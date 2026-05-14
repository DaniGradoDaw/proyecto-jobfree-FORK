import { useEffect, useState } from "react";
import { CreditCardIcon, ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { listarTodosPagos } from "api/admin";
import { useLanguage } from "context/LanguageContext";

const ESTADO_COLORES = {
  PENDIENTE:    "bg-amber-100 text-amber-700 ring-amber-200",
  PAGADO:       "bg-emerald-100 text-emerald-700 ring-emerald-200",
  REEMBOLSADO:  "bg-sky-100 text-sky-700 ring-sky-200",
  FALLIDO:      "bg-red-100 text-red-600 ring-red-200",
};

const ESTADOS_LABEL = {
  PENDIENTE:   "Pendiente",
  PAGADO:      "Pagado",
  REEMBOLSADO: "Reembolsado",
  FALLIDO:     "Fallido",
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

function PagosAdmin() {
  const { tx } = useLanguage();
  const [pagos, setPagos]           = useState([]);
  const [cargando, setCargando]     = useState(true);
  const [error, setError]           = useState("");
  const [filtro, setFiltro]     = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    listarTodosPagos()
      .then(setPagos)
      .catch(() => setError(tx("No se pudieron cargar los pagos.")))
      .finally(() => setCargando(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const estados = ["todos", "PENDIENTE", "PAGADO", "REEMBOLSADO", "FALLIDO"];

  const filtrados = pagos.filter((p) => {
    const coincideFiltro = filtro === "todos" || p.estado === filtro;
    const coincideBusqueda =
      busqueda === "" ||
      String(p.reservaId ?? "").includes(busqueda) ||
      String(p.id).includes(busqueda) ||
      (p.metodo ?? "").toLowerCase().includes(busqueda.toLowerCase());
    return coincideFiltro && coincideBusqueda;
  });

  const totalImporte = filtrados.reduce((acc, p) => acc + Number(p.importe ?? 0), 0);
  const totalPagado  = pagos.filter((p) => p.estado === "PAGADO").reduce((acc, p) => acc + Number(p.importe ?? 0), 0);

  const labelFiltroActivo = filtro === "todos"
    ? tx("Todos").toLowerCase()
    : ESTADOS_LABEL[filtro] || filtro;

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
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{tx("Pagos")}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {tx("{count} pagos registrados en la plataforma.", { count: pagos.length })}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-right shadow-sm shrink-0">
            <p className="text-xs text-slate-500">{tx("Total")} ({labelFiltroActivo})</p>
            <p className="text-lg font-bold text-slate-900">{totalImporte.toFixed(2)} €</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-right shrink-0">
            <p className="text-xs text-emerald-600">{tx("Pagos completados")}</p>
            <p className="text-lg font-bold text-emerald-700">{totalPagado.toFixed(2)} €</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={tx("Buscar por ID, reserva o método de pago...")}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>
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
            {e === "todos" ? tx("Todos") : ESTADOS_LABEL[e] || e}
            {` (${e === "todos" ? pagos.length : pagos.filter((p) => p.estado === e).length})`}
          </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <CreditCardIcon className="h-10 w-10 mb-3" />
            <p className="text-sm font-medium text-slate-600">{tx("No hay pagos con este estado")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  <th className="px-4 py-3">{tx("#")}</th>
                  <th className="px-4 py-3">{tx("Reserva")}</th>
                  <th className="px-4 py-3">{tx("Metodo")}</th>
                  <th className="px-4 py-3">{tx("Estado")}</th>
                  <th className="px-4 py-3 text-right">{tx("Importe")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtrados.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-slate-400 text-xs">{p.id}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {p.reservaId ? `#${p.reservaId}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600 capitalize">
                      {p.metodo?.toLowerCase().replace("_", " ") ?? "—"}
                    </td>
                    <td className="px-4 py-3"><BadgeEstado estado={p.estado} /></td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-700">
                      {Number(p.importe ?? 0).toFixed(2)}€
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

export default PagosAdmin;
