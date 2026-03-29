import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PagedResponseDto } from '../../contracts/paged-response.dto';
import { RecipeSummaryDto } from '../../contracts/recipe-summary.dto';
import { routes } from '../../app.routes';
import { environment } from '../../../environments/environment';
import { HomePage } from './home-page';

describe('HomePage', () => {
  let httpController: HttpTestingController;
  const recipesEndpoint = `${environment.apiBaseUrl.replace(/\/+$/, '')}/recipes`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter(routes)],
    }).compileComponents();

    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should request and render the first page of recipes on load', async () => {
    const fixture = TestBed.createComponent(HomePage);

    fixture.detectChanges();

    const request = expectRecipeRequest(1);
    request.flush(
      createPagedResponse(1, 2, [
        createRecipeSummary('dirty-matcha', 'Dirty Matcha'),
        createRecipeSummary('orange-americano', 'Orange Americano'),
      ]),
    );

    await fixture.whenStable();
    fixture.detectChanges();

    const content = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(content).toContain('Dirty Matcha');
    expect(content).toContain('Orange Americano');
    expect(content).toContain('Recipe library');
  });

  it('should append the next page and prevent duplicate concurrent load-more requests', async () => {
    const fixture = TestBed.createComponent(HomePage);

    fixture.detectChanges();
    expectRecipeRequest(1).flush(
      createPagedResponse(1, 2, [
        createRecipeSummary('dirty-matcha', 'Dirty Matcha'),
        createRecipeSummary('orange-americano', 'Orange Americano'),
      ]),
    );

    await fixture.whenStable();
    fixture.detectChanges();

    const loadMoreButton = findButton(fixture.nativeElement as HTMLElement, 'Load More');
    expect(loadMoreButton).toBeTruthy();

    loadMoreButton?.click();
    loadMoreButton?.click();

    const nextPageRequests = httpController.match(
      (req) =>
        req.method === 'GET' &&
        req.url === recipesEndpoint &&
        req.params.get('page') === '2' &&
        req.params.get('pageSize') === '12',
    );

    expect(nextPageRequests.length).toBe(1);

    nextPageRequests[0].flush(createPagedResponse(2, 2, [createRecipeSummary('tiramisu-latte', 'Tiramisu Latte')]));

    await fixture.whenStable();
    fixture.detectChanges();

    const content = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(content).toContain('Dirty Matcha');
    expect(content).toContain('Orange Americano');
    expect(content).toContain('Tiramisu Latte');
    expect(content).not.toContain('Load More');
  });

  function expectRecipeRequest(page: number) {
    return httpController.expectOne(
      (req) =>
        req.method === 'GET' &&
        req.url === recipesEndpoint &&
        req.params.get('page') === String(page) &&
        req.params.get('pageSize') === '12',
    );
  }
});

function findButton(root: HTMLElement, label: string): HTMLButtonElement | undefined {
  return Array.from(root.querySelectorAll('button')).find((button) => button.textContent?.includes(label)) as
    | HTMLButtonElement
    | undefined;
}

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

function createPagedResponse(
  page: number,
  totalPages: number,
  items: RecipeSummaryDto[],
): PagedResponseDto<RecipeSummaryDto> {
  return {
    items,
    page,
    pageSize: 12,
    totalCount: totalPages * 12,
    totalPages,
  };
}
