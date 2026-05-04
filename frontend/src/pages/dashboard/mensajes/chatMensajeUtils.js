// Utilidades de sincronización de mensajes y estados para el chat en tiempo real.
// Separadas del componente para facilitar pruebas y lectura.

export function compareMensajes(a, b) {
  const fechaA = new Date(a.fechaEnvio).getTime();
  const fechaB = new Date(b.fechaEnvio).getTime();
  if (fechaA !== fechaB) return fechaA - fechaB;
  return Number(a.id || 0) - Number(b.id || 0);
}

function estadoTimestampMs(estado) {
  if (!estado?.timestamp) return 0;
  const parsed = new Date(estado.timestamp).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function mergeEstadoFinal(actual, estado) {
  if (!estado) return actual;
  const actualTs = estadoTimestampMs({ timestamp: actual?._estadoTimestamp });
  const nuevoTs = estadoTimestampMs(estado);
  const tsFinal = Math.max(actualTs, nuevoTs);
  const leido = Boolean(actual?.leido || estado?.leido);
  const recibido = Boolean(actual?.recibido || estado?.recibido || leido);
  return {
    ...actual,
    leido,
    recibido,
    _estadoTimestamp: tsFinal > 0 ? new Date(tsFinal).toISOString() : actual?._estadoTimestamp,
  };
}

// Tabla de conversión: tipo de evento → lista normalizada de estados {id, leido, recibido}
const NORMALIZAR_POR_TIPO = {
  "mensaje.leido.lote":    (e) => e.mensajeIds.map((id) => ({ id: Number(id), leido: true,  recibido: true })),
  "mensaje.recibido.lote": (e) => e.mensajeIds.map((id) => ({ id: Number(id), leido: false, recibido: true })),
  "mensaje.leido":         (e) => [{ id: Number(e.mensajeId), leido: true,  recibido: true }],
  "mensaje.recibido":      (e) => [{ id: Number(e.mensajeId), leido: false, recibido: true }],
};

export function normalizarEstadosEvento(evento) {
  // Formato enriquecido: el evento ya trae los objetos mensaje completos
  if (Array.isArray(evento?.mensajes) && evento.mensajes.length > 0) {
    return evento.mensajes
      .filter((m) => m?.id)
      .map((m) => ({ id: Number(m.id), leido: Boolean(m.leido), recibido: Boolean(m.recibido), timestamp: m.timestamp }));
  }
  const fn = NORMALIZAR_POR_TIPO[evento?.tipo];
  return fn ? fn(evento) : [];
}

export function mergeMensajes(actuales, nuevos) {
  const mapa = new Map(actuales.map((m) => [m.id, m]));
  nuevos.forEach((m) => mapa.set(m.id, { ...mapa.get(m.id), ...m }));
  return Array.from(mapa.values()).sort(compareMensajes);
}

export function upsertMensaje(actuales, mensaje) {
  const idx = actuales.findIndex(
    (item) =>
      Number(item.id) === Number(mensaje.id) ||
      (item.clientMessageId && mensaje.clientMessageId && item.clientMessageId === mensaje.clientMessageId)
  );

  if (idx !== -1) {
    // Actualización en sitio — la posición no cambia
    const result = [...actuales];
    result[idx] = { ...actuales[idx], ...mensaje };
    return result;
  }

  // Nuevo mensaje: casi siempre llega al final (orden cronológico del servidor)
  const ultimo = actuales[actuales.length - 1];
  if (!ultimo || compareMensajes(mensaje, ultimo) >= 0) {
    return [...actuales, mensaje];
  }

  // Mensaje fuera de orden (raro): sort completo como fallback
  return [...actuales, mensaje].sort(compareMensajes);
}
