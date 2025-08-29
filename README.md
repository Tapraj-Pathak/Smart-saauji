## Smart साहुजी

Turn-key inventory and insights app for small retailers. This repo contains a React (Vite) frontend and an Express + MongoDB backend.

### Stack

- Node.js, Express, MongoDB (Mongoose)
- React (Vite, TypeScript), Tailwind CSS, shadcn-ui

### Repo layout

```
.
├─ server/                 # Express API, MongoDB models, auth middleware
│  ├─ routes/              # /auth, /products, /recommendations, /wholesale
│  ├─ models/              # User, Product (Mongoose)
│  ├─ middleware/          # JWT auth, role guard
│  └─ index.js             # App entry
├─ src/                    # React app
│  ├─ pages/               # Login, Dashboard, Analytics
│  ├─ components/          # UI and feature components
│  └─ main.tsx             # App bootstrap
└─ README.md
```

---

## Quick start

1. Install dependencies

```sh
# Frontend (root)
npm install

# Backend
cd server
npm install
```

2. Environment variables

- Create `server/.env` (local dev template):

```
MONGO_URI=mongodb://127.0.0.1:27017/smart_साहुजी
PORT=4000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=change_me_in_production
JWT_EXPIRES_IN=7d
```

- Create `.env` at project root for the frontend:

```
VITE_API_URL=http://localhost:4000/api
```

3. Start MongoDB

- Windows service (recommended): open PowerShell as Admin

```powershell
Get-Service MongoDB
Start-Service MongoDB
```

- Or run manually:

```powershell
mkdir C:\data\db   # first time only
"C:\\Program Files\\MongoDB\\Server\\X.Y\\bin\\mongod.exe" --dbpath C:\\data\\db
```

4. Run servers

```sh
# Backend API
cd server
npm run dev

# Frontend (new terminal at repo root)
npm run dev
```

5. Verify

- API health: `http://localhost:4000/api/health`
- App: Vite URL in console (typically `http://localhost:5173`)

---

## Using the app

### Authentication

- Login/Register screen posts to the backend:
  - `POST /api/auth/register` → creates user, returns `{ token, user }`
  - `POST /api/auth/login` → returns `{ token, user }`
- Token is stored in `localStorage` as `token` and used for protected actions.

### Products

- `GET /api/products` → list products (supports simple text search with `?q=`)
- `POST /api/products` (auth: owner) → create product
- `PUT /api/products/:id` (auth: owner) → update
- `DELETE /api/products/:id` (auth: owner) → remove
- `POST /api/products/:id/adjust` (auth: owner|staff) → increment/decrement quantity

### Recommendations

- `GET /api/recommendations` → basic insights (low stock, upcoming expiry)

### Wholesale (simulated)

- `POST /api/wholesale/request` (auth) → echoes a request payload for outreach

---

## Configuration notes

- CORS is controlled via `CORS_ORIGIN` in `server/.env` (comma-separated list or `*`).
- Default MongoDB: `mongodb://127.0.0.1:27017/smart_साहुजी`. For Atlas, set `MONGO_URI` to your cluster string.
- Do not commit secrets. Use `.env` files locally and secrets manager in production.

---

## Troubleshooting

- ECONNREFUSED 127.0.0.1:27017
  - MongoDB not running. Start the service or run `mongod` manually (see above).
- Duplicate index warnings
  - Ensure only one unique index is defined for `User.email` (already fixed in `server/models/User.js`).
- CORS errors in browser
  - Confirm `CORS_ORIGIN` includes the frontend origin (e.g., `http://localhost:5173`). Restart backend after changes.
- 401/403 on product mutations
  - Ensure you are logged in; a JWT must be present in `localStorage` and sent in the `Authorization: Bearer <token>` header.

---

## npm scripts

Frontend (root):

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

Backend (`server/`):

```json
{
  "dev": "nodemon index.js",
  "start": "node index.js"
}
```

---

## Roadmap ideas

- Persistent analytics, better recommendation pipeline
- Role management UI (owner vs staff)
- Import/export products (CSV)
- Optional cloud MongoDB (Atlas) quick-setup script
