import { apiFetch } from "./config";

export async function crearReporte(reportadoId, mensajes) {
  const mensajesJson = JSON.stringify(
    mensajes.slice(-10).map((m) => ({
      texto: m.contenido || "",
      esMio: m.esMio,
      fecha: m.fechaEnvio,
    }))
  );
  const res = await apiFetch("/reportes", {
    method: "POST",
    body: JSON.stringify({ reportadoId, mensajesJson }),
  });
  if (!res.ok && res.status !== 201) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Error al enviar el reporte");
  }
}
