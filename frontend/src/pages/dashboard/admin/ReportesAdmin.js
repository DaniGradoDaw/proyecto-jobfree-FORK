import { useEffect, useState } from "react";
import {
  FlagIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/outline";
import { listarTodosReportes, resolverReporteAdmin, eliminarReporteAdmin } from "api/admin";
import { suspenderUsuario, activarUsuario } from "api/admin";
import { useLanguage } from "context/LanguageContext";
import Avatar from "components/Avatar";

function BadgeEstado({ resuelto }) {
  const { tx } = useLanguage();
  return resuelto
    ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{tx("Resuelto")}
      </span>
    : <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-red-200">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />{tx("Pendiente")}
      </span>;
}

function MensajesSnapshot({ json }) {
  const { tx } = useLanguage();
  let mensajes = [];
  try { mensajes = JSON.parse(json) || []; } catch { return null; }
  if (!mensajes.length) return <p className="text-xs text-slate-400 italic">{tx("Sin mensajes capturados")}</p>;
  return (
    <div className="mt-3 space-y-1.5 rounded-xl bg-slate-50 p-3 border border-slate-100">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">{tx("Últimos mensajes capturados")}</p>
      {mensajes.map((m, i) => (
        <div key={i} className={`flex ${m.esMio ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-xs leading-snug ${
            m.esMio
              ? "bg-emerald-500 text-white rounded-br-sm"
              : "bg-white text-slate-700 border border-slate-200 rounded-bl-sm"
          }`}>
            {m.texto || <span className="italic opacity-60">{tx("imagen")}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function FilaReporte({ reporte, onResolver, onEliminar, onSuspender, procesando, suspendiendo }) {
  const { tx } = useLanguage();
  const [expandido, setExpandido] = useState(false);

  const estaActivo     = reporte.reportadoActivo;
  const suspendidoEste = suspendiendo === reporte.reportadoId;

  return (
    <div className={`rounded-2xl border p-4 transition ${
      reporte.resuelto ? "border-slate-200 bg-slate-50" : "border-red-100 bg-white shadow-sm"
    }`}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <div className="flex items-center gap-2">
              <Avatar src={reporte.reportadoFotoUrl} nombre={reporte.reportadoNombre} className="h-8 w-8 rounded-full shrink-0" iconFallback />
              <div>
                <p className="text-xs text-slate-400">{tx("Reportado")}</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-slate-900">{reporte.reportadoNombre}</p>
                  {!estaActivo && (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700 ring-1 ring-red-200">
                      {tx("Suspendido")}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <span className="text-slate-300">·</span>
            <div className="flex items-center gap-2">
              <Avatar src={reporte.reportadorFotoUrl} nombre={reporte.reportadorNombre} className="h-6 w-6 rounded-full shrink-0" iconFallback />
              <div>
                <p className="text-xs text-slate-400">{tx("Reportó")}</p>
                <p className="text-sm text-slate-600">{reporte.reportadorNombre}</p>
              </div>
            </div>
            <span className="text-slate-300">·</span>
            <div>
              <p className="text-xs text-slate-400">{tx("Fecha")}</p>
              <p className="text-xs text-slate-500">
                {reporte.fecha
                  ? new Date(reporte.fecha).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })
                  : "—"}
              </p>
            </div>
          </div>
          {expandido && <MensajesSnapshot json={reporte.mensajesJson} />}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
          <BadgeEstado resuelto={reporte.resuelto} />

          <button
            onClick={() => setExpandido((v) => !v)}
            title={expandido ? tx("Contraer") : tx("Ver mensajes")}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 transition"
          >
            {expandido ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </button>

          <button
            onClick={() => onSuspender(reporte.reportadoId, estaActivo)}
            disabled={suspendidoEste}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition disabled:opacity-50 ${
              estaActivo
                ? "bg-amber-50 text-amber-700 hover:bg-amber-100 ring-1 ring-amber-200"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ring-1 ring-emerald-200"
            }`}
          >
            {suspendidoEste
              ? <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
              : estaActivo
                ? <><NoSymbolIcon className="h-3.5 w-3.5" />{tx("Suspender")}</>
                : <><CheckCircleIcon className="h-3.5 w-3.5" />{tx("Activar")}</>
            }
          </button>

          {!reporte.resuelto && (
            <button
              onClick={() => onResolver(reporte.id)}
              disabled={procesando === reporte.id}
              className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 ring-1 ring-emerald-200 transition disabled:opacity-50"
            >
              <CheckCircleIcon className="h-3.5 w-3.5" />{tx("Resolver")}
            </button>
          )}

          <button
            onClick={() => onEliminar(reporte.id)}
            disabled={procesando === reporte.id}
            className="rounded-full p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportesAdmin() {
  const { tx } = useLanguage();
  const [reportes, setReportes]       = useState([]);
  const [cargando, setCargando]       = useState(true);
  const [error, setError]             = useState("");
  const [filtro, setFiltro]           = useState("todos");
  const [busqueda, setBusqueda]       = useState("");
  const [procesando, setProcesando]   = useState(null);
  const [suspendiendo, setSuspendiendo] = useState(null);

  useEffect(() => {
    listarTodosReportes()
      .then(setReportes)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  const filtrados = reportes.filter((r) => {
    const coincideFiltro =
      filtro === "todos" ? true :
      filtro === "pendiente" ? !r.resuelto :
      r.resuelto;
    const coincideBusqueda =
      busqueda === "" ||
      (r.reportadoNombre ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (r.reportadorNombre ?? "").toLowerCase().includes(busqueda.toLowerCase());
    return coincideFiltro && coincideBusqueda;
  });

  async function handleResolver(id) {
    setProcesando(id);
    try {
      const actualizado = await resolverReporteAdmin(id);
      setReportes((prev) => prev.map((r) => r.id === actualizado.id ? { ...r, resuelto: true } : r));
    } catch (e) { alert(e.message); }
    finally { setProcesando(null); }
  }

  async function handleEliminar(id) {
    if (!window.confirm(tx("¿Eliminar este reporte?"))) return;
    setProcesando(id);
    try {
      await eliminarReporteAdmin(id);
      setReportes((prev) => prev.filter((r) => r.id !== id));
    } catch (e) { alert(e.message); }
    finally { setProcesando(null); }
  }

  async function handleSuspender(reportadoId, estaActivo) {
    setSuspendiendo(reportadoId);
    try {
      const fn = estaActivo ? suspenderUsuario : activarUsuario;
      const actualizado = await fn(reportadoId);
      setReportes((prev) => prev.map((r) =>
        r.reportadoId === reportadoId ? { ...r, reportadoActivo: actualizado.activo } : r
      ));
    } catch (e) { alert(e.message); }
    finally { setSuspendiendo(null); }
  }

  const pendientes = reportes.filter((r) => !r.resuelto).length;

  const FILTROS = [
    { key: "todos",     label: tx("Todos"),      count: reportes.length },
    { key: "pendiente", label: tx("Pendientes"), count: pendientes },
    { key: "resuelto",  label: tx("Resueltos"),  count: reportes.length - pendientes },
  ];

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
        <h1 className="text-xl font-semibold text-slate-900">{tx("Reportes")}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {tx("{total} reportes en total", { total: reportes.length })}
          {pendientes > 0 && (
            <>
              {" · "}
              <span className="text-red-600 font-medium">
                {tx("{count} pendientes", { count: pendientes })}
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
            placeholder={tx("Buscar por nombre de usuario...")}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>
        <div className="flex gap-2">
          {FILTROS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
                filtro === f.key
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
          <FlagIcon className="h-10 w-10 text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-500">{tx("No hay reportes")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtrados.map((r) => (
            <FilaReporte
              key={r.id}
              reporte={r}
              onResolver={handleResolver}
              onEliminar={handleEliminar}
              onSuspender={handleSuspender}
              procesando={procesando}
              suspendiendo={suspendiendo}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReportesAdmin;
