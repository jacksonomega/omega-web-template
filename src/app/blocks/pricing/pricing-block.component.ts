import { Component, Input } from '@angular/core';
import { PricingBlockData, PricingPlan } from '../../core/tenant/tenant.model';

@Component({
  selector: 'app-pricing-block',
  standalone: true,
  template: `
    <section class="pricing">
      <div class="pricing__container">
        <h2 class="pricing__title">{{ data.sectionTitle }}</h2>
        <div class="pricing__grid">
          @for (plan of data.plans; track plan.name) {
            <article
              class="pricing-card"
              [class.pricing-card--highlighted]="plan.highlighted"
            >
              @if (plan.highlighted) {
                <div class="pricing-card__badge">Más popular</div>
              }
              <h3 class="pricing-card__name">{{ plan.name }}</h3>
              <div class="pricing-card__price-row">
                <span class="pricing-card__currency">{{ plan.currency }}</span>
                <span class="pricing-card__amount">{{ plan.price }}</span>
                <span class="pricing-card__period">/{{ plan.period === 'monthly' ? 'mes' : 'año' }}</span>
              </div>
              <ul class="pricing-card__features">
                @for (feature of plan.features; track feature) {
                  <li class="pricing-card__feature">
                    <span class="pricing-card__check" aria-hidden="true">✓</span>
                    {{ feature }}
                  </li>
                }
              </ul>
              <a
                href="#contact"
                class="pricing-card__cta"
                [class.pricing-card__cta--primary]="plan.highlighted"
              >
                {{ plan.ctaText }}
              </a>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .pricing {
      background: var(--color-bg);
      padding: 6rem 2rem;
    }

    .pricing__container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .pricing__title {
      font-size: clamp(1.8rem, 3.5vw, 2.8rem);
      font-weight: 800;
      color: var(--color-text);
      text-align: center;
      margin-bottom: 3.5rem;
      letter-spacing: -0.02em;
    }

    .pricing__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      align-items: start;
    }

    .pricing-card {
      position: relative;
      background: var(--color-surface);
      border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
      border-radius: var(--border-radius);
      padding: 2.5rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }

    .pricing-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 48px color-mix(in srgb, var(--color-primary) 12%, transparent);
    }

    .pricing-card--highlighted {
      background: color-mix(in srgb, var(--color-primary) 12%, var(--color-surface));
      border-color: var(--color-primary);
      box-shadow: 0 0 0 1px var(--color-primary), 0 20px 60px color-mix(in srgb, var(--color-primary) 25%, transparent);
    }

    .pricing-card__badge {
      position: absolute;
      top: -14px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--color-primary);
      color: #fff;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 14px;
      border-radius: 999px;
      white-space: nowrap;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .pricing-card__name {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--color-text);
    }

    .pricing-card__price-row {
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
    }

    .pricing-card__currency {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text-muted);
      align-self: flex-start;
      margin-top: 6px;
    }

    .pricing-card__amount {
      font-size: 3rem;
      font-weight: 800;
      color: var(--color-text);
      line-height: 1;
    }

    .pricing-card__period {
      font-size: 0.9rem;
      color: var(--color-text-muted);
    }

    .pricing-card__features {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      flex: 1;
    }

    .pricing-card__feature {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.95rem;
      color: var(--color-text-muted);
    }

    .pricing-card__check {
      color: var(--color-accent);
      font-weight: 700;
      flex-shrink: 0;
    }

    .pricing-card__cta {
      display: block;
      text-align: center;
      padding: 0.85rem 1.5rem;
      border-radius: var(--border-radius);
      font-weight: 700;
      font-size: 0.95rem;
      text-decoration: none;
      border: 1.5px solid color-mix(in srgb, var(--color-primary) 40%, transparent);
      color: var(--color-text-muted);
      background: transparent;
      transition: all 0.2s ease;
    }

    .pricing-card__cta:hover {
      border-color: var(--color-primary);
      color: var(--color-text);
    }

    .pricing-card__cta--primary {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: #fff;
      box-shadow: 0 4px 20px color-mix(in srgb, var(--color-primary) 40%, transparent);
    }

    .pricing-card__cta--primary:hover {
      background: var(--color-secondary);
      border-color: var(--color-secondary);
      color: #fff;
      box-shadow: 0 6px 28px color-mix(in srgb, var(--color-primary) 50%, transparent);
    }

    @media (max-width: 640px) {
      .pricing { padding: 4rem 1.5rem; }
    }
  `],
})
export class PricingBlockComponent {
  @Input({ required: true }) data!: PricingBlockData;
}
