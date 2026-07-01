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

## Levantar todo con Docker

Ideal para GitHub: sin instalar Node ni MongoDB.

```bash
git clone https://github.com/Volkya/rol-Docs.git
cd rol-Docs
cp .env.example .env   # completar Cloudinary y SESSION_SECRET
docker compose up --build
```

Docker Compose lee tu `.env` automáticamente (`env_file`). Solo `MONGODB_URI` se sobreescribe internamente a `mongodb://mongodb:27017/rolDocs` porque dentro del contenedor la DB no es `localhost`.

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
