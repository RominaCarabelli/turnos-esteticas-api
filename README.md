# Agenda de Turnos

API REST desarrollada con Node.js, Express, Sequelize y MySQL para gestionar los turnos de profesionales de servicios de estética.

## Funcionalidades principales

- Registro e inicio de sesión de profesionales.
- Autenticación mediante sesiones.
- Encriptación de contraseñas con bcrypt.
- Gestión de servicios profesionales.
- Gestión de turnos: creación, consulta, edición y cancelación.
- Validación de datos de entrada.
- Prevención de superposición de turnos.
- Protección de rutas privadas y separación de datos por profesional.
- Limitación de intentos de inicio de sesión y registro.

## Tecnologías utilizadas

- Node.js
- Express
- MySQL
- Sequelize
- bcrypt
- express-session
- express-validator
- express-rate-limit
- connect-session-sequelize

## Requisitos previos

Antes de ejecutar el proyecto, necesitás tener instalado:

- Node.js
- pnpm
- MySQL

## Instalación

1. Clonar el repositorio de GitHub.
2. Ingresar a la carpeta del proyecto.
3. Instalar las dependencias:

```bash
pnpm install
```

4. Crear un archivo `.env` en la raíz del proyecto, tomando como referencia `.env.example`.
5. Configurar las variables de entorno con los datos de conexión a MySQL y una clave secreta para las sesiones.

## Variables de entorno

El archivo `.env` debe incluir las siguientes variables:

| Variable | Descripción |
|---|---|
| `PORT` | Puerto en el que se ejecuta la API. |
| `DB_HOST` | Servidor de MySQL. |
| `DB_PORT` | Puerto de MySQL. |
| `DB_NAME` | Nombre de la base de datos. |
| `DB_USER` | Usuario de MySQL. |
| `DB_PASSWORD` | Contraseña de MySQL. |
| `SESSION_SECRET` | Clave secreta para las sesiones. |
| `NODE_ENV` | Entorno de ejecución. |

**Importante:** no publiques el archivo `.env`, ya que contiene información privada.

## Ejecución

Para iniciar el servidor en modo desarrollo:

```bash
pnpm dev
```

Para iniciar el servidor normalmente:

```bash
pnpm start
```

## Endpoints

Todas las rutas están disponibles bajo el prefijo `/api`.

### Autenticación

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| POST | `/api/auth/register` | Registrar un profesional e iniciar sesión. | Público |
| POST | `/api/auth/login` | Iniciar sesión. | Público |
| POST | `/api/auth/logout` | Cerrar sesión. | Sesión |
| GET | `/api/auth/me` | Obtener los datos del profesional autenticado. | Sesión |

### Servicios

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/services` | Listar servicios del profesional. | Sesión |
| GET | `/api/services/:id` | Obtener un servicio por ID. | Sesión |
| POST | `/api/services` | Crear un servicio. | Sesión |
| PUT | `/api/services/:id` | Actualizar un servicio. | Sesión |
| DELETE | `/api/services/:id` | Desactivar un servicio. | Sesión |

### Turnos

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/appointments` | Listar los turnos del profesional. | Sesión |
| GET | `/api/appointments/:id` | Obtener un turno por ID. | Sesión |
| POST | `/api/appointments` | Crear un turno. | Sesión |
| PUT | `/api/appointments/:id` | Actualizar un turno. | Sesión |
| DELETE | `/api/appointments/:id` | Cancelar un turno. | Sesión |

### Respuestas y validaciones

- `200 OK`: solicitud procesada correctamente.
- `201 Created`: recurso creado correctamente.
- `400 Bad Request`: datos inválidos o solicitud incorrecta.
- `401 Unauthorized`: falta una sesión válida o las credenciales son incorrectas.
- `404 Not Found`: recurso inexistente o que no pertenece al profesional autenticado.
- `409 Conflict`: conflicto con un turno existente.
- `500 Internal Server Error`: error interno del servidor.

Las rutas privadas requieren una sesión válida. Cada profesional solo puede acceder a sus propios servicios y turnos.

## Ejemplos de uso

Las solicitudes se pueden realizar desde Postman u otra herramienta compatible con HTTP.

### Registrar un profesional

**Método:** `POST`

**Endpoint:** `/api/auth/register`

**Body (JSON):**

```json
{
  "name": "Profesional de prueba",
  "email": "profesional@example.com",
  "password": "Prueba1234",
  "confirmPassword": "Prueba1234",
  "workMode": "independent",
  "activityIds": [1]
}
```

El registro crea la cuenta e inicia la sesión del profesional.

### Iniciar sesión

**Método:** `POST`

**Endpoint:** `/api/auth/login`

**Body (JSON):**

```json
{
  "email": "profesional@example.com",
  "password": "Prueba1234"
}
```

### Crear un servicio

**Método:** `POST`

**Endpoint:** `/api/services`

**Body (JSON):**

```json
{
  "name": "Lifting de pestañas",
  "description": "Servicio de lifting de pestañas"
}
```

Requiere una sesión válida.

### Crear un turno

**Método:** `POST`

**Endpoint:** `/api/appointments`

**Body (JSON):**

```json
{
  "clientName": "Cliente de prueba",
  "clientPhone": "1123456789",
  "serviceId": null,
  "serviceName": "Lifting de pestañas",
  "startAt": "2026-10-28T09:00:00-03:00",
  "durationMinutes": 60
}
```

La fecha debe incluir la zona horaria. Si se selecciona un servicio existente, se puede enviar su `serviceId`; si no, se debe indicar `serviceName`.

### Estados de los turnos

Los estados permitidos son:

- `pending`: pendiente.
- `confirmed`: confirmado.
- `completed`: completado.
- `cancelled`: cancelado.

La cancelación se realiza mediante `DELETE` y conserva el registro del turno.

## Pruebas con Postman

Para probar la API:

1. Iniciar el servidor con `pnpm dev`.
2. Importar la colección de Postman del proyecto, una vez exportada.
3. Registrar un profesional o iniciar sesión con una cuenta existente.
4. Enviar las solicitudes a los endpoints de autenticación, servicios y turnos.
5. Verificar los códigos HTTP y los mensajes de respuesta.

### Casos verificados

- Registro e inicio de sesión con credenciales válidas.
- Rechazo de credenciales incorrectas.
- Cierre de sesión y bloqueo de rutas protegidas sin sesión.
- Validación de campos obligatorios y formatos incorrectos.
- Limitación de intentos de inicio de sesión y registro.
- Separación de los datos entre profesionales.
- Rechazo de servicios inexistentes, inactivos o pertenecientes a otro profesional.
- Prevención de superposición de turnos.
- Cancelación lógica de turnos y conservación del registro.
- Rechazo de modificaciones de turnos cancelados.

La colección de Postman debe incluir ejemplos de solicitudes y permitir reproducir las pruebas de la API.

