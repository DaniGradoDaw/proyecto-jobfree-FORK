import { apiFetch } from "./config";

export async function crearReserva(datos) {
  const res = await apiFetch("/reservas", {
    method: "POST",
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al crear la reserva");
  }
  return res.json();
}

export async function obtenerMisReservas() {
  const res = await apiFetch("/reservas/mis-reservas");
  if (!res.ok) throw new Error("Error al obtener tus reservas");
  return res.json();
}

export async function obtenerReservaPorId(id) {
  const res = await apiFetch(`/reservas/${id}`);
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al obtener la reserva");
  }
  return res.json();
}

export async function obtenerMisSolicitudes() {
  const res = await apiFetch("/reservas/mis-solicitudes");
  if (!res.ok) throw new Error("Error al obtener las solicitudes");
  return res.json();
}

export async function confirmarReserva(id) {
  const res = await apiFetch(`/reservas/${id}/confirmar`, { method: "PATCH" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al confirmar la reserva");
  }
  return res.json();
}

export async function rechazarReserva(id) {
  const res = await apiFetch(`/reservas/${id}/rechazar`, { method: "PATCH" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al rechazar la reserva");
  }
  return res.json();
}

export async function cancelarReserva(id) {
  const res = await apiFetch(`/reservas/${id}/cancelar`, { method: "PATCH" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al cancelar la reserva");
  }
  return res.json();
}

export async function completarReserva(id) {
  const res = await apiFetch(`/reservas/${id}/completar`, { method: "PATCH" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al completar la reserva");
  }
  return res.json();
}

export async function actualizarProgreso(id, progreso, notas) {
  const body = { progreso };
  if (notas !== undefined) body.notas = notas;
  const res = await apiFetch(`/reservas/${id}/progreso`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al actualizar el progreso");
  }
  return res.json();
}
