import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PagedResponseDto } from '../../contracts/paged-response.dto';
import { RecipeSummaryDto } from '../../contracts/recipe-summary.dto';
import { environment } from '../../../environments/environment';
import { RecipeListApiService } from './recipe-list-api.service';

describe('RecipeListApiService', () => {
  let service: RecipeListApiService;
  let httpController: HttpTestingController;
  const recipesEndpoint = `${environment.apiBaseUrl.replace(/\/+$/, '')}/recipes`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(RecipeListApiService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should request the first recipes page with the provided page size', () => {
    let responseBody: PagedResponseDto<RecipeSummaryDto> | undefined;

    service.getFirstPage(12).subscribe((response) => {
      responseBody = response;
    });

    const request = httpController.expectOne(
      (req) =>
        req.method === 'GET' &&
        req.url === recipesEndpoint &&
        req.params.get('page') === '1' &&
        req.params.get('pageSize') === '12',
    );

    request.flush(createPagedResponse(1, 2, [createRecipeSummary('dirty-matcha', 'Dirty Matcha')]));

    expect(responseBody?.items[0].title).toBe('Dirty Matcha');
  });

  it('should request the next page relative to the current page', () => {
    service.getNextPage(1, 12).subscribe();

    const request = httpController.expectOne(
      (req) =>
        req.method === 'GET' &&
        req.url === recipesEndpoint &&
        req.params.get('page') === '2' &&
        req.params.get('pageSize') === '12',
    );

    request.flush(createPagedResponse(2, 2, [createRecipeSummary('orange-americano', 'Orange Americano')]));
  });

  it('should include category, tag, and search query params when provided', () => {
    service.getFirstPage(12, { category: 'Modern', tag: 'matcha', search: 'latte' }).subscribe();

    const request = httpController.expectOne(
      (req) =>
        req.method === 'GET' &&
        req.url === recipesEndpoint &&
        req.params.get('page') === '1' &&
        req.params.get('pageSize') === '12' &&
        req.params.get('category') === 'Modern' &&
        req.params.get('tag') === 'matcha' &&
        req.params.get('search') === 'latte',
    );

    request.flush(createPagedResponse(1, 1, [createRecipeSummary('dirty-matcha', 'Dirty Matcha')]));
  });

  it('should omit empty filter values and empty search from query params', () => {
    service.getFirstPage(12, { tag: '   ', search: '   ' }).subscribe();

    const request = httpController.expectOne(
      (req) =>
        req.method === 'GET' &&
        req.url === recipesEndpoint &&
        req.params.get('page') === '1' &&
        req.params.get('pageSize') === '12' &&
        !req.params.has('category') &&
        !req.params.has('tag') &&
        !req.params.has('search'),
    );

    request.flush(createPagedResponse(1, 1, [createRecipeSummary('dirty-matcha', 'Dirty Matcha')]));
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
