# Guía del Componente: Botón Flotante de Chat con IA (`ai-chat`)

El bloque `ai-chat` es un componente interactivo tipo "widget flotante" diseñado para ser inyectado dinámicamente a través del motor *Server-Driven UI* del SaaS. Proporciona una interfaz de chat moderna, animada y totalmente personalizable, pensada para conectarse a un modelo de asistencia conversacional (IA).

## 1. Propósito y Comportamiento Visivo

- **Disposición Flotante:** Se ancla de forma persistente (`position: fixed`) en una de las 4 esquinas de la ventana del navegador del usuario.
- **Diseño Adaptativo (White-label):** Hereda automáticamente el color corporativo (`primaryColor`) configurado a nivel de Tenant para colorear el botón, la cabecera del chat y los mensajes del usuario.
- **Microinteracciones:** Incluye animaciones fluidas (curvas *cubic-bezier*) al hacer hover, al abrir el panel de chat (animación `chatSlideIn`) y estados de carga estilizados mientras espera la respuesta de la IA.

---

## 2. Contrato Estructural (JSON Payload)

Para que el motor Angular levante e instancie este componente, el JSON proveniente del backend o del editor web debe incluir un bloque tipo `ai-chat` con la siguiente interfaz:

```json
{
  "type": "ai-chat",
  "data": {
    "floatingPosition": "bottom-right",
    "buttonIcon": "🤖",
    "buttonColor": "var(--primaryColor)",
    "chatTitle": "Asistente Virtual IA",
    "welcomeMessage": "¡Hola! Soy el asistente virtual del negocio. ¿Cómo puedo ayudarte hoy?",
    "endpointUrl": "https://api.tu-saas.com/v1/tenant-id/chat-bot",
    "placeholderText": "Escribe tu duda o consulta..."
  }
}
```

### Diccionario de Propiedades (`data`)

| Propiedad | Tipo | Requerido | Descripción |
| :--- | :--- | :---: | :--- |
| `endpointUrl` | `string` | **Sí** | La URL absoluta hacia donde el componente enviará las consultas del usuario vía POST. |
| `floatingPosition` | `string` | No | Controla la esquina de anclaje. Valores permitidos: `"bottom-right"`, `"bottom-left"`, `"top-right"`, `"top-left"`. Por defecto: `"bottom-right"`. |
| `buttonIcon` | `string` | No | El emoji o texto corto que actúa como icono en el botón circular. Por defecto: `💬`. |
| `buttonColor` | `string` | No | Fuerza un color de fondo para el botón y detalles. Se recomienda delegarlo a `var(--primaryColor)` para heredar el tema del tenant. |
| `chatTitle` | `string` | No | Título visible en la cabecera del panel de chat. Por defecto: `"AI Assistant"`. |
| `welcomeMessage` | `string` | No | El primer mensaje (enviado por el "bot") que aparecerá automáticamente cargado en el historial. |
| `placeholderText` | `string` | No | Texto descriptivo en la barra de escritura antes de teclear. |

---

## 3. Integración con la API Backend

El componente gestiona el estado de peticiones web usando `HttpClient` nativo de Angular. Esta es la arquitectura de comunicación red a tener en cuenta por el equipo de Backend:

### Flujo de la Petición
Cuando el usuario final teclea un mensaje y envía el formulario:

**1. Petición (Request):** El componente realiza de forma incondicional un `POST` HTTP al `endpointUrl` estipulado, inyectando un body JSON plano con la pregunta del usuario:
```http
POST /v1/tenant-id/chat-bot
Content-Type: application/json

{
  "message": "Quiero reservar mesa para dos este viernes."
}
```

**2. Estado de Carga (Loading State):** 
Durante la espera de la resolución de la promesa HTTP, la interfaz de usuario inhabilita la caja de texto, bloquea el botón de envío y muestra burbujas de "puntos suspensivos" (`...`) en el lateral de la IA indicando que "*El bot está escribiendo*".

**3. Respuesta Esperada (Response):**
El backend IA debe procesar el texto y devolver un JSON. El componente buscará prioritariamente la clave `reply` (o subsidiariamente `message`) en el nivel raíz de la respuesta:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "reply": "¡Claro! Disponemos de varias mesas libres este viernes. ¿Sobre qué hora os gustaría cenar?"
}
```

En caso de error en la red temporal (estado *timeout* o *5xx*), el componente insertará un mensaje automático amistoso para notificar al visitante sin romper el flujo de la aplicación.

---

## 4. Personalización Avanzada (CSS Interno)

Si deseas modificar su apariencia más allá del objeto JSON, estos son los nombres de variables CSS clave que el bloque asimila de su contexto global:

*   `--chat-theme`: El color principal del widget (deriva de `data.buttonColor`).
*   `--surfaceColor`: Da color a la caja de input de texto y la zona gris de mensajes para no ser un blanco puro estridente.
*   `--textColor`: Controla el color del texto en las respuestas de la IA.