import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TenantService } from '../../core/tenant/tenant.service';

@Component({
  selector: 'app-dynamic-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    @if (tenantConfig(); as config) {
      <nav class="navbar">
        <div class="navbar-container">
          <a routerLink="/" class="navbar-brand">
            @if (config.theme.logoUrl) {
              <img [src]="config.theme.logoUrl" [alt]="config.businessName + ' logo'" class="navbar-logo" />
            } @else {
              <span class="navbar-business-name">{{ config.businessName }}</span>
            }
          </a>
          
          <ul class="navbar-links">
            @for (page of config.pages; track page.id) {
              <li>
                <a [routerLink]="page.path" 
                   routerLinkActive="active" 
                   [routerLinkActiveOptions]="{exact: page.path === '/'}"
                   class="nav-link">
                  {{ page.name }}
                </a>
              </li>
            }
          </ul>
        </div>
      </nav>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    }
  `,
  styles: [`
    .navbar {
      background-color: var(--color-bg);
      border-bottom: 1px solid var(--color-surface);
      position: sticky;
      top: 0;
      z-index: 1000;
      padding: 1rem 2rem;
    }

    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .navbar-brand {
      text-decoration: none;
      color: var(--color-text);
    }

    .navbar-logo {
      height: 48px;
      width: auto;
      object-fit: contain;
    }

    .navbar-business-name {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--color-primary);
    }

    .navbar-links {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      gap: 2rem;
    }

    .nav-link {
      text-decoration: none;
      color: var(--color-text);
      font-weight: 600;
      font-size: 1.1rem;
      transition: color 0.2s ease;
    }

    .nav-link:hover, .nav-link.active {
      color: var(--color-primary);
    }

    @media (max-width: 768px) {
      .navbar-container {
        flex-direction: column;
        gap: 1rem;
      }
      .navbar-links {
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  `]
})
export class DynamicLayoutComponent {
  private tenantService = inject(TenantService);
  tenantConfig = this.tenantService.tenantConfig;
}