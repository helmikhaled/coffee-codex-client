import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="space-y-4 py-4">
      <p class="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
        Curated Recipe Library
      </p>
      <h1 class="max-w-2xl text-3xl font-semibold leading-tight text-stone-900 dark:text-stone-100 sm:text-4xl">
        Discover modern coffee drinks crafted for home baristas.
      </h1>
      <p class="max-w-2xl text-sm text-stone-600 dark:text-stone-300 sm:text-base">
        Feature pages are coming next. This app shell route is ready for recipe listing integration.
      </p>
    </section>
  `,
})
export class HomePageComponent {}
