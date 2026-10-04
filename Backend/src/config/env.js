import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
dotenv.config({ path: process.env.ENV_FILE || path.join(projectRoot, ".env") });

const splitList = (value = "") => value.split(",").map((item) => item.trim()).filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  origins: splitList(process.env.ORIGIN || "http://localhost:3000"),
  dbUrl: process.env.DB_URL,
  // MongoDB's default database for a pathless connection URL is `test`.
  // Explicitly use that legacy target unless the deployment sets DB_NAME.
  dbName: process.env.DB_NAME || "test",
  accessTokenSecret: process.env.ACCESS_TOKEN,
  refreshTokenSecret: process.env.REFRESH_TOKEN,
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIREY || process.env.ACCESS_TOKEN_EXPIRY || "15m",
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIREY || process.env.REFRESH_TOKEN_EXPIRY || "7d",
};

export function validateEnv() {
  env.port = Number(process.env.PORT || 5000);
  const required = ["DB_URL", "ACCESS_TOKEN", "REFRESH_TOKEN"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  if (!Number.isInteger(env.port) || env.port < 1 || env.port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }
  for (const key of ["URL_CHECK_TIMEOUT_MS", "CHECK_INTERVAL_MS", "DB_CONNECT_TIMEOUT_MS"]) {
    const value = process.env[key];
    if (value !== undefined && (!/^\d+$/.test(value) || Number(value) < 1)) {
      throw new Error(`${key} must be a positive integer`);
    }
  }
  const dbUrl = process.env.DB_URL;
  if (dbUrl) {
    let parsed;
    try { parsed = new URL(dbUrl); }
    catch { throw new Error("DB_URL must be a valid MongoDB connection URL"); }
    if (!["mongodb:", "mongodb+srv:"].includes(parsed.protocol)) {
      throw new Error("DB_URL must use mongodb:// or mongodb+srv://");
    }
  }
  for (const key of ["ACCESS_TOKEN", "REFRESH_TOKEN"]) {
    const value = process.env[key];
    if (value.length < 32 || value.startsWith("replace_")) {
      throw new Error(`${key} must be a random secret of at least 32 characters`);
    }
  }
  return env;
}
