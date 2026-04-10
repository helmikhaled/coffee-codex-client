import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { ImageDto } from '../../contracts/recipe-detail.dto';

@Component({
  selector: 'app-recipe-hero-media',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  template: `
    <section class="w-full space-y-4" aria-label="Recipe images" role="region">
      <div
        class="relative w-full touch-pan-y overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white/90 shadow-[0_24px_52px_-34px_rgba(120,53,15,0.45)] dark:border-stone-800 dark:bg-stone-900/90 dark:shadow-[0_26px_54px_-36px_rgba(0,0,0,0.78)]"
        [attr.tabindex]="hasMultipleImages() ? '0' : null"
        (keydown.arrowleft)="showPreviousImage()"
        (keydown.arrowright)="showNextImage()"
        (touchstart)="onTouchStart($event)"
        (touchmove)="onTouchMove($event)"
        (touchend)="onTouchEnd($event)"
        (touchcancel)="onTouchCancel()"
      >
        <div class="aspect-[4/5] sm:aspect-[3/2] lg:aspect-[4/3] bg-stone-100 dark:bg-stone-950">
          @if (activeImage(); as image) {
            @if (canRenderImage(image.url)) {
              <img
                [src]="image.url"
                [alt]="imageAlt(image)"
                class="h-full w-full object-contain transition-opacity duration-300"
                [attr.loading]="activeIndex() === 0 ? 'eager' : 'lazy'"
                [attr.fetchpriority]="activeIndex() === 0 ? 'high' : null"
                decoding="async"
                (error)="markImageError(image.url)"
              />
            } @else {
              <div
                class="flex h-full items-end bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.24),_transparent_58%),linear-gradient(160deg,_rgba(231,229,228,0.95),_rgba(245,245,244,0.85))] p-6 dark:bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.14),_transparent_58%),linear-gradient(160deg,_rgba(41,37,36,0.96),_rgba(28,25,23,0.9))]"
              >
                <p class="max-w-xs text-sm uppercase tracking-[0.2em] text-stone-600 dark:text-stone-300">
                  {{ fallbackLabel(image) }}
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
              class="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-stone-700 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/60 dark:border-stone-700/90 dark:bg-stone-900/85 dark:text-stone-100 dark:hover:bg-stone-800"
              aria-label="Previous image"
              (click)="showPreviousImage()"
            >
              <span aria-hidden="true">&#8592;</span>
            </button>
            <button
              type="button"
              class="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-stone-700 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/60 dark:border-stone-700/90 dark:bg-stone-900/85 dark:text-stone-100 dark:hover:bg-stone-800"
              aria-label="Next image"
              (click)="showNextImage()"
            >
              <span aria-hidden="true">&#8594;</span>
            </button>
          </div>
        }
      </div>

      @if (hasMultipleImages()) {
        <div class="flex items-center justify-center gap-2" aria-label="Recipe image pagination">
          @for (image of carouselImages(); track image.url + '-' + image.order; let i = $index) {
            <button
              type="button"
              class="h-3 w-3 rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/60"
              [class.border-amber-600]="i === activeIndex()"
              [class.bg-amber-500]="i === activeIndex()"
              [class.border-stone-300]="i !== activeIndex()"
              [class.bg-transparent]="i !== activeIndex()"
              [class.dark:border-amber-300]="i === activeIndex()"
              [class.dark:bg-amber-300]="i === activeIndex()"
              [class.dark:border-stone-600]="i !== activeIndex()"
              [class.dark:bg-transparent]="i !== activeIndex()"
              [attr.aria-label]="indicatorLabel(i)"
              [attr.aria-current]="i === activeIndex() ? 'true' : null"
              (click)="selectImage(i)"
            ></button>
          }
        </div>
      }
    </section>
  `,
})
export class RecipeHeroMedia {
  private static readonly SWIPE_THRESHOLD_PX = 48;

