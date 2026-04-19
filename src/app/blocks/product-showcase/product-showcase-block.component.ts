import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductShowcaseBlockData } from '../../core/tenant/tenant.model';

@Component({
  selector: 'app-product-showcase-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="product-showcase">
      <div class="showcase-container">
        
        <header class="showcase-header">
          @if (data.sectionTitle) {
            <h2 class="section-title">{{ data.sectionTitle }}</h2>
          }
          @if (data.subtitle) {
            <p class="section-subtitle">{{ data.subtitle }}</p>
          }
        </header>

        <div class="products-wrapper" [class.carousel]="data.layout === 'carousel'" [class.grid]="data.layout === 'grid'">
          @for (product of data.products; track product.id) {
            <article class="product-card">
              <div class="image-wrapper">
                <img [src]="product.imageUrl" [alt]="product.title" class="product-img" loading="lazy">
                
                @if (product.badge) {
                  <span class="product-badge">{{ product.badge }}</span>
                }
                
                <div class="card-overlay">
                  @if (product.actionUrl) {
                    <a [href]="product.actionUrl" class="action-btn">Ver Detalle</a>
                  }
                </div>
              </div>

              <div class="product-info">
                <h3 class="product-title">{{ product.title }}</h3>
                <div class="price-container">
                  @if (product.originalPrice) {
                    <span class="original-price">{{ product.originalPrice }}</span>
                  }
                  <span class="current-price">{{ product.price }}</span>
                </div>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .product-showcase {
      padding: 6rem 2rem;
      background-color: var(--color-bg);
      color: var(--color-text);
      overflow: hidden;
    }

    .showcase-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .showcase-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .section-title {
      font-size: clamp(2rem, 4vw, 3.5rem);
      font-weight: 900;
      letter-spacing: -0.02em;
      margin-bottom: 0.5rem;
    }

    .section-subtitle {
      font-size: 1.25rem;
      color: var(--color-text-muted);
      max-width: 600px;
      margin: 0 auto;
    }

    /* Layouts */
    .products-wrapper.grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
      gap: 2.5rem;
    }

    .products-wrapper.carousel {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      gap: 2rem;
      padding-bottom: 2rem;
      /* Hide scrollbar for Chrome, Safari and Opera */
      &::-webkit-scrollbar { display: none; }
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }

    .products-wrapper.carousel .product-card {
      min-width: min(260px, 75vw);
      flex-shrink: 0;
      scroll-snap-align: start;
    }

    /* Product Card */
    .product-card {
      background: var(--color-surface);
      border-radius: var(--border-radius, 1rem);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 10px 30px color-mix(in srgb, var(--color-text-muted) 5%, transparent);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
    }

    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px color-mix(in srgb, var(--color-primary) 15%, transparent);
    }

    .image-wrapper {
      position: relative;
      aspect-ratio: 3/4;
      overflow: hidden;
      background: color-mix(in srgb, var(--color-surface) 90%, #000);
    }

    .product-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.7s ease;
    }

    .product-card:hover .product-img {
      transform: scale(1.08);
    }

    .product-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: var(--color-primary);
      color: #fff;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.35rem 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-radius: 9999px;
      z-index: 2;
    }

    /* Hover Overlay */
    .card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%);
      opacity: 0;
      transition: opacity 0.3s ease;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 2rem;
      z-index: 1;
    }

    .product-card:hover .card-overlay {
      opacity: 1;
    }

    .action-btn {
      background: #fff;
      color: #000;
      text-decoration: none;
      font-weight: 700;
      padding: 0.75rem 2rem;
      border-radius: 9999px;
      transform: translateY(20px);
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .product-card:hover .action-btn {
      transform: translateY(0);
    }

    .action-btn:hover {
      background: var(--color-primary);
      color: #fff;
    }

    /* Product Info */
    .product-info {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex-grow: 1;
    }

    .product-title {
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0;
      color: var(--color-text);
      line-height: 1.4;
    }

    .price-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: auto;
    }

    .current-price {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--color-primary);
    }

    .original-price {
      font-size: 0.95rem;
      color: var(--color-text-muted);
      text-decoration: line-through;
    }

    @media (max-width: 768px) {
      .product-showcase {
        padding: 4rem 1rem;
      }
      .section-title {
        font-size: 2.2rem;
      }
      .products-wrapper.grid {
        gap: 1.5rem;
      }
    }
  `]
})
export class ProductShowcaseBlockComponent {
  @Input({ required: true }) data!: ProductShowcaseBlockData;
}
