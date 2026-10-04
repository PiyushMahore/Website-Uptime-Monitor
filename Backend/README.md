# Uptime Monitor API 2.0

Express and MongoDB API for user accounts, website checks, and email downtime alerts.

## Run locally

1. Use Node.js 20 or newer.
2. Copy `.env.example` to `.env` and fill in the secrets and service credentials you use.
3. Install dependencies with `npm ci`.
4. Start MongoDB and run `npm run dev`.
5. Run the test suite with `npm test`.

`npm start` starts the API without nodemon. The default API port is 5000. `ORIGIN` is the exact frontend origin; multiple origins can be comma separated.

## Environment settings

`DB_URL` is a MongoDB connection URL. If it has no database path, the API uses `DB_NAME` (default `test`, matching MongoDB's default for pathless URLs and the previous working connection). If the URL already contains a database path, that path is used. The two JWT secrets must be different random values with at least 32 characters. Both corrected `*_EXPIRY` names and the previous `*_EXPIREY` spellings are accepted.

Email alerts and password reset codes require Gmail `EMAIL` and an app password in `APP_PASSWORD`. Profile image upload requires Cloudinary credentials. These integrations are only needed when their corresponding features are used.

## API and operations

- User and monitor APIs retain the `/api/v1` paths. Website CRUD and test-alert routes require an access-token cookie or `Authorization: Bearer <access-token>`.
- `POST /api/v1/user/refresh-token` rotates the refresh token. The frontend retries an authorized request once after refreshing an expired access token.
- Password reset codes are generated on the server, stored as hashes, expire after ten minutes, and are single use.
- `GET /health/live` is a liveness check. `GET /health/ready` returns 503 until MongoDB is connected.
- Public one-time website checks are rate limited and reject loopback/private network addresses. Configure monitored targets to use publicly reachable hosts.
- Only email notifications are implemented. The API runs the polling scheduler in the same process; run one API replica unless polling is moved to a distributed worker/queue. The built-in rate limiter also uses per-process memory, so multi-replica deployments should use a shared store.
- Set `NODE_ENV=production` behind HTTPS. Mongo index creation is disabled in production; ensure the user uniqueness and website owner indexes exist before deployment.

## Tests

The Node test runner covers HTTP health/error/auth behavior, URL normalization and private-network rejection, and user-secret serialization/token hashing. Run with `npm test`.
