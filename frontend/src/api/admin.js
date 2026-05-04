import { apiFetch } from "api/config";

// ── Usuarios ──────────────────────────────────────────────────────────────────

export async function listarUsuarios() {
  const res = await apiFetch("/usuarios");
  if (!res.ok) throw new Error("Error al cargar usuarios");
  return res.json();
}

export async function eliminarUsuario(id) {
  const res = await apiFetch(`/usuarios/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar usuario");
}

// ── Reservas ──────────────────────────────────────────────────────────────────

export async function listarTodasReservas() {
  const res = await apiFetch("/reservas");
  if (!res.ok) throw new Error("Error al cargar reservas");
  return res.json();
}

// ── Pagos ─────────────────────────────────────────────────────────────────────

export async function listarTodosPagos() {
  const res = await apiFetch("/pagos");
  if (!res.ok) throw new Error("Error al cargar pagos");
  return res.json();
}

// ── Notificaciones ────────────────────────────────────────────────────────────

export async function listarTodasNotificaciones() {
  const res = await apiFetch("/notificaciones");
  if (!res.ok) throw new Error("Error al cargar notificaciones");
  return res.json();
}

// ── Categorías ────────────────────────────────────────────────────────────────

export async function crearCategoria(datos) {
  const res = await apiFetch("/categorias", {
    method: "POST",
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al crear categoría");
  }
  return res.json();
}

export async function actualizarCategoria(id, datos) {
  const res = await apiFetch(`/categorias/${id}`, {
    method: "PATCH",
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al actualizar categoría");
  }
  return res.json();
}

export async function eliminarCategoria(id) {
  const res = await apiFetch(`/categorias/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar categoría");
}

// ── Subcategorías ─────────────────────────────────────────────────────────────

export async function crearSubcategoria(datos) {
  const res = await apiFetch("/subcategorias", {
    method: "POST",
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al crear subcategoría");
  }
  return res.json();
}

export async function actualizarSubcategoria(id, datos) {
  const res = await apiFetch(`/subcategorias/${id}`, {
    method: "PATCH",
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al actualizar subcategoría");
  }
  return res.json();
}

export async function eliminarSubcategoria(id) {
  const res = await apiFetch(`/subcategorias/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar subcategoría");
}

// ── Profesionales ─────────────────────────────────────────────────────────────

export async function eliminarPerfilProfesional(id) {
  const res = await apiFetch(`/profesionales/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar perfil profesional");
}

export async function cambiarRolUsuario(id, rol) {
  const res = await apiFetch(`/usuarios/${id}/rol`, {
    method: "PATCH",
    body: JSON.stringify({ rol }),
  });
  if (!res.ok) throw new Error("Error al cambiar el rol");
  return res.json();
}

export async function cancelarReservaAdmin(id) {
  const res = await apiFetch(`/reservas/${id}/admin/cancelar`, { method: "PATCH" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al cancelar la reserva");
  }
  return res.json();
}

export async function completarReservaAdmin(id) {
  const res = await apiFetch(`/reservas/${id}/admin/completar`, { method: "PATCH" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al completar la reserva");
  }
  return res.json();
}

export async function confirmarPagoAdmin(id) {
  const res = await apiFetch(`/pagos/${id}/confirmar`, { method: "PATCH" });
  if (!res.ok) throw new Error("Error al confirmar el pago");
  return res.json();
}
