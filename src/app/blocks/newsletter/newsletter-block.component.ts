import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { NewsletterBlockData } from '../../core/tenant/tenant.model';
import { TenantService } from '../../core/tenant/tenant.service';

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
              #emailInput
              type="email"
              [placeholder]="data().placeholderText || 'Correo electrónico'"
              class="input-field"
              [value]="emailValue()"
              (input)="onEmailInput(emailInput.value)"
              autocomplete="email"
              required
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
          <button
            class="btn btn-primary"
            type="button"
            [disabled]="isSubmitting()"
            [attr.aria-busy]="isSubmitting()"
            (click)="subscribe()"
          >
            {{ isSubmitting() ? 'Enviando...' : (data().buttonText || 'Suscribirse') }}
          </button>
        </div>
        
        @if (successMessage()) {
          <p class="success-message">{{ successMessage() }}</p>
        }
        @if (errorMessage()) {
          <p class="error-message" role="alert">{{ errorMessage() }}</p>
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

    .btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .success-message {
      margin-top: 1rem;
      color: green;
      font-weight: bold;
    }

    .error-message {
      margin-top: 1rem;
      color: #b42318;
      font-weight: 600;
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
  private readonly http = inject(HttpClient);
  private readonly tenantService = inject(TenantService);

  data = input.required<NewsletterBlockData>();

  emailValue = signal('');
  isSubmitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  layoutClass = computed(() => this.data().layout || 'centered');
  inputType = computed(() => this.data().type || 'email');

  onEmailInput(value: string): void {
    this.emailValue.set(value.trim());
    if (this.errorMessage()) {
      this.errorMessage.set('');
    }
  }

  subscribe(): void {
    const email = this.emailValue().trim();
    const publicCompanyId = this.tenantService.getCompanyPublicId()?.trim();

    this.successMessage.set('');
    this.errorMessage.set('');

    if (!email || !this.isValidEmail(email)) {
      this.errorMessage.set('Introduce un correo electronico valido.');
      return;
    }

    if (!publicCompanyId) {
      this.errorMessage.set('No se pudo obtener el identificador publico de la compania.');
      return;
    }

    this.isSubmitting.set(true);

    this.http.post('https://api.omega-studio.tech/sites/loyalty/signup', {
      email,
      publicCompanyId,
    }).subscribe({
      next: () => {
        this.successMessage.set('¡Suscripción exitosa!');
        this.emailValue.set('');
        this.isSubmitting.set(false);
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: () => {
        this.errorMessage.set('No se pudo completar la suscripcion. Intentalo de nuevo.');
        this.isSubmitting.set(false);
      },
    });
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
