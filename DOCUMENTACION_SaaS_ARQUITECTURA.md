# 🏗️ Guía de Integración Backend - Arquitectura SaaS Multi-Tenant (Server-Driven UI)

Este documento es la referencia definitiva para el desarrollo del **Backend**. Define exactamente cómo el servidor debe construir y enviar la interfaz de usuario (Layout, Estilos y Contenido) al frontend (Angular 21) para que este renderice la Landing Page de cada inquilino (Pyme) de forma dinámica y perfecta.

---

## 🧭 1. Concepto: Server-Driven UI

El frontend **no tiene rutas estáticas ni páginas pre-ensambladas**. Es un lienzo en blanco (un motor) que sabe cómo pintar "Bloques" de diseño. 

1. El visitante entra a `https://[slug-del-cliente].misaas.com`.
2. El frontend extrae el `[slug]` y hace un `GET /api/tenant/[slug]`.
3. El Backend devuelve un **JSON** con la configuración completa.
4. El frontend inyecta los estilos globales y renderiza exactamente los bloques indicados, en el orden indicado, con los datos indicados.

**Tu objetivo en el Backend es:** Construir este JSON dinámicamente según lo que la Pyme haya configurado en su panel de administración.

---

## 📦 2. Estructura Raíz del JSON (El Contrato)

El endpoint `GET /api/tenant/:slug` debe retornar **siempre** un objeto con esta estructura raíz:

```json
{
  "tenantId": "UUID-o-ID-unico-del-cliente",
  "slug": "nombre-pyme",
  "businessName": "Nombre Comercial de la Pyme",
  
  "theme": { ... },   // 🎨 100% responsable de la identidad visual
  "seo": { ... },     // 🔍 Metadatos para buscadores y redes sociales
  "blocks": [ ... ]   // 🧱 Lista de secciones de la página
}
```

---

## 🎨 3. Objeto `theme` (Identidad Visual)

El frontend mapea estas propiedades directamente a Variables CSS (`--color-primary`, etc.). Modificar estos valores cambia instantáneamente el aspecto de *toda* la web.

```json
"theme": {
  "primaryColor": "#16a34a",     // Color dominante (Botones, fondos destacados)
  "secondaryColor": "#15803d",   // Color secundario (Típicamente usado para efectos hover del botón primario)
  "accentColor": "#4ade80",      // Acentos (Estrellas, iconos brillantes, checkmarks)
  "bgColor": "#0a0f0d",          // Color de fondo de TODA la web. 
                                 // -> Usa colores oscuros (#000000) para Dark Mode.
                                 // -> Usa colores claros (#FFFFFF) para Light Mode.
  "surfaceColor": "#111b15",     // Color de las "tarjetas" (fondos de formularios, planes de precio). 
                                 // -> Debe contrastar ligeramente con bgColor.
  "textColor": "#f0fdf4",        // Color del texto principal (Títulos y botones ghost).
  "textMutedColor": "#86efac",   // Color secundario (Descripciones, subtítulos, texto de ayuda).
  "fontFamily": "'Inter', sans-serif", // Nombre de la fuente para el CSS
  "fontFamilyUrl": "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap", // URL para importar la fuente automáticamente
  "borderRadius": "12px",        // Redondeo de elementos. 
                                 // -> Ejemplos: "0px" (Austero/Corporativo), "8px" (Moderno), "999px" (Píldoras)
  "logoUrl": "https://midominio.com/logo.png", // Para el header/footer (opcional)
  "faviconUrl": "https://midominio.com/favicon.ico" // Cambia el icono de pestaña
}
```

---

## 🔍 4. Objeto `seo` (Metadatos)

```json
"seo": {
  "title": "Abogados Madrid | Especialistas Penal",
  "description": "Despacho de abogados con más de 20 años de experiencia.",
  "ogImage": "https://midominio.com/og-banner.jpg", // Imagen al compartir en WhatsApp/Twitter
  "keywords": ["abogados", "madrid", "penal"]
}
```

---

## 🧱 5. El Array `blocks` (Construyendo la Página)

El array `blocks` es una lista ordenada de objetos. 
**El Backend tiene LIBERTAD TOTAL de:**
1. **Reordenar:** El frontend ordenará los bloques basándose puramente en el campo numérico `order`.
2. **Ocultar:** Si `visible` es `false`, el frontend no renderiza (ni descarga el código de) ese bloque.
3. **Repetir:** Puedes enviar múltiples bloques del mismo tipo (ej. dos bloques `features`), siempre que su `id` sea único.
4. **Omitir:** No es obligatorio enviar todos los tipos de bloques. Una web puede ser simplemente un `hero` y un `footer`.

El contrato base de un bloque es:
```json
{
  "id": "uuid-unico-del-bloque", // Crucial para la renderización de Angular
  "type": "tipo-de-bloque",      // Determina qué componente se instancia
  "order": 1,                    // Orden posicional (1, 2, 3...)
  "visible": true,               // Interruptor de encendido/apagado
  "data": { ... }                // Datos dinámicos (DIFERENTE SEGÚN EL TIPO)
}
```

### Catálogo de Tipos Soportados y su `data`

A continuación, la estructura exacta que el Backend debe servir dentro de la propiedad `"data"` para cada `"type"`.

