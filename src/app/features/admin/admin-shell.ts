import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-shell',
  imports: [RouterLink, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-10 pb-10 pt-4 sm:space-y-12 sm:pt-8 lg:space-y-14">
      <section
        class="overflow-hidden rounded-[2rem] border border-stone-200/80 bg-[linear-gradient(180deg,rgba(255,251,235,0.78),rgba(255,255,255,0.95))] px-5 py-8 shadow-[0_25px_70px_-40px_rgba(120,53,15,0.38)] dark:border-stone-800/80 dark:bg-[linear-gradient(180deg,rgba(41,37,36,0.96),rgba(17,24,39,0.9))] dark:shadow-[0_30px_80px_-45px_rgba(0,0,0,0.9)] sm:px-8 sm:py-10 lg:px-12 lg:py-14"
      >
        <div class="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-end">
          <div class="space-y-5">
            <p class="text-[0.72rem] uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">Admin</p>
            <div class="space-y-3">
              <h1 class="max-w-3xl font-serif text-4xl leading-tight text-stone-900 dark:text-stone-50 sm:text-5xl">
                Manage the curated recipe library without leaving the calm product shell.
              </h1>
              <p class="max-w-2xl text-base leading-7 text-stone-600 dark:text-stone-300 sm:text-lg">
                This area is reserved for editorial recipe operations. It stays lightweight and focused so future CRUD workflows
                can build on a clear foundation.
              </p>
            </div>

            <div class="flex flex-wrap gap-3">
              <a
                routerLink="/admin/recipes"
                class="inline-flex items-center justify-center rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium tracking-[0.08em] text-stone-50 transition hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-300"
              >
                Recipe Management
              </a>
              <a
                routerLink="/"
                class="inline-flex items-center justify-center rounded-full border border-stone-300/80 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:hover:border-stone-600 dark:hover:bg-stone-800"
              >
                Back To Library
              </a>
            </div>
          </div>

          <aside class="rounded-[1.75rem] border border-white/60 bg-white/70 p-5 backdrop-blur dark:border-stone-700/70 dark:bg-stone-900/70 sm:p-6">
            <p class="text-sm font-medium uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">Admin Scope</p>
            <div class="mt-5 space-y-4 text-sm leading-7 text-stone-600 dark:text-stone-300">
              <p>Recipe creation, editing, deletion, and image workflows live under this route tree.</p>
              <p>Public discovery routes remain separate so browsing keeps its editorial, minimal pace.</p>
            </div>
          </aside>
        </div>
      </section>

      <router-outlet />
    </div>
  `,
})
export class AdminShell {}
