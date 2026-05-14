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

// ── Servicios ─────────────────────────────────────────────────────────────────

export async function listarTodosServicios() {
  const res = await apiFetch("/servicios?size=500&sort=id,desc");
  if (!res.ok) throw new Error("Error al cargar servicios");
  const data = await res.json();
  return data.content ?? data;
}

export async function activarServicioAdmin(id) {
  const res = await apiFetch(`/servicios/${id}/admin/activar`, { method: "PATCH" });
  if (!res.ok) throw new Error("Error al activar el servicio");
  return res.json();
}

export async function desactivarServicioAdmin(id) {
  const res = await apiFetch(`/servicios/${id}/admin/desactivar`, { method: "PATCH" });
  if (!res.ok) throw new Error("Error al desactivar el servicio");
  return res.json();
}

export async function eliminarServicioAdmin(id) {
  const res = await apiFetch(`/servicios/${id}/admin`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar el servicio");
}

// ── Valoraciones ──────────────────────────────────────────────────────────────

export async function listarTodasValoraciones() {
  const res = await apiFetch("/valoraciones");
  if (!res.ok) throw new Error("Error al cargar valoraciones");
  return res.json();
}

export async function eliminarValoracionAdmin(id) {
  const res = await apiFetch(`/valoraciones/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar la valoración");
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

export async function subirImagenSubcategoria(archivo) {
  const form = new FormData();
  form.append("imagen", archivo);
  const res = await apiFetch("/subcategorias/upload-imagen", { method: "POST", body: form });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || "Error al subir la imagen");
  }
  return res.json();
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

// ── Notificaciones ────────────────────────────────────────────────────────────

export async function listarTodasNotificaciones() {
  const res = await apiFetch("/notificaciones");
  if (!res.ok) throw new Error("Error al cargar notificaciones");
  return res.json();
}

export async function eliminarNotificacionAdmin(id) {
  const res = await apiFetch(`/notificaciones/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar la notificación");
}

// ── Suspender / Activar usuario ───────────────────────────────────────────────

export async function suspenderUsuario(id) {
  const res = await apiFetch(`/usuarios/${id}/suspender`, { method: "PATCH" });
  if (!res.ok) throw new Error("Error al suspender el usuario");
  return res.json();
}

export async function activarUsuario(id) {
  const res = await apiFetch(`/usuarios/${id}/activar`, { method: "PATCH" });
  if (!res.ok) throw new Error("Error al activar el usuario");
  return res.json();
}

// ── Mensajes ──────────────────────────────────────────────────────────────────

export async function listarTodosMensajes() {
  const res = await apiFetch("/mensajes");
  if (!res.ok) throw new Error("Error al cargar mensajes");
  return res.json();
}

// ── Reportes ──────────────────────────────────────────────────────────────────

export async function listarTodosReportes() {
  const res = await apiFetch("/reportes");
  if (!res.ok) throw new Error("Error al cargar reportes");
  return res.json();
}

export async function resolverReporteAdmin(id) {
  const res = await apiFetch(`/reportes/${id}/resolver`, { method: "PATCH" });
  if (!res.ok) throw new Error("Error al resolver el reporte");
  return res.json();
}

export async function eliminarReporteAdmin(id) {
  const res = await apiFetch(`/reportes/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar el reporte");
}
