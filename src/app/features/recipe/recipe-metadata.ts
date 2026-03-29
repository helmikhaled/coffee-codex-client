import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { AuthorDto } from '../../contracts/recipe-detail.dto';
import { RecipeCategory } from '../../contracts/recipe-summary.dto';

@Component({
  selector: 'app-recipe-metadata',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  template: `
    <section class="space-y-4" aria-labelledby="recipe-metadata-heading">
      <div class="space-y-1">
        <p class="text-[0.7rem] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">Recipe Metadata</p>
        <h2 id="recipe-metadata-heading" class="font-serif text-2xl text-stone-900 dark:text-stone-50 sm:text-3xl">
          Notes
        </h2>
      </div>

      <div class="rounded-2xl border border-stone-200/80 bg-white/85 p-4 dark:border-stone-800 dark:bg-stone-900/80 sm:p-5">
        <p class="text-[0.66rem] uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">Category</p>
        <p class="mt-1 text-base font-semibold text-stone-900 dark:text-stone-100">{{ category() }}</p>
      </div>

      <div class="rounded-2xl border border-stone-200/80 bg-white/85 p-4 dark:border-stone-800 dark:bg-stone-900/80 sm:p-5">
        <p class="text-[0.66rem] uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">Tags</p>
        @if (tags().length > 0) {
          <div class="mt-3 flex flex-wrap gap-2">
            @for (tag of tags(); track tag) {
              <span
                class="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-amber-900 dark:border-amber-400/25 dark:bg-amber-300/10 dark:text-amber-100"
              >
                {{ tag }}
              </span>
            }
          </div>
        } @else {
          <p class="mt-2 text-sm text-stone-600 dark:text-stone-300">No tags available.</p>
        }
      </div>

      <div class="rounded-2xl border border-stone-200/80 bg-white/85 p-4 dark:border-stone-800 dark:bg-stone-900/80 sm:p-5">
        <p class="text-[0.66rem] uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">Author</p>
        <div class="mt-3 flex items-center gap-3">
          @if (canRenderAuthorAvatar()) {
            <img
              [src]="author().avatarUrl"
              [alt]="author().name + ' avatar'"
              class="h-11 w-11 rounded-full object-cover"
              loading="lazy"
              decoding="async"
              (error)="markAuthorAvatarError(author().avatarUrl)"
            />
          } @else {
            <span
              class="inline-flex h-11 w-11 items-center justify-center rounded-full bg-stone-200 text-sm font-semibold uppercase text-stone-700 dark:bg-stone-700 dark:text-stone-100"
              aria-hidden="true"
            >
              {{ authorInitial() }}
            </span>
          }
          <p class="text-base font-semibold text-stone-900 dark:text-stone-100">{{ author().name }}</p>
        </div>
      </div>
    </section>
  `,
})
export class RecipeMetadata {
  author = input<AuthorDto>({ id: 'author', name: 'Coffee Codex', avatarUrl: '' });
  category = input<RecipeCategory>('Modern');
  tags = input<string[]>([]);

  private readonly avatarErrors = signal<Record<string, boolean>>({});

  markAuthorAvatarError(url: string): void {
    if (!url) {
      return;
    }

    this.avatarErrors.update((current) => ({ ...current, [url]: true }));
  }

  canRenderAuthorAvatar(): boolean {
    const avatarUrl = this.author().avatarUrl;
    if (!avatarUrl) {
      return false;
    }

    return !this.avatarErrors()[avatarUrl];
  }

  authorInitial(): string {
    const firstChar = this.author().name?.trim().charAt(0);
    return firstChar ? firstChar.toUpperCase() : 'C';
  }
}
