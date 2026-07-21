# Smart Saauji

Smart Saauji is a full-stack inventory and insights platform for small retailers. The client and server are now organized into separate folders for easier development and deployment.

## Project Structure

- client/ - Vite + React + TypeScript frontend
- server/ - Express + MongoDB backend API

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, shadcn/ui
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT

## Prerequisites

- Node.js 18 or newer
- npm or bun
- A running MongoDB instance

## Setup

1. Install frontend dependencies

   ```bash
   cd client
   npm install
   ```

2. Install backend dependencies

   ```bash
   cd ../server
   npm install
   ```

3. Configure environment variables
   - Create a .env file in client/ with:
     ```env
     VITE_API_URL=http://localhost:4000/api
     ```
   - Create a .env file in server/ with your MongoDB and JWT settings.

## Run Locally

Start the frontend:

```bash
cd client
npm run dev
```

Start the backend:

```bash
cd server
npm run dev
```

## Build for Production

Frontend:

```bash
cd client
npm run build
```

Backend:

```bash
cd server
npm start
```

## Notes

- The frontend uses the API URL from client/.env.
- The backend should be running before using the app in development mode.
