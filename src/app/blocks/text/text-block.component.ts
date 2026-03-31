import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextBlockData } from '../../core/tenant/tenant.model';

@Component({
  selector: 'app-text-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="text-block" [class]="'align-' + (data().alignment || 'left')">
      <div class="text-container">
        @if (data().sectionTitle) {
          <h2 class="section-title">{{ data().sectionTitle }}</h2>
        }
        @if (data().subtitle) {
          <p class="section-subtitle">{{ data().subtitle }}</p>
        }
        <div class="content">
          @for (paragraph of data().paragraphs; track paragraph) {
            <p>{{ paragraph }}</p>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .text-block {
      padding: 5rem 2rem;
      background-color: var(--color-bg);
      color: var(--color-text);
    }
    
    .text-container {
      max-width: 800px;
      margin: 0 auto;
    }
    
    /* Alignments */
    .align-center { text-align: center; }
    .align-right { text-align: right; }
    .align-left { text-align: left; }
    
    /* Typography */
    .section-title {
      font-size: clamp(2rem, 4vw, 3rem);
      margin-bottom: 0.5rem;
      color: var(--color-primary);
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    
    .section-subtitle {
      font-size: 1.25rem;
      color: var(--color-secondary);
      margin-bottom: 2.5rem;
      font-weight: 600;
    }
    
    .content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .content p {
      font-size: 1.15rem;
      line-height: 1.8;
      color: var(--color-text-muted);
      margin: 0;
    }

    @media (max-width: 768px) {
      .text-block {
        padding: 4rem 1.5rem;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextBlockComponent {
  data = input.required<TextBlockData>();
}
