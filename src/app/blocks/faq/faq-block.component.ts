import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqBlockData } from '../../core/tenant/tenant.model';

@Component({
  selector: 'app-faq-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="faq-block" [class.layout-grid]="data().layout === 'grid'">
      <div class="faq-container">
        @if (data().sectionTitle) {
          <h2 class="section-title">{{ data().sectionTitle }}</h2>
        }
        @if (data().subtitle) {
          <p class="section-subtitle">{{ data().subtitle }}</p>
        }

        <div class="faq-items">
          @for (faq of data().faqs; track faq.question; let i = $index) {
            <div class="faq-item" [class.open]="openIndex() === i">
              <button class="faq-question" (click)="toggleAccordion(i)" [attr.aria-expanded]="openIndex() === i">
                <span>{{ faq.question }}</span>
                <span class="faq-icon" aria-hidden="true">
                  @if (openIndex() === i) {
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  }
                </span>
              </button>
              
              <div class="faq-answer-wrapper" [style.max-height]="openIndex() === i ? '500px' : '0'">
                <div class="faq-answer">
                  <p>{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .faq-block {
      padding: 4rem 2rem;
      background-color: var(--color-bg);
      color: var(--color-text);
    }
    
    .faq-container {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .layout-grid .faq-container {
      max-width: 1200px;
    }

    .layout-grid .faq-items {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .section-title {
      font-size: 2.5rem;
      text-align: center;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: var(--color-primary);
    }

    .section-subtitle {
      text-align: center;
      margin-bottom: 3rem;
      color: var(--color-text-muted);
      font-size: 1.1rem;
    }

    .faq-item {
      margin-bottom: 1rem;
      border: 1px solid var(--color-surface);
      border-radius: var(--border-radius, 8px);
      overflow: hidden;
      background-color: var(--color-surface);
      transition: all 0.3s ease;
    }

    .faq-question {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      background: transparent;
      border: none;
      color: var(--color-text);
      font-size: 1.2rem;
      font-weight: 600;
      cursor: pointer;
      text-align: left;
      font-family: inherit;
    }

    .faq-question:hover {
      color: var(--color-primary);
    }

    .faq-icon {
      flex-shrink: 0;
      margin-left: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
      color: var(--color-primary);
    }

    .faq-answer-wrapper {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.4s ease-in-out;
    }

    .faq-answer {
      padding: 0 1.5rem 1.5rem;
      color: var(--color-text-muted);
      line-height: 1.6;
    }

    .layout-grid .faq-item {
      border: 1px solid var(--color-surface);
    }
    
    .layout-grid .faq-answer-wrapper {
        max-height: none !important;
    }
    
    .layout-grid .faq-icon {
        display: none;
    }
    
    .layout-grid .faq-question {
        cursor: default;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqBlockComponent {
  data = input.required<FaqBlockData>();
  openIndex = signal<number | null>(null);

  toggleAccordion(index: number) {
    if (this.data().layout === 'grid') return;
    this.openIndex.update((curr) => (curr === index ? null : index));
  }
}
