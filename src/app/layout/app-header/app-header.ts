import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Params, Router, RouterLink, UrlTree } from '@angular/router';
import { filter, startWith } from 'rxjs';
import { ThemeToggle } from '../../shared/theme-toggle/theme-toggle';

@Component({
  selector: 'app-app-header',
  imports: [RouterLink, ThemeToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app-header.html',
})
export class AppHeader {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly searchInput = signal('');
  protected readonly isMobileSearchExpanded = signal(false);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        startWith(new NavigationEnd(0, this.router.url, this.router.url)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.syncSearchInputFromUrl();
      });
  }

  protected updateSearchInput(value: string): void {
    this.searchInput.set(value);
  }

  protected submitSearch(): void {
    const normalizedSearch = this.normalizeSearch(this.searchInput());
    this.searchInput.set(normalizedSearch ?? '');
    void this.handleSearchQueryChange(normalizedSearch);
  }

  protected toggleMobileSearch(): void {
    this.isMobileSearchExpanded.update((isExpanded) => !isExpanded);
  }

  protected clearSearch(): void {
    this.searchInput.set('');
    void this.handleSearchQueryChange(null);
  }

  private normalizeSearch(value: string | null): string | null {
    const normalized = value?.trim();
    return normalized ? normalized : null;
  }

  private normalizeQueryParamValue(value: unknown): string | null {
    if (typeof value !== 'string') {
      return null;
    }

    const normalized = value.trim();
    return normalized ? normalized : null;
  }

  private isHomeRoute(urlTree: UrlTree): boolean {
    const primarySegments = urlTree.root.children['primary']?.segments ?? [];
    return primarySegments.length === 0;
  }

  private syncSearchInputFromUrl(): void {
    const currentQueryParams = this.router.parseUrl(this.router.url).queryParams;
    const search = this.normalizeSearch(this.normalizeQueryParamValue(currentQueryParams['search']));
    this.searchInput.set(search ?? '');
  }

  private async handleSearchQueryChange(search: string | null): Promise<void> {
    const currentUrlTree = this.router.parseUrl(this.router.url);
    const currentQueryParams = currentUrlTree.queryParams;
    const currentSearch = this.normalizeSearch(this.normalizeQueryParamValue(currentQueryParams['search']));
    const category = this.normalizeQueryParamValue(currentQueryParams['category']);
    const tag = this.normalizeQueryParamValue(currentQueryParams['tag']);

    if (this.isHomeRoute(currentUrlTree) && currentSearch === search) {
      this.isMobileSearchExpanded.set(false);
      return;
    }

    const queryParams: Params = {
      category: category ?? null,
      tag: tag ?? null,
      search: search ?? null,
    };

    await this.router.navigate(['/'], { queryParams });
    this.isMobileSearchExpanded.set(false);
  }
}
