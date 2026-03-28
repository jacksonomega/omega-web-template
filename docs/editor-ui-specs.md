# Especificaciones de Interfaz de Usuario (UI) para el Editor Web

Este documento detalla los controles y componentes de interfaz que debe tener el Panel de Administración (Editor del CMS) para explotar al máximo la arquitectura de *Server-Driven UI* del SaaS. Cada control mapea directamente a variables del modelo JSON de Angular.

---

## 1. Menú de Apariencia Global (Theming)
Esta sección afecta a toda la web y mapea a la interfaz `TenantTheme`.

### Paleta de Colores
*   **Color Primario (`primaryColor`)**:
    *   *Control UI:* Selector de Color (Color Picker) híbrido (con input Hex `#000000`).
    *   *Uso:* Botones principales, acentos gráficos, enlaces.
*   **Color de Fondo (`bgColor`)**:
    *   *Control UI:* Selector de Color. Preferificar colores base (blanco, negro, gris muy oscuro).
*   **Color de Superficie (`surfaceColor`)**:
    *   *Control UI:* Selector de Color.
    *   *Lógica sugerida:* Permitir que la UI lo calcule automáticamente (haciendo el fondo un 10% más claro o más oscuro) o permitir al usuario elegir un color específico para las tarjetas de contenido.
*   **Colores de Texto (`textColor`, `textMutedColor`)**:
    *   *Control UI:* Toggle "Tema Oscuro / Tema Claro" que automáticamente asigne blancos absolutos o grises oscuros, con opción de modificar el HEX manualmente.

### Tipografía
*   **Fuente Principal (`fontFamily`, `fontFamilyUrl`)**:
    *   *Control UI:* Dropdown/Select pre-poblado con integraciones de Google Fonts (Ej: Inter, Roboto, Playfair Display, Outfit).
    *   *Preview:* El dropdown debe mostrar el nombre de la fuente renderizado *en esa misma fuente*.

### Formas y Geometría
*   **Redondeo de bordes (`borderRadius`)**:
    *   *Control UI:* "Segmented Control" (Botones agrupados) con iconos visuales:
        - 🔲 **Cuadrado** (`0px`)
        - ⬜ **Redondeado** (`8px`)
        - ⚪ **Píldora / Circular** (`999px`)

---

## 2. Constructor de Páginas (Gestor de Bloques)
Esta sección mapea al array `blocks: PageBlock[]`.

*   **Listado de Bloques Activos**:
    *   *Control UI:* Lista Drag-and-Drop (Arrastrar y soltar) para reordenar bloques actualizando la propiedad `order`.
*   **Control de Estado por Bloque**:
    *   *Control UI:* Switch / Toggle (Encendido/Apagado) que mapea a la propiedad `visible`.
*   **Selector de Nuevos Bloques**:
    *   *Control UI:* Modal visual. En lugar de decir "Añadir ItemList", debe estar orientado al usuario:
        - "Añadir Lista de Precios" -> Crea un `ItemList` modo `list`.
        - "Añadir Menú" -> Crea un `ItemList` modo `menu`.
        - "Añadir Catálogo" -> Crea un `ItemList` modo `card-grid`.

---

## 3. Editor Profundo: El Super Bloque `ItemList`
Al hacer clic en editar un bloque `ItemList`, el usuario debe ver esta UI:

### Configuración del Layout del Bloque
*   **Estilo del Bloque (`displayStyle`)**:
    *   *Control UI:* Tres tarjetas visuales grandes, con iconos que representen "Lista Simple", "Cuadrícula de Tarjetas" y "Menú Punteado".
*   **Columnas en Desktop (`columns.desktop`)**:
    *   *Control UI:* Slider o botones "1 | 2 | 3 | 4".
    *   *Regla condicionada:* Si `displayStyle` es `list` o `menu`, limitar el máximo a 2 columnas. Si es `card-grid`, permitir 4.

### Editor de Categorías e Ítems
*   **Gestor de Categorías**:
    *   *Control UI:* Acordeones expansibles. Puedes "Añadir Categoría", que crea un panel colapsable. Dentro, está el botón "Añadir Ítem".
*   **Modal/Drawer "Editar Ítem"**:
    *   **Título y Descripción**: Campos de texto convencionales (Inputs).
    *   **Precio (`price`)**: Input numérico o texto corto (para "Desde $20").
    *   **Duración (`duration`)**: Input opcional. (Se puede ocultar si el `displayStyle` es de restaurante).
    *   **Imagen (`imageUrl`)**: 
        *   *Control UI:* Zona de *Drag & Drop* para subir archivo.
        *   *Regla:* Solo mostrar u obligar si el layout elegido es `card-grid`.
    *   **Etiquetas (`tags`)**:
        *   *Control UI:* Input de tipo "Tags" o "Chips". Al escribir una palabra y dar *Enter*, se convierte en una píldora visual (ej: [OFERTA] x).

### Constructor de Acción (El Botón del Ítem)
Mapea a la interfaz `ActionProp`. Si el usuario marca la casilla "Añadir botón a este ítem":
1.  **Select "Acción del botón":**
    - Opciones: Enlace Web (`url`), Enviar WhatsApp (`whatsapp`), Enviar Email (`email`).
2.  **Input Dinámico (Depende del anterior):**
    - Si elige Enlace Web -> Input para escribir la URL (ej. Calendly).
    - Si elige WhatsApp -> Input de número telefónico + Textarea pequeño para el "Mensaje predeterminado". (El frontend o el backend concatenará esto a `wa.me/numero?text=mensaje`).
3.  **Texto del Botón (`label`)**: Input simple (ej: "Consultar precio").

---

## 4. Editor Profundo: Bloque `LocationInfo` (Ubicación y Horarios)

### Dirección y Mapa
*   **Buscador de Dirección**:
    *   *Control UI:* Un Autocomplete conectado a Google Places API. Al seleccionar una dirección real, el JSON se llena automáticamente con la `address.street`, `address.city` y extrae la longitud y latitud `coordinates`.

### Creador de Horarios
*   *Control UI:* Interfaz de "Agenda Semanal".
    *   Una lista de Lunes a Domingo.
    *   Cada fila tiene un Toggle "Abierto/Cerrado".
    *   Si está abierto, muestra dos inputs de hora: `Apertura` (09:00) y `Cierre` (18:00).
    *   *Exportación:* El Editor compila esto en el array simple JSON definido en la arquitectura.

---

## Recomendaciones Técnicas para la Interfaz
1. **Live Preview (Previsualización en tiempo real):**
   El CMS debe tener la pantalla dividida. A la izquierda, el panel de controles descritos aquí. A la derecha, un Iframe (o el componente nativo renderizado) mostrando la web. Gracias a Angular Signals y CSS Variables, **cada cambio en un input izquierdo debería actualizar automáticamente la vista derecha** sin necesidad de guardar en base de datos.
2. **Onboarding por Plantillas:**
   No obligues a los dueños de PYMES a empezar desde un canvas vacío. Ofrece "Plantillas" a nivel base de datos que ya pre-configuren los JSON de colores, bloques e ítems adecuados para su rubro desde el instante cero.
