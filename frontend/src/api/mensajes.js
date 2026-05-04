import { apiFetch } from "./config";

export async function obtenerMensajesDeConversacion(conversacionId, { before, size = 50 } = {}) {
  const params = new URLSearchParams({ size });
  if (before != null) params.set("before", before);
  const res = await apiFetch(`/mensajes/conversaciones/${conversacionId}?${params}`);
  if (!res.ok) throw new Error("Error al obtener los mensajes");
  const data = await res.json();
  // Compatibilidad: si el backend devuelve array (formato legacy) lo normalizamos
  if (Array.isArray(data)) return { mensajes: data, hayMas: false };
  return data; // { mensajes: [], hayMas: bool }
}

export async function obtenerConteoMensajesNoLeidos() {
  const res = await apiFetch("/mensajes/no-leidos/count");
  if (!res.ok) throw new Error("Error al obtener el conteo de mensajes no leídos");
  return res.json();
}

export async function subirImagenMensaje(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await apiFetch("/mensajes/upload-imagen", { method: "POST", body: formData });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || "Error al subir la imagen");
  }
  return res.json();
}

export async function enviarMensaje(datos) {
  const res = await apiFetch("/mensajes", {
    method: "POST",
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al enviar el mensaje");
  }
  return res.json();
}

export async function marcarMensajeLeido(id) {
  const res = await apiFetch(`/mensajes/${id}/leido`, { method: "PATCH" });
  if (!res.ok) throw new Error("Error al marcar el mensaje como leído");
  return res.json();
}

export async function marcarMensajeRecibido(id) {
  const res = await apiFetch(`/mensajes/${id}/recibido`, { method: "PATCH" });
  if (!res.ok) throw new Error("Error al marcar el mensaje como recibido");
  return res.json();
}

export async function marcarMensajesRecibidos(ids) {
  const mensajeIds = [...new Set((ids || []).map(Number).filter(Boolean))];
  if (mensajeIds.length === 0) return [];

  const res = await apiFetch("/mensajes/recibido/lote", {
    method: "PATCH",
    body: JSON.stringify({ mensajeIds }),
  });
  if (!res.ok) throw new Error("Error al marcar los mensajes como recibidos");
  return res.json();
}

export async function marcarMensajesLeidos(ids) {
  const mensajeIds = [...new Set((ids || []).map(Number).filter(Boolean))];
  if (mensajeIds.length === 0) return [];

  const res = await apiFetch("/mensajes/leido/lote", {
    method: "PATCH",
    body: JSON.stringify({ mensajeIds }),
  });
  if (!res.ok) throw new Error("Error al marcar los mensajes como leídos");
  return res.json();
}
