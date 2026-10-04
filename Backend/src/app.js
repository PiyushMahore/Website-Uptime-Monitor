import express from "express"
import path from "node:path";
import cookieParser from "cookie-parser"
import cors from "cors"
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { env, projectRoot } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

export const app = express()

app.disable("x-powered-by")
app.use(helmet())

function isLocalDevelopmentOrigin(origin) {
  if (env.nodeEnv === "production") return false;
  try {
    const url = new URL(origin);
    return url.protocol === "http:" && ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  } catch {
    return false;
  }
}

app.use(cors({
  origin(origin, callback) {
    if (!origin || env.origins.includes(origin) || isLocalDevelopmentOrigin(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use(express.json({ limit: "100kb" }))
app.use(express.urlencoded({ limit: "100kb", extended: false }))
app.use(express.static(path.join(projectRoot, "public")))
app.use(cookieParser())
const rateLimitOptions = (windowMs, limit) => ({
  windowMs,
  limit,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (_req, res) => res.status(429).json({ statusCode: 429, success: false, data: null, message: "Too many requests. Try again later." }),
});
app.use("/api", rateLimit(rateLimitOptions(60_000, 120)))
app.use("/api/v1/user/login", rateLimit(rateLimitOptions(15 * 60_000, 10)))
app.use("/api/v1/user/signup", rateLimit(rateLimitOptions(60 * 60_000, 10)))
app.use("/api/v1/user/generate-otp", rateLimit(rateLimitOptions(60 * 60_000, 5)))
app.use("/api/v1/user/reset-password", rateLimit(rateLimitOptions(15 * 60_000, 10)))
app.use("/api/v1/webUrls/check-url", rateLimit(rateLimitOptions(60_000, 10)))

import { userRoute } from "./routes/user.routes.js"
import { webUrlRoute } from "./routes/webUrl.routes.js"

app.use("/api/v1/user", userRoute)
app.use("/api/v1/webUrls", webUrlRoute)

app.get("/health/live", (_req, res) => res.status(200).json({ status: "ok" }))
app.get("/health/ready", async (_req, res) => {
  const mongoose = await import("mongoose");
  const ready = mongoose.default.connection.readyState === 1;
  return res.status(ready ? 200 : 503).json({ status: ready ? "ok" : "unavailable" });
})

app.use(notFoundHandler)
app.use(errorHandler)
