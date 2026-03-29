import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TenantConfig } from './tenant.model';

// ─── Mock Tenant Data ─────────────────────────────────────────────────────────

const MOCK_TENANTS: Record<string, TenantConfig> = {
  demo: {
    tenantId: 'tenant-001',
    slug: 'demo',
    businessName: 'GreenLeaf Studio',
    theme: {
      primaryColor: '#16a34a',
      secondaryColor: '#15803d',
      accentColor: '#4ade80',
      bgColor: '#0a0f0d',
      surfaceColor: '#111b15',
      textColor: '#f0fdf4',
      textMutedColor: '#86efac',
      fontFamily: "'Inter', sans-serif",
      fontFamilyUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap',
      borderRadius: '12px',
      logoUrl: 'https://placehold.co/160x48/16a34a/ffffff?text=GreenLeaf',
      faviconUrl: '',
    },
    seo: {
      title: 'GreenLeaf Studio — Diseño Sostenible',
      description: 'Agencia de diseño sostenible para marcas con propósito.',
      ogImage: 'https://placehold.co/1200x630/16a34a/ffffff?text=GreenLeaf+Studio',
      keywords: ['diseño', 'sostenible', 'branding', 'green'],
    },
    blocks: [
      {
        id: 'block-hero-1',
        type: 'hero',
        order: 1,
        visible: true,
        data: {
          headline: 'Diseño que respeta el planeta',
          subheadline: 'Creamos identidades visuales sostenibles para marcas con propósito. Tu imagen, nuestra pasión.',
          layout: 'full-bg',
          badge: 'Agencia Certificada Verde',
          actions: [
            { type: 'url', url: '#contact', label: 'Comenzar ahora' },
            { type: 'whatsapp', url: 'https://wa.me/34600000000', label: 'Hablar con un experto' }
          ],
          imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
          backgroundType: 'image',
        },
      },
      {
        id: 'block-features-1',
        type: 'features',
        order: 2,
        visible: true,
        data: {
          sectionTitle: '¿Por qué elegirnos?',
          features: [
            { icon: '🌱', title: 'Diseño Eco-Friendly', description: 'Procesos digitales que minimizan el impacto ambiental.' },
            { icon: '🎨', title: 'Identidad Única', description: 'Cada marca es irrepetible. Tu logo, tipografía y paleta son exclusivos.' },
            { icon: '⚡', title: 'Entrega Rápida', description: 'Primeras propuestas en 48 horas. Tu tiempo es valioso.' },
            { icon: '🤝', title: 'Soporte Continuo', description: 'Te acompañamos mucho más allá del lanzamiento.' },
          ],
        },
      },
      {
        id: 'block-promo-1',
        type: 'promo-timer',
        order: 2.2,
        visible: true,
        data: {
          title: 'Oferta Especial Eco-Brand',
          description: 'Obtén un 20% de descuento en tu manual de identidad si reservas en los próximos días.',
          endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          action: { type: 'whatsapp', url: 'https://wa.me/34600000000', label: 'Reclamar Oferta' }
        }
      },
      {
        id: 'block-item-list-1',
        type: 'item-list',
        order: 2.5,
        visible: true,
        data: {
          header: {
            title: 'Nuestros Servicios de Diseño',
            subtitle: 'Soluciones creativas adaptadas a tus necesidades sostenibles.'
          },
          displayStyle: 'list',
          columns: { mobile: 1, desktop: 2 },
          categories: [
            {
              id: 'cat_branding',
              name: 'Branding y Estrategia',
              items: [
                {
                  id: 'item_logo',
                  title: 'Auditoría de Marca',
                  description: 'Analizamos profundamente tu identidad actual y te entregamos un reporte de oportunidades.',
                  price: 'Desde 150€',
                  duration: '1 semana',
                  tags: ['Recomendado'],
                  action: { type: 'whatsapp', url: 'https://wa.me/error', label: 'Consultar' }
                },
                {
                  id: 'item_strategy',
                  title: 'Estrategia de Posicionamiento',
                  description: 'Definimos tono de voz y pilares de contenido para que conectes con tu audiencia real.',
                  duration: '3 semanas',
                  action: { type: 'url', url: '#contact', label: 'Más info' }
                }
              ]
            },
            {
              id: 'cat_digital',
              name: 'Desarrollo Digital',
              items: [
                {
                  id: 'item_web',
                  title: 'Landing Page Verde',
                  description: 'Una web ultra rápida y alojada en servidores con energía 100% verde.',
                  price: '599€',
                  tags: ['Eco-Hosting'],
                  action: { type: 'url', url: '#contact', label: 'Solicitar presupuesto' }
                }
              ]
            }
          ]
        }
      },
      {
        id: 'block-video-1',
        type: 'video-embed',
        order: 2.8,
        visible: true,
        data: {
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&rel=0',
          platform: 'youtube',
          caption: 'Nuestro manifiesto de marca sostenible.'
        }
      },
      {
        id: 'block-pricing-1',
        type: 'pricing',
        order: 3,
        visible: true,
        data: {
          sectionTitle: 'Planes transparentes',
          plans: [
            {
              name: 'Starter',
              price: 299,
              currency: 'EUR',
              period: 'monthly',
              features: ['Logo profesional', '3 variantes de color', 'Archivos editables', 'Soporte por email'],
              highlighted: false,
              ctaText: 'Empezar',
            },
            {
              name: 'Profesional',
              price: 599,
              currency: 'EUR',
              period: 'monthly',
              features: ['Todo en Starter', 'Manual de marca', 'Landing page', 'Redes sociales kit', 'Soporte prioritario'],
              highlighted: true,
              ctaText: 'El más popular',
            },
            {
              name: 'Enterprise',
              price: 1200,
              currency: 'EUR',
              period: 'monthly',
              features: ['Todo en Profesional', 'Estrategia de marca', 'Campañas digitales', 'Account manager dedicado'],
              highlighted: false,
              ctaText: 'Contactar',
            },
          ],
        },
      },
      {
        id: 'block-testimonials-1',
        type: 'testimonials',
        order: 4,
        visible: true,
        data: {
          sectionTitle: 'Lo que dicen nuestros clientes',
          testimonials: [
            {
              name: 'Laura Martínez',
              role: 'CEO, EcoFashion Madrid',
              avatarUrl: 'https://placehold.co/80x80/16a34a/ffffff?text=LM',
              quote: 'GreenLeaf transformó nuestra identidad visual completamente. El resultado superó todas nuestras expectativas.',
              rating: 5,
            },
            {
              name: 'Carlos Ruiz',
              role: 'Fundador, BioMarket',
              avatarUrl: 'https://placehold.co/80x80/15803d/ffffff?text=CR',
              quote: 'Rápidos, profesionales y con una sensibilidad para el diseño sostenible que no encontramos en ningún otro sitio.',
              rating: 5,
            },
            {
              name: 'Ana González',
              role: 'Directora de Marketing, NatureCo',
              avatarUrl: 'https://placehold.co/80x80/4ade80/0a0f0d?text=AG',
              quote: 'El manual de marca que nos entregaron es una obra de arte. Todos en el equipo lo adoramos.',
              rating: 4,
            },
          ],
        },
      },
      {
        id: 'block-contact-1',
        type: 'contact',
        order: 5,
        visible: true,
        data: {
          sectionTitle: 'Hablemos de tu proyecto',
          email: 'hola@greenleaf.studio',
          phone: '+34 612 345 678',
          address: 'Calle del Diseño 42, Madrid, España',
          showMap: false,
        },
      },
      {
        id: 'block-footer-1',
        type: 'footer',
        order: 6,
        visible: true,
        data: {
          copyrightText: '© 2024 GreenLeaf Studio. Todos los derechos reservados.',
          links: [
            { label: 'Privacidad', url: '/privacidad' },
            { label: 'Términos', url: '/terminos' },
            { label: 'Cookies', url: '/cookies' },
          ],
          socialLinks: [
            { platform: 'Instagram', url: 'https://instagram.com', icon: '📸' },
            { platform: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
            { platform: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
          ],
        },
      },
    ],
  },

  // ─── Second demo tenant (purple/gold theme) ──────────────────────────────────
  premium: {
    tenantId: 'tenant-002',
    slug: 'premium',
    businessName: 'Nova Digital Agency',
    theme: {
      primaryColor: '#7c3aed',
      secondaryColor: '#6d28d9',
      accentColor: '#fbbf24',
      bgColor: '#09090f',
      surfaceColor: '#13131e',
      textColor: '#f5f3ff',
      textMutedColor: '#c4b5fd',
      fontFamily: "'Outfit', sans-serif",
      fontFamilyUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap',
      borderRadius: '8px',
      logoUrl: 'https://placehold.co/160x48/7c3aed/ffffff?text=Nova',
      faviconUrl: '',
    },
    seo: {
      title: 'Nova Digital Agency — Presencia Digital Premium',
      description: 'Agencia digital de alto nivel para marcas que quieren destacar.',
      ogImage: 'https://placehold.co/1200x630/7c3aed/ffffff?text=Nova+Digital',
      keywords: ['agencia', 'digital', 'premium', 'marketing'],
    },
    blocks: [
      {
        id: 'block-hero-2',
        type: 'hero',
        order: 1,
        visible: true,
        data: {
          headline: 'Tu marca, redefinida',
          subheadline: 'Estrategias digitales de alto impacto que convierten visitantes en clientes fieles.',
          ctaText: 'Ver portafolio',
          ctaUrl: '#features',
          imageUrl: 'https://placehold.co/800x600/7c3aed/ffffff?text=Nova+Hero',
          backgroundType: 'gradient',
        },
      },
      {
        id: 'block-features-2',
        type: 'features',
        order: 2,
        visible: true,
        data: {
          sectionTitle: 'Servicios premium',
          features: [
            { icon: '🚀', title: 'Growth Marketing', description: 'Estrategias de crecimiento basadas en datos reales.' },
            { icon: '🎯', title: 'Performance Ads', description: 'Campañas optimizadas con IA para máximo retorno.' },
            { icon: '💎', title: 'Branding Premium', description: 'Identidades visuales que comunican excelencia.' },
            { icon: '📊', title: 'Analytics Avanzado', description: 'Decisiones basadas en métricas, no en suposiciones.' },
          ],
        },
      },
      {
        id: 'block-footer-2',
        type: 'footer',
        order: 3,
        visible: true,
        data: {
          copyrightText: '© 2024 Nova Digital Agency. All rights reserved.',
          links: [{ label: 'Privacy', url: '/privacy' }, { label: 'Terms', url: '/terms' }],
          socialLinks: [
            { platform: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
            { platform: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
          ],
        },
      },
    ],
  },
};

// ─── Interceptor Function ─────────────────────────────────────────────────────

/**
 * Mock HTTP interceptor for local development.
 * Intercepts GET /api/tenant/:slug and returns static data.
 * Remove (or guard with isPlatformBrowser) before production.
 */
export const tenantMockInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method === 'GET' && req.url.includes('/api/tenant/')) {
    const slug = req.url.split('/api/tenant/')[1].split('?')[0]; // Extracts slug correctly even with absolute URLs
    const config = MOCK_TENANTS[slug] ?? MOCK_TENANTS['demo'];
    
    // Return a proper HttpResponse object so HttpClient processes it correctly
    return of(new HttpResponse({ status: 200, body: config })).pipe(delay(200));
  }
  return next(req);
};
