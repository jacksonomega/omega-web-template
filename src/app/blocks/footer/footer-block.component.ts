import { Component, Input } from '@angular/core';
import { FooterBlockData } from '../../core/tenant/tenant.model';

@Component({
  selector: 'app-footer-block',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="footer__container">
        <div class="footer__top">
          <div class="footer__links">
            @for (link of data.links; track link.label) {
              <a class="footer__link" [href]="link.url">{{ link.label }}</a>
            }
          </div>
          <div class="footer__social">
            @for (social of data.socialLinks; track social.platform) {
              <a
                class="footer__social-link"
                [href]="social.url"
                [attr.aria-label]="social.platform"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span aria-hidden="true">{{ social.icon }}</span>
              </a>
            }
          </div>
        </div>
        <div class="footer__divider" aria-hidden="true"></div>
        <p class="footer__copyright">{{ data.copyrightText }}</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--color-surface);
      padding: 3rem 2rem;
      border-top: 1px solid color-mix(in srgb, var(--color-primary) 15%, transparent);
    }

    .footer__container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .footer__top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .footer__links {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .footer__link {
      font-size: 0.9rem;
      color: var(--color-text-muted);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .footer__link:hover {
      color: var(--color-accent);
    }

    .footer__social {
      display: flex;
      gap: 0.75rem;
    }

    .footer__social-link {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
      border-radius: 50%;
      font-size: 1.1rem;
      text-decoration: none;
      transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
    }

    .footer__social-link:hover {
      background: color-mix(in srgb, var(--color-primary) 25%, transparent);
      border-color: var(--color-primary);
      transform: translateY(-2px);
    }

    .footer__divider {
      height: 1px;
      background: color-mix(in srgb, var(--color-primary) 12%, transparent);
    }

    .footer__copyright {
      font-size: 0.85rem;
      color: color-mix(in srgb, var(--color-text-muted) 70%, transparent);
      text-align: center;
      margin: 0;
    }

    @media (max-width: 640px) {
      .footer { padding: 2.5rem 1.5rem; }
      .footer__top { flex-direction: column; align-items: flex-start; }
    }
  `],
})
export class FooterBlockComponent {
  @Input({ required: true }) data!: FooterBlockData;
}
