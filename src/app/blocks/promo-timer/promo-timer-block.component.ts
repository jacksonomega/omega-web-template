import { Component, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromoTimerBlockData } from '../../core/tenant/tenant.model';

@Component({
  selector: 'app-promo-timer-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="promo-timer">
      <div class="promo-timer__container">
        
        <div class="promo-timer__content">
          <h2 class="promo-timer__title">{{ data.title }}</h2>
          @if (data.description) {
            <p class="promo-timer__description">{{ data.description }}</p>
          }
        </div>
        
        <div class="promo-timer__countdown">
          <div class="timer-box">
            <span class="timer-box__value">{{ days() }}</span>
            <span class="timer-box__label">Días</span>
          </div>
          <div class="timer-box__separator">:</div>
          <div class="timer-box">
            <span class="timer-box__value">{{ hours() }}</span>
            <span class="timer-box__label">Horas</span>
          </div>
          <div class="timer-box__separator">:</div>
          <div class="timer-box">
            <span class="timer-box__value">{{ minutes() }}</span>
            <span class="timer-box__label">Minutos</span>
          </div>
          <div class="timer-box__separator">:</div>
          <div class="timer-box">
            <span class="timer-box__value">{{ seconds() }}</span>
            <span class="timer-box__label">Segs</span>
          </div>
        </div>
        
        @if (data.action) {
          <div class="promo-timer__action">
            <a class="promo-timer__cta" 
               [href]="data.action.url" 
               [attr.target]="data.action.type === 'url' ? '_blank' : null"
               [class.promo-timer__cta--whatsapp]="data.action.type === 'whatsapp'">
              
              @if (data.action.type === 'whatsapp') {
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              }
              {{ data.action.label || 'Aprovechar Oferta' }}
            </a>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .promo-timer {
      background: color-mix(in srgb, var(--color-accent) 15%, var(--color-surface));
      padding: 4rem 2rem;
      border-top: 2px solid var(--color-accent);
      border-bottom: 2px solid var(--color-accent);
      color: var(--color-text);
    }

    .promo-timer__container {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 2rem;
    }

    @media (min-width: 768px) {
      .promo-timer__container {
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
      }
    }

    .promo-timer__content {
      max-width: 400px;
    }

    .promo-timer__title {
      font-size: clamp(1.8rem, 3vw, 2.5rem);
      font-weight: 800;
      color: var(--color-accent);
      margin: 0 0 0.5rem 0;
      line-height: 1.2;
    }

    .promo-timer__description {
      font-size: 1rem;
      color: var(--color-text-muted);
      margin: 0;
    }

    .promo-timer__countdown {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .timer-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: var(--color-bg);
      padding: 1rem;
      min-width: 70px;
      border-radius: var(--border-radius);
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      border: 1px solid color-mix(in srgb, var(--color-text-muted) 10%, transparent);
    }

    .timer-box__value {
      font-size: 2rem;
      font-weight: 800;
      color: var(--color-text);
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }

    .timer-box__label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--color-text-muted);
      margin-top: 0.25rem;
    }

    .timer-box__separator {
      font-size: 2rem;
      font-weight: 800;
      color: var(--color-accent);
      line-height: 1;
      margin-top: -1.2rem;
    }

    .promo-timer__action {
      display: flex;
      justify-content: center;
    }

    .promo-timer__cta {
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
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 4px 15px color-mix(in srgb, var(--color-primary) 40%, transparent);
    }

    .promo-timer__cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px color-mix(in srgb, var(--color-primary) 50%, transparent);
    }

    .promo-timer__cta--whatsapp {
      background: #25D366;
      box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
    }
    .promo-timer__cta--whatsapp:hover {
      background: #128C7E;
      box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
    }

    @media (max-width: 480px) {
      .promo-timer__countdown { gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      .timer-box { min-width: 65px; padding: 0.75rem; }
      .timer-box__value { font-size: 1.5rem; }
      .timer-box__separator { display: none; }
    }
  `]
})
export class PromoTimerBlockComponent implements OnInit, OnDestroy {
  @Input({ required: true }) data!: PromoTimerBlockData;

  days = signal('00');
  hours = signal('00');
  minutes = signal('00');
  seconds = signal('00');

  private intervalId: any;

  ngOnInit() {
    this.calculateTimeLeft();
    this.intervalId = setInterval(() => {
      this.calculateTimeLeft();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private calculateTimeLeft() {
    if (!this.data.endDate) return;
    const end = new Date(this.data.endDate).getTime();
    const now = new Date().getTime();
    const distance = end - now;

    if (distance < 0) {
      this.days.set('00');
      this.hours.set('00');
      this.minutes.set('00');
      this.seconds.set('00');
      if (this.intervalId) clearInterval(this.intervalId);
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    this.days.set(String(d).padStart(2, '0'));
    this.hours.set(String(h).padStart(2, '0'));
    this.minutes.set(String(m).padStart(2, '0'));
    this.seconds.set(String(s).padStart(2, '0'));
  }
}
