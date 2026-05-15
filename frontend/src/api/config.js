const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
export default API_URL;

/**
 * Wrapper sobre fetch que siempre incluye credentials: 'include'
 * para que el navegador envíe la cookie httpOnly de autenticación.
 *
 * Cuando recibe un 401 en endpoints no-auth (sesión expirada),
 * emite el evento "auth:sesion-expirada" para que AuthContext
 * cierre la sesión y redirija al login.
 */
export async function apiFetch(path, options = {}) {
  const headers = {
    Accept: "application/json",
    ...options.headers,
  };
  if (options.body && typeof options.body === "string") {
    headers["Content-Type"] = "application/json";
  }
  const token = localStorage.getItem("jf_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(API_URL + path, {
    ...options,
    credentials: "include",
    headers,
  });
  if (res.status === 401 && !path.startsWith("/auth/")) {
    window.dispatchEvent(new CustomEvent("auth:sesion-expirada"));
  }
  return res;
}
