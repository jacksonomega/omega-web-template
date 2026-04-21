# Guía del Componente: Asistente IA a Pantalla Completa (`ai-chat-page`)

El bloque `ai-chat-page` es un componente de interfaz inmersiva diseñado para ocupar toda la pantalla (al estilo de ChatGPT o Claude). A diferencia del botón flotante (`ai-chat`), este bloque está pensado para ser el componente único o principal dentro de una página dedicada (por ejemplo, `/asistente`), ofreciendo un espacio de trabajo sin distracciones para consultas profundas.

## 1. Propósito y Comportamiento Visual

- **Experiencia Inmersiva (Full-Screen):** Ocupa automáticamente el alto disponible del navegador (descontando el header global de la aplicación) mediante `calc(100vh - 80px)`.
- **Adaptabilidad Dark/Light Mode:** El diseño respeta firmemente la configuración del Tenant. Detecta e integra inteligentemente `var(--bgColor)` y `var(--surfaceColor)`, funcionando perfecto tanto en paletas claras (fondos blancos) como oscuras (fondos negros/grises oscuros).
- **Responsividad (Mobile First):** En dispositivos móviles (pantallas menores a 768px), la barra lateral (Sidebar) se oculta automáticamente para maximizar el área de lectura y escritura de mensajes.
- **Input "Sticky":** La caja de texto para escribir permanece anclada en la parte inferior de la pantalla con un sutil gradiente semi-transparente que oculta los mensajes subyacentes, logrando el mismo acabado *premium* que las apps nativas de IA.

---

## 2. Contrato Estructural (JSON Payload)

Para generar esta vista en el flujo del *Server-Driven UI*, el backend debe inyectar este bloque preferiblemente como único elemento (o primero) dentro de una ruta.

```json
{
  "type": "ai-chat-page",
  "data": {
    "title": "Nuevo Chat",
    "subtitle": "Asesoramiento Legal Inteligente",
    "welcomeMessage": "Soy tu asistente legal virtual. ¿Sobre qué ley o caso quieres que busquemos hoy?",
    "assistantName": "LexBot",
    "assistantAvatar": "https://ui-avatars.com/api/?name=LB&background=10b981&color=fff",
    "userAvatar": "https://ui-avatars.com/api/?name=U&background=f3f4f6&color=333",
    "endpointUrl": "https://api.tu-saas.com/v1/tenant-id/chat-full",
    "placeholderText": "Redacta de forma clara tu consulta legal..."
  }
}
```

### Diccionario de Propiedades (`data`)

| Propiedad | Tipo | Requerido | Descripción |
| :--- | :--- | :---: | :--- |
| `endpointUrl` | `string` | **Sí** | La URL del backend IA que recibirá las peticiones POST y devolverá el texto de respuesta. |
| `title` | `string` | No | Texto principal del botón lateral para limpiar o iniciar una nueva conversación. Por defecto: `"Nuevo Chat"`. |
| `subtitle` | `string` | No | Pequeño texto inferior en el sidebar para contextualizar (Ej: "Abogados Asociados" o "Soporte V2"). |
| `welcomeMessage` | `string` | No | El mensaje inicial pre-cargado enviado por el bot al entrar a la página. |
| `assistantName` | `string` | No | Nombre de la entidad inteligente que encabeza cada burbuja de respuesta. Por defecto: `"Asistente IA"`. |
| `assistantAvatar`| `string` | No | URL estática de la imagen (preferible cuadrada de 32x32px) para el icono del bot. |
| `userAvatar` | `string` | No | URL estática de la imagen para el icono del usuario/visitante. |
| `placeholderText`| `string` | No | Texto de incitación a la escritura en el input inferior. |
| `primaryColor` | `string` | No | Color principal personalizado (botones, bordes activos). |
| `bgColor` | `string` | No | Color de fondo general. |
| `surfaceColor` | `string` | No | Color de fondo secundario (sidebar, inputs, mensajes bot). |
| `textColor` | `string` | No | Color del texto principal. |

---

## 3. Integración con la API Backend (Comportamiento)

Al igual que su contraparte flotante, la mecánica de red es la misma.

1. **Petición (POST):** Cada vez que el visitante pulsa enter o hace click en enviar.
```http
POST /v1/tenant-id/chat-full
Content-Type: application/json

{
  "message": "Texto tecleado por el usuario"
}
```

2. **Respuesta (JSON Esperado):** El componente se queda en estado `isLoading()` (fase "Pensando...") hasta que recibe respuesta. Busca la clave `reply` (o `message`).
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "reply": "Respuesta procesada desde tu modelo de IA."
}
```

## 4. Personalización Avanzada (Sistema Custom Properties)

Gracias al *Tenant Engine*, todo el aspecto se hereda mágicamente desde la configuración global del cliente.

- `--bgColor`: Tiñe el fondo donde descansan los mensajes de los usuarios y la zona de escritura. Crucial para admitir sitios con estéticas oscuras puras (`#000000`) o claras absolutas (`#ffffff`).
- `--surfaceColor`: Utilizado para destacar la barra lateral (Sidebar), las respuestas del bot y el marco protector del input de texto.
- `--primaryColor`: Pinta el fondo del botón de enviar, el botón "Nuevo Chat" de la barra lateral, y subraya con color la caja de texto al estar activa (`:focus-within`).
- `--textColor` / `--textMutedColor`: Permiten leer perfectamente sin importar la luminosidad del Tenant.