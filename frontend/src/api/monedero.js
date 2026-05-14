import { apiFetch } from "./config";

export async function obtenerMonedero() {
  const res = await apiFetch("/monedero");
  if (!res.ok) throw new Error("Error al obtener el monedero");
  return res.json();
}

export async function obtenerMovimientos() {
  const res = await apiFetch("/monedero/movimientos");
  if (!res.ok) throw new Error("Error al obtener los movimientos");
  return res.json();
}

export async function iniciarRecarga(importe) {
  const res = await apiFetch("/monedero/recargar", {
    method: "POST",
    body: JSON.stringify({ importe }),
  });
  if (!res.ok) throw new Error("Error al iniciar la recarga");
  return res.json();
}

export async function confirmarRecarga(piId, importe) {
  const res = await apiFetch(`/monedero/confirmar-recarga/${piId}`, {
    method: "POST",
    body: JSON.stringify({ importe }),
  });
  if (!res.ok) throw new Error("Error al confirmar la recarga");
  return res.json();
}

export async function getCuentaBancaria() {
  const res = await apiFetch("/monedero/cuenta-bancaria");
  if (res.status === 204) return null;
  if (!res.ok) return null;
  return res.json();
}

export async function saveCuentaBancaria(iban, titular) {
  const res = await apiFetch("/monedero/cuenta-bancaria", {
    method: "PUT",
    body: JSON.stringify({ iban, titular }),
  });
  if (!res.ok) throw new Error("Error al guardar la cuenta bancaria");
}

export async function retirarSaldo(importe) {
  const res = await apiFetch("/monedero/retirar", {
    method: "POST",
    body: JSON.stringify({ importe }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al procesar la retirada");
  }
  return res.json();
}
