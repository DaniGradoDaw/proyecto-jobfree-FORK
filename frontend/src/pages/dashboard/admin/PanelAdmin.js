import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UsersIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  StarIcon,
  TagIcon,
  ArrowPathIcon,
  BanknotesIcon,
  WrenchScrewdriverIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";
import { useLanguage } from "context/LanguageContext";
import { listarUsuarios, listarTodasReservas, listarTodosPagos, listarTodosServicios, listarTodasValoraciones, listarTodosReportes } from "api/admin";
import { obtenerCategorias } from "api/categorias";

const ESTADOS_RESERVA = {
  PENDIENTE:  "Pendiente",
  CONFIRMADA: "Aceptada",
  COMPLETADA: "Completada",
  CANCELADA:  "Cancelada",
  RECHAZADA:  "Rechazada",
};

function badgeEstadoColor(estado) {
  const mapa = {
    PENDIENTE:  "bg-amber-100 text-amber-700 ring-amber-200",
    CONFIRMADA: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    COMPLETADA: "bg-slate-100 text-slate-600 ring-slate-200",
    CANCELADA:  "bg-red-100 text-red-600 ring-red-200",
    RECHAZADA:  "bg-red-100 text-red-600 ring-red-200",
  };
  return mapa[estado] ?? "bg-slate-100 text-slate-600 ring-slate-200";
}

function StatCard({ icono: Icono, label, valor, sublabel, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition text-left w-full"
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icono className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-slate-900">{valor ?? "—"}</p>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{label}</p>
        {sublabel && <p className="text-xs font-medium text-emerald-600 mt-0.5 truncate">{sublabel}</p>}
      </div>
    </button>
  );
}

function PanelAdmin() {
  const navigate = useNavigate();
  const { tx } = useLanguage();
  const [stats, setStats] = useState(null);
  const [ultimasReservas, setUltimasReservas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      listarUsuarios(),
      listarTodasReservas(),
      listarTodosPagos(),
      listarTodosServicios(),
      listarTodasValoraciones(),
      listarTodosReportes(),
      obtenerCategorias(),
    ])
      .then(([usuarios, reservas, pagos, servicios, valoraciones, reportes, categorias]) => {
        const ingresos = pagos
          .filter((p) => p.estado === "PAGADO")
          .reduce((acc, p) => acc + Number(p.importe ?? 0), 0);

        setStats({
          usuarios: usuarios.length,
          clientes: usuarios.filter((u) => u.rol === "CLIENTE").length,
          profesionales: usuarios.filter((u) => u.rol === "PROFESIONAL").length,
          reservas: reservas.length,
          reservasPendientes: reservas.filter((r) => r.estado === "PENDIENTE").length,
          pagos: pagos.length,
          ingresos,
          servicios: servicios.length,
          serviciosActivos: servicios.filter((s) => s.activa).length,
          valoraciones: valoraciones.length,
          reportes: reportes.length,
          reportesPendientes: reportes.filter((r) => !r.resuelto).length,
          categorias: categorias.length,
        });
        setUltimasReservas(
          [...reservas]
            .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
            .slice(0, 6)
        );
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
        {tx("Cargando...")}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{tx("Panel de administración")}</h1>
        <p className="mt-1 text-sm text-slate-500">{tx("Resumen general de la plataforma.")}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        <StatCard
          icono={UsersIcon}
          label={tx("Usuarios registrados")}
          sublabel={`${stats?.clientes ?? 0} clientes · ${stats?.profesionales ?? 0} prof.`}
          valor={stats?.usuarios}
          color="bg-violet-100 text-violet-600"
          onClick={() => navigate("/dashboard/admin/usuarios")}
        />
        <StatCard
          icono={CalendarDaysIcon}
          label={tx("Reservas totales")}
          sublabel={stats?.reservasPendientes > 0 ? `${stats.reservasPendientes} pendientes` : null}
          valor={stats?.reservas}
          color="bg-emerald-100 text-emerald-600"
          onClick={() => navigate("/dashboard/admin/reservas")}
        />
        <StatCard
          icono={CreditCardIcon}
          label={tx("Pagos registrados")}
          valor={stats?.pagos}
          color="bg-sky-100 text-sky-600"
          onClick={() => navigate("/dashboard/admin/pagos")}
        />
        <StatCard
          icono={BanknotesIcon}
          label={tx("Ingresos reales")}
          valor={`${(stats?.ingresos ?? 0).toFixed(0)}€`}
          color="bg-teal-100 text-teal-600"
          onClick={() => navigate("/dashboard/admin/pagos")}
        />
        <StatCard
          icono={WrenchScrewdriverIcon}
          label={tx("Servicios")}
          sublabel={stats?.serviciosActivos != null ? `${stats.serviciosActivos} activos` : null}
          valor={stats?.servicios}
          color="bg-blue-100 text-blue-600"
          onClick={() => navigate("/dashboard/admin/servicios")}
        />
        <StatCard
          icono={StarIcon}
          label={tx("Valoraciones")}
          valor={stats?.valoraciones}
          color="bg-amber-100 text-amber-600"
          onClick={() => navigate("/dashboard/admin/valoraciones")}
        />
        <StatCard
          icono={FlagIcon}
          label={tx("Reportes")}
          sublabel={stats?.reportesPendientes > 0 ? `${stats.reportesPendientes} pendientes` : null}
          valor={stats?.reportes}
          color="bg-red-100 text-red-600"
          onClick={() => navigate("/dashboard/admin/reportes")}
        />
        <StatCard
          icono={TagIcon}
          label={tx("Categorias")}
          valor={stats?.categorias}
          color="bg-pink-100 text-pink-600"
          onClick={() => navigate("/dashboard/admin/categorias")}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-800">{tx("Ultimas reservas")}</h2>
          <button onClick={() => navigate("/dashboard/admin/reservas")} className="text-xs text-emerald-600 hover:underline font-medium">
            {tx("Ver todas")} →
          </button>
        </div>

        {ultimasReservas.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">{tx("No hay reservas todavía.")}</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {ultimasReservas.map((r) => (
              <div key={r.id} className="flex items-center gap-4 px-5 py-3">
                <span className="text-xs text-slate-400 w-6 shrink-0">#{r.id}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{r.servicioTitulo ?? "—"}</p>
                  <p className="text-xs text-slate-500 truncate">{r.clienteNombre ?? "—"} → {r.profesionalNombre ?? "—"}</p>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 shrink-0 ${badgeEstadoColor(r.estado)}`}>
                  {ESTADOS_RESERVA[r.estado] || r.estado}
                </span>
                <span className="text-sm font-semibold text-slate-700 shrink-0">
                  {Number(r.precioTotal ?? 0).toFixed(2)}€
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PanelAdmin;
