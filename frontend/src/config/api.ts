/**
 * Central place that knows where the backend API lives.
 *
 * The frontend and backend are now two separate servers (different origins in
 * production, different ports in dev). Every API call in the app is written as a
 * relative path, e.g. fetch('/api/orders'). `apiFetch` is a drop-in replacement for
 * `fetch` that prefixes those relative paths with the backend's base URL, so the
 * rest of the codebase doesn't need to change.
 *
 * Configure the backend URL via VITE_API_URL (see .env.example). If it's left empty,
 * requests stay relative — useful if you put both apps behind the same reverse proxy.
 */

export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function resolveUrl(input: RequestInfo | URL): RequestInfo | URL {
  if (!API_BASE_URL) return input;

  if (typeof input === 'string' && input.startsWith('/')) {
    return `${API_BASE_URL}${input}`;
  }

  if (input instanceof Request && input.url.startsWith('/')) {
    return new Request(`${API_BASE_URL}${input.url}`, input);
  }

  return input;
}

/** Use this instead of the global `fetch` for any call to our own backend (paths starting with '/'). */
export function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return fetch(resolveUrl(input), init);
}
