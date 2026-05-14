import { useEffect, useState } from "react";
import {
  StarIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { listarTodasValoraciones, eliminarValoracionAdmin } from "api/admin";
import Avatar from "components/Avatar";

function Estrellas({ valor }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) =>
        n <= valor
          ? <StarSolid key={n} className="h-3.5 w-3.5 text-amber-400" />
          : <StarIcon   key={n} className="h-3.5 w-3.5 text-slate-200" />
      )}
    </div>
  );
}

function ModalConfirmar({ mensaje, onConfirmar, onCancelar }) {
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
            className="flex-1 rounded-full py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

const FILTROS_ESTRELLAS = [
  { key: "todas", label: "Todas" },
  { key: "5", label: "★ 5" },
  { key: "4", label: "★ 4" },
  { key: "3", label: "★ 3" },
  { key: "2", label: "★ 2" },
  { key: "1", label: "★ 1" },
];

const PAGE_SIZE = 15;

function ValoracionesAdmin() {
  const [valoraciones, setValoraciones] = useState([]);
  const [cargando, setCargando]         = useState(true);
  const [error, setError]               = useState("");
  const [busqueda, setBusqueda]         = useState("");
  const [filtroEstrellas, setFiltroEstrellas] = useState("todas");
  const [procesando, setProcesando]     = useState(null);
  const [modal, setModal]               = useState(null);
  const [pagina, setPagina]             = useState(1);

  useEffect(() => {
    listarTodasValoraciones()
      .then(setValoraciones)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  const filtradas = valoraciones.filter((v) => {
    const coincideBusqueda =
      v.clienteNombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.comentario?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstrellas =
      filtroEstrellas === "todas" || String(v.estrellas) === filtroEstrellas;
    return coincideBusqueda && coincideEstrellas;
  });

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / PAGE_SIZE));
  const paginaActual = Math.min(pagina, totalPaginas);
  const paginadas   = filtradas.slice((paginaActual - 1) * PAGE_SIZE, paginaActual * PAGE_SIZE);

  function cambiarFiltro(v) { setFiltroEstrellas(v); setPagina(1); }
  function cambiarBusqueda(v) { setBusqueda(v); setPagina(1); }

  async function handleEliminar(valoracion) {
    setProcesando(valoracion.id);
    try {
      await eliminarValoracionAdmin(valoracion.id);
      setValoraciones((prev) => prev.filter((v) => v.id !== valoracion.id));
    } catch (e) {
      alert(e.message);
    } finally {
      setProcesando(null);
      setModal(null);
    }
  }

  const mediaGlobal = valoraciones.length
    ? (valoraciones.reduce((s, v) => s + v.estrellas, 0) / valoraciones.length).toFixed(1)
    : "—";

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
          <StarIcon className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Valoraciones</h1>
          <p className="text-sm text-slate-500">Modera las reseñas dejadas por los clientes.</p>
        </div>
        <div className="ml-auto flex gap-3 text-sm">
          <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">{valoraciones.length} reseñas</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-500">Media {mediaGlobal} ★</span>
        </div>
      </div>

      {/* Controles */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente o comentario…"
            value={busqueda}
            onChange={(e) => cambiarBusqueda(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>
        <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
          {FILTROS_ESTRELLAS.map((f) => (
            <button
              key={f.key}
              onClick={() => cambiarFiltro(f.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filtroEstrellas === f.key ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
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
      ) : filtradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
          <StarIcon className="h-10 w-10 text-slate-200 mb-3" />
          <p className="text-sm font-medium text-slate-500">No hay valoraciones que coincidan</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Comentario</th>
                <th className="px-4 py-3 text-center">Estrellas</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginadas.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar
                        src={v.clienteFotoUrl}
                        nombre={v.clienteNombre}
                        className="h-8 w-8 rounded-full shrink-0"
                        iconFallback
                      />
                      <span className="font-medium text-slate-800 truncate max-w-[140px]">
                        {v.clienteNombre ?? "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-600 line-clamp-2 max-w-xs leading-snug">
                      {v.comentario ?? <span className="italic text-slate-300">Sin comentario</span>}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <Estrellas valor={v.estrellas} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {v.fecha
                      ? new Date(v.fecha).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <button
                        onClick={() => setModal(v)}
                        disabled={procesando === v.id}
                        title="Eliminar valoración"
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
                {(paginaActual - 1) * PAGE_SIZE + 1}–{Math.min(paginaActual * PAGE_SIZE, filtradas.length)} de {filtradas.length}
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
                              ? "bg-amber-500 text-white"
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

      {modal && (
        <ModalConfirmar
          mensaje={`¿Eliminar la reseña de "${modal.clienteNombre}"? Esta acción no se puede deshacer.`}
          onConfirmar={() => handleEliminar(modal)}
          onCancelar={() => setModal(null)}
        />
      )}
    </div>
  );
}

export default ValoracionesAdmin;
