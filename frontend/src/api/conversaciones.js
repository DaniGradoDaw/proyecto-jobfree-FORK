import { apiFetch } from "./config";

export async function obtenerMisConversaciones() {
  const res = await apiFetch("/conversaciones/mis");
  if (!res.ok) throw new Error("Error al obtener las conversaciones");
  return res.json();
}

export async function obtenerConversacionPorReserva(reservaId) {
  const res = await apiFetch(`/conversaciones/reserva/${reservaId}`);
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al obtener la conversación");
  }
  return res.json();
}

export async function obtenerConversacion(id) {
  const res = await apiFetch(`/conversaciones/${id}`);
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al obtener la conversación");
  }
  return res.json();
}

export async function crearOObtenerConversacionContacto(profesionalId) {
  const res = await apiFetch("/conversaciones/contacto", {
    method: "POST",
    body: JSON.stringify({ profesionalId }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al iniciar la conversación");
  }
  return res.json();
}

// duracion: "8h" | "1s" | "siempre" | null (null = dessilenciar)
export async function silenciarConversacion(id, duracion) {
  const res = await apiFetch(`/conversaciones/${id}/silenciar`, {
    method: "PATCH",
    body: JSON.stringify({ duracion: duracion ?? null }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al silenciar/activar la conversación");
  }
  return res.json();
}

export async function fijarConversacion(id) {
  const res = await apiFetch(`/conversaciones/${id}/fijar`, { method: "PATCH" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al fijar/desfijar la conversación");
  }
  return res.json();
}
