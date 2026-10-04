import dns from "node:dns/promises";
import net from "node:net";
import http from "node:http";
import https from "node:https";
import { normalizeMonitorUrl } from "./urlValidation.js";

const REQUEST_TIMEOUT_MS = Number(process.env.URL_CHECK_TIMEOUT_MS || 10_000);
const MAX_RESPONSE_BYTES = 1024 * 1024;

function isPrivateAddress(address) {
  if (net.isIPv4(address)) {
    const [a, b, c] = address.split(".").map(Number);
    return a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) ||
      (a === 192 && (b === 0 || (b === 88 && c === 99) || (b === 2 && c === 0))) ||
      (a === 198 && ((b === 18 || b === 19) || (b === 51 && c === 100))) ||
      (a === 203 && b === 0 && c === 113);
  }
  if (net.isIPv6(address)) {
    const normalized = address.toLowerCase();
    return normalized === "::" || normalized === "::1" || normalized.startsWith("fc") ||
      normalized.startsWith("fd") || /^fe[89ab]/.test(normalized) || normalized.startsWith("ff") ||
      normalized.startsWith("::ffff:") || normalized.startsWith("2001:db8:") || normalized.startsWith("2001:10:");
  }
  return true;
}

async function resolvePublicAddress(hostname) {
  if (net.isIP(hostname)) {
    if (isPrivateAddress(hostname)) throw new Error("Private network targets cannot be monitored");
    return [{ address: hostname, family: net.isIP(hostname) }];
  }
  const addresses = await dns.lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new Error("Private network targets cannot be monitored");
  }
  return addresses;
}

export async function fetchUrls(urlDescription) {
  const url = new URL(normalizeMonitorUrl(typeof urlDescription === "string" ? urlDescription : urlDescription?.Urls));
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  const addresses = await resolvePublicAddress(hostname);
  const address = addresses[0];
  const client = url.protocol === "https:" ? https : http;
  const timings = { nameLookupTime: 0, connectionTime: 0, tlsHandshakeTime: 0, dataTransferTime: 0, totalTime: 0, statusCode: 0, date: new Date() };
  const start = Date.now();

  return new Promise((resolve, reject) => {
    let connectedAt = 0;
    let firstByteAt = 0;
    let bytesReceived = 0;
    let done = false;
    const finish = (error, result) => {
      if (done) return;
      done = true;
      if (error) reject(error);
      else resolve(result);
    };

    const request = client.request({
      protocol: url.protocol,
      hostname,
      port: url.port || undefined,
      path: `${url.pathname}${url.search}`,
      method: "GET",
      headers: { "user-agent": "UptimeMonitor/2.0", accept: "*/*", connection: "close" },
      lookup: (_host, options, callback) => {
        if (options?.all) callback(null, addresses);
        else callback(null, address.address, address.family);
      },
    }, (response) => {
      timings.statusCode = response.statusCode || 0;
      response.on("data", (chunk) => {
        if (!firstByteAt) firstByteAt = Date.now();
        bytesReceived += chunk.length;
        if (bytesReceived > MAX_RESPONSE_BYTES) {
          timings.dataTransferTime = Date.now() - firstByteAt;
          timings.totalTime = Date.now() - start;
          timings.date = new Date();
          finish(null, timings);
          request.destroy();
        }
      });
      response.on("end", () => {
        const end = Date.now();
        timings.nameLookupTime = Math.max(0, connectedAt - start - timings.connectionTime);
        timings.dataTransferTime = firstByteAt ? Math.max(0, end - firstByteAt) : 0;
        timings.totalTime = Math.max(0, end - start);
        timings.date = new Date(end);
        finish(null, timings);
      });
      response.on("error", (error) => finish(error));
      response.resume();
    });

    request.on("socket", (socket) => {
      socket.once("lookup", () => { timings.nameLookupTime = Date.now() - start; });
      socket.once("connect", () => {
        connectedAt = Date.now();
        timings.connectionTime = Math.max(0, connectedAt - start - timings.nameLookupTime);
      });
      socket.once("secureConnect", () => {
        timings.tlsHandshakeTime = Math.max(0, Date.now() - connectedAt);
      });
    });
    request.setTimeout(REQUEST_TIMEOUT_MS, () => request.destroy(new Error("Website check timed out")));
    request.on("error", (error) => finish(error));
    request.end();
  });
}

export { isPrivateAddress };
