import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin-recipes-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="rounded-[1.75rem] border border-stone-200/80 bg-white/90 p-6 shadow-[0_20px_50px_-34px_rgba(120,53,15,0.42)] dark:border-stone-800 dark:bg-stone-900/90 dark:shadow-[0_22px_50px_-36px_rgba(0,0,0,0.85)] sm:p-8"
      aria-labelledby="admin-recipes-heading"
    >
      <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-3">
          <p class="text-[0.72rem] uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">Protected Area</p>
          <h2 id="admin-recipes-heading" class="font-serif text-3xl text-stone-900 dark:text-stone-50 sm:text-4xl">
            Recipe management will appear here.
          </h2>
          <p class="max-w-3xl text-sm leading-7 text-stone-600 dark:text-stone-300 sm:text-base">
            This placeholder route confirms the authentication and admin navigation surface for the upcoming recipe-management
            spec. The full CRUD interface will extend this page rather than replacing the route.
          </p>
        </div>

        <div class="rounded-2xl border border-stone-200/80 bg-stone-50/90 px-4 py-3 text-sm text-stone-600 dark:border-stone-700 dark:bg-stone-950/80 dark:text-stone-300">
          Next spec: create, edit, delete, and image workflows
        </div>
      </div>
    </section>
  `,
})
export class AdminRecipesPage {}
