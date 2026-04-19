# 🧠 Guía Maestra: Generación de Sitios Web SMB (SaaS Engine)

Este documento es el cerebro que debes entregar a cualquier Agente de IA para que genere configuraciones JSON perfectas. Define no solo la estructura técnica, sino la **filosofía de diseño** del motor.

---

## 🛑 PARTE 1: EL PROMPT DE PODER (Copiar íntegro)

> "Actúa como un **Senior Product Designer & Frontend Architect**. Tu misión es configurar el JSON de un sitio web para una PYME usando nuestro 'Server-Driven UI Engine'.
> 
> **Tu proceso de pensamiento:**
> 1.  **Análisis de Marca:** ¿Qué colores transmiten la esencia del negocio? (Ej: Salud = Azules/Blancos, Barbería = Negro/Dorado/Rojo, Eco = Verdes).
> 2.  **Arquitectura de Información:** ¿Qué es lo más importante? Si es un restaurante, el Menú. Si es un abogado, la confianza (Testimonios) y el contacto.
> 3.  **Composición de Bloques:** No te limites a 4 bloques. Crea una experiencia completa (Hero -> Features -> ItemList -> Testimonials -> Contact -> Footer).
> 
> **Instrucciones Técnicas:**
> -   Usa el 'Libro de Recetas' adjunto para inspirarte en cómo usar los componentes.
> -   **ESTRICTO:** El campo `type` de los bloques debe ser **kebab-case** (ej: `item-list`, no `ItemList`).
> -   **ESTRICTO:** El JSON de salida debe estar envuelto en `{ "type": "UPDATE_TENANT_CONFIG", "payload": { ... } }`.
> -   **COPYWRITING:** Escribe textos reales, vendedores y humanos. Nada de 'Lorem Ipsum'.
> -   **CONTACTO:** Siempre incluye un bloque `location` si el negocio es físico (restaurante, barbería, clínica)."

---

## 📖 PARTE 2: LIBRO DE RECETAS (Casos de Uso)

El motor es como un LEGO. Un mismo bloque puede ser muchas cosas dependiendo de cómo configures su `data`.

### 📍 Receta A: El "Link-in-Bio" (Estilo Linktree)
*   **Secreto:** Usa un solo bloque `item-list` con `displayStyle: "list"` y llénalo de acciones directas.
*   **JSON de Bloque:**
```json
{
  "type": "item-list",
  "data": {
    "header": { "title": "Mis Enlaces", "subtitle": "Encuéntrame en todas partes" },
    "displayStyle": "list",
    "categories": [{
      "name": "Social",
      "items": [
        { "title": "Mi Canal de YouTube", "action": { "type": "url", "url": "...", "label": "Suscribirse" } },
        { "title": "Agendar Consultoría", "action": { "type": "url", "url": "...", "label": "Reservar" } }
      ]
    }]
  }
}
```

### 📍 Receta B: Menú de Restaurante Pro
*   **Secreto:** Usa `displayStyle: "menu"`. El motor añadirá automáticamente puntos suspensivos entre el nombre y el precio.
*   **Configuración:** Agrupa por categorías (Entrantes, Platos, Postres).
*   **Visual:** `surfaceColor` debe ser un tono muy suave del `bgColor`.

### 📍 Receta C: Catálogo de Productos (Mini-Ecom)
*   **Secreto:** Usa `displayStyle: "card-grid"`. Es **obligatorio** poner `imageUrl`.
*   **Acción:** Configura el botón como `type: "whatsapp"` para que el pedido llegue directo al móvil del dueño.

### 📍 Receta D: Portada de Alta Conversión (Promo + Redes)
*   **Secreto:** Usa un fondo a pantalla completa `layout: "full-bg"` y añade DOS botones en la portada, uno de ellos de WhatsApp.
*   **JSON Parcial:**
```json
{
  "type": "hero",
  "data": {
    "headline": "Tu Nueva Imagen Te Espera",
    "layout": "full-bg",
    "backgroundType": "image",
    "imageUrl": "https://...",
    "badge": "OFERTA DE PRIMAVERA",
    "actions": [
      { "type": "url", "url": "#booking", "label": "Reservar Cita" },
      { "type": "whatsapp", "url": "https://wa.me/34XXXX", "label": "Hablar con Recepción" }
    ]
  }
}
```

### 📍 Receta E: Mostrar Instalaciones o Trabajos (Galería)
*   **Secreto:** Usa `type: "gallery"`. Si hay pocas fotos usa `layout: "grid"`, si hay muchas usa `layout: "carousel"`.
*   **JSON de Bloque:**
```json
{
  "type": "gallery",
  "data": {
    "sectionTitle": "Nuestras Instalaciones",
    "layout": "carousel",
    "images": [
      { "url": "https://...", "caption": "Sala principal" },
      { "url": "https://...", "caption": "Área de relax" }
    ]
  }
}
```

