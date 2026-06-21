// Central place for backend access. The base URL comes from VITE_API_URL so the
// app can target a local backend in development and the deployed one in production.

const DEFAULT_API_URL = "https://iteracja-hackathon-1110.onrender.com";

const stripTrailingSlash = (url: string) => url.replace(/\/+$/, "");

/** Base URL of the FastAPI backend. */
export const API_URL = stripTrailingSlash(
  import.meta.env.VITE_API_URL ?? DEFAULT_API_URL,
);

/** Base URL the emergency QR code points to. Defaults to the app's own origin. */
export const SCAN_BASE_URL = stripTrailingSlash(
  import.meta.env.VITE_SCAN_BASE_URL ?? window.location.origin,
);

/** Build an absolute backend URL from a path (e.g. apiUrl("/login")). */
export const apiUrl = (path: string) =>
  `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Build the public scan URL embedded in a user's QR code. */
export const scanUrl = (token: string) =>
  `${SCAN_BASE_URL}/mobile/scan/${encodeURIComponent(token)}`;

const ACCESS_TOKEN_KEY = "accessToken";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const setAccessToken = (token: string | null) => {
  if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token);
  else localStorage.removeItem(ACCESS_TOKEN_KEY);
};

/**
 * fetch wrapper that targets the backend and attaches the stored JWT access
 * token as a Bearer header. Use for endpoints that require authentication.
 */
export const authFetch = (path: string, init: RequestInit = {}) => {
  const token = getAccessToken();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(apiUrl(path), { ...init, headers });
};
