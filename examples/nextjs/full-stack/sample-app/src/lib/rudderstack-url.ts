const loopbackHostnames = ['localhost', '127.0.0.1', '[::1]'];

export function getDataPlaneUrlValidationError(dataPlaneUrl: string): string | undefined {
  let url: URL;

  try {
    url = new URL(dataPlaneUrl);
  } catch {
    return 'must be a valid URL.';
  }

  const isHttpLoopback = url.protocol === 'http:' && loopbackHostnames.includes(url.hostname);
  if (url.protocol !== 'https:' && !isHttpLoopback) {
    return 'must use HTTPS unless it targets a loopback host.';
  }

  return undefined;
}
