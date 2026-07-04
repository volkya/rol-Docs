# Rol Docs

A full-stack web app for creating and managing **RPG character sheets**: backstory, physical/psychological descriptions, stats, and portrait images.

Built for the Spanish-speaking tabletop RPG community, this repository is a monolithic Express app with Handlebars views and MongoDB persistence. Docker Compose is included so anyone can clone the repo and run the project without installing databases or system-level dependencies.

## Features

- **Character sheet management** — Create, edit, and delete characters with attributes, backstory, and stats
- **Image uploads** — Local storage or Cloudinary (configurable via `.env`)
- **Authentication** — Email/password sign-up and sign-in (Passport local strategy)
- **Protected routes** — Only authenticated users can access character sheets
- **Light/dark theme** — Toggle with `localStorage` persistence
- **Docker Compose** — App + MongoDB ready with a single command

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Backend | Express |
| Frontend | Handlebars, Bootstrap 4 |
| Database | MongoDB, Mongoose |
| Authentication | Passport (local strategy), bcryptjs |
| Sessions | express-session, connect-flash |
| Images | Multer, Cloudinary (optional) |
| Containers | Docker, Docker Compose |

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- **Docker** and **Docker Compose** (recommended for MongoDB and full-stack deployment)

### Installation

```bash
git clone https://github.com/Volkya/rol-Docs.git
cd rol-Docs
cp .env.example .env
npm install
```

## Running the Application

There are two ways to run the project:

### Option A — Local development (recommended)

MongoDB in Docker, app on your machine with hot-reload.

**Terminal 1 — database:**

```bash
npm run db
# or in the background: npm run db:up
```

**Terminal 2 — application:**

```bash
npm run dev
```

- App → [http://localhost:2000](http://localhost:2000)
- MongoDB → `mongodb://localhost:27017`
- MongoDB Compass → connect to `mongodb://localhost:27017`, database `rolDocs`

> Do not run full `docker compose up` and `npm run dev` at the same time — both bind to port `2000`.

### Option B — Full Docker stack (ideal for cloning the repo)

No need to install Node or MongoDB on the host.

```bash
cp .env.example .env
docker compose up --build
```

- App → [http://localhost:2000](http://localhost:2000)
- MongoDB → exposed on `localhost:27017`

Docker Compose loads your `.env` via `env_file`. Only `MONGODB_URI` is overridden internally to `mongodb://mongodb:27017/rolDocs`, because inside the container the database host is the `mongodb` service, not `localhost`.

## Authentication

Authentication uses **Passport** with a local strategy (email + password):

1. **Sign up** (`POST /users/signup`) — Creates a user with a bcrypt-hashed password
2. **Sign in** (`POST /users/signin`) — Validates credentials and opens a session
3. **Session** — `express-session` keeps the user logged in (`req.user`)
4. **Protection** — `isAuthenticated` middleware guards all `/files/*` routes
5. **Logout** (`GET /users/logout`) — Destroys the session and redirects home

The navbar adapts to session state: guests see **Sign in / Sign up**; logged-in users see **My sheets / New sheet / Log out**.

## Image Uploads

Character images are handled with **Multer** (temporary disk storage) and then:

| Configuration | Behavior |
|---------------|----------|
| `CLOUDINARY_*` set | Uploads to Cloudinary (`rolDocs` folder) and stores `imageURL` + `public_id` in MongoDB |
| No Cloudinary | Saves to `src/public/uploads/` and uses a local URL (`/uploads/...`) |

Only image files are accepted (jpg, png, webp, etc.), max **5 MB**.

### Setting up Cloudinary

1. Create an account at [cloudinary.com](https://cloudinary.com)
2. Copy **Cloud name**, **API Key**, and **API Secret** from the dashboard
3. Add them to `.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Restart the app (`npm run dev` or `docker compose restart app`)

## Environment Variables

Copy `.env.example` to `.env` in the project root:

| Variable | Example | Description |
|----------|---------|-------------|
| `PORT` | `2000` | Express server port |
| `MONGODB_URI` | `mongodb://localhost:27017/rolDocs` | MongoDB connection URI (local in dev) |
| `SESSION_SECRET` | `a-long-random-secret` | Secret for signing session cookies |
| `CLOUDINARY_CLOUD_NAME` | `my-cloud` | Optional — Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | `123456789` | Optional — Cloudinary API key |
| `CLOUDINARY_API_SECRET` | `abc123` | Optional — Cloudinary API secret |

## Routes Reference

The app is **server-rendered** (no JSON REST API). Main routes:

### Public

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Landing page |
| `GET` | `/about` | About the app |

### Authentication

| Method | Path | Body / Params | Description |
|--------|------|---------------|-------------|
| `GET` | `/users/signup` | — | Sign-up form |
| `POST` | `/users/signup` | `username`, `email`, `password`, `confirm_password` | Create account |
| `GET` | `/users/signin` | — | Sign-in form |
| `POST` | `/users/signin` | `email`, `password` | Log in |
| `GET` | `/users/logout` | — | Log out (requires auth) |

### Character sheets (auth required)

| Method | Path | Body / Params | Description |
|--------|------|---------------|-------------|
| `GET` | `/files` | — | List all sheets |
| `GET` | `/files/add` | — | New sheet form |
| `POST` | `/files/add` | `multipart/form-data` + character fields | Create sheet |
| `GET` | `/files/edit/:id` | — | Edit form |
| `PUT` | `/files/edit/:id` | `multipart/form-data` + character fields | Update sheet |
| `DELETE` | `/files/delete/:id` | `_method=DELETE` | Delete sheet |

## Project Structure

```
rol-Docs/
├── src/
│   ├── app.js              # Express entry point
│   ├── database.js         # MongoDB connection
│   ├── keys.js             # Environment config
│   ├── config/
│   │   ├── passport.js     # Authentication strategy
│   │   └── multer.js       # File upload config
│   ├── helpers/
│   │   ├── auth.js         # isAuthenticated / isGuest middleware
│   │   └── upload.js       # Cloudinary / local upload logic
│   ├── models/
│   │   ├── user.js         # User schema
│   │   └── file.js         # Character sheet schema
│   ├── routes/
│   │   ├── index.js        # Public routes
│   │   ├── users.js        # Auth routes
│   │   └── files.js        # Character sheet CRUD
│   ├── views/              # Handlebars templates
│   └── public/             # CSS, JS, and local uploads
├── docker-compose.yml      # App + MongoDB
├── Dockerfile
├── .env.example
└── package.json
```

## Scripts

```bash
npm run dev      # Local app with nodemon (hot-reload)
npm start        # Production
npm run db       # MongoDB only in Docker (foreground)
npm run db:up    # MongoDB only in Docker (background)
npm run db:down  # Stop MongoDB container
```

## Roadmap

Planned features (models already defined, routes pending):

- Character chronologies
- Relationship maps between characters
- In-character chat

## Core Philosophy

Keep the app **simple and focused** for tabletop RPG players. Each sheet centralizes all character info in one place, without clutter. Every improvement should prioritize clarity and usability over unnecessary complexity.

---

Built with curiosity by [@Dyma](https://github.com/Volkya)
