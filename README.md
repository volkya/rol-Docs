# Rol Docs

Aplicación full-stack para crear y gestionar **fichas de personaje de rol** (RPG): historia, descripción física/psicológica, estadísticas e imagen de cada PJ.

Pensada para la comunidad hispana de rol, este repositorio contiene una app monolítica con servidor Express, vistas Handlebars y persistencia en MongoDB. Incluye Docker Compose para que cualquiera pueda clonar el repo y levantar el proyecto sin instalar bases de datos ni dependencias del sistema.

## Features

- **Gestión de fichas** — Crear, editar y eliminar personajes con atributos, historia y stats
- **Subida de imágenes** — Almacenamiento local o Cloudinary (configurable vía `.env`)
- **Autenticación** — Registro e inicio de sesión con email y contraseña (Passport local)
- **Rutas protegidas** — Solo usuarios autenticados acceden a las fichas
- **Tema claro/oscuro** — Toggle con persistencia en `localStorage`
- **Docker Compose** — App + MongoDB listos con un solo comando

## Tech Stack

| Capa | Tecnología |
|------|------------|
| Runtime | Node.js |
| Backend | Express |
| Frontend | Handlebars, Bootstrap 4 |
| Base de datos | MongoDB, Mongoose |
| Autenticación | Passport (local strategy), bcryptjs |
| Sesiones | express-session, connect-flash |
| Imágenes | Multer, Cloudinary (opcional) |
| Contenedores | Docker, Docker Compose |

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- **Docker** y **Docker Compose** (recomendado para MongoDB y despliegue completo)

### Installation

```bash
git clone https://github.com/Volkya/rol-Docs.git
cd rol-Docs
cp .env.example .env
npm install
```

## Running the Application

Hay dos formas de trabajar con el proyecto:

### Opción A — Desarrollo local (recomendada)

MongoDB en Docker, app en tu máquina con hot-reload.

**Terminal 1 — base de datos:**

```bash
npm run db
# o en segundo plano: npm run db:up
```

**Terminal 2 — aplicación:**

```bash
npm run dev
```

