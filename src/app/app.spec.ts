import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes, withComponentInputBinding())],
    }).compileComponents();

    localStorage.removeItem('coffee-codex-theme');
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = '';
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the header with logo and controls', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Coffee Codex');
    expect(compiled.querySelector('[aria-label="Search"]')).toBeTruthy();
    expect(compiled.querySelector('[aria-label="Switch to dark mode"], [aria-label="Switch to light mode"]')).toBeTruthy();
  });

  it('should render recipe route placeholder for /r/:id', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/r/espresso-tonic');
    fixture.detectChanges();
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('/r/espresso-tonic');
  });

  it('should toggle theme class when theme button is clicked', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const toggleButton = fixture.nativeElement.querySelector(
      '[aria-label="Switch to dark mode"], [aria-label="Switch to light mode"]',
    ) as HTMLButtonElement | null;

    expect(toggleButton).toBeTruthy();
    toggleButton?.click();
    fixture.detectChanges();

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('coffee-codex-theme')).toBe('dark');
  });
});
