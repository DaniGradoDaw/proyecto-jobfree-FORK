import { apiFetch } from "./config";

export async function crearPago(reservaId) {
  const res = await apiFetch("/pagos", {
    method: "POST",
    body: JSON.stringify({ reservaId, metodo: "TARJETA" }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al crear el pago");
  }
  return res.json();
}

export async function obtenerPagoPorReserva(reservaId) {
  const res = await apiFetch(`/pagos/reservas/${reservaId}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al obtener el pago");
  }
  return res.json();
}

export async function crearPaymentIntent(pagoId) {
  const res = await apiFetch(`/pagos/${pagoId}/stripe/payment-intent`, { method: "POST" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al crear el payment intent");
  }
  return res.json();
}

export async function simularPago(pagoId) {
  const res = await apiFetch(`/pagos/${pagoId}/simular`, { method: "POST" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al simular el pago");
  }
  return res.json();
}
