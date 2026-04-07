# Control de Cambios: Expansión del Motor Server-Driven UI (SDUI)

Este documento registra las actualizaciones significativas realizadas en el motor principal (Angular) para transicionar de un sistema monolítico estático a una plataforma robusta, multi-cliente y multi-página.

## 1. Nuevos "Super Bloques" Integrados

Se han añadido tres (3) nuevos bloques genéricos al ecosistema para dotar a las páginas construidas de mayor capacidad para contar historias y manejar objeciones. Todos estos bloques son completamente dinámicos, gestionados por estado vía `Signals` (`signal()`) y heredan nativamente el theaming de las variables globales (`--color-primary`, `--color-surface`, etc.).

### A. Bloque "FAQ" (Preguntas Frecuentes)
Un bloque orientado a romper fricciones en ventas. 
- **Ubicación:** `src/app/blocks/faq/faq-block.component.ts`
- **Registro en el motor:** `'faq'`
- **Modelo de datos (`FaqBlockData`):** Soporta `sectionTitle`, `subtitle`, e inserta arrays de respuestas bajo la interfaz `FaqItem`.
- **Comportamiento:** Implementa un acordeón mediante *Signal Mutations* (`openIndex.update()`) permitiendo expandir / colapsar dinámicamente cada pregunta usando animaciones de altura restrictivas.
- **Payload Base:**
  ```json
  {
    "type": "faq",
    "data": {
      "sectionTitle": "Preguntas",
      "faqs": [{ "question": "¿Dudas?", "answer": "Cierto." }]
    }
  }
  ```

### B. Bloque "Text" (Bloque Textual Puro)
Bloque ideal para apartados como "Acerca de nosotros", historias corporativas o descripciones largas (manifiestos).
- **Ubicación:** `src/app/blocks/text/text-block.component.ts`
- **Registro en el motor:** `'text'`
- **Modelo de Datos (`TextBlockData`):** Recibe un array nativo de stings `paragraphs: string[]` permitiendo separar múltiples párrafos visuales. Añadida la compatibilidad de `alignment: 'left' | 'center' | 'right'`.

### C. Bloque "Timeline" (Línea de Tiempo)
Este bloque expone temporalmente hitos (ideal para secciones "Nuestro Proceso" o la historia del negocio).
- **Ubicación:** `src/app/blocks/timeline/timeline-block.component.ts`
- **Registro en el motor:** `'timeline'`
- **Modelo de datos (`TimelineBlockData`):** Expone la interfaz `TimelineEvent` con `date`, `title` y `description`.
- **CSS Avanzado:** Componente que dibuja una línea central de base que en escritorio intercala elementos pares (`is-left`) e impares (`is-right`) mediante CSS puro, y al llegar a una vista menor o igual a 768px, alinea todos los conectores hacia el eje izquierdo.

---

## 2. Refactorización a Arquitectura Multi-Página (Routing Dinámico)

El hito más importante del actual release es la transición conceptual del `TenantConfig`. Originalmente, un inquilino (*tenant*) representaba solo una Lading Page (página única). Ahora la arquitectura soporta múltiples páginas agrupadas por negocio.

### A. Modificación del Esquema Contractual (Data Types)
En `src/app/core/tenant/tenant.model.ts`:
- **Se eliminó** el array lineal de la raíz: `blocks: PageBlock[]`.
- **Se sustituyó por** el arreglo de páginas: `pages: TenantPage[]`.
- La interfaz `TenantPage` ahora envita un envoltorio que contiene además del listado de bloques (`blocks: PageBlock[]`), información de ruta necesaria para Angular (`path: string`, `name: string`).

### B. El Dynamic Layout (`DynamicLayoutComponent`)
Se creó `src/app/engine/dynamic-layout/dynamic-layout.component.ts`. 
- Este actúa como la "Carcasa del Aplicativo", responsable de escuchar al modelo e inyectar un **Navbar (Menú de Navegación) estático**.
- Este Header itera dinámicamente de forma automática el listado de páginas en formato enlace: `<a [routerLink]="page.path">`, construyendo la navegación de la web solo interpretando la data remota (`config.pages`).

### C. Abstracción del Router e Inyección Comodín (`app.routes.ts`)
Para dejar de lado el enrutamiento rígido:
- La ruta raíz de Angular (`''`) ahora carga el `DynamicLayoutComponent`.
- Como hijo, carga como "Capturador-Comodín" (`**`) el `PageRendererComponent`. Independientemente de que URL visites (`/contacto`, `/servicios`), la vista cargará el renderizador.

### D. Renderizador Sensible a la URL actual (`PageRendererComponent`)
- Ahora el import de Angular consume observadores del router (`router.events`), escuchando específicamente a la clase `NavigationEnd`.
- Cuando el usuario navega a `'URL'`:
  1. El engine captura el path.
  2. Filtra dentro del array de páginas del usuario actual buscando correspondencias (`config.pages.find(p => p.path === url)`).
  3. Si la URL existe, extrae los bloques específicos de ESA página y los manda a construir.
  4. Si la URL es espuria (No declarada por el modelo SaaS actual), dispara de manera nativa la señal oculta `pageNotFound`, anulando la construcción del modelo y dibujando el componente de *"Error 404"* implementado nativamente dentro del template.
