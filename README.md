# Agenda de Turnos

API REST desarrollada con Node.js, Express, Sequelize y MySQL para gestionar los turnos de profesionales de servicios de estética.

## Funcionalidades principales

- Registro e inicio de sesión de profesionales.
- Autenticación mediante sesiones.
- Protección de contraseñas mediante bcrypt.
- Gestión de servicios profesionales.
- Gestión de turnos: creación, consulta, edición y cancelación.
- Validación de datos de entrada.
- Prevención de superposición de turnos.
- Protección de rutas privadas y separación de datos por profesional.
- Limitación de intentos de inicio de sesión y registro.
- Desactivación de servicios sin eliminar sus registros.
- Cancelación lógica de turnos, conservando su historial.

## Tecnologías utilizadas

- Node.js
- Express
- MySQL
- Sequelize
- bcrypt
- express-session
- connect-session-sequelize
- express-validator
- express-rate-limit

## Requisitos previos

Antes de ejecutar el proyecto, necesitás tener instalado:

- Node.js
- pnpm
- MySQL

## Estructura del proyecto

```text
BACKEND_TPFINAL/
├── index.js
├── .env.example
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
└── src/
    ├── app.js
    ├── config/
    ├── controllers/
    ├── middlewares/
    ├── models/
    ├── routes/
    └── services/
```

- `config/`: configuración de la base de datos, sesiones e inicialización de datos.
- `controllers/`: recepción y respuesta de las solicitudes HTTP.
- `middlewares/`: autenticación, validaciones y manejo de errores.
- `models/`: modelos de Sequelize y relaciones entre entidades.
- `routes/`: definición de los endpoints.
- `services/`: lógica de negocio y operaciones sobre los datos.
- `index.js`: inicialización de la aplicación y conexión con la base de datos.

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

**Importante:** no publiques el archivo `.env`, ya que contiene información privada. El archivo `.env.example` sirve como referencia y no debe contener credenciales reales.

## Ejecución

Para iniciar el servidor en modo desarrollo:

```bash
pnpm dev
```

Para iniciar el servidor normalmente:

```bash
pnpm start
```

Si la configuración es correcta, la aplicación se conectará a MySQL, preparará las tablas y los datos iniciales y comenzará a escuchar en el puerto configurado.

## Modelo de datos

La aplicación utiliza MySQL y Sequelize para administrar las entidades principales:

- **User:** representa al profesional registrado.
- **ProfessionalActivity:** contiene el catálogo de actividades profesionales.
- **UserProfessionalActivity:** relaciona profesionales con sus actividades.
- **Service:** almacena los servicios de cada profesional.
- **Appointment:** almacena los turnos y su información.

Los profesionales pueden tener varios servicios y turnos. Cada servicio y turno pertenece a un profesional, y los datos se aíslan para que cada cuenta acceda únicamente a sus propios registros.

Un turno puede estar asociado a un servicio existente o guardar el nombre de un servicio indicado para esa ocasión.

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
| GET | `/api/services` | Listar los servicios del profesional. | Sesión |
| GET | `/api/services/:id` | Obtener un servicio por ID. | Sesión |
| POST | `/api/services` | Crear un servicio. | Sesión |
| PUT | `/api/services/:id` | Actualizar un servicio. | Sesión |
| DELETE | `/api/services/:id` | Desactivar un servicio. | Sesión |

Los nombres de servicios activos no se pueden duplicar para un mismo profesional. Distintos profesionales pueden tener servicios con el mismo nombre. Los servicios desactivados no se eliminan físicamente.

