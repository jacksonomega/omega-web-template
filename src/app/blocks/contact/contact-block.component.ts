import { Component, Input } from '@angular/core';
import { ContactBlockData } from '../../core/tenant/tenant.model';

@Component({
  selector: 'app-contact-block',
  standalone: true,
  template: `
    <section class="contact" id="contact">
      <div class="contact__container">
        <div class="contact__header">
          <h2 class="contact__title">{{ data.sectionTitle }}</h2>
        </div>
        <div class="contact__layout">
          <!-- Info panel -->
          <div class="contact__info">
            <div class="contact__info-card">
              @if (data.email) {
                <a class="contact__info-item" [href]="'mailto:' + data.email">
                  <span class="contact__info-icon" aria-hidden="true">✉️</span>
                  <span>{{ data.email }}</span>
                </a>
              }
              @if (data.phone) {
                <a class="contact__info-item" [href]="'tel:' + data.phone">
                  <span class="contact__info-icon" aria-hidden="true">📞</span>
                  <span>{{ data.phone }}</span>
                </a>
              }
              @if (data.address) {
                <div class="contact__info-item">
                  <span class="contact__info-icon" aria-hidden="true">📍</span>
                  <span>{{ data.address }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Contact form -->
          <form class="contact__form" (submit)="handleSubmit($event)" novalidate>
            <div class="contact__field-group">
              <div class="contact__field">
                <label for="contact-name" class="contact__label">Nombre</label>
                <input id="contact-name" type="text" class="contact__input" placeholder="Tu nombre completo" autocomplete="name" />
              </div>
              <div class="contact__field">
                <label for="contact-email" class="contact__label">Email</label>
                <input id="contact-email" type="email" class="contact__input" placeholder="tu@email.com" autocomplete="email" />
              </div>
            </div>
            <div class="contact__field">
              <label for="contact-message" class="contact__label">Mensaje</label>
              <textarea id="contact-message" class="contact__textarea" rows="5" placeholder="Cuéntanos sobre tu proyecto..."></textarea>
            </div>
            <button type="submit" class="contact__submit">
              Enviar mensaje
              <span aria-hidden="true">→</span>
            </button>
          </form>
        </div>

        @if (data.showMap && data.mapEmbedUrl) {
          <div class="contact__map">
            <iframe
              [src]="data.mapEmbedUrl"
              title="Ubicación en el mapa"
              width="100%"
              height="300"
              style="border:0;"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .contact {
      background: var(--color-bg);
      padding: 6rem 2rem;
    }

    .contact__container {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .contact__title {
      font-size: clamp(1.8rem, 3.5vw, 2.8rem);
      font-weight: 800;
      color: var(--color-text);
      margin-bottom: 0;
      letter-spacing: -0.02em;
      text-align: center;
    }

    .contact__layout {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 2.5rem;
      align-items: start;
    }

    .contact__info-card {
      background: var(--color-surface);
      border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
      border-radius: var(--border-radius);
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .contact__info-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.95rem;
      color: var(--color-text-muted);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    a.contact__info-item:hover {
      color: var(--color-accent);
    }

    .contact__info-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .contact__form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .contact__field-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }

    .contact__field {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .contact__label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-text-muted);
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .contact__input,
    .contact__textarea {
      background: var(--color-surface);
      border: 1.5px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
      border-radius: var(--border-radius);
      padding: 0.85rem 1rem;
      color: var(--color-text);
      font-family: var(--font-family);
      font-size: 0.95rem;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      outline: none;
      resize: vertical;
    }

    .contact__input::placeholder,
    .contact__textarea::placeholder {
      color: color-mix(in srgb, var(--color-text-muted) 50%, transparent);
    }

    .contact__input:focus,
    .contact__textarea:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 18%, transparent);
    }

    .contact__submit {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--color-primary);
      color: #fff;
      padding: 1rem 2rem;
      border-radius: var(--border-radius);
      font-weight: 700;
      font-size: 1rem;
      border: none;
      cursor: pointer;
      width: fit-content;
      transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
      box-shadow: 0 4px 20px color-mix(in srgb, var(--color-primary) 35%, transparent);
    }

    .contact__submit:hover {
      transform: translateY(-2px);
      background: var(--color-secondary);
      box-shadow: 0 8px 32px color-mix(in srgb, var(--color-primary) 45%, transparent);
    }

    .contact__map {
      border-radius: var(--border-radius);
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
    }

    @media (max-width: 768px) {
      .contact__layout { grid-template-columns: 1fr; }
      .contact__field-group { grid-template-columns: 1fr; }
      .contact { padding: 4rem 1.5rem; }
    }
  `],
})
export class ContactBlockComponent {
  @Input({ required: true }) data!: ContactBlockData;

  handleSubmit(event: Event): void {
    event.preventDefault();
    // Placeholder — wire to real service in production
    console.log('Form submitted — connect to your API here.');
  }
}
