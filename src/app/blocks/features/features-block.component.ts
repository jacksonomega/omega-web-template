import { Component, Input } from '@angular/core';
import { FeaturesBlockData } from '../../core/tenant/tenant.model';

@Component({
  selector: 'app-features-block',
  standalone: true,
  template: `
    <section class="features">
      <div class="features__container">
        <h2 class="features__title">{{ data.sectionTitle }}</h2>
        <div class="features__grid">
          @for (feature of data.features; track feature.title) {
            <article class="feature-card">
              <div class="feature-card__icon" aria-hidden="true">{{ feature.icon }}</div>
              <h3 class="feature-card__title">{{ feature.title }}</h3>
              <p class="feature-card__desc">{{ feature.description }}</p>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .features {
      background: var(--color-surface);
      padding: 6rem 2rem;
      position: relative;
      overflow: hidden;
    }

    .features::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 60% 40% at 50% 0%, color-mix(in srgb, var(--color-primary) 8%, transparent), transparent);
      pointer-events: none;
    }

    .features__container {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .features__title {
      font-size: clamp(1.8rem, 3.5vw, 2.8rem);
      font-weight: 800;
      color: var(--color-text);
      text-align: center;
      margin-bottom: 3.5rem;
      letter-spacing: -0.02em;
    }

    .features__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }

    .feature-card {
      background: color-mix(in srgb, var(--color-bg) 60%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
      border-radius: var(--border-radius);
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
      cursor: default;
    }

    .feature-card:hover {
      transform: translateY(-4px);
      border-color: color-mix(in srgb, var(--color-primary) 50%, transparent);
      box-shadow: 0 12px 40px color-mix(in srgb, var(--color-primary) 15%, transparent);
    }

    .feature-card__icon {
      font-size: 2.5rem;
      line-height: 1;
    }

    .feature-card__title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--color-text);
    }

    .feature-card__desc {
      font-size: 0.95rem;
      line-height: 1.65;
      color: var(--color-text-muted);
    }

    @media (max-width: 640px) {
      .features { padding: 4rem 1.5rem; }
    }
  `],
})
export class FeaturesBlockComponent {
  @Input({ required: true }) data!: FeaturesBlockData;
}
