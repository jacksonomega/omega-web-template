# Contrato de Payload: Editor Web ↔ Motor SaaS (Iframe)

Este documento define la estructura estricta (API Contract) que el Editor Web debe enviar al motor embebido en el Iframe a través de la API `postMessage`. El motor de renderizado en Angular solo será capaz de crear la página y actualizarla en tiempo real si el JSON sigue las convenciones exactas descritas a continuación.

---

## 1. Estructura Base del Mensaje (El Evento PostMessage)
El Editor Web siempre debe enviar un objeto envolvente (Envelope) con un tipo de evento declarado.

```javascript
const mensaje = {
  type: "UPDATE_TENANT_CONFIG", // ESTRICTO: Debe ser esta cadena exacta
  payload: {
    // La configuración completa del Tenant va aquí
  }
};
document.getElementById('miframe').contentWindow.postMessage(mensaje, '*');
```

---

## 2. El Objeto Payload (`TenantConfig`)
El objeto `payload` debe contener la información del diseño del sitio.

### Ejemplo Completo y Válido:

```json
{
  "tenantId": "tenant-demo-123",
  
  "theme": {
    "primaryColor": "#16a34a",
    "secondaryColor": "#15803d",
    "accentColor": "#4ade80",
    "bgColor": "#ffffff",
    "surfaceColor": "#f8fafc",
    "textColor": "#0f172a",
    "textMutedColor": "#64748b",
    "fontFamily": "'Inter', sans-serif",
    "fontFamilyUrl": "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap",
    "borderRadius": "8px",
    "logoUrl": "https://mi-dominio.com/logo.png",
    "faviconUrl": "https://mi-dominio.com/favicon.ico"
  },
  
  "seo": {
    "title": "Mi Empresa Local",
    "description": "El mejor servicio de la ciudad.",
    "ogImage": "https://mi-dominio.com/banner.png",
    "keywords": ["servicio", "local"]
  },

  "blocks": [
     // Array de todos los bloques activos en la página (Ver Sección 3)
  ]
}
```

---

## 3. Arquitectura del Array `blocks` (Reglas de Oro)

1.  **Tipos en Kebab-Case (`type`):** El motor Angular busca identificadores exactos para cargar componentes perezosos.
    -   ❌ Evitar: `"ItemList"`, `"LocationInfo"`, `"HeroSection"`.
    -   ✅ Correcto: `"item-list"`, `"hero"`, `"pricing"`, `"features"`, `"contact"`, `"testimonials"`, `"footer"`.
2.  **Propiedades Obligatorias por Bloque:** Todos los bloques deben compartir el mismo esqueleto exterior:
    -   `id` (string): Único por bloque en la página.
    -   `type` (string): Identificador kebab-case de la librería superior.
    -   `order` (number): 0, 1, 2... Define en qué orden caen en la pantalla.
    -   `visible` (boolean): Si es falso, el Iframe lo ocultará sin eliminar su código HTML.
    -   `data` (object): Contiene las variables exclusivas del componente (varía según el `type`).

---

## 4. Estructura Exacta de Data para el Bloque `"item-list"`

Si solicitas un bloque `"item-list"`, la clave `data` no puede estar vacía, y no puede contener un array desnudo de `items`. **Debe estructurarse primero con categorías**.

### Contrato JSON para `"item-list"`:

```json
{
  "id": "bloque-servicios-1",
  "type": "item-list",
  "order": 1,
  "visible": true,
  "data": {
    "header": {
      "title": "Nuestros Tratamientos",
      "subtitle": "Selecciona el que más se ajuste a tu piel."
    },
    "displayStyle": "list", // EXCLUSIVO: "list", "menu", o "card-grid"
    "columns": { 
      "mobile": 1, 
      "desktop": 2 
    },
    "categories": [
      {
        "id": "cat_01",
        "name": "Faciales",
        "items": [
          {
            "id": "item_01",
            "title": "Limpieza Profunda",
            "description": "Extracción de comedones + mascarilla.",
            "price": "Desde $45",
            "duration": "45 min",
            "imageUrl": "https://url.com/opcional.png", // Visible si displayStyle="card-grid"
            "tags": ["Recomendado"],
            "action": {
              "type": "whatsapp", // EXCLUSIVO: "url", "whatsapp", "email", "scroll-to"
              "url": "https://wa.me/12345678",
              "label": "Agendar"
            }
          }
        ]
      }
    ]
  }
}
```

### Importante para desarrolladores Frontend/React del Editor:
*   Si `displayStyle === 'menu'`, las acciones (`action`) se ocultarán visualmente aunque existan en el JSON, y las imágenes (`imageUrl`) serán ignoradas.
*   Si omiten la clave `header.title`, el componente ahora dejará de lanzar error, pero ese espacio visual se perderá y no se renderizará su contenedor de título.
*   Asegúrense de usar `JSON.stringify/parse` profundamente limpio sin referenciar prototipos pesados u objetos cíclicos cuando empaqueten los "States" de React/Vue antes de lanzarlos hacia el `postMessage`.
