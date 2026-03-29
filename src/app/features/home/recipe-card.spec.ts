import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../app.routes';
import { RecipeSummaryDto } from '../../contracts/recipe-summary.dto';
import { RecipeCard } from './recipe-card';

describe('RecipeCard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeCard],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should navigate to the recipe detail route when the card link is clicked', async () => {
    const fixture = TestBed.createComponent(RecipeCard);
    const router = TestBed.inject(Router);
    const recipe = createRecipeSummary('dirty-matcha', 'Dirty Matcha');

    fixture.componentRef.setInput('recipe', recipe);
    fixture.componentRef.setInput('recipeLink', ['/r', recipe.id]);
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement | null;

    expect(anchor).toBeTruthy();
    expect(anchor?.getAttribute('href')).toContain('/r/dirty-matcha');

    anchor?.click();
    await fixture.whenStable();

    expect(router.url).toBe('/r/dirty-matcha');
  });
});

function createRecipeSummary(id: string, title: string): RecipeSummaryDto {
  return {
    id,
    slug: id,
    title,
    category: 'Modern',
    thumbnailUrl: `https://images.example.com/${id}.jpg`,
    brewCount: 1200,
    authorName: 'Coffee Codex',
    difficulty: 'Beginner',
  };
}