### 📍 Receta F: Generar Confianza (Testimonios + Mapa)
*   **Secreto:** Termina siempre la página con un bloque `testimonials` seguido de un bloque `location`.
*   **JSON de Ubicación:**
```json
{
  "type": "location",
  "data": {
    "sectionTitle": "Visítanos",
    "address": "Calle Mayor 1, Madrid",
    "description": "Estamos en pleno centro, frente a la Puerta del Sol."
  }
}
```

---

## 🛠️ PARTE 3: DICCIONARIO TÉCNICO COMPLETO

### 1. Sistema de Temas (Theme)
| Variable | Propósito | Ejemplo |
| :--- | :--- | :--- |
| `primaryColor` | Botones y acentos principales | `#2563eb` |
| `surfaceColor` | Fondo de las tarjetas e inputs | `#f8fafc` |
| `borderRadius` | Curvatura de toda la interfaz | `0px` (Rudo), `12px` (Moderno), `30px` (Playful) |

### 2. Catálogo de Bloques Soportados (`type`)

#### `hero` (La Portada Avanzada)
- `headline`: Título gigante.
- `subheadline`: Descripción de apoyo.
- `badge`: (Opcional) Pequeña banda superior (ej: "NUEVO").
- `layout`: `"split"`, `"centered"` o `"full-bg"`.
- `backgroundType`: `"image"`, `"gradient"`, o `"video"`.
- `backgroundVideoUrl`: Si el tipo es video (debe ser archivo .mp4 directo).
- `actions`: Array de botones `[{ type, url, label }]`. Admite type `"whatsapp"`.

#### `promo-timer` (Reloj de Cuenta Atrás)
- Úsalo para crear urgencia antes de un lanzamiento o evento.
- `title`, `description`.
- `endDate`: Fecha ISO futura (ej: `"2026-12-31T23:59:59Z"`).
- `action`: Botón para aprovechar la oferta `{ type, url, label }`.

#### `video-embed` (Incrustador de Redes Sociales)
- Para incrustar un vídeo de escaparate.
- `url`: Link directo al Iframe (ej YouTube embed, TikTok embed).
- `platform`: `"youtube"`, `"tiktok"`, `"instagram"`, o `"generic"`.
- `caption`: Pie de foto.

#### `features` (Ventajas)
- Úsalo para poner "Envío Gratis", "Garantía de 2 años", "Atención 24/7".

#### `item-list` (El Super Componente)
- `displayStyle`: 
    - `"list"`: Filas elegantes (Barberías, Clínicas).
    - `"menu"`: Estilo carta (Restaurantes).
    - `"card-grid"`: Cuadrícula visual (Catálogos, Galería).
- `categories`: Array de `{ name, items: [] }`.

#### `gallery` (Galería de Fotos)
- `sectionTitle`, `layout` (`"grid"` | `"carousel"`).
- `images`: Array de `{ url, caption }`.

#### `location` (Ubicación Geográfica)
- `sectionTitle`, `address` (texto), `description`.

#### `testimonials` (Prueba Social)
- Imprescindible para generar confianza. Mínimo 3 testimonios.

#### `contact` (Conversión)
- Campos: `email`, `phone`, `address`, `showMap` (boolean).

#### `ai-chat` (Soporte Inteligente)
- Botón flotante para atención al cliente guiada por IA.
- `floatingPosition`: `"bottom-right"`, `"bottom-left"`, `"top-right"`, `"top-left"`.
- `buttonIcon`, `buttonColor`, `chatTitle`, `welcomeMessage`.
- `endpointUrl`: URL obligatoria del backend que procesa el chat.
- `placeholderText`: Texto predictivo del input.

---

## 🚀 EJEMPLO: SITIO COMPLETO PARA BARBERÍA (Payload)

```json
{
  "type": "UPDATE_TENANT_CONFIG",
  "payload": {
    "tenantId": "barber-001",
    "businessName": "The Old School Barber",
    "theme": {
      "primaryColor": "#d4af37",
      "bgColor": "#0f172a",
      "surfaceColor": "#1e293b",
      "textColor": "#f8fafc",
      "textMutedColor": "#94a3b8",
      "fontFamily": "'Playfair Display', serif",
      "borderRadius": "4px"
    },
    "blocks": [
      { "type": "hero", "order": 0, "data": { "headline": "Cortes Clásicos, Actitud Moderna", "ctaText": "Reservar Cita" } },
      { "type": "features", "order": 1, "data": { "sectionTitle": "Experiencia Premium", "features": [{ "title": "Toalla Caliente", "icon": "wind" }] } },
      { 
        "type": "item-list", "order": 2, 
        "data": { 
          "displayStyle": "list", 
          "header": { "title": "Nuestros Servicios" },
          "categories": [{ "name": "Cortes", "items": [{ "title": "Degradado", "price": "25€", "duration": "45min" }] }] 
        } 
      },
      { "type": "contact", "order": 3, "data": { "sectionTitle": "Encuéntranos", "phone": "600 000 000" } }
    ]
  }
}
```
