import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../core/theme/theme.service';

@Component({
  selector: 'app-theme-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [attr.aria-label]="ariaLabel()"
      class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300/80 text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
      (click)="toggleTheme()"
    >
      @if (isDark()) {
        <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      } @else {
        <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z"></path>
        </svg>
      }
    </button>
  `,
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);

  readonly isDark = this.themeService.isDark;
  readonly ariaLabel = computed(() => (this.isDark() ? 'Switch to light mode' : 'Switch to dark mode'));

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
