import { app } from "./app.js";
import { env, validateEnv } from "./config/env.js";
import dbConnect from "./db/dbConnect.js";
import { WebUrl } from "./models/webUrl.model.js";
import { checkUrls } from "./utils/urlChecker.js";
import { fileURLToPath } from "node:url";

const CHECK_INTERVAL_MS = Math.max(10_000, Number(process.env.CHECK_INTERVAL_MS || 180_000));
let server;
let stopped = false;
let monitorTask;

async function runMonitorCycle() {
  try {
    const urls = await WebUrl.find({}, {
      Urls: 1,
      notificationType: 1,
      userId: 1,
      statusCode: 1,
      statusCodes: { $slice: -1 },
    }).lean();
    for (let index = 0; index < urls.length; index += 25) {
      const batch = urls.slice(index, index + 25);
      const results = await Promise.allSettled(batch.map((url) => checkUrls(url)));
      results.forEach((result) => {
        if (result.status === "rejected") console.error("Website check failed:", result.reason);
      });
    }
  } catch (error) {
    console.error("Monitor cycle failed:", error);
  }
}

async function monitorLoop() {
  if (stopped) return;
  monitorTask = runMonitorCycle();
  await monitorTask;
  monitorTask = undefined;
  if (!stopped) setTimeout(monitorLoop, CHECK_INTERVAL_MS).unref();
}

export async function startServer() {
  validateEnv();
  await dbConnect();
  server = app.listen(env.port, () => console.log(`Uptime Monitor API listening on port ${env.port}`));
  void monitorLoop();
  return server;
}

export async function stopServer() {
  stopped = true;
  if (monitorTask) await monitorTask;
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  const mongoose = await import("mongoose");
  await mongoose.default.disconnect();
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  startServer().catch((error) => {
    console.error("Unable to start Uptime Monitor API:", error.message);
    process.exitCode = 1;
  });

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.once(signal, () => {
      stopServer().finally(() => process.exit(0));
    });
  }
}
