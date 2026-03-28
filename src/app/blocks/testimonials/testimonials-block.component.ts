import { Component, Input } from '@angular/core';
import { TestimonialsBlockData } from '../../core/tenant/tenant.model';

@Component({
  selector: 'app-testimonials-block',
  standalone: true,
  template: `
    <section class="testimonials">
      <div class="testimonials__container">
        <h2 class="testimonials__title">{{ data.sectionTitle }}</h2>
        <div class="testimonials__grid">
          @for (t of data.testimonials; track t.name) {
            <article class="testimonial-card">
              <div class="testimonial-card__stars" [attr.aria-label]="t.rating + ' estrellas'">
                @for (star of starsArray(t.rating); track star) {
                  <span aria-hidden="true">★</span>
                }
              </div>
              <blockquote class="testimonial-card__quote">"{{ t.quote }}"</blockquote>
              <footer class="testimonial-card__author">
                <img
                  [src]="t.avatarUrl"
                  [alt]="'Foto de ' + t.name"
                  class="testimonial-card__avatar"
                  loading="lazy"
                />
                <div>
                  <div class="testimonial-card__name">{{ t.name }}</div>
                  <div class="testimonial-card__role">{{ t.role }}</div>
                </div>
              </footer>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .testimonials {
      background: var(--color-surface);
      padding: 6rem 2rem;
      position: relative;
      overflow: hidden;
    }

    .testimonials::after {
      content: '"';
      position: absolute;
      top: -0.5rem;
      right: 5%;
      font-size: 20rem;
      font-weight: 900;
      color: color-mix(in srgb, var(--color-primary) 6%, transparent);
      line-height: 1;
      pointer-events: none;
      font-family: Georgia, serif;
    }

    .testimonials__container {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .testimonials__title {
      font-size: clamp(1.8rem, 3.5vw, 2.8rem);
      font-weight: 800;
      color: var(--color-text);
      text-align: center;
      margin-bottom: 3.5rem;
      letter-spacing: -0.02em;
    }

    .testimonials__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .testimonial-card {
      background: color-mix(in srgb, var(--color-bg) 70%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-primary) 18%, transparent);
      border-radius: var(--border-radius);
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }

    .testimonial-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px color-mix(in srgb, var(--color-primary) 12%, transparent);
    }

    .testimonial-card__stars {
      color: var(--color-accent);
      font-size: 1.1rem;
      letter-spacing: 2px;
    }

    .testimonial-card__quote {
      font-size: 1rem;
      line-height: 1.7;
      color: var(--color-text-muted);
      font-style: italic;
      margin: 0;
      flex: 1;
    }

    .testimonial-card__author {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding-top: 1rem;
      border-top: 1px solid color-mix(in srgb, var(--color-primary) 12%, transparent);
    }

    .testimonial-card__avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid color-mix(in srgb, var(--color-primary) 30%, transparent);
      flex-shrink: 0;
    }

    .testimonial-card__name {
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--color-text);
    }

    .testimonial-card__role {
      font-size: 0.82rem;
      color: var(--color-text-muted);
    }

    @media (max-width: 640px) {
      .testimonials { padding: 4rem 1.5rem; }
    }
  `],
})
export class TestimonialsBlockComponent {
  @Input({ required: true }) data!: TestimonialsBlockData;

  starsArray(rating: number): number[] {
    return Array.from({ length: Math.min(Math.max(rating, 0), 5) });
  }
}
