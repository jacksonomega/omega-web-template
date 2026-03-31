# Guía de Nuevos Bloques: Galería, Ubicación y Testimonios

Este documento contiene las especificaciones exactas para configurar los últimos bloques añadidos al motor de UI. 

---

## 1. Galería Multimedia (`gallery`)
Este bloque permite mostrar colecciones de imágenes con diseño adaptable.

### Estructura JSON
```json
{
  "type": "gallery",
  "data": {
    "sectionTitle": "Nuestras Instalaciones", // Opcional
    "layout": "grid", // O "carousel"
    "images": [
      {
        "url": "https://imagen1.jpg",
        "caption": "Descripción corta", // Opcional
        "altText": "Texto alternativo SEO" // Opcional
      }
    ]
  }
}
```
### Detalles Técnicos
- **Layout `grid`**: Cuadrícula automática que se adapta al ancho disponible.
- **Layout `carousel`**: Fila horizontal con deslizamiento nativo (ideal para móviles). 
- **Efectos**: Las imágenes tienen un efecto de "zoom suave" al pasar el ratón.

---

## 2. Ubicación y Mapas (`location`)
Genera un mapa de Google Maps interactivo basado únicamente en una dirección de texto.

### Estructura JSON
```json
{
  "type": "location",
  "data": {
    "sectionTitle": "Visítanos", // Opcional
    "address": "Calle Mayor 1, 28013 Madrid, España", // Dirección textual completa
    "description": "Estamos justo al lado de la Plaza de Sol." // Opcional
  }
}
```
### Detalles Técnicos
- **Generación Automática**: El motor construye el Iframe de Google Maps de forma segura (`DomSanitizer`).
- **Navegación GPS**: Incluye un botón que detecta si el usuario está en móvil para abrir la App de Mapas nativa o la web oficial.

---

## 3. Prueba Social: Testimonios (`testimonials`)
Bloque diseñado para generar confianza mediante reseñas de clientes reales.

### Estructura JSON
```json
{
  "type": "testimonials",
  "data": {
    "sectionTitle": "Lo que dicen de nosotros",
    "testimonials": [
      {
        "name": "Juan Pérez",
        "role": "CEO en TechCorp", // Opcional
        "avatarUrl": "https://foto-perfil.jpg",
        "quote": "El servicio superó todas mis expectativas. Altamente recomendado.",
        "rating": 5 // Número del 1 al 5
      }
    ]
  }
}
```
### Detalles Técnicos
- **Estrellas Visuales**: El campo `rating` genera automáticamente iconos de estrellas doradas.
- **Formato Foto**: Las fotos de perfil (`avatarUrl`) se recortan automáticamente a formato circular con borde estilizado.
- **Diseño**: Fondo con marca de agua de comillas gigantes para un aspecto editorial premium.
