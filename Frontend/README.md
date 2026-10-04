# Website Uptime Monitor frontend

This frontend is built with React and Vite. It sends API requests to the backend URL configured by `VITE_API_BASE_URL`.

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to the backend server's base URL. The default is `http://localhost:5000`.
3. Start the development server with `npm run dev`, or create a production build with `npm run build`.

The URL may include a path prefix, but should not include the `/api/v1` route prefix. Vite reads environment values at startup/build time, so restart the dev server after changing `.env`.
