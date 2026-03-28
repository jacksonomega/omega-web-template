# Arquitectura de Bloques Dinámicos para SaaS (PYMES)

Este documento detalla la arquitectura de datos y componentes propuestos para un motor de *Server-Driven UI* en Angular, orientado específicamente a Pequeñas y Medianas Empresas (SaaS Multi-tenant).

El objetivo principal es la **máxima reutilización**. En lugar de crear docenas de componentes específicos (ej. `RestaurantMenuComponent`, `BarbershopServicesComponent`), se propone crear **"Super Bloques" Genéricos** que alteran su visualización y comportamiento en función de sus propiedades (`props`).

---

## 1. El "Super Bloque" de Listas (`ItemList`)

Este es el bloque estructural más importante. Dependiendo de la propiedad `displayStyle`, puede renderizarse como el menú de un restaurante, una lista de servicios de una clínica, o un catálogo de productos de una tienda local.

### Esquema JSON

```json
{
  "type": "block",
  "name": "ItemList",
  "props": {
    "header": {
      "title": "Nuestros Servicios",
      "subtitle": "Cortes y arreglos de barba"
    },
    "displayStyle": "list", // Opciones: "list" (clínicas/barberías), "card-grid" (tiendas), "menu" (restaurantes)
    "columns": { "mobile": 1, "desktop": 2 },
    "categories": [
      {
        "id": "cat_1",
        "name": "Cabello",
        "items": [
          {
            "id": "item_123",
            "title": "Corte Clásico",
            "description": "Corte a tijera o máquina con lavado incluido.",
            "price": "$25",
            "duration": "45 min", // Útil para clínicas/servicios
            "imageUrl": "https://ejemplo.com/corte.jpg",
            "tags": ["Popular", "Oferta"], // Insignias / Badges
            "action": {
              "type": "external-link",
              "url": "https://calendly.com/negocio/corte-25",
              "label": "Agendar"
            }
          }
        ]
      }
    ]
  }
}
```

### Modelos de TypeScript (Angular)

```typescript
export interface ActionProp {
  type: 'url' | 'whatsapp' | 'email' | 'scroll-to';
  url: string;
  label?: string;
}

export interface ListItem {
  id: string;
  title: string;
  price?: string;
  description?: string;
  imageUrl?: string;
  duration?: string;
  tags?: string[];
  action?: ActionProp;
}

export interface ListCategory {
  id: string;
  name: string;
  items: ListItem[];
}

export interface ItemListBlockProps {
  header: { title: string; subtitle?: string };
  displayStyle: 'list' | 'card-grid' | 'menu';
  columns: { mobile: number; desktop: number };
  categories: ListCategory[];
}
```

---

## 2. Bloque de Presencia Física (`LocationInfo`)

Imprescindible para negocios locales físicos. Agrupa direcciones reales, mapas interactivos (para navegación GPS) y los horarios operativos (Business Hours) en una sola estructura cohesiva.

### Esquema JSON

```json
{
  "type": "block",
  "name": "LocationInfo",
  "props": {
    "title": "Encuéntranos",
    "layout": "split", // "split" (mapa a la izquierda, texto a la derecha), "stacked" (mapa arriba)
    "address": {
      "street": "Av. Principal 123",
      "city": "Madrid",
      "googleMapsUrl": "https://maps.app.goo.gl/..." // Se usa para el botón "Cómo llegar"
    },
    "coordinates": { 
      "lat": 40.4168,
      "lng": -3.7038
    },
    "contact": {
      "phone": "+34 600 000 000",
      "email": "hola@negocio.com",
      "whatsapp": "+34 600 000 000"
    },
    "businessHours": {
      "note": "Cerrado los festivos",
      "schedule": [
        { "days": "Lun - Vie", "hours": "09:00 - 19:00" },
        { "days": "Sábado", "hours": "10:00 - 14:00" },
        { "days": "Domingo", "hours": "Cerrado" }
      ]
    }
  }
}
```

---

## 3. Bloque de Integración Dinámica (`EmbedIntegration`)

Las PYMES ya utilizan herramientas especializadas para hacer reservas o agendar citas (Calendly, Fresha, Buk, OpenTable). Este componente permite integrar Iframes de forma segura en lugar de reinventar la rueda e intentar construir un motor de reservas complejo.

### Esquema JSON

```json
{
  "type": "block",
  "name": "EmbedIntegration",
  "props": {
    "provider": "calendly", // "calendly", "fresha", "opentable", "custom-iframe"
    "embeddingType": "inline", // "inline" (flujo normal de la página), "popup" / "modal"
    "url": "https://calendly.com/tunegocio/reserva",
    "fallbackAction": {
      "buttonText": "Si no carga, abre nuestro calendario aquí",
      "url": "https://calendly.com/tunegocio/reserva"
    },
    "height": "600px",
    "theme": "dark"
  }
}
```

---

## 4. Personalizaciones Globales (Theming)

Un motor SaaS multi-tenant debe abstraer el diseño utilizando variables CSS (CSS Custom Properties). Esto permite que cada "Tenant" o PYME tenga una apariencia radicalmente distinta usando los mismos componentes subyacentes.

### Propiedades Sugeridas (`TenantTheme`)

- **Paleta de Colores (`--color-primary`, `--color-secondary`, `--color-bg`)**: Separación estricta entre colores de acento y colores de superficie.
- **Tipografías (`--font-family`)**: Permitir la carga dinámica de Google Fonts.
- **Formas de Componentes (`--border-radius`)**:
  - `0px`: Estilo "Sharp" o corporativo.
  - `8px`: Estilo "Rounded" o moderno/tecnológico.
  - `999px`: Estilo "Pill" o amigable.

## 5. Próximos Pasos para Desarrollo

1. Ampliar el `tenant.model.ts` e incluir estas nuevas interfaces dentro de la unión `BlockData`.
2. Crear un `ItemListBlockComponent` robusto, capaz de interpretar `displayStyle`.
3. Actualizar la inyección de mock data en el interceptor `tenant.interceptor.ts` o en los esquemas iniciales de la base de datos para facilitar pruebas inmediatas E2E.
