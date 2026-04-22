import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { NewsletterBlockData } from '../../core/tenant/tenant.model';

@Component({
  selector: 'app-newsletter-block',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="newsletter-block" [class]="layoutClass()">
      <div class="content">
        <h2>{{ data().title }}</h2>
        @if (data().subtitle) {
          <p class="subtitle">{{ data().subtitle }}</p>
        }

        <div class="form-wrapper">
          @if (inputType() === 'both' || inputType() === 'email') {
            <input 
              type="email" 
              [placeholder]="data().placeholderText || 'Correo electrónico'" 
              class="input-field" 
              [attr.aria-label]="data().placeholderText || 'Correo electrónico'"
            />
          }
          @if (inputType() === 'phone') {
            <input 
              type="tel" 
              [placeholder]="data().placeholderText || 'Teléfono'" 
              class="input-field" 
              [attr.aria-label]="data().placeholderText || 'Teléfono'"
            />
          }
          <button class="btn btn-primary" (click)="subscribe()">{{ data().buttonText || 'Suscribirse' }}</button>
        </div>
        
        @if (successMessage()) {
          <p class="success-message">{{ successMessage() }}</p>
        }
      </div>

      @if (data().layout === 'split' && data().imageUrl) {
        <div class="image-wrapper">
          <img [src]="data().imageUrl" alt="Newsletter" loading="lazy" />
        </div>
      }
    </section>
  `,
  styleUrls: [],
  styles: [`
    .newsletter-block {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding: 4rem 2rem;
      border-radius: var(--border-radius);
      background-color: var(--surfaceColor);
      color: var(--textColor);
      max-width: 1200px;
      margin: 0 auto;
    }

    .newsletter-block.split {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .newsletter-block.centered {
      text-align: center;
      align-items: center;
    }

    .content {
      flex: 1;
      max-width: 600px;
      width: 100%;
    }

    h2 {
      margin-bottom: 1rem;
      color: var(--primaryColor);
    }

    .subtitle {
      margin-bottom: 2rem;
      opacity: 0.8;
      font-size: 1.125rem;
    }

    .form-wrapper {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .centered .form-wrapper {
      justify-content: center;
    }

    .input-field {
      flex: 1;
      min-width: 200px;
      padding: 0.75rem 1rem;
      border: 1px solid rgba(0,0,0,0.1);
      border-radius: var(--border-radius);
      font-size: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: var(--border-radius);
      cursor: pointer;
      font-weight: bold;
      transition: opacity 0.2s;
    }
    .btn-primary {
      background-color: var(--primaryColor);
      color: var(--surfaceColor);
    }

    .btn:hover {
      opacity: 0.9;
    }

    .success-message {
      margin-top: 1rem;
      color: green;
      font-weight: bold;
    }

    .image-wrapper {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    img {
      max-width: 100%;
      border-radius: var(--border-radius);
      object-fit: cover;
    }

    @media (max-width: 768px) {
      .newsletter-block.split {
        flex-direction: column;
      }
    }
  `]
})
export class NewsletterBlockComponent {
  data = input.required<NewsletterBlockData>();

  successMessage = signal('');

  layoutClass = computed(() => this.data().layout || 'centered');
  inputType = computed(() => this.data().type || 'email');

  subscribe() {
    // Mock subscription
    this.successMessage.set('¡Suscripción exitosa!');
    setTimeout(() => this.successMessage.set(''), 3000);
  }
}
