import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LocationBlockData } from '../../core/tenant/tenant.model';

@Component({
  selector: 'app-location-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="location">
      <div class="location__container">
        @if (data.sectionTitle) {
          <h2 class="location__title">{{ data.sectionTitle }}</h2>
        }

        <div class="location__grid">
          <div class="location__info">
            <div class="location__address-box">
              <span class="location__icon">📍</span>
              <div>
                <h3 class="location__label">Nuestra Ubicación</h3>
                <p class="location__address">{{ data.address }}</p>
              </div>
            </div>
            
            @if (data.description) {
              <p class="location__description">{{ data.description }}</p>
            }

            <a 
              [href]="'https://www.google.com/maps/search/?api=1&query=' + encodeAddress(data.address)" 
              target="_blank" 
              class="location__button"
            >
              Abrir en Google Maps
            </a>
          </div>

          <div class="location__map-wrapper">
            <iframe 
              [src]="safeMapUrl" 
              class="location__iframe" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .location {
      background: var(--color-surface);
      padding: 5rem 2rem;
      color: var(--color-text);
    }

    .location__container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .location__title {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 800;
      text-align: center;
      margin-bottom: 3.5rem;
      letter-spacing: -0.02em;
    }

    .location__grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 3rem;
      align-items: center;
    }

    @media (min-width: 992px) {
      .location__grid {
        grid-template-columns: 1fr 1.5fr;
      }
    }

    .location__info {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .location__address-box {
      display: flex;
      gap: 1.25rem;
      background: var(--color-bg);
      padding: 1.5rem;
      border-radius: var(--border-radius);
      border-left: 4px solid var(--color-primary);
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }

    .location__icon {
      font-size: 2rem;
    }

    .location__label {
      font-size: 0.9rem;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--color-primary);
      margin: 0 0 0.25rem 0;
      letter-spacing: 0.05em;
    }

    .location__address {
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0;
      line-height: 1.4;
    }

    .location__description {
      font-size: 1.1rem;
      line-height: 1.6;
      color: var(--color-text-muted);
      margin: 0;
    }

    .location__button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: fit-content;
      padding: 0.8rem 1.5rem;
      background: var(--color-primary);
      color: #fff;
      font-weight: 700;
      text-decoration: none;
      border-radius: var(--border-radius);
      transition: all 0.2s ease;
      box-shadow: 0 4px 15px color-mix(in srgb, var(--color-primary) 30%, transparent);
    }

    .location__button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px color-mix(in srgb, var(--color-primary) 40%, transparent);
      filter: brightness(1.1);
    }

    .location__map-wrapper {
      position: relative;
      width: 100%;
      height: 400px;
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      border: 1px solid color-mix(in srgb, var(--color-text-muted) 20%, transparent);
    }

    .location__iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }

    @media (max-width: 480px) {
      .location__map-wrapper {
        height: 300px;
      }
    }
  `]
})
export class LocationBlockComponent implements OnInit {
  @Input({ required: true }) data!: LocationBlockData;
  private sanitizer = inject(DomSanitizer);
  safeMapUrl!: SafeResourceUrl;

  ngOnInit() {
    this.updateMapUrl();
  }

  private updateMapUrl() {
    const baseUrl = 'https://maps.google.com/maps';
    const params = `q=${encodeURIComponent(this.data.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${baseUrl}?${params}`);
  }

  encodeAddress(address: string): string {
    return encodeURIComponent(address);
  }
}
