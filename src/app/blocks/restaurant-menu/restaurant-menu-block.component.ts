import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantMenuBlockData, MenuCategory } from '../../core/tenant/tenant.model';

@Component({
  selector: 'app-restaurant-menu-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="restaurant-menu-block">
      <div class="menu-container">
        
        <header class="menu-header">
          @if (data.sectionTitle) {
            <h2 class="section-title">{{ data.sectionTitle }}</h2>
          }
          @if (data.subtitle) {
            <p class="section-subtitle">{{ data.subtitle }}</p>
          }
        </header>

        <!-- Dynamic Category Tabs -->
        @if (data.categories && data.categories.length > 1) {
          <nav class="menu-tabs">
            @for (cat of data.categories; track cat.id) {
              <button 
                class="tab-btn" 
                [class.active]="activeCategoryId() === cat.id"
                (click)="setActiveCategory(cat.id)">
                {{ cat.name }}
              </button>
            }
          </nav>
        }

        <!-- Menu Content -->
        <div class="menu-content" [class.fade]="isAnimating()">
          @for (category of data.categories; track category.id) {
            @if (activeCategoryId() === category.id || data.categories.length === 1) {
              <div class="menu-category">
                
                @if (data.categories.length === 1) {
                  <h3 class="category-title">{{ category.name }}</h3>
                }

                <div class="menu-grid">
                  @for (item of category.items; track item.id) {
                    <article class="menu-item">
                      <div class="item-header">
                        <h4 class="item-title">
                          <span class="title-text">{{ item.title }}</span>
                          @if (item.isPopular) {
                            <span class="badge popular">Estrella</span>
                          }
                        </h4>
                        <span class="item-price">{{ item.price }}</span>
                      </div>
                      
                      @if (item.description) {
                        <p class="item-desc">{{ item.description }}</p>
                      }

                      @if (item.allergens && item.allergens.length > 0) {
                        <div class="item-allergens">
                          @for (allergen of item.allergens; track allergen) {
                            <span class="allergen-icon" [title]="allergen">{{ getAllergenIcon(allergen) }}</span>
                          }
                        </div>
                      }
                    </article>
                  }
                </div>
              </div>
            }
          }
        </div>
        
      </div>
    </section>
  `,
  styles: [`
    .restaurant-menu-block {
      background-color: var(--color-bg);
      padding: 6rem 2rem;
      font-family: var(--font-family, serif);
    }

    .menu-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .menu-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .section-title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      color: var(--color-primary);
      font-weight: 700;
      margin-bottom: 1rem;
      letter-spacing: -0.03em;
    }

    .section-subtitle {
      font-size: 1.2rem;
      color: var(--color-text-muted);
      font-family: sans-serif;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    /* Tabs Styling */
    .menu-tabs {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 3rem;
      border-bottom: 1px solid color-mix(in srgb, var(--color-text-muted) 30%, transparent);
      padding-bottom: 1rem;
    }

    .tab-btn {
      background: transparent;
      border: none;
      color: var(--color-text-muted);
      font-size: 1.25rem;
      font-weight: 600;
      padding: 0.5rem 1rem;
      cursor: pointer;
      position: relative;
      transition: color 0.3s ease;
    }

    .tab-btn:hover {
      color: var(--color-text);
    }

    .tab-btn.active {
      color: var(--color-primary);
    }

    .tab-btn.active::after {
      content: '';
      position: absolute;
      bottom: -1rem;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: var(--color-primary);
      border-radius: 3px 3px 0 0;
    }

    /* Category Content */
    .menu-content {
      transition: opacity 0.3s ease;
    }
    
    .menu-content.fade {
      opacity: 0;
    }

    .category-title {
      font-size: 2rem;
      text-align: center;
      color: var(--color-text);
      margin-bottom: 3rem;
      font-style: italic;
    }

    .menu-grid {
      display: grid;
      grid-template-columns: 1fr;
      column-gap: 4rem;
      row-gap: 2.5rem;
    }

    @media (min-width: 768px) {
      .menu-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    /* Menu Item */
    .menu-item {
      display: flex;
      flex-direction: column;
      width: 100%;
      overflow: hidden;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      position: relative;
      margin-bottom: 0.5rem;
      gap: 0.5rem;
    }

    .item-header::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 6px;
      border-bottom: 2px dotted color-mix(in srgb, var(--color-text-muted) 50%, transparent);
      z-index: 0;
    }

    .item-title {
      font-size: 1.35rem;
      color: var(--color-text);
      margin: 0;
      background: var(--color-bg);
      padding-right: 0.75rem;
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .title-text {
      font-weight: 700;
    }
    
    .badge {
      font-size: 0.65rem;
      text-transform: uppercase;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-family: sans-serif;
      font-weight: bold;
    }
    
    .badge.popular {
      background-color: color-mix(in srgb, #eab308 20%, transparent);
      color: #ca8a04;
    }

    .item-price {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-primary);
      background: var(--color-bg);
      padding-left: 0.25rem;
      position: relative;
      z-index: 1;
      white-space: nowrap;
    }

    .item-desc {
      font-size: 0.95rem;
      color: var(--color-text-muted);
      line-height: 1.6;
      margin: 0;
      font-family: sans-serif;
    }

    .item-allergens {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .allergen-icon {
      font-size: 1.1rem;
      filter: grayscale(0.5);
      cursor: help;
    }

    @media (max-width: 768px) {
      .restaurant-menu-block {
        padding: 4rem 1rem;
      }
      .section-title {
        font-size: 2rem;
      }
      .item-header {
        align-items: flex-start;
      }
      .item-title {
        font-size: 1.15rem;
        flex-wrap: wrap;
      }
      .item-price {
        font-size: 1.15rem;
      }
      .menu-grid {
        row-gap: 2rem;
      }
    }
  `]
})
export class RestaurantMenuBlockComponent {
  @Input({ required: true }) data!: RestaurantMenuBlockData;
  
  activeCategoryId = signal<string | null>(null);
  isAnimating = signal<boolean>(false);

  ngOnInit() {
    if (this.data.categories && this.data.categories.length > 0) {
      this.activeCategoryId.set(this.data.categories[0].id);
    }
  }

  setActiveCategory(id: string) {
    if (this.activeCategoryId() !== id) {
      this.isAnimating.set(true);
      setTimeout(() => {
        this.activeCategoryId.set(id);
        this.isAnimating.set(false);
      }, 150);
    }
  }

  getAllergenIcon(allergen: string): string {
    const icons: Record<string, string> = {
      'gluten': '🌾',
      'lactose': '🥛',
      'nuts': '🥜',
      'vegan': '🌱',
      'spicy': '🌶️'
    };
    return icons[allergen] || '⚠️';
  }
}
