import { useEffect, useState } from "react";
import { CalendarDaysIcon, ArrowPathIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { listarTodasReservas, cancelarReservaAdmin } from "api/admin";
import { useLanguage } from "context/LanguageContext";

const ESTADO_COLORES = {
  PENDIENTE:  "bg-amber-100 text-amber-700 ring-amber-200",
  CONFIRMADA: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  COMPLETADA: "bg-slate-100 text-slate-600 ring-slate-200",
  CANCELADA:  "bg-red-100 text-red-600 ring-red-200",
  RECHAZADA:  "bg-red-100 text-red-600 ring-red-200",
};

const ESTADOS_LABEL = {
  PENDIENTE:  "Pendiente",
  CONFIRMADA: "Aceptada",
  COMPLETADA: "Completada",
  CANCELADA:  "Cancelada",
  RECHAZADA:  "Rechazada",
};

function BadgeEstado({ estado }) {
  const label = ESTADOS_LABEL[estado] || estado;
  const color = ESTADO_COLORES[estado] ?? "bg-slate-100 text-slate-600 ring-slate-200";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${color}`}>
      {label}
    </span>
  );
}

function ReservasAdmin() {
  const { idioma, tx } = useLanguage();
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState("");
  const [filtro, setFiltro]     = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [accionando, setAccionando] = useState(null);

  useEffect(() => {
    listarTodasReservas()
      .then(setReservas)
      .catch(() => setError(tx("No se pudieron cargar las reservas.")))
      .finally(() => setCargando(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCancelar(reserva) {
    if (!window.confirm(tx("¿Cancelar la reserva #{id}?", { id: reserva.id }))) return;
    setAccionando(reserva.id);
    try {
      const actualizada = await cancelarReservaAdmin(reserva.id);
      setReservas((prev) => prev.map((r) => r.id === actualizada.id ? { ...r, estado: actualizada.estado } : r));
    } catch (err) {
      alert(err.message);
    } finally {
      setAccionando(null);
    }
  }

  const estados = ["todas", "PENDIENTE", "CONFIRMADA", "COMPLETADA", "CANCELADA", "RECHAZADA"];

  const filtradas = reservas.filter((r) => {
    const coincideEstado = filtro === "todas" || r.estado === filtro;
    const coincideBusqueda =
      busqueda === "" ||
      (r.servicioTitulo ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (r.clienteNombre ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (r.profesionalNombre ?? "").toLowerCase().includes(busqueda.toLowerCase());
    return coincideEstado && coincideBusqueda;
  });

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
        <h1 className="text-xl font-semibold text-slate-900">{tx("Reservas")}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {tx("{count} reservas en total.", { count: reservas.length })}
        </p>
      </div>

      <input
        type="text"
        placeholder={tx("Buscar por cliente, profesional o servicio...")}
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
      />

      <div className="flex flex-wrap gap-2">
        {estados.map((e) => (
          <button
            key={e}
            onClick={() => setFiltro(e)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filtro === e
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {e === "todas" ? tx("Todos") : ESTADOS_LABEL[e] || e}
            {` (${e === "todas" ? reservas.length : reservas.filter((r) => r.estado === e).length})`}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {filtradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <CalendarDaysIcon className="h-10 w-10 mb-3" />
            <p className="text-sm font-medium text-slate-600">{tx("No hay reservas que coincidan")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  <th className="px-4 py-3">{tx("#")}</th>
                  <th className="px-4 py-3">{tx("Servicio")}</th>
                  <th className="px-4 py-3">{tx("Cliente")}</th>
                  <th className="px-4 py-3">{tx("Profesional")}</th>
                  <th className="px-4 py-3">{tx("Fecha")}</th>
                  <th className="px-4 py-3">{tx("Estado")}</th>
                  <th className="px-4 py-3 text-right">{tx("Precio")}</th>
                  <th className="px-4 py-3 text-right">{tx("Acciones")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtradas.map((r) => {
                  const enProceso = accionando === r.id;
                  return (
                    <tr key={r.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 text-slate-400 text-xs">{r.id}</td>
                      <td className="px-4 py-3 font-medium text-slate-900 max-w-[160px] truncate">{r.servicioTitulo ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-600">{r.clienteNombre ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-600">{r.profesionalNombre ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {r.fechaCreacion
                          ? new Date(r.fechaCreacion).toLocaleDateString(idioma === "en" ? "en-GB" : "es-ES", { day: "numeric", month: "short", year: "numeric" })
                          : "—"}
                      </td>
                      <td className="px-4 py-3"><BadgeEstado estado={r.estado} /></td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-700">
                        {Number(r.precioTotal ?? 0).toFixed(2)}€
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {(r.estado === "PENDIENTE" || r.estado === "CONFIRMADA") && (
                            <button
                              onClick={() => handleCancelar(r)}
                              disabled={enProceso}
                              title={tx("Cancelar reserva")}
                              className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 transition disabled:opacity-50"
                            >
                              {enProceso ? <ArrowPathIcon className="h-3 w-3 animate-spin" /> : <XCircleIcon className="h-3.5 w-3.5" />}
                              {tx("Cancelar")}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReservasAdmin;
