/**
 * url-safety.mjs — the one place that decides whether a control-plane URL is safe to send a write
 * key to. Shared so preflight.mjs and generate.mjs cannot drift apart on the rule.
 *
 * The write key travels in the sourceConfig URL's query AND in the Authorization header, so a
 * remote control plane MUST be HTTPS. Loopback endpoints are excepted for local development.
 */
const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

/**
 * Validates a control-plane URL that will carry the write key.
 * @param {string} url The candidate URL.
 * @param {string} label Name to use in the error message (e.g. '--configUrl', 'config.configUrl').
 * @returns {string} The URL unchanged, when it is acceptable.
 * @throws {Error} When the URL is unparseable, or remote and not HTTPS.
 */
const assertSafeControlPlaneUrl = (url, label) => {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`${label} is not a valid URL: ${url}`);
  }
  if (parsed.protocol !== 'https:' && !LOOPBACK_HOSTS.has(parsed.hostname)) {
    throw new Error(
      `${label} must be https:// (loopback dev endpoints excepted) — it carries the write key.`,
    );
  }
  return url;
};

export { assertSafeControlPlaneUrl, LOOPBACK_HOSTS };
