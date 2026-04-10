import { TestBed } from '@angular/core/testing';
import { ImageDto } from '../../contracts/recipe-detail.dto';
import { RecipeHeroMedia } from './recipe-hero-media';

describe('RecipeHeroMedia', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeHeroMedia],
    }).compileComponents();
  });

  it('should render the first image as active on initial load', () => {
    const fixture = TestBed.createComponent(RecipeHeroMedia);

    fixture.componentRef.setInput('title', 'Dirty Matcha');
    fixture.componentRef.setInput('images', createImages());
    fixture.detectChanges();

    const heroImage = getHeroImage(fixture.nativeElement as HTMLElement);

    expect(heroImage).toBeTruthy();
    expect(heroImage?.getAttribute('src')).toContain('dirty-matcha-hero.jpg');
    expect(heroImage?.getAttribute('loading')).toBe('eager');
  });

  it('should navigate with next and previous actions using wrap-around behavior', () => {
    const fixture = TestBed.createComponent(RecipeHeroMedia);
    const component = fixture.componentInstance;

    fixture.componentRef.setInput('title', 'Dirty Matcha');
    fixture.componentRef.setInput('images', createImages());
    fixture.detectChanges();

    component.showNextImage();
    fixture.detectChanges();

    expect(getHeroImage(fixture.nativeElement as HTMLElement)?.getAttribute('src')).toContain('dirty-matcha-side.jpg');

    component.showNextImage();
    fixture.detectChanges();

    expect(getHeroImage(fixture.nativeElement as HTMLElement)?.getAttribute('src')).toContain('dirty-matcha-pour.jpg');

    component.showNextImage();
    fixture.detectChanges();

    expect(getHeroImage(fixture.nativeElement as HTMLElement)?.getAttribute('src')).toContain('dirty-matcha-hero.jpg');

    component.showPreviousImage();
    fixture.detectChanges();

    expect(getHeroImage(fixture.nativeElement as HTMLElement)?.getAttribute('src')).toContain('dirty-matcha-pour.jpg');
  });

  it('should navigate to selected image when a pagination dot is clicked', () => {
    const fixture = TestBed.createComponent(RecipeHeroMedia);

    fixture.componentRef.setInput('title', 'Dirty Matcha');
    fixture.componentRef.setInput('images', createImages());
    fixture.detectChanges();

    const dots = getPaginationDots(fixture.nativeElement as HTMLElement);

    expect(dots.length).toBe(3);

    dots[2].click();
    fixture.detectChanges();

    expect(getHeroImage(fixture.nativeElement as HTMLElement)?.getAttribute('src')).toContain('dirty-matcha-pour.jpg');
    expect(dots[2].getAttribute('aria-current')).toBe('true');
  });

  it('should hide navigation controls and pagination when there is only one image', () => {
    const fixture = TestBed.createComponent(RecipeHeroMedia);

    fixture.componentRef.setInput('title', 'Single Image Recipe');
    fixture.componentRef.setInput('images', [createImages()[0]]);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('button[aria-label="Previous image"]')).toBeNull();
    expect(root.querySelector('button[aria-label="Next image"]')).toBeNull();
    expect(root.querySelector('[aria-label="Recipe image pagination"]')).toBeNull();
  });

  it('should navigate on horizontal swipe gestures', () => {
    const fixture = TestBed.createComponent(RecipeHeroMedia);
    const component = fixture.componentInstance;

    fixture.componentRef.setInput('title', 'Dirty Matcha');
    fixture.componentRef.setInput('images', createImages());
    fixture.detectChanges();

    component.onTouchStart(createTouchEvent(220, 100));
    component.onTouchMove(createTouchEvent(130, 108));
    component.onTouchEnd(createTouchEvent(130, 108));
    fixture.detectChanges();

    expect(getHeroImage(fixture.nativeElement as HTMLElement)?.getAttribute('src')).toContain('dirty-matcha-side.jpg');
  });

  it('should ignore vertical-dominant swipe gestures', () => {
    const fixture = TestBed.createComponent(RecipeHeroMedia);
    const component = fixture.componentInstance;

    fixture.componentRef.setInput('title', 'Dirty Matcha');
    fixture.componentRef.setInput('images', createImages());
    fixture.detectChanges();

    component.onTouchStart(createTouchEvent(200, 100));
    component.onTouchMove(createTouchEvent(170, 190));
    component.onTouchEnd(createTouchEvent(170, 190));
    fixture.detectChanges();

    expect(getHeroImage(fixture.nativeElement as HTMLElement)?.getAttribute('src')).toContain('dirty-matcha-hero.jpg');
  });

  it('should render fallback when an active image fails to load', () => {
    const fixture = TestBed.createComponent(RecipeHeroMedia);
    const component = fixture.componentInstance;

    fixture.componentRef.setInput('title', 'Dirty Matcha');
    fixture.componentRef.setInput('images', createImages());
    fixture.detectChanges();

    component.markImageError('https://images.example.com/dirty-matcha-hero.jpg');
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const content = root.textContent ?? '';

    expect(root.querySelector('img')).toBeNull();
    expect(content).toContain('Dirty Matcha Hero unavailable');
  });
});

function getHeroImage(root: HTMLElement): HTMLImageElement | null {
  return root.querySelector('img');
}

function getPaginationDots(root: HTMLElement): HTMLButtonElement[] {
  const pagination = root.querySelector('[aria-label="Recipe image pagination"]');
  if (!pagination) {
    return [];
  }

  return Array.from(pagination.querySelectorAll('button')) as HTMLButtonElement[];
}

function createImages(): ImageDto[] {
  return [
    {
      url: 'https://images.example.com/dirty-matcha-hero.jpg',
      caption: 'Dirty Matcha Hero',
      order: 1,
    },
    {
      url: 'https://images.example.com/dirty-matcha-side.jpg',
      caption: 'Dirty Matcha Side',
      order: 2,
    },
    {
      url: 'https://images.example.com/dirty-matcha-pour.jpg',
      caption: 'Dirty Matcha Pour',
      order: 3,
    },
  ];
}

function createTouchEvent(x: number, y: number): TouchEvent {
  const touchPoint = { clientX: x, clientY: y } as Touch;
  const touches = {
    item: (index: number) => (index === 0 ? touchPoint : null),
  } as TouchList;

  return {
    changedTouches: touches,
  } as TouchEvent;
}
