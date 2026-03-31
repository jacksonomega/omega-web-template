import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryBlockData } from '../../core/tenant/tenant.model';

@Component({
  selector: 'app-gallery-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="gallery">
      <div class="gallery__container">
        @if (data.sectionTitle) {
          <h2 class="gallery__title">{{ data.sectionTitle }}</h2>
        }
        
        <div class="gallery__wrapper" [attr.data-layout]="data.layout || 'grid'">
          @for (img of data.images; track img.url) {
            <figure class="gallery__item">
              <div class="gallery__image-wrapper">
                <img 
                  [src]="img.url" 
                  [alt]="img.altText || img.caption || 'Imagen de galería'"
                  class="gallery__image"
                  loading="lazy"
                >
              </div>
              @if (img.caption) {
                <figcaption class="gallery__caption">{{ img.caption }}</figcaption>
              }
            </figure>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .gallery {
      background: var(--color-bg);
      padding: 5rem 2rem;
    }

    .gallery__container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .gallery__title {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 800;
      color: var(--color-text);
      text-align: center;
      margin-bottom: 3rem;
      letter-spacing: -0.02em;
    }

    .gallery__wrapper {
      display: grid;
      gap: 1.5rem;
    }

    /* GRID LAYOUT */
    .gallery__wrapper[data-layout="grid"] {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }

    /* CAROUSEL LAYOUT */
    .gallery__wrapper[data-layout="carousel"] {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      gap: 1.5rem;
      padding-bottom: 1.5rem; /* space for scrollbar */
      scrollbar-width: thin;
      scrollbar-color: var(--color-primary) transparent;
      scroll-behavior: smooth;
    }

    .gallery__wrapper[data-layout="carousel"]::-webkit-scrollbar {
      height: 8px;
    }
    .gallery__wrapper[data-layout="carousel"]::-webkit-scrollbar-track {
      background: color-mix(in srgb, var(--color-text-muted) 10%, transparent);
      border-radius: 4px;
    }
    .gallery__wrapper[data-layout="carousel"]::-webkit-scrollbar-thumb {
      background: var(--color-primary);
      border-radius: 4px;
    }

    .gallery__item {
      margin: 0;
      position: relative;
      border-radius: var(--border-radius);
      overflow: hidden;
      background: var(--color-surface);
      box-shadow: 0 4px 20px color-mix(in srgb, var(--color-text-muted) 10%, transparent);
      display: flex;
      flex-direction: column;
    }

    .gallery__wrapper[data-layout="grid"] .gallery__item {
      height: 100%;
    }

    .gallery__wrapper[data-layout="carousel"] .gallery__item {
      scroll-snap-align: start;
      flex: 0 0 85%;
      max-width: 400px;
    }

    @media (min-width: 640px) {
      .gallery__wrapper[data-layout="carousel"] .gallery__item {
        flex: 0 0 45%;
      }
    }
    
    @media (min-width: 1024px) {
      .gallery__wrapper[data-layout="carousel"] .gallery__item {
        flex: 0 0 30%;
      }
    }

    .gallery__image-wrapper {
      overflow: hidden;
      height: 280px;
      width: 100%;
    }

    .gallery__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.4s ease;
    }

    .gallery__item:hover .gallery__image {
      transform: scale(1.05);
    }

    .gallery__caption {
      padding: 1.25rem 1rem;
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--color-text);
      text-align: center;
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class GalleryBlockComponent {
  @Input({ required: true }) data!: GalleryBlockData;
}
