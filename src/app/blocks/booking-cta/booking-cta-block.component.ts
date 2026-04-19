import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BookingCtaBlockData } from '../../core/tenant/tenant.model';

@Component({
  selector: 'app-booking-cta-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="booking-cta-block">
      <div class="booking-container" [style.background-image]="data.imageUrl ? 'url(' + data.imageUrl + ')' : 'none'">
        
        <div class="overlay"></div>

        <div class="content-wrapper">
          <div class="text-content">
            <h2 class="title">{{ data.title }}</h2>
            @if (data.subtitle) {
              <p class="subtitle">{{ data.subtitle }}</p>
            }
          </div>

          <div class="action-content">
            @if (data.widgetType === 'button-only' && data.buttonUrl) {
              <a [href]="data.buttonUrl" class="cta-button" target="_blank">
                {{ data.buttonLabel || 'Reservar Ahora' }}
              </a>
            } @else if (safeWidgetUrl) {
              <div class="widget-wrapper" [class.calendly]="data.widgetType === 'calendly'">
                <iframe 
                  [src]="safeWidgetUrl" 
                  width="100%" 
                  height="100%" 
                  frameborder="0" 
                  scrolling="yes" 
                  allowfullscreen>
                </iframe>
              </div>
            }
          </div>
        </div>
        
      </div>
    </section>
  `,
  styles: [`
    .booking-cta-block {
      padding: 4rem 2rem;
      background-color: var(--color-bg);
      display: flex;
      justify-content: center;
    }

    .booking-container {
      width: 100%;
      max-width: 1200px;
      min-height: 500px;
      border-radius: var(--border-radius, 1.5rem);
      background-size: cover;
      background-position: center;
      background-color: color-mix(in srgb, var(--color-surface) 50%, var(--color-primary));
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 100%);
      backdrop-filter: blur(4px);
    }

    .content-wrapper {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 3rem;
      width: 100%;
      max-width: 1000px;
      padding: 3rem;
    }

    @media (min-width: 900px) {
      .content-wrapper {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    /* Text */
    .text-content {
      color: #fff;
      flex: 1;
    }

    .title {
      font-size: clamp(2rem, 5vw, 4rem);
      font-weight: 800;
      margin: 0 0 1rem 0;
      line-height: 1.1;
      letter-spacing: -0.02em;
      text-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }

    .subtitle {
      font-size: 1.25rem;
      color: rgba(255,255,255,0.85);
      margin: 0;
      max-width: 500px;
      line-height: 1.6;
    }

    /* Actions */
    .action-content {
      flex: 1;
      display: flex;
      justify-content: center;
      width: 100%;
    }

    @media (min-width: 900px) {
      .action-content {
        justify-content: flex-end;
      }
    }

    .cta-button {
      display: inline-block;
      background: var(--color-primary);
      color: #fff;
      font-size: 1.25rem;
      font-weight: 700;
      padding: 1.25rem 3rem;
      border-radius: 9999px;
      text-decoration: none;
      text-align: center;
      box-shadow: 0 10px 20px color-mix(in srgb, var(--color-primary) 30%, transparent);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 2px solid transparent;
    }

    .cta-button:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px color-mix(in srgb, var(--color-primary) 40%, transparent);
      filter: brightness(1.1);
    }

    .widget-wrapper {
      width: 100%;
      max-width: 450px;
      height: 400px;
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    }

    .widget-wrapper.calendly {
      height: 600px; /* Calendly specific height */
    }

    @media (max-width: 768px) {
      .booking-cta-block {
        padding: 2rem 1rem;
      }
      .content-wrapper {
        padding: 1.5rem;
        text-align: center;
        gap: 2rem;
      }
      .subtitle {
        margin: 0 auto;
        font-size: 1.1rem;
      }
      .cta-button {
        padding: 1rem 2rem;
        font-size: 1.1rem;
        width: 100%;
      }
      .widget-wrapper {
        height: 350px;
      }
      .widget-wrapper.calendly {
        height: 500px;
      }
    }
  `]
})
export class BookingCtaBlockComponent implements OnInit {
  @Input({ required: true }) data!: BookingCtaBlockData;
  safeWidgetUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    if (this.data.widgetType !== 'button-only' && this.data.widgetUrl) {
      this.safeWidgetUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.widgetUrl);
    }
  }
}
