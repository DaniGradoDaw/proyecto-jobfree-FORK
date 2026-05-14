import { apiFetch } from "./config";

export async function crearCheckoutSuscripcion(plan, periodicidad) {
  const res = await apiFetch("/suscripciones/checkout", {
    method: "POST",
    body: JSON.stringify({ plan, periodicidad }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al crear la sesión de pago");
  }
  return res.json();
}

export async function cancelarSuscripcion() {
  const res = await apiFetch("/suscripciones/cancelar", { method: "POST" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al cancelar la suscripción");
  }
  return res.json();
}

export async function obtenerMiPlan() {
  const res = await apiFetch("/suscripciones/mi-plan");
  if (!res.ok) throw new Error("Error al obtener el plan");
  return res.json();
}

export async function verificarSuscripcion() {
  const res = await apiFetch("/suscripciones/verificar");
  if (!res.ok) throw new Error("Error al verificar la suscripción");
  return res.json();
}
