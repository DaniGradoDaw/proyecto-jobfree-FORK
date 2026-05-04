import { apiFetch } from "./config";

export async function bloquearUsuario(id, motivo) {
  const res = await apiFetch(`/bloqueos/${id}`, {
    method: "POST",
    body: JSON.stringify({ motivo: motivo || null }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al bloquear al usuario");
  }
}

export async function desbloquearUsuario(id) {
  const res = await apiFetch(`/bloqueos/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al desbloquear al usuario");
  }
}

export async function obtenerBloqueados() {
  const res = await apiFetch("/bloqueos");
  if (!res.ok) throw new Error("Error al obtener usuarios bloqueados");
  return res.json();
}
