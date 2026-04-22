# Bloque de Fidelización (Newsletter)

El bloque `newsletter` (Boletín / Fidelización) permite a las empresas captar la información de contacto de sus visitantes (correo electrónico o teléfono) para enviarles noticias, promociones o actualizaciones. Este bloque es altamente personalizable y soporta distintos diseños (centrado y dividido con imagen) y tipos de captura (solo email, solo teléfono, o ambos).

## Interfaz TypeScript

La estructura de datos del bloque define las propiedades permitidas para su configuración:

```typescript
export interface NewsletterBlockData {
  title: string;                 // Título principal del bloque
  subtitle?: string;             // Texto secundario opcional
  placeholderText?: string;      // Texto de guía para el input (Ej: "Tu correo electrónico")
  buttonText?: string;           // Texto personalizado para el botón (Ej: "Suscribirse")
  imageUrl?: string;             // URL de la imagen (solo usado cuando layout = 'split')
  layout?: 'split' | 'centered'; // Disposición del bloque (por defecto 'centered')
  type?: 'email' | 'phone' | 'both'; // Tipo de entrada a solicitar (por defecto 'email')
}
```

## Casos de Uso y Ejemplos de Payload (JSON)

Al enviar la configuración desde el backend (o al guardarla en el editor general), este bloque se enviará siempre bajo la key `"type": "newsletter"`.

### Ejemplo 1: Newsletter estándar centrado (Solo Email)

Ideal para el pie de página o una sección directa en medio de la landing.

```json
{
  "id": "block-newsletter-1",
  "type": "newsletter",
  "order": 10,
  "visible": true,
  "data": {
    "title": "Suscríbete a nuestro boletín",
    "subtitle": "No te pierdas de nuestras mejores promociones y noticias exclusivas.",
    "type": "email",
    "placeholderText": "Introduce tu correo electrónico...",
    "buttonText": "Quiero suscribirme",
    "layout": "centered"
  }
}
```

### Ejemplo 2: Captación de Leads dividida con Imagen (Mail y Teléfono)

Ideal para campañas específicas donde se aporta valor visual (una foto del local, un regalo por suscribirse, etc) y se prefieren obtener varias formas de contacto.

```json
{
  "id": "block-newsletter-2",
  "type": "newsletter",
  "order": 11,
  "visible": true,
  "data": {
    "title": "¡Únete a nuestro club VIP!",
    "subtitle": "Déjanos tus datos y recibe un 15% de descuento en tu próxima compra.",
    "type": "both",
    "placeholderText": "Email / Teléfono",
    "buttonText": "Obtener Descuento",
    "layout": "split",
    "imageUrl": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600"
  }
}
```

### Ejemplo 3: Captura solo para SMS / WhatsApp (Solo Teléfono)

Para pymes físicas (como restaurantes, peluquerías) que publicitan mediante WhatsApp o SMS.

```json
{
  "id": "block-newsletter-3",
  "type": "newsletter",
  "order": 12,
  "visible": true,
  "data": {
    "title": "Avisos por WhatsApp",
    "subtitle": "Recibe el menú del día directamente en tu móvil.",
    "type": "phone",
    "placeholderText": "+34 600 000 000",
    "buttonText": "Avisadme",
    "layout": "centered"
  }
}
```

## Detalles del Diseño

* **Estilizado Automático:** El bloque obedece as las variables globales del _Tenant_ en todo momento (`--primaryColor` para el título y botones, `--surfaceColor` para el fondo del bloque de fidelización y `--textColor` para los textos base).
* **Responsivo:** El `layout: "split"` ubica el formulario a la izquierda y la imagen a la derecha en escritorio, pero automáticamente se apila en dispositivos móviles para no romper la interfaz.
* **Componente Angular Standalone:** Construido siguiendo los Core Architecture Principles del proyecto, apoyándose totalmente en el modelo de Signals de Angular moderno.