- App → [http://localhost:2000](http://localhost:2000)
- MongoDB → `mongodb://localhost:27017`
- Compass / cliente MongoDB → conectar a `mongodb://localhost:27017`, base de datos `rolDocs`

> No ejecutes `docker compose up` completo y `npm run dev` a la vez: ambos usan el puerto `2000`.

### Opción B — Todo con Docker (ideal para quien clona el repo)

Sin instalar Node ni MongoDB en el host.

```bash
cp .env.example .env
docker compose up --build
```

- App → [http://localhost:2000](http://localhost:2000)
- MongoDB → expuesto en `localhost:27017`

Docker Compose carga tu `.env` con `env_file`. Solo `MONGODB_URI` se sobreescribe internamente a `mongodb://mongodb:27017/rolDocs`, porque dentro del contenedor el host de la DB es el servicio `mongodb`, no `localhost`.

## Authentication

El flujo de autenticación usa **Passport** con estrategia local (email + contraseña):

1. **Registro** (`POST /users/signup`) — Crea un usuario con contraseña hasheada (bcrypt)
2. **Login** (`POST /users/signin`) — Valida credenciales y abre sesión
3. **Sesión** — `express-session` mantiene al usuario logueado (`req.user`)
4. **Protección** — Middleware `isAuthenticated` bloquea rutas `/files/*`
5. **Logout** (`GET /users/logout`) — Cierra la sesión y redirige al inicio

La UI adapta el navbar según el estado de sesión: visitantes ven **Iniciar sesión / Registrarse**; usuarios logueados ven **Mis fichas / Nueva ficha / Cerrar sesión**.

## Image Uploads

Las imágenes de las fichas se procesan con **Multer** (disco temporal) y luego:

| Configuración | Comportamiento |
|---------------|----------------|
| `CLOUDINARY_*` definidas | Sube a Cloudinary (carpeta `rolDocs`) y guarda `imageURL` + `public_id` en MongoDB |
| Sin Cloudinary | Guarda en `src/public/uploads/` y usa URL local (`/uploads/...`) |

Solo se aceptan imágenes (jpg, png, webp, etc.), máximo **5 MB**.

### Configurar Cloudinary

1. Crear cuenta en [cloudinary.com](https://cloudinary.com)
2. Copiar **Cloud name**, **API Key** y **API Secret** del dashboard
3. Agregarlos al `.env`:

```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

4. Reiniciar la app (`npm run dev` o `docker compose restart app`)

## Environment Variables

Copia `.env.example` a `.env` en la raíz del proyecto:

| Variable | Ejemplo | Descripción |
|----------|---------|-------------|
| `PORT` | `2000` | Puerto del servidor Express |
| `MONGODB_URI` | `mongodb://localhost:27017/rolDocs` | URI de MongoDB (local en dev) |
| `SESSION_SECRET` | `un-secreto-largo` | Secreto para firmar cookies de sesión |
| `CLOUDINARY_CLOUD_NAME` | `mi-cloud` | Opcional — nombre del cloud en Cloudinary |
| `CLOUDINARY_API_KEY` | `123456789` | Opcional — API key de Cloudinary |
| `CLOUDINARY_API_SECRET` | `abc123` | Opcional — API secret de Cloudinary |

## Routes Reference

La app es **server-rendered** (no expone API REST JSON). Las rutas principales:

### Públicas

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Landing page |
| `GET` | `/about` | Acerca de la app |

### Autenticación

| Método | Ruta | Body / Params | Descripción |
|--------|------|---------------|-------------|
| `GET` | `/users/signup` | — | Formulario de registro |
| `POST` | `/users/signup` | `username`, `email`, `password`, `confirm_password` | Crear cuenta |
| `GET` | `/users/signin` | — | Formulario de login |
| `POST` | `/users/signin` | `email`, `password` | Iniciar sesión |
| `GET` | `/users/logout` | — | Cerrar sesión (requiere auth) |

### Fichas de personaje (requieren auth)

| Método | Ruta | Body / Params | Descripción |
|--------|------|---------------|-------------|
| `GET` | `/files` | — | Listado de fichas |
| `GET` | `/files/add` | — | Formulario nueva ficha |
| `POST` | `/files/add` | `multipart/form-data` + campos del personaje | Crear ficha |
| `GET` | `/files/edit/:id` | — | Formulario de edición |
| `PUT` | `/files/edit/:id` | `multipart/form-data` + campos | Actualizar ficha |
| `DELETE` | `/files/delete/:id` | `_method=DELETE` | Eliminar ficha |

## Project Structure

```
rol-Docs/
├── src/
│   ├── app.js              # Punto de entrada Express
│   ├── database.js         # Conexión MongoDB
│   ├── keys.js             # Variables de entorno
│   ├── config/
│   │   ├── passport.js     # Estrategia de autenticación
│   │   └── multer.js       # Configuración de subida de archivos
│   ├── helpers/
│   │   ├── auth.js         # Middlewares isAuthenticated / isGuest
│   │   └── upload.js       # Lógica Cloudinary / local
│   ├── models/
│   │   ├── user.js         # Schema de usuario
│   │   └── file.js         # Schema de ficha de personaje
│   ├── routes/
│   │   ├── index.js        # Rutas públicas
│   │   ├── users.js        # Auth
│   │   └── files.js        # CRUD de fichas
│   ├── views/              # Plantillas Handlebars
│   └── public/             # CSS, JS y uploads locales
├── docker-compose.yml      # App + MongoDB
├── Dockerfile
├── .env.example
└── package.json
```

## Scripts

```bash
npm run dev      # App local con nodemon (hot-reload)
npm start        # Producción
npm run db       # Solo MongoDB en Docker (foreground)
npm run db:up    # Solo MongoDB en Docker (background)
npm run db:down  # Detener contenedor de MongoDB
```

## Roadmap

Funcionalidades planificadas (modelos ya definidos, rutas pendientes):

- Cronologías de personaje
- Mapa de relaciones entre personajes
- Chat de rol

## Core Philosophy

Mantener la app **simple y funcional** para jugadores de rol hispanohablantes. Cada ficha concentra la información del personaje en un solo lugar, sin distracciones. Las contribuciones y mejoras deben priorizar claridad y usabilidad por sobre complejidad innecesaria.

---

Built with curiosity by [@Dyma](https://github.com/Volkya)
