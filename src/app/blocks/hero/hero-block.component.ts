import { Component, Input } from '@angular/core';
import { HeroBlockData } from '../../core/tenant/tenant.model';

@Component({
  selector: 'app-hero-block',
  standalone: true,
  template: `
    <section class="hero" [class.hero--gradient]="data.backgroundType === 'gradient'">
      <div class="hero__backdrop"></div>
      <div class="hero__container">
        <div class="hero__content">
          <h1 class="hero__headline">{{ data.headline }}</h1>
          <p class="hero__subheadline">{{ data.subheadline }}</p>
          <a class="hero__cta" [href]="data.ctaUrl">
            {{ data.ctaText }}
            <span class="hero__cta-arrow">→</span>
          </a>
        </div>
        <div class="hero__visual">
          <div class="hero__image-wrapper">
            <img
              [src]="data.imageUrl"
              [alt]="data.headline"
              class="hero__image"
              loading="eager"
            />
            <div class="hero__image-glow"></div>
          </div>
        </div>
      </div>
      <div class="hero__scroll-indicator" aria-hidden="true">
        <span class="hero__scroll-dot"></span>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      min-height: 100dvh;
      display: flex;
      align-items: center;
      background: var(--color-bg);
      overflow: hidden;
    }

    .hero__backdrop {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 80% 60% at 70% 50%, color-mix(in srgb, var(--color-primary) 18%, transparent) 0%, transparent 70%),
        radial-gradient(ellipse 50% 40% at 20% 80%, color-mix(in srgb, var(--color-accent) 10%, transparent) 0%, transparent 60%);
      pointer-events: none;
    }

    .hero__container {
      position: relative;
      z-index: 1;
      max-width: 1200px;
      margin: 0 auto;
      padding: 6rem 2rem 4rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }

    .hero__content {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    .hero__headline {
      font-size: clamp(2.4rem, 5vw, 4rem);
      font-weight: 800;
      line-height: 1.1;
      color: var(--color-text);
      letter-spacing: -0.03em;
    }

    .hero__headline::first-line {
      color: var(--color-accent);
    }

    .hero__subheadline {
      font-size: clamp(1rem, 2vw, 1.2rem);
      line-height: 1.7;
      color: var(--color-text-muted);
      max-width: 480px;
    }

    .hero__cta {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--color-primary);
      color: #fff;
      padding: 1rem 2rem;
      border-radius: var(--border-radius);
      font-weight: 700;
      font-size: 1rem;
      text-decoration: none;
      width: fit-content;
      transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
      box-shadow: 0 4px 24px color-mix(in srgb, var(--color-primary) 40%, transparent);
    }

    .hero__cta:hover {
      transform: translateY(-2px);
      background: var(--color-secondary);
      box-shadow: 0 8px 32px color-mix(in srgb, var(--color-primary) 50%, transparent);
    }

    .hero__cta-arrow {
      transition: transform 0.2s ease;
    }

    .hero__cta:hover .hero__cta-arrow {
      transform: translateX(4px);
    }

    .hero__visual {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .hero__image-wrapper {
      position: relative;
      border-radius: calc(var(--border-radius) * 2);
      overflow: hidden;
    }

    .hero__image {
      width: 100%;
      max-width: 500px;
      height: auto;
      display: block;
      border-radius: calc(var(--border-radius) * 2);
      border: 1px solid color-mix(in srgb, var(--color-primary) 30%, transparent);
      transition: transform 0.4s ease;
    }

    .hero__image:hover {
      transform: scale(1.02);
    }

    .hero__image-glow {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at center, color-mix(in srgb, var(--color-accent) 15%, transparent), transparent 70%);
      pointer-events: none;
    }

    .hero__scroll-indicator {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .hero__scroll-dot {
      width: 6px;
      height: 6px;
      background: var(--color-accent);
      border-radius: 50%;
      animation: bounce 1.6s ease infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); opacity: 1; }
      50% { transform: translateY(10px); opacity: 0.4; }
    }

    @media (max-width: 768px) {
      .hero__container {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 2.5rem;
        padding: 5rem 1.5rem 3rem;
      }
      .hero__subheadline { max-width: 100%; }
      .hero__cta { margin: 0 auto; }
      .hero__visual { order: -1; }
    }
  `],
})
export class HeroBlockComponent {
  @Input({ required: true }) data!: HeroBlockData;
}
