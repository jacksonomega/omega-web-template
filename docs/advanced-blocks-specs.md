# Especificación de Bloques Avanzados e Interactivos

Este documento detalla técnicamente los nuevos bloques dinámicos añadidos a la arquitectura del SaaS. Estas especificaciones son útiles para los desarrolladores del Editor Web que necesiten construir los controles (inputs, selectores) necesarios para manipular estas nuevas propiedades.

## 1. Portada Avanzada (Super Hero)
El bloque `hero` ha sido recodificado para soportar múltiples layouts, vídeos nativos de fondo y un sistema de llamados a la acción (CTAs) con iconos de redes sociales integrados.

### Interfaz TypeScript
```typescript
{
  "type": "hero",
  "data": {
    "headline": string;
    "subheadline": string;
    "badge"?: string; // Etiqueta superior opcional (Ej: "NUEVO")
    "layout"?: "split" | "centered" | "full-bg"; // Define la estructura visual
    "backgroundType": "image" | "gradient" | "video";
    "imageUrl"?: string;
    "backgroundVideoUrl"?: string; // Url directa a un .mp4
    "actions"?: ActionProp[]; // Array de botones
  }
}
```

### Comportamiento del Editor Web
*   **Selector de Layout:** Si el usuario elige `layout="full-bg"`, el motor alineará el texto al centro (por defecto) o a la izquierda, aplicará un degradado oscurecido sobre la imagen/vídeo de fondo, y cambiará el texto a blanco automáticamente puro. Las imágenes de fondo y vídeos usarán `object-fit: cover`.
*   **Botón de WhatsApp Automático:** Si dentro del array de `actions` un botón tiene el tipo `"whatsapp"`, el bloque inyectará automáticamente el SVG corporativo de WhatsApp y pintará el botón de verde (`#25D366`), añadiendo efectos de sombra verde.

---

## 2. Temporizador Promocional (`promo-timer`)
Un bloque crítico para conversión que genera urgencia temporal ("FOMO") calculando el tiempo restante hasta una fecha indicada.

### Interfaz TypeScript
```typescript
{
  "type": "promo-timer",
  "data": {
    "title": string;
    "description"?: string;
    "endDate": string; // Fecha en formato ISO 8601
    "action"?: ActionProp;
  }
}
```

### Comportamiento del Editor Web
*   **Control de Fecha:** El Editor debe usar un selector de fecha y hora (`<input type="datetime-local">`) y **siempre convertirlo a ISO string** (Ej: `2026-12-31T23:59:59Z`) antes de enviarlo por `postMessage`.
*   **Motor Reactivo:** Angular utiliza `Signals` para calcular matemáticamente los días, horas, minutos y segundos restantes. Si la fecha ya ha pasado (distancia negativa), el contador se fijará en `00:00:00:00` de forma segura.

---

## 3. Incrustador de Redes Sociales (`video-embed`)
Diseñado para embeber Iframes de manera segura y completamente responsiva, reaccionando inteligentemente a la plataforma de origen.

### Interfaz TypeScript
```typescript
{
  "type": "video-embed",
  "data": {
    "url": string; // URL preparada para Iframe (Ej: youtube.com/embed/...)
    "platform": "youtube" | "tiktok" | "instagram" | "generic";
    "caption"?: string; // Texto legal o descriptivo debajo del vídeo
  }
}
```

### Comportamiento del Editor Web
*   **Seguridad:** Angular pasará la `url` por su `DomSanitizer` nativo. El editor debe asegurarse de mandar un enlace de Iframe válido (Ej: En lugar de `youtube.com/watch?v=123`, debe ser `youtube.com/embed/123`).
*   **Relación de Aspecto (Aspect Ratio):**
    *   Si el Editor manda `platform="youtube"` o `"generic"`, el bloque de Angular reservará un rectángulo horizontal panorámico (`16:9`).
    *   Si el Editor manda `platform="tiktok"` o `"instagram"`, el bloque limitará el ancho máximo a `400px` y aplicará un formato vertical estilo móvil (`9:16`).
