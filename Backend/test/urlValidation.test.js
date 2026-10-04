import test from "node:test";
import assert from "node:assert/strict";
import { normalizeMonitorUrl } from "../src/utils/urlValidation.js";
import { fetchUrls, isPrivateAddress } from "../src/utils/urlFetcher.js";

test("normalizes host-only website input to HTTPS", () => {
  assert.equal(normalizeMonitorUrl("example.com"), "https://example.com/");
});

test("preserves an explicit HTTP scheme, port, path, and query", () => {
  assert.equal(normalizeMonitorUrl("http://example.com:8080/health?full=1"), "http://example.com:8080/health?full=1");
});

test("rejects empty, malformed, unsupported, and credential-bearing URLs", () => {
  for (const input of ["", "not a url", "ftp://example.com", "https://name:pass@example.com"]) {
    assert.throws(() => normalizeMonitorUrl(input), TypeError, `input should be rejected: ${input}`);
  }
});

test("classifies private and public IP addresses for SSRF protection", () => {
  for (const address of ["127.0.0.1", "10.1.2.3", "172.20.1.1", "192.168.0.10", "192.0.2.1", "203.0.113.9", "::1", "fd00::1", "2001:db8::1"]) {
    assert.equal(isPrivateAddress(address), true, `${address} should be private`);
  }
  assert.equal(isPrivateAddress("8.8.8.8"), false);
  assert.equal(isPrivateAddress("2606:4700:4700::1111"), false);
});

test("refuses loopback targets before making an outbound request", async () => {
  await assert.rejects(fetchUrls("http://127.0.0.1"), /Private network targets/);
});
