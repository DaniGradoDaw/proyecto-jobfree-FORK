import { apiFetch } from "./config";

const ERROR_RED = "No se pudo conectar con el servidor. Comprueba que el backend está en marcha.";

export async function login(email, password) {
  let res;
  try {
    res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error(ERROR_RED);
  }
  if (res.status === 429) throw new Error(await extraerMensajeError(res, "Demasiados intentos. Espera un minuto."));
  if (!res.ok) throw new Error(await extraerMensajeError(res, "Credenciales incorrectas"));
  const data = await res.json(); // { usuario, token }
  if (data.token) localStorage.setItem("jf_token", data.token);
  return data;
}

export async function logout() {
  localStorage.removeItem("jf_token");
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch {
    // ignorar errores de red en el logout
  }
}

export async function getMe() {
  let res;
  try {
    res = await apiFetch("/auth/me");
  } catch {
    throw new Error(ERROR_RED);
  }
  if (!res.ok) throw new Error("No autenticado");
  return res.json();
}

export async function registrarCliente(datos) {
  let res;
  try {
    res = await apiFetch("/usuarios/cliente", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  } catch {
    throw new Error(ERROR_RED);
  }
  if (!res.ok) {
    throw new Error(await extraerMensajeError(res, "Error al registrar el usuario"));
  }
  return res.json();
}

export async function registrarProfesional(datos) {
  let res;
  try {
    res = await apiFetch("/usuarios/profesional", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  } catch {
    throw new Error(ERROR_RED);
  }
  if (!res.ok) {
    throw new Error(await extraerMensajeError(res, "Error al registrar el profesional"));
  }
  return res.json();
}

/**
 * Guarda el rol deseado en la sesión del backend antes de iniciar OAuth2.
 * Debe llamarse justo antes de redirigir a /oauth2/authorization/{proveedor}.
 */
export async function iniciarOAuth(rol) {
  try {
    await apiFetch("/auth/iniciar-oauth", {
      method: "POST",
      body: JSON.stringify({ rol }),
    });
  } catch {
    // Si falla, el backend usará CLIENTE por defecto
  }
}

export async function refreshToken() {
  try {
    const res = await apiFetch("/auth/refresh", { method: "POST" });
    if (res.ok) {
      try {
        const data = await res.json();
        if (data.token) localStorage.setItem("jf_token", data.token);
      } catch {}
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function solicitarResetPassword(email) {
  let res;
  try {
    res = await apiFetch("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  } catch {
    throw new Error(ERROR_RED);
  }
  if (!res.ok) throw new Error(await extraerMensajeError(res, "Error al enviar el correo"));
  return res.json();
}

export async function resetearPassword(token, nuevaPassword) {
  let res;
  try {
    res = await apiFetch("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, nuevaPassword }),
    });
  } catch {
    throw new Error(ERROR_RED);
  }
  if (!res.ok) throw new Error(await extraerMensajeError(res, "Error al restablecer la contraseña"));
  return res.json();
}

async function extraerMensajeError(res, fallback) {
  try {
    const json = await res.json();
    return json.message || json.error || fallback;
  } catch {
    return fallback;
  }
}
