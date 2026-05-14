import { useEffect, useState } from "react";
import {
  WrenchScrewdriverIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  listarTodosServicios,
  activarServicioAdmin,
  desactivarServicioAdmin,
  eliminarServicioAdmin,
} from "api/admin";

const FILTROS = [
  { key: "todos",     label: "Todos" },
  { key: "activos",   label: "Activos" },
  { key: "inactivos", label: "Inactivos" },
];

function BadgeActivo({ activa }) {
  return activa
    ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Activo
      </span>
    : <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />Inactivo
      </span>;
}

function ModalConfirmar({ mensaje, onConfirmar, onCancelar, peligro = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <p className="text-sm text-slate-700">{mensaje}</p>
        <div className="mt-5 flex gap-3">
          <button onClick={onCancelar} className="flex-1 rounded-full border border-slate-300 py-2 text-sm text-slate-600 hover:bg-slate-50 transition">
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className={`flex-1 rounded-full py-2 text-sm font-semibold text-white transition ${peligro ? "bg-red-600 hover:bg-red-700" : "bg-slate-800 hover:bg-slate-700"}`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 15;

function ServiciosAdmin() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [error, setError]         = useState("");
  const [busqueda, setBusqueda]   = useState("");
  const [filtro, setFiltro]       = useState("todos");
  const [procesando, setProcesando] = useState(null);
  const [modal, setModal]         = useState(null); // { tipo, servicio }
  const [pagina, setPagina]       = useState(1);

  useEffect(() => {
    listarTodosServicios()
      .then(setServicios)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  const filtrados = servicios.filter((s) => {
    const coincideBusqueda =
      s.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.nombreProfesional?.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.subcategoriaNombre?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideFiltro =
      filtro === "todos" ? true :
      filtro === "activos" ? s.activa :
      !s.activa;
    return coincideBusqueda && coincideFiltro;
  });

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE));
  const paginaActual = Math.min(pagina, totalPaginas);
  const paginados   = filtrados.slice((paginaActual - 1) * PAGE_SIZE, paginaActual * PAGE_SIZE);

  function cambiarFiltro(nuevoFiltro) { setFiltro(nuevoFiltro); setPagina(1); }
  function cambiarBusqueda(v) { setBusqueda(v); setPagina(1); }

  async function handleToggle(servicio) {
    setProcesando(servicio.id);
    try {
      const actualizado = servicio.activa
        ? await desactivarServicioAdmin(servicio.id)
        : await activarServicioAdmin(servicio.id);
      setServicios((prev) => prev.map((s) => s.id === actualizado.id ? { ...s, activa: actualizado.activa } : s));
    } catch (e) {
      alert(e.message);
    } finally {
      setProcesando(null);
      setModal(null);
    }
  }

  async function handleEliminar(servicio) {
    setProcesando(servicio.id);
    try {
      await eliminarServicioAdmin(servicio.id);
      setServicios((prev) => prev.filter((s) => s.id !== servicio.id));
    } catch (e) {
      alert(e.message);
    } finally {
      setProcesando(null);
      setModal(null);
    }
  }

  const totalActivos   = servicios.filter((s) => s.activa).length;
  const totalInactivos = servicios.filter((s) => !s.activa).length;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
          <WrenchScrewdriverIcon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Servicios publicados</h1>
          <p className="text-sm text-slate-500">Modera los servicios ofrecidos por los profesionales.</p>
        </div>
        <div className="ml-auto flex gap-3 text-sm">
          <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">{totalActivos} activos</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-500">{totalInactivos} inactivos</span>
        </div>
      </div>

      {/* Controles */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por título, profesional o categoría…"
            value={busqueda}
            onChange={(e) => cambiarBusqueda(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
          {FILTROS.map((f) => (
            <button
              key={f.key}
              onClick={() => cambiarFiltro(f.key)}
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
          <WrenchScrewdriverIcon className="h-10 w-10 text-slate-200 mb-3" />
          <p className="text-sm font-medium text-slate-500">No hay servicios que coincidan</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 text-left">Servicio</th>
                <th className="px-4 py-3 text-left">Profesional</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-right">Precio/h</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginados.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900 truncate max-w-xs">{s.titulo}</p>
                    <p className="text-xs text-slate-400">{s.duracionMin} min</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{s.nombreProfesional ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-500">{s.subcategoriaNombre ?? "—"}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800 tabular-nums">
                    {Number(s.precioHora).toFixed(2)} €
                  </td>
                  <td className="px-4 py-3 text-center">
                    <BadgeActivo activa={s.activa} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setModal({ tipo: "toggle", servicio: s })}
                        disabled={procesando === s.id}
                        title={s.activa ? "Desactivar" : "Activar"}
                        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                          s.activa
                            ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        } disabled:opacity-50`}
                      >
                        {s.activa
                          ? <><XCircleIcon className="h-3.5 w-3.5" />Desactivar</>
                          : <><CheckCircleIcon className="h-3.5 w-3.5" />Activar</>
                        }
                      </button>
                      <button
                        onClick={() => setModal({ tipo: "eliminar", servicio: s })}
                        disabled={procesando === s.id}
                        title="Eliminar servicio"
                        className="flex items-center justify-center rounded-full p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPaginas > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
              <span className="text-xs text-slate-400">
                {(paginaActual - 1) * PAGE_SIZE + 1}–{Math.min(paginaActual * PAGE_SIZE, filtrados.length)} de {filtrados.length}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setPagina((p) => Math.max(1, p - 1))}
                  disabled={paginaActual === 1}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition"
                >
                  ← Anterior
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                  .filter((n) => n === 1 || n === totalPaginas || Math.abs(n - paginaActual) <= 1)
                  .reduce((acc, n, idx, arr) => {
                    if (idx > 0 && n - arr[idx - 1] > 1) acc.push("…");
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((n, i) =>
                    n === "…"
                      ? <span key={`e${i}`} className="px-2 py-1.5 text-xs text-slate-400">…</span>
                      : <button
                          key={n}
                          onClick={() => setPagina(n)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                            n === paginaActual
                              ? "bg-blue-600 text-white"
                              : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >{n}</button>
                  )
                }
                <button
                  onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                  disabled={paginaActual === totalPaginas}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {modal?.tipo === "toggle" && (
        <ModalConfirmar
          mensaje={`¿${modal.servicio.activa ? "Desactivar" : "Activar"} el servicio "${modal.servicio.titulo}"?`}
          onConfirmar={() => handleToggle(modal.servicio)}
          onCancelar={() => setModal(null)}
        />
      )}
      {modal?.tipo === "eliminar" && (
        <ModalConfirmar
          mensaje={`¿Eliminar permanentemente "${modal.servicio.titulo}"? Se borrarán también sus reservas asociadas.`}
          onConfirmar={() => handleEliminar(modal.servicio)}
          onCancelar={() => setModal(null)}
          peligro
        />
      )}
    </div>
  );
}

export default ServiciosAdmin;
