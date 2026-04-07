import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { TenantConfig, TenantTheme } from './tenant.model';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);

  constructor() {
    this.listenToEditorMessages();
  }

  // ─── PostMessage Interceptor para el Editor Web ──────────────────────────────
  private listenToEditorMessages(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('message', (event) => {
      // TODO: Añadir comprobaciones de seguridad (event.origin) cuando sepamos la URL del Editor
      
      try {
        const payload = event.data;
        
        // Asume que el editor podría enviar { type: 'LIVE_UPDATE', data: { ...el JSON... } }
        // o directamente el JSON
        if (payload && typeof payload === 'object') {
          console.log('----------------------------------------------------');
          console.log('🧩 [SaaS Engine] Mensaje (JSON) interceptado desde el Iframe Padre:');
          console.log(payload);
          console.log('----------------------------------------------------');
          
          if (payload.type === 'UPDATE_TENANT_CONFIG' && payload.payload) {
            console.log('⚡ [SaaS Engine] Aplicando actualización Live Preview...');
            this.config.set(payload.payload);
            this.applyTheme(payload.payload.theme);
            if (payload.payload.theme.faviconUrl) {
              this.applyFavicon(payload.payload.theme.faviconUrl);
            }
          }
        }
      } catch (err) {
        console.error('[SaaS Engine] Error procesando mensaje de postMessage', err);
      }
    });
  }

  // ─── State ───────────────────────────────────────────────────────────────────

  readonly config = signal<TenantConfig | null>(null);
  readonly tenantConfig = this.config;
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // ─── Derived Signals (computed) ───────────────────────────────────────────────

  readonly theme = computed(() => this.config()?.theme ?? null);
  readonly seo = computed(() => this.config()?.globalSeo ?? null);
  readonly businessName = computed(() => this.config()?.businessName ?? '');

  // ─── Slug Resolution (SSR-compatible) ────────────────────────────────────────

  /**
   * Resolves the tenant slug from the hostname.
   * Uses the injected DOCUMENT token so it works both in browser and SSR.
   * Examples:
   *   cliente1.misaas.com  → 'cliente1'
   *   localhost            → 'demo'  (fallback for local development)
   */
  resolveSlug(): string {
    const hostname = this.document.location.hostname;

    // Local dev — always return the demo tenant
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'demo';
    }

    // Extract first subdomain segment: 'cliente1' from 'cliente1.misaas.com'
    const parts = hostname.split('.');
    return parts.length >= 3 ? parts[0] : 'demo';
  }

  // ─── Config Loader ────────────────────────────────────────────────────────────

  loadTenantConfig(): Observable<TenantConfig> {
    const slug = this.resolveSlug();
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.get<TenantConfig>(`/api/tenant/${slug}`).pipe(
      tap((config) => {
        this.config.set(config);
        this.applyTheme(config.theme);
        this.applyFavicon(config.theme.faviconUrl);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        this.error.set(`Failed to load tenant config for slug "${slug}"`);
        this.isLoading.set(false);
        return throwError(() => err);
      })
    );
  }

  // ─── CSS Custom Properties Injection ─────────────────────────────────────────

  /**
   * Injects tenant theme as CSS Custom Properties on :root.
   * This ensures all components can access theme variables via var(--color-primary) etc.
   * NO stylesheet files are modified — all overrides live in the DOM.
   */
  private applyTheme(theme: TenantTheme): void {
    const root = this.document.documentElement;

    const variables: Record<string, string> = {
      '--color-primary': theme.primaryColor,
      '--color-secondary': theme.secondaryColor,
      '--color-accent': theme.accentColor,
      '--color-bg': theme.bgColor,
      '--color-surface': theme.surfaceColor,
      '--color-text': theme.textColor,
      '--color-text-muted': theme.textMutedColor,
      '--font-family': theme.fontFamily,
      '--border-radius': theme.borderRadius,
    };

    Object.entries(variables).forEach(([prop, value]) => {
      root.style.setProperty(prop, value);
    });

    // Inject Google Fonts link if provided
    if (theme.fontFamilyUrl) {
      this.injectGoogleFont(theme.fontFamilyUrl);
    }
  }

  private injectGoogleFont(url: string): void {
    const existing = this.document.getElementById('tenant-font');
    if (existing) existing.remove();

    const link = this.document.createElement('link');
    link.id = 'tenant-font';
    link.rel = 'stylesheet';
    link.href = url;
    this.document.head.appendChild(link);
  }

  private applyFavicon(faviconUrl: string): void {
    if (!faviconUrl) return;
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'icon';
      this.document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }
}
