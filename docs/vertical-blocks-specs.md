# Especificación de Bloques Verticales para Pymes

Siguiendo la arquitectura Server-Driven UI del SaaS, hemos implementado nuevos bloques orientados explícitamente a verticales de negocio como la restauración (hostelería), minoristas (retail) y negocios basados en citas/reservas.

---

## 1. Tarjeta de Presentación Digital (`business-info`)
Reemplaza los bloques tradicionales dispersos de contacto y ubicación uniendo todo en un formato de "Tarjeta Glassmorphism".

### Interfaz JSON para el Payload
```json
{
  "type": "business-info",
  "data": {
    "sectionTitle": "Encuéntranos",
    "openingHours": [
      { "day": "Lunes - Viernes", "hours": "09:00 - 18:00" },
      { "day": "Sábados", "hours": "10:00 - 14:00" },
      { "day": "Domingos", "hours": "Cerrado" }
    ],
    "isOpenNow": true,
    "phone": "+34 900 123 456",
    "whatsapp": "+34 600 123 456",
    "email": "hola@negocio.com",
    "address": "Avenida Principal 123, Madrid",
    "mapEmbedUrl": "https://www.google.com/maps/embed?pb=!1m18..."
  }
}
```
**Comportamiento:** `isOpenNow` altera dinámicamente la etiqueta superior ("Abierto Ahora" en verde o "Cerrado" en rojo). El número de WhatsApp automáticamente genera un enlace `wa.me`.

---

## 2. Carta para Restaurantes (`restaurant-menu`)
Una evolución exclusiva de las listas para soportar categorías navegables, descripciones refinadas y símbolos de alérgenos unificados.

### Interfaz JSON para el Payload
```json
{
  "type": "restaurant-menu",
  "data": {
    "sectionTitle": "Nuestra Carta",
    "subtitle": "Descubre nuestros sabores",
    "categories": [
      {
        "id": "entrantes-1",
        "name": "Entrantes",
        "items": [
          {
            "id": "item-1",
            "title": "Bravas Caseras",
            "price": "6.50€",
            "description": "Patatas acompañadas de nuestra salsa especial ligeramente picante.",
            "allergens": ["spicy", "vegan"],
            "isPopular": true
          }
        ]
      }
    ]
  }
}
```
**Comportamiento:** Si hay múltiples categorías, el bloque genera pestañas (Tabs) interactivas. Los alérgenos soportados son: `gluten`, `lactose`, `nuts`, `vegan`, `spicy`. Usar un `id` único para las claves.

---

## 3. Catálogo de Tienda (`product-showcase`)
Exhibición visual de productos físicos, diseñado con microanimaciones, etiquetas sobre las fotografías y precios cruzados.

### Interfaz JSON para el Payload
```json
{
  "type": "product-showcase",
  "data": {
    "sectionTitle": "Novedades de Temporada",
    "layout": "grid", // "carousel" (scroll horizontal) o "grid" (rejilla cuadriculada)
    "products": [
      {
        "id": "prod-1",
        "title": "Zapatillas Runner Ultra",
        "price": "89.99€",
        "originalPrice": "110.00€",
        "imageUrl": "https://ejemplo.com/zapato.jpg",
        "badge": "OFERTA",
        "actionUrl": "https://tienda.com/producto/1"
      }
    ]
  }
}
```
**Comportamiento:** El Editor web debe permitir elegir el diseño entre `grid` y `carousel` dependiendo del gusto del cliente y volumen de inventario.

---

## 4. Reserva / Cita Integrada (`booking-cta`)
Un bloque inmersivo para la conversión. En lugar de un mero enlace, simula o incrusta un motor de terceros.

### Interfaz JSON para el Payload
```json
{
  "type": "booking-cta",
  "data": {
    "title": "Reserva tu mesa online",
    "subtitle": "No te quedes sin sitio, disponemos de zona interior y terraza exterior.",
    "imageUrl": "https://ejemplo.com/fondo-restaurante.jpg",
    "widgetType": "thefork", // "calendly", "thefork", "custom", o "button-only"
    "widgetUrl": "https://www.thefork.com/booking/widget/...", // URL del iframe de inserción
    "buttonLabel": "Reservar por Teléfono",
    "buttonUrl": "tel:+34123456789"
  }
}
```
**Comportamiento:**
- `widgetType="button-only"`: Renderizará un simple botón elegante con fondo difuminado basado en la imagen provista.
- Si se escoge `calendly`, el contenedor del Iframe será más largo verticalmente para acoger el seleccionador de días nativo de Calendly.

---

## 5. Asistente con Inteligencia Artificial Flotante (`ai-chat`)
Introduce un botón de atención al cliente flotante en el sitio que, al hacer clic, despliega un panel de chat de IA.

### Interfaz JSON para el Payload
```json
{
  "type": "ai-chat",
  "data": {
    "floatingPosition": "bottom-right",
    "buttonIcon": "🤖",
    "buttonColor": "#007bff",
    "chatTitle": "Soporte IA",
    "welcomeMessage": "¡Hola! ¿En qué puedo ayudarte?",
    "endpointUrl": "https://api.tu-saas.com/v1/chat",
    "placeholderText": "Escribe tu duda..."
  }
}
```
**Comportamiento:**
- `floatingPosition`: Controla la esquina donde aparecerá fijado (fixed) el botón flotante.
- `endpointUrl`: La URL del backend que procesará el texto del usuario y devolverá una respuesta (`{"reply": "..."}`).
- Incorpora animaciones de despliegue, estado de carga "is typing" e interfaz amigable tipo chat.