#### A. `type: "hero"` (Cabecera principal)
```json
"data": {
  "headline": "El mejor software para restaurantes",
  "subheadline": "Gestiona reservas, pedidos y facturación desde un solo lugar.",
  "ctaText": "Prueba Gratis de 14 días",
  "ctaUrl": "#pricing", // Puede ser un ancla o un link externo (https://...)
  "imageUrl": "https://bucket.com/dashboard-preview.png",
  "backgroundType": "gradient" // Valores permitidos: "gradient" | "image" | "video"
}
```

#### B. `type: "features"` (Cuadrícula de características/servicios)
```json
"data": {
  "sectionTitle": "¿Por qué elegirnos?",
  "features": [
    {
      "icon": "⚡", // Puede ser Emoji, texto o clase CSS si se estandariza
      "title": "Súper Rápido",
      "description": "Carga en menos de 1 segundo."
    },
    {
       // Puedes mandar desde 1 hasta N elementos. El grid es auto-adaptable.
    }
  ]
}
```

#### C. `type: "pricing"` (Tarifas y planes)
```json
"data": {
  "sectionTitle": "Planes Transparentes",
  "plans": [
    {
      "name": "Básico",
      "price": 29,
      "currency": "€",
      "period": "monthly",    // "monthly" | "annual"
      "highlighted": false,   // false = Diseño normal (tarjeta básica)
      "ctaText": "Elegir Básico",
      "features": ["1 Usuario", "Soporte Mail"]
    },
    {
      "name": "Pro",
      "price": 99,
      "currency": "€",
      "period": "monthly",
      "highlighted": true,    // true = Borde brillante, etiqueta "Más Popular", botón relleno
      "ctaText": "Elegir Pro",
      "features": ["Todo lo Básico", "Soporte Telefónico"]
    }
  ]
}
```

#### D. `type: "testimonials"` (Reseñas de clientes)
```json
"data": {
  "sectionTitle": "Historias de éxito",
  "testimonials": [
    {
      "name": "María Gómez",
      "role": "Directora de Ventas",
      "avatarUrl": "https://bucket.com/maria.jpg",
      "quote": "Nuestras ventas subieron un 200%.",
      "rating": 5 // Número del 1 al 5. El frontend renderizará las estrellas doradas (accentColor).
    }
  ]
}
```

#### E. `type: "contact"` (Formulario e información)
```json
"data": {
  "sectionTitle": "Hablemos de tu proyecto",
  "email": "hola@mipyme.com",     // Opcional. Si se envía "", se oculta la fila visual.
  "phone": "+34 600 000 000",     // Opcional
  "address": "Calle Falsa 123",   // Opcional
  "showMap": true,                // true = Muestra el iframe de Maps debajo
  "mapEmbedUrl": "https://www.google.com/maps/embed?..." // Requerido si showMap es true
}
```

#### F. `type: "footer"` (Pie de página)
```json
"data": {
  "copyrightText": "© 2024 Mi Pyme. Todos los derechos reservados.",
  "links": [
    { "label": "Política de Privacidad", "url": "/privacy" },
    { "label": "Términos Legales", "url": "/terms" }
  ],
  "socialLinks": [
    {
      "platform": "Instagram", // Para atributos ARIA de accesibilidad
      "url": "https://instagram.com/...",
      "icon": "📸" // Icono visual para el botón redondo
    }
  ]
}
```

---

## 💡 6. Combinaciones y Casos de Uso (Ejemplos)

De esta arquitectura nacen infinitas posibilidades sin tocar Angular. El Backend puede enviar configuraciones "mágicas" como estas:

### Caso 1: La Landing Clásica (El flujo por defecto)
Backend envía: `[Hero, Features, Pricing, Testimonials, Contact, Footer]`.

### Caso 2: El "Mini-Sitio" tipo Linktree / Link-in-bio
Una pyme pequeña solo quiere una web tarjeta de visita. 
El Backend envía:
- `Hero` (Con foto del autónomo y botón a su WhatsApp).
- `Contact` (Solo un formulario rápido sin mapa).
- `Footer`.
*(El frontend cargará al instante porque ignora el código de Pricing, Features, etc.)*

### Caso 3: "Squeeze Page" (Captación dura)
Se quiere maximizar leads, por lo que el formulario de contacto va arriba del todo.
El Backend simplemente altera el orden:
1. `Contact` (order: 1)
2. `Hero` (order: 2) -> (usado como explicación debajo del formulario)
3. `Features` (order: 3)

### Caso 4: Repetición Dinámica (Web larga)
El Backend puede enviar **tres** bloques de tipo `features`.
1. `type: "features"`, `order: 2`, `data.sectionTitle = "Nuestros Servicios en Nube"`
2. `type: "features"`, `order: 4`, `data.sectionTitle = "Nuestros Servicios Físicos"`
Angular renderizará la misma UI pero inyectará datos distintos sin problema de conflictos.

---

## 🚨 7. Reglas Críticas para el Backend

1. **La propiedad `type` es case-sensitive y escrita en piedra.** Si envías `"Type": "Hero"` o `"type": "heroes"`, el FrontEnd lanzará un warning de `Unknown block type` y lo ignorará. Los tipos exactos son: `hero`, `features`, `pricing`, `testimonials`, `contact`, `footer`.
2. **Los `id` de los bloques DEBEN ser únicos en el array.** Angular usa esto para optimizar el renderizado visual (`track block.id`).
3. **Omisión segura:** Si una Pyme no sube URL de Mapas, el Backend debe poner `"showMap": false`, no intentar inyectar variables nulas que puedan romper el iFrame.
4. **Seguridad de Colores:** Asegurar en el panel de control del cliente que los HEX de color (ej. `#FFFFFF`) siempre vengan con el símbolo `#`.
