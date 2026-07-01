# Rol Docs

App full-stack para crear y gestionar **fichas de personaje de rol**: historia, descripción física/psicológica, estadísticas e imagen.

## Stack

| Capa | Tecnología |
|------|------------|
| Backend | Node.js, Express |
| Frontend | Handlebars, Bootstrap |
| Base de datos | MongoDB, Mongoose |
| Auth | Passport (local) |
| Imágenes | Multer (local) o Cloudinary (opcional) |

## Desarrollo local (recomendado mientras programás)

MongoDB en Docker, app en tu máquina con hot-reload.

**Terminal 1 — base de datos:**

```bash
npm run db
# o en segundo plano: npm run db:up
```

**Terminal 2 — app:**

```bash
cp .env.example .env   # solo la primera vez
npm install
npm run dev
```

Abrí [http://localhost:2000](http://localhost:2000)

Tu `.env` debe tener:

```
MONGODB_URI=mongodb://localhost:27017/rolDocs
```

**MongoDB Compass:** conectá a `mongodb://localhost:27017` → base de datos `rolDocs`.

Para apagar solo la DB: `npm run db:down`

> No corras `docker compose up` completo y `npm run dev` a la vez: los dos intentarían usar el puerto 2000.

---

## Levantar todo con Docker (para quien clona el repo)

Ideal para GitHub: sin instalar Node ni MongoDB.

```bash
git clone https://github.com/Volkya/rol-Docs.git
cd rol-Docs
docker compose up --build
```

Abre [http://localhost:2000](http://localhost:2000)

---

## Variables de entorno

Copia `.env.example` a `.env`:

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del servidor (default: 2000) |
| `MONGODB_URI` | URI de MongoDB (`localhost` en dev, `mongodb` dentro de Docker) |
| `SESSION_SECRET` | Secreto de sesión |
| `CLOUDINARY_*` | Opcional. Sin ellas, las fotos se guardan en `src/public/uploads` |

## Funcionalidades

- Registro e inicio de sesión
- CRUD de fichas de personaje
- Subida de imagen (local o Cloudinary)
- Rutas protegidas con autenticación
- Tema claro/oscuro

## Scripts

```bash
npm run dev      # app local con nodemon
npm run db       # solo MongoDB en Docker (foreground)
npm run db:up    # solo MongoDB en Docker (background)
npm run db:down  # apagar MongoDB
npm start        # producción
```

---

Built with curiosity by [@Dyma](https://github.com/Volkya)
