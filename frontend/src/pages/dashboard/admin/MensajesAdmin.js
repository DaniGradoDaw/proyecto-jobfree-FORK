import { useEffect, useState } from "react";
import { ChatBubbleLeftRightIcon, ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { listarTodosMensajes } from "api/admin";
import { useLanguage } from "context/LanguageContext";

function MensajesAdmin() {
  const { idioma, tx } = useLanguage();
  const [mensajes, setMensajes]     = useState([]);
  const [cargando, setCargando]     = useState(true);
  const [error, setError]           = useState("");
  const [busqueda, setBusqueda]     = useState("");
  const [soloFiltrados, setSoloFiltrados] = useState(false);

  useEffect(() => {
    listarTodosMensajes()
      .then(setMensajes)
      .catch(() => setError(tx("No se pudieron cargar los mensajes.")))
      .finally(() => setCargando(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const PATRON_CONTACTO = /(\*{4,})/;

  const filtrados = mensajes.filter((m) => {
    if (m.eliminado) return false;
    const coincideBusqueda =
      busqueda === "" ||
      (m.contenido ?? "").toLowerCase().includes(busqueda.toLowerCase());
    const coincideFiltro = !soloFiltrados || PATRON_CONTACTO.test(m.contenido ?? "");
    return coincideBusqueda && coincideFiltro;
  });

  const totalFiltrados = mensajes.filter((m) => !m.eliminado && PATRON_CONTACTO.test(m.contenido ?? "")).length;

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
        {tx("Cargando...")}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-sm py-10 text-center">{error}</p>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{tx("Mensajes")}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {tx("{total} mensajes en total", { total: mensajes.filter(m => !m.eliminado).length })}
          {totalFiltrados > 0 && (
            <>
              {" · "}
              <span className="text-amber-600 font-medium">
                {tx("{count} con datos de contacto bloqueados", { count: totalFiltrados })}
              </span>
            </>
          )}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={tx("Buscar en mensajes...")}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>
        <button
          onClick={() => setSoloFiltrados((v) => !v)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
            soloFiltrados
              ? "bg-amber-500 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          {tx("Solo bloqueados")} {totalFiltrados > 0 && `(${totalFiltrados})`}
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <ChatBubbleLeftRightIcon className="h-10 w-10 mb-3" />
            <p className="text-sm font-medium text-slate-600">{tx("No hay mensajes")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  <th className="px-4 py-3">{tx("#")}</th>
                  <th className="px-4 py-3">{tx("Conversación")}</th>
                  <th className="px-4 py-3">{tx("De → A")}</th>
                  <th className="px-4 py-3">{tx("Contenido")}</th>
                  <th className="px-4 py-3">{tx("Fecha")}</th>
                  <th className="px-4 py-3">{tx("Estado")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtrados.slice(0, 200).map((m) => {
                  const tieneBloqueado = PATRON_CONTACTO.test(m.contenido ?? "");
                  return (
                    <tr
                      key={m.id}
                      className={`transition ${tieneBloqueado ? "bg-amber-50/40 hover:bg-amber-50" : "hover:bg-slate-50"}`}
                    >
                      <td className="px-4 py-3 text-slate-400 text-xs">{m.id}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">#{m.conversacionId ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {m.remitenteNombre ?? `#${m.remitenteId}`} → {m.destinatarioNombre ?? `#${m.destinatarioId}`}
                      </td>
                      <td className="px-4 py-3 text-slate-800 max-w-xs">
                        <span className={`line-clamp-2 ${tieneBloqueado ? "font-medium" : ""}`}>
                          {m.contenido ?? <span className="italic text-slate-400">{tx("(sin contenido)")}</span>}
                        </span>
                        {tieneBloqueado && (
                          <span className="mt-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700 ring-1 ring-amber-200">
                            {tx("Datos bloqueados")}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {m.fechaEnvio
                          ? new Date(m.fechaEnvio).toLocaleDateString(
                              idioma === "en" ? "en-GB" : "es-ES",
                              { day: "numeric", month: "short", year: "numeric" }
                            )
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {m.editado && (
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 bg-sky-100 text-sky-700 ring-sky-200 mr-1">
                            {tx("Editado")}
                          </span>
                        )}
                        {m.leido ? (
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 bg-slate-100 text-slate-500 ring-slate-200">
                            {tx("Leído")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 bg-emerald-100 text-emerald-700 ring-emerald-200">
                            {tx("No leído")}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtrados.length > 200 && (
              <p className="text-center text-xs text-slate-400 py-3">
                {tx("Mostrando los primeros 200 resultados. Usa la búsqueda para filtrar.")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MensajesAdmin;
