import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { ImageDto } from '../../contracts/recipe-detail.dto';

@Component({
  selector: 'app-recipe-hero-media',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  template: `
    <section class="space-y-4" aria-label="Recipe images">
      <div
        class="relative overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white/90 shadow-[0_24px_52px_-34px_rgba(120,53,15,0.45)] dark:border-stone-800 dark:bg-stone-900/90 dark:shadow-[0_26px_54px_-36px_rgba(0,0,0,0.78)]"
      >
        <div class="aspect-[4/5] sm:aspect-[3/2] lg:aspect-[4/3]">
          @if (activeImage(); as image) {
            @if (canRenderImage(image.url)) {
              <img
                [src]="image.url"
                [alt]="imageAlt(image)"
                class="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
                (error)="markImageError(image.url)"
              />
            } @else {
              <div
                class="flex h-full items-end bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.24),_transparent_58%),linear-gradient(160deg,_rgba(231,229,228,0.95),_rgba(245,245,244,0.85))] p-6 dark:bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.14),_transparent_58%),linear-gradient(160deg,_rgba(41,37,36,0.96),_rgba(28,25,23,0.9))]"
              >
                <p class="max-w-xs text-sm uppercase tracking-[0.2em] text-stone-600 dark:text-stone-300">
                  {{ title() }} image
                </p>
              </div>
            }
          } @else {
            <div
              class="flex h-full items-end bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.24),_transparent_58%),linear-gradient(160deg,_rgba(231,229,228,0.95),_rgba(245,245,244,0.85))] p-6 dark:bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.14),_transparent_58%),linear-gradient(160deg,_rgba(41,37,36,0.96),_rgba(28,25,23,0.9))]"
            >
              <p class="max-w-xs text-sm uppercase tracking-[0.2em] text-stone-600 dark:text-stone-300">
                No recipe images available
              </p>
            </div>
          }
        </div>

        @if (hasMultipleImages()) {
          <div class="pointer-events-none absolute inset-0 flex items-center justify-between px-3 sm:px-4">
            <button
              type="button"
              class="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-stone-700 shadow-sm transition hover:bg-white dark:border-stone-700/90 dark:bg-stone-900/85 dark:text-stone-100 dark:hover:bg-stone-800"
              aria-label="Previous image"
              (click)="showPreviousImage()"
            >
              <span aria-hidden="true">&#8592;</span>
            </button>
            <button
              type="button"
              class="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-stone-700 shadow-sm transition hover:bg-white dark:border-stone-700/90 dark:bg-stone-900/85 dark:text-stone-100 dark:hover:bg-stone-800"
              aria-label="Next image"
              (click)="showNextImage()"
            >
              <span aria-hidden="true">&#8594;</span>
            </button>
          </div>
        }
      </div>

      @if (hasMultipleImages()) {
        <div class="grid grid-cols-4 gap-2 sm:grid-cols-6" aria-label="Recipe image thumbnails">
          @for (image of images(); track image.url + '-' + image.order; let i = $index) {
            <button
              type="button"
              class="overflow-hidden rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/60"
              [class.border-amber-500]="i === activeIndex()"
              [class.border-stone-200]="i !== activeIndex()"
              [class.dark:border-amber-300]="i === activeIndex()"
              [class.dark:border-stone-700]="i !== activeIndex()"
              [attr.aria-label]="'Show image ' + (i + 1)"
              [attr.aria-current]="i === activeIndex() ? 'true' : null"
              (click)="selectImage(i)"
            >
              <div class="aspect-square bg-stone-200/80 dark:bg-stone-800/80">
                @if (canRenderImage(image.url)) {
                  <img
                    [src]="image.url"
                    [alt]="thumbnailAlt(image, i)"
                    class="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    (error)="markImageError(image.url)"
                  />
                } @else {
                  <div class="flex h-full w-full items-center justify-center text-xs uppercase text-stone-500 dark:text-stone-400">
                    N/A
                  </div>
                }
              </div>
            </button>
          }
        </div>
      }
    </section>
  `,
})
export class RecipeHeroMedia {
  images = input.required<ImageDto[]>();
  title = input('');

  private readonly imageErrors = signal<Record<string, boolean>>({});
  private readonly selectedIndex = signal(0);

  readonly activeIndex = computed(() => {
    const imagesLength = this.images().length;
    if (imagesLength === 0) {
      return 0;
    }

    const index = this.selectedIndex();
    if (index >= imagesLength) {
      return imagesLength - 1;
    }

    if (index < 0) {
      return 0;
    }

    return index;
  });

  readonly activeImage = computed(() => {
    const images = this.images();
    return images[this.activeIndex()] ?? null;
  });

  readonly hasMultipleImages = computed(() => this.images().length > 1);

  showPreviousImage(): void {
    const count = this.images().length;
    if (count < 2) {
      return;
    }

    const nextIndex = (this.activeIndex() - 1 + count) % count;
    this.selectedIndex.set(nextIndex);
  }

  showNextImage(): void {
    const count = this.images().length;
    if (count < 2) {
      return;
    }

    const nextIndex = (this.activeIndex() + 1) % count;
    this.selectedIndex.set(nextIndex);
  }

  selectImage(index: number): void {
    this.selectedIndex.set(index);
  }

  markImageError(url: string): void {
    if (!url) {
      return;
    }

    this.imageErrors.update((current) => ({ ...current, [url]: true }));
  }

  canRenderImage(url: string): boolean {
    if (!url) {
      return false;
    }

    return !this.imageErrors()[url];
  }

  imageAlt(image: ImageDto): string {
    return image.caption?.trim() || `${this.title()} photo`;
  }

  thumbnailAlt(image: ImageDto, index: number): string {
    return image.caption?.trim() || `${this.title()} thumbnail ${index + 1}`;
  }
}
