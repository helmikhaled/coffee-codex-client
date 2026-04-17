import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router, convertToParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';
import { PagedResponseDto } from '../../contracts/paged-response.dto';
import { RecipeSummaryDto } from '../../contracts/recipe-summary.dto';
import { routes } from '../../app.routes';
import { environment } from '../../../environments/environment';
import { HomePage } from './home-page';

describe('HomePage', () => {
  let httpController: HttpTestingController;
  let router: Router;
  let queryParamMap$: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let routeStub: {
    queryParamMap: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
    snapshot: { queryParamMap: ReturnType<typeof convertToParamMap> };
  };
  const recipesEndpoint = `${environment.apiBaseUrl.replace(/\/+$/, '')}/recipes`;

  beforeEach(async () => {
    queryParamMap$ = new BehaviorSubject(convertToParamMap({}));
    routeStub = {
      queryParamMap: queryParamMap$,
      snapshot: {
        queryParamMap: convertToParamMap({}),
      },
    };

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes),
        { provide: ActivatedRoute, useValue: routeStub },
      ],
    }).compileComponents();

    httpController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    httpController.verify();
    vi.restoreAllMocks();
  });

  it('should request and render the first page of recipes on load', async () => {
    const fixture = TestBed.createComponent(HomePage);

    fixture.detectChanges();
    await Promise.resolve();

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
    await Promise.resolve();
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
        req.params.get('pageSize') === '12' &&
        !req.params.has('category') &&
        !req.params.has('tag') &&
        !req.params.has('search'),
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

  it('should initialize filters from URL query params on first load', async () => {
    setRouteQueryParams({
      category: 'Modern',
      tag: 'matcha',
    });

    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    await Promise.resolve();

    expectRecipeRequest(1, { category: 'Modern', tag: 'matcha' }).flush(
      createPagedResponse(1, 1, [createRecipeSummary('dirty-matcha', 'Dirty Matcha', 'Modern')]),
    );

    await fixture.whenStable();
    fixture.detectChanges();

    const content = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(content).toContain('Dirty Matcha');
  });

  it('should request filtered page 1 when selecting category and tag chips', async () => {
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    await Promise.resolve();

    expectRecipeRequest(1).flush(
      createPagedResponse(1, 1, [createRecipeSummary('orange-americano', 'Orange Americano', 'Citrus')]),
    );

    await fixture.whenStable();
    fixture.detectChanges();

    findButton(fixture.nativeElement as HTMLElement, 'Modern')?.click();
    await Promise.resolve();

    expectRecipeRequest(1, { category: 'Modern' }).flush(
      createPagedResponse(1, 1, [createRecipeSummary('modern-cortado', 'Modern Cortado', 'Modern')]),
    );

    await fixture.whenStable();
    fixture.detectChanges();

    findButton(fixture.nativeElement as HTMLElement, 'Matcha')?.click();
    await Promise.resolve();

    expectRecipeRequest(1, { category: 'Modern', tag: 'matcha' }).flush(
      createPagedResponse(1, 1, [createRecipeSummary('dirty-matcha', 'Dirty Matcha', 'Modern')]),
    );

    await fixture.whenStable();
    fixture.detectChanges();

    const content = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(content).toContain('Dirty Matcha');
  });

  it('should clear filters, remove query params, and reload unfiltered listing', async () => {
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    await Promise.resolve();

    expectRecipeRequest(1).flush(createPagedResponse(1, 1, [createRecipeSummary('classic', 'Classic', 'Classic')]));
    await fixture.whenStable();
    fixture.detectChanges();

    findButton(fixture.nativeElement as HTMLElement, 'Modern')?.click();
    await Promise.resolve();
    expectRecipeRequest(1, { category: 'Modern' }).flush(
      createPagedResponse(1, 1, [createRecipeSummary('modern', 'Modern', 'Modern')]),
    );
    await fixture.whenStable();
    fixture.detectChanges();

    findButton(fixture.nativeElement as HTMLElement, 'Clear filters')?.click();
    await Promise.resolve();
    expectRecipeRequest(1).flush(createPagedResponse(1, 1, [createRecipeSummary('all', 'All', 'Classic')]));

    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([], {
      relativeTo: routeStub as unknown as ActivatedRoute,
      queryParams: { category: null, tag: null, search: null },
    });
  });

  it('should request searched page 1 results when search query param is active', async () => {
    setRouteQueryParams({ search: 'matcha' });

    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    await Promise.resolve();

    expectRecipeRequest(1, { search: 'matcha' }).flush(
      createPagedResponse(1, 1, [createRecipeSummary('dirty-matcha', 'Dirty Matcha', 'Modern')]),
    );

    await fixture.whenStable();
    fixture.detectChanges();

    const content = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(content).toContain('Dirty Matcha');
  });

  it('should reload results when route search query param changes after initial load', async () => {
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    await Promise.resolve();

    expectRecipeRequest(1).flush(createPagedResponse(1, 1, [createRecipeSummary('classic', 'Classic', 'Classic')]));
    await fixture.whenStable();
    fixture.detectChanges();

    setRouteQueryParams({ search: 'matcha' });
    await Promise.resolve();

    expectRecipeRequest(1, { search: 'matcha' }).flush(
      createPagedResponse(1, 1, [createRecipeSummary('dirty-matcha', 'Dirty Matcha', 'Modern')]),
    );

    await fixture.whenStable();
    fixture.detectChanges();

    const content = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(content).toContain('Dirty Matcha');
  });

  it('should show no-results search state and clear-search recovery action', async () => {
    setRouteQueryParams({ search: 'matcha' });

    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    await Promise.resolve();

    expectRecipeRequest(1, { search: 'matcha' }).flush(createPagedResponse(1, 1, []));
    await fixture.whenStable();
    fixture.detectChanges();

    const content = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(content).toContain('No recipes found');

    findButton(fixture.nativeElement as HTMLElement, 'Clear Search')?.click();
    await Promise.resolve();

    expectRecipeRequest(1).flush(createPagedResponse(1, 1, [createRecipeSummary('all', 'All', 'Classic')]));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([], {
      relativeTo: routeStub as unknown as ActivatedRoute,
      queryParams: { category: null, tag: null, search: null },
    });
  });

  it('should include active filters in load-more requests', async () => {
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    await Promise.resolve();

    expectRecipeRequest(1).flush(createPagedResponse(1, 1, [createRecipeSummary('classic', 'Classic', 'Classic')]));
    await fixture.whenStable();
    fixture.detectChanges();

    findButton(fixture.nativeElement as HTMLElement, 'Modern')?.click();
    await Promise.resolve();
    expectRecipeRequest(1, { category: 'Modern' }).flush(
      createPagedResponse(1, 2, [createRecipeSummary('modern-1', 'Modern 1', 'Modern')]),
    );
    await fixture.whenStable();
    fixture.detectChanges();

    findButton(fixture.nativeElement as HTMLElement, 'Load More')?.click();
    await Promise.resolve();

    expectRecipeRequest(2, { category: 'Modern' }).flush(
      createPagedResponse(2, 2, [createRecipeSummary('modern-2', 'Modern 2', 'Modern')]),
    );

    await fixture.whenStable();
    fixture.detectChanges();
  });

  function setRouteQueryParams(params: Record<string, string>): void {
    const queryParamMap = convertToParamMap(params);
    routeStub.snapshot.queryParamMap = queryParamMap;
    queryParamMap$.next(queryParamMap);
  }

  function expectRecipeRequest(page: number, query?: { category?: string; tag?: string; search?: string }) {
    return httpController.expectOne(
      (req) =>
        req.method === 'GET' &&
        req.url === recipesEndpoint &&
        req.params.get('page') === String(page) &&
        req.params.get('pageSize') === '12' &&
        (query?.category ? req.params.get('category') === query.category : !req.params.has('category')) &&
        (query?.tag ? req.params.get('tag') === query.tag : !req.params.has('tag')) &&
        (query?.search ? req.params.get('search') === query.search : !req.params.has('search')),
    );
  }
});

function findButton(root: HTMLElement, label: string): HTMLButtonElement | undefined {
  return Array.from(root.querySelectorAll('button')).find((button) => button.textContent?.includes(label)) as
    | HTMLButtonElement
    | undefined;
}

function createRecipeSummary(
  id: string,
  title: string,
  category: RecipeSummaryDto['category'] = 'Modern',
): RecipeSummaryDto {
  return {
    id,
    slug: id,
    title,
    category,
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
