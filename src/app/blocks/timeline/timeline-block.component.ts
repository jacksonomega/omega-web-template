import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineBlockData } from '../../core/tenant/tenant.model';

@Component({
  selector: 'app-timeline-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="timeline-block">
      <div class="timeline-container">
        @if (data().sectionTitle) {
          <h2 class="section-title">{{ data().sectionTitle }}</h2>
        }
        @if (data().subtitle) {
          <p class="section-subtitle">{{ data().subtitle }}</p>
        }

        <div class="timeline-wrapper">
          <div class="timeline-line"></div>
          
          <div class="timeline-events">
            @for (event of data().events; track event.title; let i = $index) {
              <div class="timeline-item" [class.is-left]="i % 2 === 0" [class.is-right]="i % 2 !== 0">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <span class="timeline-date">{{ event.date }}</span>
                  <h3 class="timeline-item-title">{{ event.title }}</h3>
                  <p class="timeline-item-desc">{{ event.description }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .timeline-block {
      padding: 5rem 2rem;
      background-color: var(--color-bg);
      color: var(--color-text);
      overflow: hidden;
    }
    
    .timeline-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .section-title {
      font-size: clamp(2rem, 4vw, 3rem);
      text-align: center;
      margin-bottom: 0.5rem;
      font-weight: 800;
      color: var(--color-primary);
      letter-spacing: -0.02em;
    }

    .section-subtitle {
      text-align: center;
      margin-bottom: 4rem;
      color: var(--color-text-muted);
      font-size: 1.25rem;
      font-weight: 600;
    }

    /* Timeline Structure */
    .timeline-wrapper {
      position: relative;
    }

    /* The central line */
    .timeline-line {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 100%;
      background-color: var(--color-surface);
      border-radius: 4px;
    }

    .timeline-events {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    /* Individual Event */
    .timeline-item {
      position: relative;
      width: 50%;
      display: flex;
      align-items: center;
    }

    /* Left Side Items */
    .timeline-item.is-left {
      left: 0;
      justify-content: flex-end;
      padding-right: 3rem;
    }

    /* Right Side Items */
    .timeline-item.is-right {
      left: 50%;
      justify-content: flex-start;
      padding-left: 3rem;
    }

    /* Dot / Marker */
    .timeline-marker {
      position: absolute;
      top: 0;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: var(--color-bg);
      border: 4px solid var(--color-primary);
      z-index: 2;
    }

    .timeline-item.is-left .timeline-marker {
      right: -10px;
    }

    .timeline-item.is-right .timeline-marker {
      left: -10px;
    }

    /* Content Box */
    .timeline-content {
      background-color: var(--color-surface);
      padding: 2rem;
      border-radius: var(--border-radius, 12px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      width: 100%;
      position: relative;
      transition: transform 0.3s ease;
    }

    .timeline-content:hover {
      transform: translateY(-5px);
    }

    /* Small triangle pointer for content box */
    .timeline-content::before {
      content: '';
      position: absolute;
      top: 24px;
      width: 0;
      height: 0;
      border-style: solid;
    }

    .timeline-item.is-left .timeline-content::before {
      right: -12px;
      border-width: 12px 0 12px 12px;
      border-color: transparent transparent transparent var(--color-surface);
    }

    .timeline-item.is-right .timeline-content::before {
      left: -12px;
      border-width: 12px 12px 12px 0;
      border-color: transparent var(--color-surface) transparent transparent;
    }

    /* Content Typography */
    .timeline-date {
      display: inline-block;
      font-size: 0.9rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-primary);
      margin-bottom: 0.5rem;
    }

    .timeline-item-title {
      font-size: 1.4rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      color: var(--color-text);
    }

    .timeline-item-desc {
      font-size: 1.05rem;
      line-height: 1.6;
      color: var(--color-text-muted);
      margin: 0;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .timeline-line {
        left: 20px;
      }
      
      .timeline-item {
        width: 100%;
        padding-left: 50px !important;
        padding-right: 0 !important;
        left: 0 !important;
        justify-content: flex-start;
      }

      .timeline-marker {
        left: 10px !important;
        right: auto !important;
      }

      .timeline-item.is-left .timeline-content::before,
      .timeline-item.is-right .timeline-content::before {
        left: -12px;
        right: auto;
        border-width: 12px 12px 12px 0;
        border-color: transparent var(--color-surface) transparent transparent;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineBlockComponent {
  data = input.required<TimelineBlockData>();
}
