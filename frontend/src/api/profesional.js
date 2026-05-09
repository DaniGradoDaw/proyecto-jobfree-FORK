import { apiFetch } from "./config";

export async function obtenerProfesionales(pagina = 0, size = 20) {
  const res = await apiFetch(`/profesionales?page=${pagina}&size=${size}`);
  if (!res.ok) throw new Error("Error al obtener profesionales");
  return res.json();
}

export async function obtenerMiPerfil() {
  const res = await apiFetch("/profesionales/mio");
  if (!res.ok) throw new Error("Perfil no encontrado");
  return res.json();
}

export async function crearMiPerfil(datos) {
  const res = await apiFetch("/profesionales", {
    method: "POST",
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al crear el perfil profesional");
  }
  return res.json();
}

export async function actualizarMiPerfil(id, datos) {
  const res = await apiFetch("/profesionales/" + id, {
    method: "PATCH",
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al actualizar el perfil profesional");
  }
  return res.json();
}

export async function actualizarCiudadesServicio(ciudades) {
  const res = await apiFetch("/profesionales/mio/ciudades", {
    method: "PUT",
    body: JSON.stringify(ciudades),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al guardar las ciudades");
  }
  return res.json();
}

export async function obtenerProfesionalesCercanos(lat, lng, radio = 20) {
  const res = await apiFetch(`/profesionales/cercanos?lat=${lat}&lng=${lng}&radio=${radio}`);
  if (!res.ok) throw new Error("Error al buscar profesionales cercanos");
  return res.json();
}

export async function obtenerProfesionalPorId(id) {
  const res = await apiFetch(`/profesionales/${id}`);
  if (!res.ok) throw new Error("No se pudo cargar el perfil del profesional");
  return res.json();
}
