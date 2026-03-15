import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'coffee-codex-theme';

  private readonly currentTheme = signal<ThemeMode>(this.resolveInitialTheme());

  readonly theme = this.currentTheme.asReadonly();
  readonly isDark = computed(() => this.currentTheme() === 'dark');

  constructor() {
    effect(() => {
      this.applyTheme(this.currentTheme());
    });
  }

  toggleTheme(): void {
    this.currentTheme.update((theme) => (theme === 'dark' ? 'light' : 'dark'));
  }

  private resolveInitialTheme(): ThemeMode {
    if (!isPlatformBrowser(this.platformId)) {
      return 'light';
    }

    const persistedTheme = this.document.defaultView?.localStorage.getItem(this.storageKey);
    if (persistedTheme === 'light' || persistedTheme === 'dark') {
      return persistedTheme;
    }

    const matchesDarkPreference = this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    return matchesDarkPreference ? 'dark' : 'light';
  }

  private applyTheme(theme: ThemeMode): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const root = this.document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    this.document.defaultView?.localStorage.setItem(this.storageKey, theme);
  }
}
