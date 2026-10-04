import test from "node:test";
import assert from "node:assert/strict";

process.env.PORT = "5000";
process.env.DB_URL = "mongodb://127.0.0.1:27017";
process.env.ACCESS_TOKEN = "a".repeat(48);
process.env.REFRESH_TOKEN = "b".repeat(48);

const { validateEnv } = await import("../src/config/env.js");

test("accepts valid server configuration", () => {
  assert.equal(validateEnv().port, 5000);
});

test("rejects missing or weak signing secrets", () => {
  const refreshToken = process.env.REFRESH_TOKEN;
  delete process.env.REFRESH_TOKEN;
  assert.throws(() => validateEnv(), /REFRESH_TOKEN/);
  process.env.REFRESH_TOKEN = "weak";
  assert.throws(() => validateEnv(), /REFRESH_TOKEN/);
  process.env.REFRESH_TOKEN = refreshToken;
});

test("rejects invalid MongoDB protocols and ports", () => {
  const dbUrl = process.env.DB_URL;
  process.env.DB_URL = "https://example.com";
  assert.throws(() => validateEnv(), /mongodb/);
  process.env.DB_URL = dbUrl;
  process.env.PORT = "70000";
  assert.throws(() => validateEnv(), /PORT/);
});
