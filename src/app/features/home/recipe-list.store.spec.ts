import { TestBed } from '@angular/core/testing';
import { Subject, of } from 'rxjs';
import { vi } from 'vitest';
import { PagedResponseDto } from '../../contracts/paged-response.dto';
import { RecipeListQueryDto } from '../../contracts/recipe-list-query.dto';
import { RecipeCategory, RecipeSummaryDto } from '../../contracts/recipe-summary.dto';
import { RecipeListApiService } from './recipe-list-api.service';
import { RecipeListStore } from './recipe-list.store';

describe('RecipeListStore', () => {
  let store: RecipeListStore;
  let api: {
    getFirstPage: ReturnType<typeof vi.fn>;
    getNextPage: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    api = {
      getFirstPage: vi.fn(),
      getNextPage: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [RecipeListStore, { provide: RecipeListApiService, useValue: api }],
    });

    store = TestBed.inject(RecipeListStore);
  });

  it('should apply category filter by reloading page 1 and replacing recipes', async () => {
    api.getFirstPage.mockImplementation(
      (_pageSize: number, filters?: Pick<RecipeListQueryDto, 'category' | 'tag' | 'search'>) => {
        if (filters?.category === 'Modern') {
          return of(createPagedResponse(1, 1, [createRecipeSummary('modern-iced', 'Modern Iced', 'Modern')]));
        }

        return of(createPagedResponse(1, 1, [createRecipeSummary('classic-latte', 'Classic Latte', 'Classic')]));
      },
    );
    api.getNextPage.mockReturnValue(of(createPagedResponse(2, 2, [])));

    await store.loadInitial();
    expect(store.recipes().map((recipe) => recipe.id)).toEqual(['classic-latte']);

    await store.applyCategoryFilter('Modern');

    expect(api.getFirstPage.mock.calls.at(-1)?.[1]).toEqual({
      category: 'Modern',
      tag: undefined,
      search: undefined,
    });
    expect(store.selectedCategory()).toBe('Modern');
    expect(store.page()).toBe(1);
    expect(store.recipes().map((recipe) => recipe.id)).toEqual(['modern-iced']);
  });

  it('should clear filters and reload the unfiltered first page', async () => {
    api.getFirstPage.mockImplementation(
      (_pageSize: number, filters?: Pick<RecipeListQueryDto, 'category' | 'tag' | 'search'>) => {
        if (filters?.tag === 'matcha') {
          return of(createPagedResponse(1, 1, [createRecipeSummary('dirty-matcha', 'Dirty Matcha', 'Modern')]));
        }

        return of(createPagedResponse(1, 1, [createRecipeSummary('orange-americano', 'Orange Americano', 'Citrus')]));
      },
    );
    api.getNextPage.mockReturnValue(of(createPagedResponse(2, 2, [])));

    await store.loadInitial();
    await store.applyTagFilter('matcha');

    expect(store.selectedTag()).toBe('matcha');
    expect(store.recipes().map((recipe) => recipe.id)).toEqual(['dirty-matcha']);

    await store.clearFilters();

    expect(store.selectedTag()).toBeNull();
    expect(store.selectedCategory()).toBeNull();
    expect(api.getFirstPage.mock.calls.at(-1)?.[1]).toEqual({
      category: undefined,
      tag: undefined,
      search: undefined,
    });
    expect(store.recipes().map((recipe) => recipe.id)).toEqual(['orange-americano']);
  });

  it('should include active filters in load-more requests', async () => {
    api.getFirstPage.mockImplementation(
      (_pageSize: number, filters?: Pick<RecipeListQueryDto, 'category' | 'tag' | 'search'>) => {
        if (filters?.tag === 'matcha') {
          return of(createPagedResponse(1, 2, [createRecipeSummary('dirty-matcha', 'Dirty Matcha', 'Modern')]));
        }

        return of(createPagedResponse(1, 1, [createRecipeSummary('orange-americano', 'Orange Americano', 'Citrus')]));
      },
    );
    api.getNextPage.mockImplementation(
      (page: number, pageSize: number, filters?: Pick<RecipeListQueryDto, 'category' | 'tag' | 'search'>) =>
        of(
          createPagedResponse(page + 1, 2, [
            createRecipeSummary(`tagged-page-${pageSize}`, `Tagged Page ${pageSize}`, filters?.category ?? 'Modern'),
          ]),
        ),
    );

    await store.loadInitial();
    await store.applyTagFilter('matcha');
    await store.loadNextPage();

    expect(api.getNextPage.mock.calls.at(-1)?.[2]).toEqual({
      category: undefined,
      tag: 'matcha',
      search: undefined,
    });
    expect(store.page()).toBe(2);
    expect(store.recipes().length).toBe(2);
  });

  it('should prevent duplicate concurrent filter reloads', async () => {
    const pendingResponse = new Subject<PagedResponseDto<RecipeSummaryDto>>();

    api.getFirstPage.mockImplementation(
      (_pageSize: number, filters?: Pick<RecipeListQueryDto, 'category' | 'tag' | 'search'>) => {
        if (filters?.category === 'Modern') {
          return pendingResponse.asObservable();
        }

        return of(createPagedResponse(1, 1, [createRecipeSummary('classic-latte', 'Classic Latte', 'Classic')]));
      },
    );
    api.getNextPage.mockReturnValue(of(createPagedResponse(2, 2, [])));

    await store.loadInitial();

    const firstApply = store.applyCategoryFilter('Modern');
    const secondApply = store.applyCategoryFilter('Modern');

    expect(api.getFirstPage.mock.calls.length).toBe(2);

    pendingResponse.next(createPagedResponse(1, 1, [createRecipeSummary('modern-filter', 'Modern Filter', 'Modern')]));
    pendingResponse.complete();

    await firstApply;
    await secondApply;

    expect(store.selectedCategory()).toBe('Modern');
    expect(store.recipes().map((recipe) => recipe.id)).toEqual(['modern-filter']);
  });

  it('should apply search by reloading page 1 and replacing recipes', async () => {
    api.getFirstPage.mockImplementation(
      (_pageSize: number, query?: Pick<RecipeListQueryDto, 'category' | 'tag' | 'search'>) => {
        if (query?.search === 'matcha') {
          return of(createPagedResponse(1, 1, [createRecipeSummary('dirty-matcha', 'Dirty Matcha', 'Modern')]));
        }

        return of(createPagedResponse(1, 1, [createRecipeSummary('orange-americano', 'Orange Americano', 'Citrus')]));
      },
    );
    api.getNextPage.mockReturnValue(of(createPagedResponse(2, 2, [])));

    await store.loadInitial();
    expect(store.recipes().map((recipe) => recipe.id)).toEqual(['orange-americano']);

    await store.applySearch('  matcha  ');

    expect(api.getFirstPage.mock.calls.at(-1)?.[1]).toEqual({
      category: undefined,
      tag: undefined,
      search: 'matcha',
    });
    expect(store.searchTerm()).toBe('matcha');
    expect(store.page()).toBe(1);
    expect(store.recipes().map((recipe) => recipe.id)).toEqual(['dirty-matcha']);
  });

  it('should clear search and keep active filters while reloading page 1', async () => {
    api.getFirstPage.mockImplementation(
      (_pageSize: number, query?: Pick<RecipeListQueryDto, 'category' | 'tag' | 'search'>) => {
        if (query?.category === 'Modern' && query?.search === 'matcha') {
          return of(createPagedResponse(1, 1, [createRecipeSummary('dirty-matcha', 'Dirty Matcha', 'Modern')]));
        }

        if (query?.category === 'Modern') {
          return of(createPagedResponse(1, 1, [createRecipeSummary('modern-cortado', 'Modern Cortado', 'Modern')]));
        }

        return of(createPagedResponse(1, 1, [createRecipeSummary('classic-latte', 'Classic Latte', 'Classic')]));
      },
    );
    api.getNextPage.mockReturnValue(of(createPagedResponse(2, 2, [])));

    await store.loadInitial();
    await store.applyCategoryFilter('Modern');
    await store.applySearch('matcha');

    expect(store.searchTerm()).toBe('matcha');
    expect(store.selectedCategory()).toBe('Modern');
    expect(store.recipes().map((recipe) => recipe.id)).toEqual(['dirty-matcha']);

    await store.clearSearch();

    expect(store.searchTerm()).toBeNull();
    expect(store.selectedCategory()).toBe('Modern');
    expect(api.getFirstPage.mock.calls.at(-1)?.[1]).toEqual({
      category: 'Modern',
      tag: undefined,
      search: undefined,
    });
    expect(store.recipes().map((recipe) => recipe.id)).toEqual(['modern-cortado']);
  });

  it('should include active search in load-more requests', async () => {
    api.getFirstPage.mockImplementation(
      (_pageSize: number, query?: Pick<RecipeListQueryDto, 'category' | 'tag' | 'search'>) => {
        if (query?.search === 'matcha') {
          return of(createPagedResponse(1, 2, [createRecipeSummary('dirty-matcha', 'Dirty Matcha', 'Modern')]));
        }

        return of(createPagedResponse(1, 1, [createRecipeSummary('orange-americano', 'Orange Americano', 'Citrus')]));
      },
    );
    api.getNextPage.mockImplementation(
      (page: number, _pageSize: number, query?: Pick<RecipeListQueryDto, 'category' | 'tag' | 'search'>) =>
        of(
          createPagedResponse(page + 1, 2, [
            createRecipeSummary(`search-page-${page}`, `Search Page ${page}`, query?.category ?? 'Modern'),
          ]),
        ),
    );

    await store.loadInitial();
    await store.applySearch('matcha');
    await store.loadNextPage();

    expect(api.getNextPage.mock.calls.at(-1)?.[2]).toEqual({
      category: undefined,
      tag: undefined,
      search: 'matcha',
    });
    expect(store.page()).toBe(2);
    expect(store.recipes().length).toBe(2);
  });

  it('should avoid duplicate reload when applying an unchanged normalized search', async () => {
    api.getFirstPage.mockImplementation(
      (_pageSize: number, query?: Pick<RecipeListQueryDto, 'category' | 'tag' | 'search'>) => {
        if (query?.search === 'matcha') {
          return of(createPagedResponse(1, 1, [createRecipeSummary('dirty-matcha', 'Dirty Matcha', 'Modern')]));
        }

        return of(createPagedResponse(1, 1, [createRecipeSummary('classic-latte', 'Classic Latte', 'Classic')]));
      },
    );
    api.getNextPage.mockReturnValue(of(createPagedResponse(2, 2, [])));

    await store.loadInitial();
    const callsBeforeSearch = api.getFirstPage.mock.calls.length;

    await store.applySearch('matcha');
    const callsAfterFirstSearch = api.getFirstPage.mock.calls.length;
    await store.applySearch('  matcha  ');

    expect(callsAfterFirstSearch).toBe(callsBeforeSearch + 1);
    expect(api.getFirstPage.mock.calls.length).toBe(callsAfterFirstSearch);
    expect(store.searchTerm()).toBe('matcha');
  });
});

function createRecipeSummary(id: string, title: string, category: RecipeCategory): RecipeSummaryDto {
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
