import { useEffect, useState } from "react";
import { BellIcon, ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import { listarTodasNotificaciones, eliminarNotificacionAdmin } from "api/admin";
import { useLanguage } from "context/LanguageContext";

function NotificacionesAdmin() {
  const { idioma, tx } = useLanguage();
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando]             = useState(true);
  const [error, setError]                   = useState("");
  const [filtro, setFiltro]                 = useState("todas");
  const [busqueda, setBusqueda]             = useState("");
  const [eliminando, setEliminando]         = useState(null);

  useEffect(() => {
    listarTodasNotificaciones()
      .then(setNotificaciones)
      .catch(() => setError(tx("No se pudieron cargar las notificaciones.")))
      .finally(() => setCargando(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleEliminar(id) {
    setEliminando(id);
    try {
      await eliminarNotificacionAdmin(id);
      setNotificaciones((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setEliminando(null);
    }
  }

  const filtradas = notificaciones.filter((n) => {
    const coincideLeida =
      filtro === "todas" ||
      (filtro === "leidas" && n.leida) ||
      (filtro === "noLeidas" && !n.leida);
    const coincideBusqueda =
      busqueda === "" ||
      (n.mensaje ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (n.usuarioEmail ?? "").toLowerCase().includes(busqueda.toLowerCase());
    return coincideLeida && coincideBusqueda;
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

  const sinLeer = notificaciones.filter((n) => !n.leida).length;

  const filtroOpciones = [
    { key: "todas",    label: tx("Todas") },
    { key: "noLeidas", label: tx("Sin leer") },
    { key: "leidas",   label: tx("Leidas") },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{tx("Notificaciones")}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {tx("{total} en total", { total: notificaciones.length })}
          {" · "}
          <span className="text-amber-600 font-medium">
            {tx("{count} sin leer", { count: sinLeer })}
          </span>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder={tx("Buscar por mensaje o email...")}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
        />
        <div className="flex gap-2">
          {filtroOpciones.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFiltro(key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
                filtro === key
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {filtradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <BellIcon className="h-10 w-10 mb-3" />
            <p className="text-sm font-medium text-slate-600">{tx("No hay notificaciones")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  <th className="px-4 py-3">{tx("#")}</th>
                  <th className="px-4 py-3">{tx("Usuario")}</th>
                  <th className="px-4 py-3">{tx("Mensaje")}</th>
                  <th className="px-4 py-3">{tx("Leida")}</th>
                  <th className="px-4 py-3">{tx("Fecha")}</th>
                  <th className="px-4 py-3 text-right">{tx("Acciones")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtradas.map((n) => (
                  <tr key={n.id} className={`transition ${!n.leida ? "bg-amber-50/40 hover:bg-amber-50" : "hover:bg-slate-50"}`}>
                    <td className="px-4 py-3 text-slate-400 text-xs">{n.id}</td>
                    <td className="px-4 py-3 text-slate-600">{n.usuarioEmail ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-800 max-w-xs truncate">{n.mensaje ?? "—"}</td>
                    <td className="px-4 py-3">
                      {n.leida ? (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 bg-slate-100 text-slate-500 ring-slate-200">
                          {tx("Leida")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 bg-amber-100 text-amber-700 ring-amber-200">
                          {tx("Sin leer")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {n.fechaCreacion
                        ? new Date(n.fechaCreacion).toLocaleDateString(idioma === "en" ? "en-GB" : "es-ES", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleEliminar(n.id)}
                        disabled={eliminando === n.id}
                        className="inline-flex items-center justify-center rounded-full p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
                      >
                        {eliminando === n.id
                          ? <ArrowPathIcon className="h-4 w-4 animate-spin" />
                          : <TrashIcon className="h-4 w-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificacionesAdmin;