### Turnos

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/appointments` | Listar los turnos del profesional. | Sesión |
| GET | `/api/appointments/:id` | Obtener un turno por ID. | Sesión |
| POST | `/api/appointments` | Crear un turno. | Sesión |
| PUT | `/api/appointments/:id` | Actualizar un turno. | Sesión |
| DELETE | `/api/appointments/:id` | Cancelar un turno. | Sesión |

La API evita la superposición de turnos para un mismo profesional. Los turnos cancelados se conservan en la base de datos y dejan de bloquear el horario correspondiente.

### Respuestas HTTP

- `200 OK`: solicitud procesada correctamente.
- `201 Created`: recurso creado correctamente.
- `400 Bad Request`: datos inválidos o solicitud incorrecta.
- `401 Unauthorized`: falta una sesión válida o las credenciales son incorrectas.
- `404 Not Found`: recurso inexistente o que no pertenece al profesional autenticado.
- `409 Conflict`: conflicto con un turno existente o un servicio duplicado.
- `500 Internal Server Error`: error interno del servidor.

Las rutas privadas requieren una sesión válida. Cada profesional solo puede acceder a sus propios servicios y turnos.

## Autenticación y sesiones

La autenticación utiliza sesiones administradas mediante `express-session`, con almacenamiento en MySQL a través de `connect-session-sequelize`.

- Las contraseñas se almacenan mediante hash con bcrypt.
- Las sesiones tienen una duración máxima configurada de 24 horas.
- Las cookies de sesión utilizan `HttpOnly` y `SameSite=none`.
- En producción, la cookie se configura como segura mediante HTTPS.
- Las rutas privadas verifican que exista una sesión válida.

## Ejemplos de uso

Las solicitudes se pueden realizar desde Postman u otra herramienta compatible con HTTP. Los ejemplos siguientes utilizan datos ficticios.

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

El registro crea la cuenta e inicia la sesión del profesional. Los identificadores de actividades deben corresponder a registros existentes en la base de datos.

Para profesionales que trabajan en un salón, se debe proporcionar el nombre del salón. Si se selecciona la actividad personalizada «Otra», también se debe indicar la actividad correspondiente.

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

El campo `durationMinutes` representa la duración del turno en minutos.

### Estados de los turnos

Los estados permitidos son:

- `pending`: pendiente.
- `confirmed`: confirmado.
- `completed`: completado.
- `cancelled`: cancelado.

La cancelación se realiza mediante `DELETE` y conserva el registro del turno.

## Pruebas con Postman

Para probar la API:

1. Instalar las dependencias con `pnpm install`.
2. Configurar el archivo `.env`.
3. Iniciar el servidor con `pnpm dev`.
4. Importar la colección exportada de Postman.
5. Registrar un profesional o iniciar sesión con una cuenta existente.
6. Enviar las solicitudes a los endpoints de autenticación, servicios y turnos.
7. Verificar los códigos HTTP y los mensajes de respuesta.

### Casos probados

- Registro e inicio de sesión con credenciales válidas.
- Rechazo de credenciales incorrectas.
- Cierre de sesión y bloqueo de rutas protegidas sin sesión.
- Validación de campos obligatorios y formatos incorrectos.
- Limitación de intentos de inicio de sesión y registro.
- Separación de los datos entre profesionales.
- Rechazo de servicios inexistentes, inactivos o pertenecientes a otro profesional.
- Prevención de superposición de turnos.
- Rechazo de servicios duplicados activos para un mismo profesional.
- Posibilidad de crear un servicio después de desactivar otro con el mismo nombre.
- Cancelación lógica de turnos y conservación del registro.
- Rechazo de modificaciones de turnos cancelados.

La colección exportada de Postman permite reproducir las solicitudes utilizadas durante las pruebas.

## Seguridad y archivos excluidos

El archivo `.gitignore` excluye los siguientes elementos:

- `node_modules/`
- `.env`
- `.DS_Store`

El archivo `.env` no debe publicarse en el repositorio, ya que contiene credenciales y claves privadas.

## Despliegue

La API está desplegada en Render y utiliza una base de datos MySQL alojada en Aiven.

- **URL de la API:** https://turnos-esteticas-api.onrender.com
- **Base de datos:** MySQL en Aiven.
- **Frontend:** https://rominacarabelli.github.io/turnos-esteticas-frontend/

Para ejecutar la API en producción, Render utiliza las variables de entorno configuradas en el servicio. Las credenciales de conexión y la clave secreta de las sesiones se mantienen fuera del repositorio.

La ruta raíz (`/`) permite comprobar que la API está funcionando. Los endpoints de autenticación, servicios y turnos están disponibles bajo el prefijo `/api`.

## Colección de Postman

En la carpeta `postman/` se encuentra la colección exportada de Postman, que permite importar y ejecutar las solicitudes utilizadas para probar los endpoints de la API.