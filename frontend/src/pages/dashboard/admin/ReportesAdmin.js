import { useEffect, useState } from "react";
import {
  FlagIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { listarTodosReportes, resolverReporteAdmin, eliminarReporteAdmin } from "api/admin";
import Avatar from "components/Avatar";

function BadgeEstado({ resuelto }) {
  return resuelto
    ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Resuelto
      </span>
    : <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-red-200">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />Pendiente
      </span>;
}

function MensajesSnapshot({ json }) {
  let mensajes = [];
  try { mensajes = JSON.parse(json) || []; } catch { return null; }
  if (!mensajes.length) return <p className="text-xs text-slate-400 italic">Sin mensajes capturados</p>;
  return (
    <div className="mt-3 space-y-1.5 rounded-xl bg-slate-50 p-3 border border-slate-100">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Últimos mensajes capturados</p>
      {mensajes.map((m, i) => (
        <div key={i} className={`flex ${m.esMio ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-xs leading-snug ${
            m.esMio
              ? "bg-emerald-500 text-white rounded-br-sm"
              : "bg-white text-slate-700 border border-slate-200 rounded-bl-sm"
          }`}>
            {m.texto || <span className="italic opacity-60">imagen</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function FilaReporte({ reporte, onResolver, onEliminar, procesando }) {
  const [expandido, setExpandido] = useState(false);

  return (
    <div className={`rounded-2xl border p-4 transition ${
      reporte.resuelto ? "border-slate-200 bg-slate-50" : "border-red-100 bg-white shadow-sm"
    }`}>
      <div className="flex items-start gap-3">
        {/* Reportado */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <div className="flex items-center gap-2">
              <Avatar src={reporte.reportadoFotoUrl} nombre={reporte.reportadoNombre} className="h-8 w-8 rounded-full shrink-0" iconFallback />
              <div>
                <p className="text-xs text-slate-400">Reportado</p>
                <p className="text-sm font-semibold text-slate-900">{reporte.reportadoNombre}</p>
              </div>
            </div>
            <span className="text-slate-300">·</span>
            <div className="flex items-center gap-2">
              <Avatar src={reporte.reportadorFotoUrl} nombre={reporte.reportadorNombre} className="h-6 w-6 rounded-full shrink-0" iconFallback />
              <div>
                <p className="text-xs text-slate-400">Reportó</p>
                <p className="text-sm text-slate-600">{reporte.reportadorNombre}</p>
              </div>
            </div>
            <span className="text-slate-300">·</span>
            <div>
              <p className="text-xs text-slate-400">Fecha</p>
              <p className="text-xs text-slate-500">
                {reporte.fecha
                  ? new Date(reporte.fecha).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })
                  : "—"}
              </p>
            </div>
          </div>

          {expandido && <MensajesSnapshot json={reporte.mensajesJson} />}
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-1.5 shrink-0">
          <BadgeEstado resuelto={reporte.resuelto} />
          <button
            onClick={() => setExpandido((v) => !v)}
            title={expandido ? "Contraer" : "Ver mensajes"}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 transition"
          >
            {expandido ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </button>
          {!reporte.resuelto && (
            <button
              onClick={() => onResolver(reporte.id)}
              disabled={procesando === reporte.id}
              title="Marcar como resuelto"
              className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition disabled:opacity-50"
            >
              <CheckCircleIcon className="h-3.5 w-3.5" />Resolver
            </button>
          )}
          <button
            onClick={() => onEliminar(reporte.id)}
            disabled={procesando === reporte.id}
            title="Eliminar reporte"
            className="rounded-full p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

const FILTROS = [
  { key: "todos",     label: "Todos" },
  { key: "pendiente", label: "Pendientes" },
  { key: "resuelto",  label: "Resueltos" },
];

function ReportesAdmin() {
  const [reportes, setReportes]     = useState([]);
  const [cargando, setCargando]     = useState(true);
  const [error, setError]           = useState("");
  const [filtro, setFiltro]         = useState("todos");
  const [procesando, setProcesando] = useState(null);

  useEffect(() => {
    listarTodosReportes()
      .then(setReportes)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  const filtrados = reportes.filter((r) =>
    filtro === "todos" ? true :
    filtro === "pendiente" ? !r.resuelto :
    r.resuelto
  );

  async function handleResolver(id) {
    setProcesando(id);
    try {
      const actualizado = await resolverReporteAdmin(id);
      setReportes((prev) => prev.map((r) => r.id === actualizado.id ? { ...r, resuelto: true } : r));
    } catch (e) { alert(e.message); }
    finally { setProcesando(null); }
  }

  async function handleEliminar(id) {
    if (!window.confirm("¿Eliminar este reporte?")) return;
    setProcesando(id);
    try {
      await eliminarReporteAdmin(id);
      setReportes((prev) => prev.filter((r) => r.id !== id));
    } catch (e) { alert(e.message); }
    finally { setProcesando(null); }
  }

  const pendientes = reportes.filter((r) => !r.resuelto).length;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
          <FlagIcon className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Reportes de usuarios</h1>
          <p className="text-sm text-slate-500">Usuarios reportados desde el chat al bloquear.</p>
        </div>
        <div className="ml-auto flex gap-3 text-sm">
          <span className="rounded-full bg-red-50 px-3 py-1 font-semibold text-red-700">{pendientes} pendientes</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-500">{reportes.length} total</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 w-fit">
          {FILTROS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filtro === f.key ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {cargando ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" /> Cargando…
        </div>
      ) : error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      ) : filtrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
          <FlagIcon className="h-10 w-10 text-slate-200 mb-3" />
          <p className="text-sm font-medium text-slate-500">No hay reportes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtrados.map((r) => (
            <FilaReporte
              key={r.id}
              reporte={r}
              onResolver={handleResolver}
              onEliminar={handleEliminar}
              procesando={procesando}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReportesAdmin;
