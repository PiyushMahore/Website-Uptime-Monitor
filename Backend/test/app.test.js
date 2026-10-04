import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test("liveness endpoint responds and exposes security headers", async () => {
  const response = await fetch(`${baseUrl}/health/live`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
  assert.equal(response.headers.get("x-powered-by"), null);
  assert.ok(response.headers.get("content-security-policy"));
});

test("unknown endpoints return the standard JSON error envelope", async () => {
  const response = await fetch(`${baseUrl}/not-a-route`);
  assert.equal(response.status, 404);
  const body = await response.json();
  assert.equal(body.success, false);
  assert.equal(body.statusCode, 404);
});

test("website endpoints require an access token", async () => {
  const response = await fetch(`${baseUrl}/api/v1/webUrls/get-website-url`);
  assert.equal(response.status, 401);
});

test("one-time public checks validate input before network access", async () => {
  const response = await fetch(`${baseUrl}/api/v1/webUrls/check-url`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url: "not a valid URL" }),
  });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).success, false);
});
