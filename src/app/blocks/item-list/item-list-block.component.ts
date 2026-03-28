import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemListBlockData } from '../../core/tenant/tenant.model';

@Component({
  selector: 'app-item-list-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="item-list">
      <div class="item-list__container">
        
        <header class="item-list__header">
          <h2 class="item-list__title">{{ data.header.title }}</h2>
          @if (data.header.subtitle) {
            <p class="item-list__subtitle">{{ data.header.subtitle }}</p>
          }
        </header>

        <div class="item-list__categories">
          @for (category of data.categories; track category.id) {
            <div class="item-list__category">
              <h3 class="item-list__category-title">{{ category.name }}</h3>
              
              <div 
                class="item-list__grid"
                [attr.data-style]="data.displayStyle"
                [style.--cols-desktop]="data.columns.desktop"
                [style.--cols-mobile]="data.columns.mobile">
                
                @for (item of category.items; track item.id) {
                  <article class="list-item" [attr.data-style]="data.displayStyle">
                    
                    @if (item.imageUrl && data.displayStyle === 'card-grid') {
                      <div class="list-item__image-wrapper">
                        <img [src]="item.imageUrl" [alt]="item.title" class="list-item__image" loading="lazy">
                      </div>
                    }

                    <div class="list-item__content">
                      <div class="list-item__header">
                        <h4 class="list-item__title">
                          <span>{{ item.title }}</span>
                        </h4>
                        @if (item.price) {
                          <span class="list-item__price">{{ item.price }}</span>
                        }
                      </div>

                      @if (item.description) {
                        <p class="list-item__description">{{ item.description }}</p>
                      }

                      <div class="list-item__meta">
                        @if (item.duration) {
                          <span class="list-item__duration">⏱ {{ item.duration }}</span>
                        }
                        @for (tag of item.tags; track tag) {
                          <span class="list-item__tag">{{ tag }}</span>
                        }
                      </div>

                      @if (item.action && data.displayStyle !== 'menu') {
                        <div class="list-item__action">
                          <a [href]="item.action.url" 
                             class="list-item__cta" 
                             [attr.target]="item.action.type === 'url' ? '_blank' : null">
                            {{ item.action.label || 'Ver más' }}
                          </a>
                        </div>
                      }
                    </div>
                  </article>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .item-list {
      background: var(--color-bg);
      padding: 6rem 2rem;
    }

    .item-list__container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .item-list__header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .item-list__title {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 800;
      color: var(--color-text);
      letter-spacing: -0.02em;
      margin: 0 0 1rem 0;
    }

    .item-list__subtitle {
      font-size: 1.25rem;
      color: var(--color-text-muted);
      max-width: 600px;
      margin: 0 auto;
    }

    .item-list__category {
      margin-bottom: 4rem;
    }

    .item-list__category-title {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--color-text);
      border-bottom: 2px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
      padding-bottom: 1rem;
      margin-bottom: 2rem;
    }

    /* Grid Layouts based on columns prop */
    .item-list__grid {
      display: grid;
      gap: 2rem;
      grid-template-columns: repeat(var(--cols-mobile), 1fr);
    }

    @media (min-width: 768px) {
      .item-list__grid {
        grid-template-columns: repeat(var(--cols-desktop), 1fr);
      }
    }

    /* --- List Item Styles --- */
    .list-item {
      position: relative;
    }

    .list-item__header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .list-item__title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-text);
      margin: 0;
    }

    .list-item__price {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-primary);
      white-space: nowrap;
    }

    .list-item__description {
      font-size: 0.95rem;
      color: var(--color-text-muted);
      line-height: 1.6;
      margin: 0 0 1rem 0;
    }

    .list-item__meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 1rem;
    }

    .list-item__duration {
      font-size: 0.85rem;
      color: var(--color-text-muted);
      background: var(--color-surface);
      border: 1px solid color-mix(in srgb, var(--color-text-muted) 20%, transparent);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .list-item__tag {
      font-size: 0.75rem;
      font-weight: 700;
      color: #fff;
      background: var(--color-primary);
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .list-item__action {
      margin-top: auto;
      padding-top: 1rem;
    }

    .list-item__cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.6rem 1.2rem;
      border-radius: var(--border-radius);
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      border: 1.5px solid var(--color-primary);
      color: var(--color-text);
      background: transparent;
      transition: all 0.2s ease;
    }

    .list-item__cta:hover {
      background: var(--color-primary);
      color: #fff;
    }

    /* --- Variant: Menu (Restaurant) --- */
    .list-item[data-style="menu"] {
      display: flex;
      flex-direction: column;
    }
    
    .list-item[data-style="menu"] .list-item__header {
      position: relative;
    }

    /* Dotted leader */
    .list-item[data-style="menu"] .list-item__title::after {
      content: "";
      position: absolute;
      bottom: 6px;
      left: 0;
      right: 0;
      height: 1px;
      border-bottom: 2px dotted color-mix(in srgb, var(--color-text-muted) 50%, transparent);
      z-index: 0;
    }

    .list-item[data-style="menu"] .list-item__title span {
      background: var(--color-bg);
      padding-right: 0.5rem;
      position: relative;
      z-index: 1;
    }

    .list-item[data-style="menu"] .list-item__price {
      background: var(--color-bg);
      padding-left: 0.5rem;
      position: relative;
      z-index: 1;
    }

    /* --- Variant: List (Barbershop, Services) --- */
    .list-item[data-style="list"] {
      background: var(--color-surface);
      border: 1px solid color-mix(in srgb, var(--color-primary) 10%, transparent);
      border-radius: var(--border-radius);
      padding: 2rem;
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .list-item[data-style="list"]:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px color-mix(in srgb, var(--color-primary) 10%, transparent);
    }

    /* --- Variant: Card Grid (Retail, Products) --- */
    .list-item[data-style="card-grid"] {
      background: var(--color-surface);
      border-radius: var(--border-radius);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
      border: 1px solid color-mix(in srgb, var(--color-primary) 10%, transparent);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .list-item[data-style="card-grid"]:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 35px color-mix(in srgb, var(--color-primary) 15%, transparent);
    }

    .list-item__image-wrapper {
      width: 100%;
      aspect-ratio: 4/3;
      overflow: hidden;
    }

    .list-item__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .list-item[data-style="card-grid"]:hover .list-item__image {
      transform: scale(1.05);
    }

    .list-item[data-style="card-grid"] .list-item__content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    @media (max-width: 640px) {
      .item-list { padding: 4rem 1.5rem; }
    }
  `]
})
export class ItemListBlockComponent {
  @Input({ required: true }) data!: ItemListBlockData;
}
