export function normalizeMonitorUrl(input) {
  if (typeof input !== "string" || !input.trim()) {
    throw new TypeError("A website URL is required");
  }

  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(input.trim()) ? input.trim() : `https://${input.trim()}`;
  let parsed;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new TypeError("Enter a valid HTTP or HTTPS URL");
  }

  if (!["http:", "https:"].includes(parsed.protocol) || !parsed.hostname || parsed.username || parsed.password) {
    throw new TypeError("Only valid HTTP and HTTPS URLs are supported");
  }
  return parsed.toString();
}
