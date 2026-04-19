import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BusinessInfoBlockData } from '../../core/tenant/tenant.model';

@Component({
  selector: 'app-business-info-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="business-info-block">
      <div class="business-info-container">
        
        <div class="info-header">
          @if (data.sectionTitle) {
            <h2 class="section-title">{{ data.sectionTitle }}</h2>
          }
        </div>

        <div class="info-grid">
          
          <!-- Contact & Location Card -->
          <div class="glass-card contact-card">
            <h3 class="card-title">Contacto y Ubicación</h3>
            
            <div class="contact-details">
              @if (data.address) {
                <div class="detail-item">
                  <span class="detail-icon">📍</span>
                  <span class="detail-text">{{ data.address }}</span>
                </div>
              }
              
              @if (data.phone) {
                <div class="detail-item">
                  <span class="detail-icon">📞</span>
                  <a [href]="'tel:' + data.phone" class="detail-link">{{ data.phone }}</a>
                </div>
              }
              
              @if (data.whatsapp) {
                <div class="detail-item">
                  <span class="detail-icon" style="color: #25D366;">💬</span>
                  <a [href]="'https://wa.me/' + cleanPhone(data.whatsapp)" target="_blank" class="detail-link">WhatsApp</a>
                </div>
              }
              
              @if (data.email) {
                <div class="detail-item">
                  <span class="detail-icon">✉️</span>
                  <a [href]="'mailto:' + data.email" class="detail-link">{{ data.email }}</a>
                </div>
              }
            </div>

            @if (safeMapUrl) {
              <div class="map-wrapper">
                <iframe 
                  [src]="safeMapUrl" 
                  width="100%" 
                  height="250" 
                  style="border:0;" 
                  allowfullscreen="" 
                  loading="lazy" 
                  referrerpolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            }
          </div>

          <!-- Opening Hours Card -->
          <div class="glass-card hours-card">
            <div class="hours-header">
              <h3 class="card-title">Horarios de Apertura</h3>
              @if (data.isOpenNow !== undefined) {
                <span class="status-badge" [class.open]="data.isOpenNow" [class.closed]="!data.isOpenNow">
                  {{ data.isOpenNow ? 'Abierto Ahora' : 'Cerrado' }}
                </span>
              }
            </div>
            
            <ul class="hours-list">
              @for (schedule of data.openingHours; track schedule.day) {
                <li class="hours-row">
                  <span class="hours-day">{{ schedule.day }}</span>
                  <span class="hours-time">{{ schedule.hours }}</span>
                </li>
              }
            </ul>
          </div>
          
        </div>
      </div>
    </section>
  `,
  styles: [`
    .business-info-block {
      padding: 6rem 2rem;
      background-color: var(--color-bg);
      color: var(--color-text);
      overflow: hidden;
    }

    .business-info-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .info-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .section-title {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 800;
      color: var(--color-primary);
      letter-spacing: -0.02em;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    @media (min-width: 900px) {
      .info-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    /* Glassmorphism Card Style */
    .glass-card {
      background: color-mix(in srgb, var(--color-surface) 90%, transparent);
      backdrop-filter: blur(10px);
      border: 1px solid color-mix(in srgb, var(--color-text-muted) 15%, transparent);
      border-radius: var(--border-radius, 1rem);
      padding: 2.5rem;
      box-shadow: 0 10px 40px rgba(0,0,0,0.05);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .glass-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 50px rgba(0,0,0,0.1);
    }

    .card-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 2rem;
      color: var(--color-text);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    /* Contact details */
    .contact-details {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .detail-icon {
      font-size: 1.5rem;
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .detail-text, .detail-link {
      font-size: 1.1rem;
      color: var(--color-text);
      font-weight: 500;
      text-decoration: none;
      transition: color 0.2s ease;
      word-wrap: break-word;
      word-break: break-word;
      overflow-wrap: break-word;
      flex: 1;
    }

    .detail-link:hover {
      color: var(--color-primary);
    }

    .map-wrapper {
      margin-top: auto;
      border-radius: calc(var(--border-radius, 1rem) - 0.5rem);
      overflow: hidden;
    }

    /* Hours Card */
    .hours-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .status-badge {
      font-size: 0.85rem;
      font-weight: 700;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.open {
      background-color: color-mix(in srgb, #22c55e 15%, transparent);
      color: #16a34a;
    }

    .status-badge.closed {
      background-color: color-mix(in srgb, #ef4444 15%, transparent);
      color: #dc2626;
    }

    .hours-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .hours-row {
      display: flex;
      justify-content: space-between;
      padding-bottom: 1rem;
      border-bottom: 1px dashed color-mix(in srgb, var(--color-text-muted) 30%, transparent);
      font-size: 1.1rem;
    }

    .hours-row:last-child {
      border-bottom: none;
    }

    .hours-day {
      font-weight: 600;
      color: var(--color-text);
    }

    .hours-time {
      color: var(--color-text-muted);
    }
    
    @media (max-width: 768px) {
      .business-info-block {
        padding: 4rem 1rem;
      }
      .glass-card {
        padding: 1.5rem;
      }
      .section-title {
        font-size: 2rem;
      }
      .hours-row {
        flex-direction: column;
        gap: 0.25rem;
      }
      .detail-icon {
        width: 2.5rem;
        height: 2.5rem;
        font-size: 1.25rem;
      }
    }
  `]
})
export class BusinessInfoBlockComponent implements OnInit {
  @Input({ required: true }) data!: BusinessInfoBlockData;
  safeMapUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    if (this.data.mapEmbedUrl) {
      this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.mapEmbedUrl);
    }
  }

  cleanPhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }
}
