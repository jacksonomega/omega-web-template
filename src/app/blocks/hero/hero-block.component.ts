import { Component, Input } from '@angular/core';
import { HeroBlockData } from '../../core/tenant/tenant.model';

@Component({
  selector: 'app-hero-block',
  standalone: true,
  template: `
    <section class="hero" 
      [attr.data-layout]="data.layout || 'split'"
      [class.hero--gradient]="data.backgroundType === 'gradient'"
      [class.hero--video]="data.backgroundType === 'video'">
      
      @if (data.backgroundType === 'video' && data.backgroundVideoUrl) {
        <video class="hero__video-bg" [src]="data.backgroundVideoUrl" autoplay loop muted playsinline></video>
      }
      
      @if (data.backgroundType === 'image' && data.layout === 'full-bg' && data.imageUrl) {
         <img class="hero__full-image-bg" [src]="data.imageUrl" [alt]="data.headline" loading="eager">
      }

      <div class="hero__backdrop" [class.hero__backdrop--overlay]="data.layout === 'full-bg'"></div>
      
      <div class="hero__container">
        <div class="hero__content">
          @if (data.badge) {
            <span class="hero__badge">{{ data.badge }}</span>
          }
          <h1 class="hero__headline">{{ data.headline }}</h1>
          <p class="hero__subheadline" [class.hero__subheadline--light]="data.layout === 'full-bg'">{{ data.subheadline }}</p>
          
          <div class="hero__actions">
            <!-- Legacy fallback for old JSONs -->
            @if (data.ctaText && data.ctaUrl && !data.actions?.length) {
              <a class="hero__cta hero__cta--primary" [href]="data.ctaUrl">
                {{ data.ctaText }}
                <span class="hero__cta-arrow">→</span>
              </a>
            }
            
            <!-- Dynamic Actions Array -->
            @for (action of data.actions || []; track action.label) {
              <a class="hero__cta" 
                 [class.hero__cta--whatsapp]="action.type === 'whatsapp'"
                 [class.hero__cta--secondary]="$index > 0 && action.type !== 'whatsapp'"
                 [class.hero__cta--primary]="$index === 0 && action.type !== 'whatsapp'"
                 [href]="action.url"
                 [attr.target]="action.type === 'url' ? '_blank' : null">
                
                @if (action.type === 'whatsapp') {
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                }
                {{ action.label || 'Continuar' }}
              </a>
            }
          </div>
        </div>
        
        @if (data.layout !== 'centered' && data.layout !== 'full-bg' && data.imageUrl) {
          <div class="hero__visual">
            <div class="hero__image-wrapper">
              <img
                [src]="data.imageUrl"
                [alt]="data.headline"
                class="hero__image"
                loading="eager"
              />
              <div class="hero__image-glow"></div>
            </div>
          </div>
        }
      </div>
      <div class="hero__scroll-indicator" aria-hidden="true" [class.hero__scroll-indicator--light]="data.layout === 'full-bg'">
        <span class="hero__scroll-dot"></span>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      min-height: 100dvh;
      display: flex;
      align-items: center;
      background: var(--color-bg);
      overflow: hidden;
      color: var(--color-text);
    }

    /* Video & Image Backgrounds */
    .hero__video-bg, .hero__full-image-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
    }

    .hero__backdrop {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 80% 60% at 70% 50%, color-mix(in srgb, var(--color-primary) 18%, transparent) 0%, transparent 70%),
        radial-gradient(ellipse 50% 40% at 20% 80%, color-mix(in srgb, var(--color-accent) 10%, transparent) 0%, transparent 60%);
      pointer-events: none;
      z-index: 1;
    }
    
    .hero__backdrop--overlay {
      background: linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4));
    }
    
    [data-layout="centered"] .hero__backdrop--overlay {
      background: rgba(0,0,0,0.6);
    }

    .hero__container {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      margin: 0 auto;
      padding: 6rem 2rem 4rem;
      display: grid;
      gap: 4rem;
      align-items: center;
      width: 100%;
    }

    /* Layout Variants */
    .hero[data-layout="split"] .hero__container {
      grid-template-columns: 1fr 1fr;
    }
    
    .hero[data-layout="centered"] .hero__container {
      grid-template-columns: 1fr;
      text-align: center;
      max-width: 800px;
    }
    
    .hero[data-layout="full-bg"] .hero__container {
      grid-template-columns: 1fr;
      text-align: left;
      color: #fff;
    }
    
    .hero[data-layout="full-bg"][data-align="center"] .hero__container {
      text-align: center;
      align-items: center;
      justify-content: center;
    }

    .hero__content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .hero[data-layout="centered"] .hero__content,
    .hero[data-layout="full-bg"][data-align="center"] .hero__content {
      align-items: center;
    }

    /* Typography */
    .hero__badge {
      display: inline-block;
      padding: 0.35rem 1rem;
      background: color-mix(in srgb, var(--color-accent) 20%, transparent);
      color: var(--color-accent);
      border: 1px solid color-mix(in srgb, var(--color-accent) 40%, transparent);
      border-radius: 999px;
      font-weight: 700;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      width: fit-content;
      margin-bottom: 0.5rem;
    }

    .hero__headline {
      font-size: clamp(2.4rem, 5vw, 4rem);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.03em;
      color: inherit;
    }
    
    .hero[data-layout="split"] .hero__headline::first-line,
    .hero[data-layout="centered"] .hero__headline::first-line {
      color: var(--color-accent);
    }
    
    .hero[data-layout="full-bg"] .hero__headline {
      color: #fff;
    }

    .hero__subheadline {
      font-size: clamp(1rem, 2vw, 1.25rem);
      line-height: 1.6;
      color: var(--color-text-muted);
      max-width: 480px;
    }
    
    .hero[data-layout="centered"] .hero__subheadline {
      max-width: 600px;
      margin: 0 auto;
    }
    
    .hero__subheadline--light {
      color: rgba(255, 255, 255, 0.85);
      font-weight: 400;
    }

    /* Actions */
    .hero__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .hero[data-layout="centered"] .hero__actions {
      justify-content: center;
    }

    .hero__cta {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      border-radius: var(--border-radius);
      font-weight: 700;
      font-size: 1rem;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .hero__cta--primary {
      background: var(--color-primary);
      color: #fff;
      box-shadow: 0 4px 24px color-mix(in srgb, var(--color-primary) 40%, transparent);
    }
    .hero__cta--primary:hover {
      transform: translateY(-2px);
      background: var(--color-secondary);
      box-shadow: 0 8px 32px color-mix(in srgb, var(--color-primary) 50%, transparent);
    }

    .hero__cta--secondary {
      background: transparent;
      color: var(--color-text);
      border: 1.5px solid color-mix(in srgb, var(--color-text) 20%, transparent);
    }
    
    .hero[data-layout="full-bg"] .hero__cta--secondary {
      color: #fff;
      border-color: rgba(255, 255, 255, 0.5);
    }
    
    .hero__cta--secondary:hover {
      background: color-mix(in srgb, var(--color-text) 5%, transparent);
      border-color: var(--color-text);
    }
    
    .hero[data-layout="full-bg"] .hero__cta--secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: #fff;
    }

    .hero__cta--whatsapp {
      background: #25D366;
      color: #fff;
      border: none;
      box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
    }
    .hero__cta--whatsapp:hover {
      background: #128C7E;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
    }

    .hero__cta-arrow {
      transition: transform 0.2s ease;
    }
    .hero__cta:hover .hero__cta-arrow {
      transform: translateX(4px);
    }

    /* Visual Content (Split Layout) */
    .hero__visual {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .hero__image-wrapper {
      position: relative;
      border-radius: calc(var(--border-radius) * 2);
      overflow: hidden;
    }

    .hero__image {
      width: 100%;
      max-width: 500px;
      height: auto;
      display: block;
      border-radius: calc(var(--border-radius) * 2);
      border: 1px solid color-mix(in srgb, var(--color-primary) 30%, transparent);
      transition: transform 0.4s ease;
    }

    .hero__image:hover {
      transform: scale(1.02);
    }

    .hero__image-glow {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at center, color-mix(in srgb, var(--color-accent) 15%, transparent), transparent 70%);
      pointer-events: none;
    }

    /* Scroll Indicator */
    .hero__scroll-indicator {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 2;
    }

    .hero__scroll-dot {
      width: 6px;
      height: 6px;
      background: var(--color-accent);
      border-radius: 50%;
      animation: bounce 1.6s ease infinite;
    }
    
    .hero__scroll-indicator--light .hero__scroll-dot {
      background: #fff;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); opacity: 1; }
      50% { transform: translateY(10px); opacity: 0.4; }
    }

    @media (max-width: 768px) {
      .hero[data-layout="split"] .hero__container {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 2.5rem;
        padding: 5rem 1.5rem 3rem;
      }
      .hero[data-layout="split"] .hero__subheadline { max-width: 100%; }
      .hero[data-layout="split"] .hero__actions { justify-content: center; }
      .hero[data-layout="split"] .hero__visual { order: -1; }
    }
  `],
})
export class HeroBlockComponent {
  @Input({ required: true }) data!: HeroBlockData;
}