  /**
   * Contract:
   * - `images` must already be ordered by backend position ASC.
   * - Empty array renders an explicit no-image fallback.
   * - One image renders as a static hero image (no carousel controls).
   * - Two or more images enable carousel navigation and pagination controls.
   */
  images = input.required<ImageDto[]>();
  title = input('');

  private readonly imageErrors = signal<Record<string, boolean>>({});
  private readonly selectedIndex = signal(0);
  private touchStart: { x: number; y: number } | null = null;
  private touchCurrent: { x: number; y: number } | null = null;
  private readonly imageSetKey = computed(() =>
    this.carouselImages()
      .map((image) => `${image.url}|${image.order}`)
      .join('||'),
  );
  readonly carouselImages = computed(() => {
    const incoming = this.images();
    if (!Array.isArray(incoming)) {
      return [];
    }

    return incoming.filter((image): image is ImageDto => !!image);
  });

  readonly activeIndex = computed(() => {
    const imagesLength = this.carouselImages().length;
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
    const images = this.carouselImages();
    return images[this.activeIndex()] ?? null;
  });

  readonly hasMultipleImages = computed(() => this.carouselImages().length > 1);

  constructor() {
    effect(() => {
      this.imageSetKey();
      this.selectedIndex.set(0);
    });
  }

  showPreviousImage(): void {
    this.moveBy(-1);
  }

  showNextImage(): void {
    this.moveBy(1);
  }

  onTouchStart(event: TouchEvent): void {
    if (!this.hasMultipleImages()) {
      return;
    }

    const touch = event.changedTouches.item(0);
    if (!touch) {
      return;
    }

    this.touchStart = { x: touch.clientX, y: touch.clientY };
    this.touchCurrent = this.touchStart;
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.touchStart) {
      return;
    }

    const touch = event.changedTouches.item(0);
    if (!touch) {
      return;
    }

    this.touchCurrent = { x: touch.clientX, y: touch.clientY };
  }

  onTouchEnd(event: TouchEvent): void {
    if (!this.touchStart || !this.hasMultipleImages()) {
      this.onTouchCancel();
      return;
    }

    const touch = event.changedTouches.item(0);
    const endPoint = touch ? { x: touch.clientX, y: touch.clientY } : this.touchCurrent;
    if (!endPoint) {
      this.onTouchCancel();
      return;
    }

    const deltaX = endPoint.x - this.touchStart.x;
    const deltaY = endPoint.y - this.touchStart.y;
    const horizontalDistance = Math.abs(deltaX);
    const verticalDistance = Math.abs(deltaY);

    this.onTouchCancel();

    if (
      horizontalDistance < RecipeHeroMedia.SWIPE_THRESHOLD_PX ||
      horizontalDistance <= verticalDistance
    ) {
      return;
    }

    if (deltaX < 0) {
      this.showNextImage();
      return;
    }

    this.showPreviousImage();
  }

  onTouchCancel(): void {
    this.touchStart = null;
    this.touchCurrent = null;
  }

  private moveBy(offset: -1 | 1): void {
    const count = this.carouselImages().length;
    if (count < 2) {
      return;
    }

    const nextIndex = (this.activeIndex() + offset + count) % count;
    this.selectedIndex.set(nextIndex);
  }

  selectImage(index: number): void {
    const clamped = Math.max(0, Math.min(index, this.carouselImages().length - 1));
    this.selectedIndex.set(clamped);
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
    const caption = image.caption?.trim();
    if (caption) {
      return caption;
    }

    const title = this.title().trim();
    if (title) {
      return `${title} photo`;
    }

    return 'Recipe photo';
  }

  indicatorLabel(index: number): string {
    return `Show image ${index + 1} of ${this.carouselImages().length}`;
  }

  fallbackLabel(image: ImageDto): string {
    const caption = image.caption?.trim();
    if (caption) {
      return `${caption} unavailable`;
    }

    const title = this.title().trim();
    if (title) {
      return `${title} image unavailable`;
    }

    return 'Recipe image unavailable';
  }
}
