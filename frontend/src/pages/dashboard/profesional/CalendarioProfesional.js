import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addMinutes } from "date-fns";
import { es } from "date-fns/locale";
import { obtenerMisSolicitudes } from "api/reservas";
import {
  CalendarDaysIcon,
  ArrowPathIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { CalendarDaysIcon as CalendarSolid } from "@heroicons/react/24/solid";
import { useLanguage } from "context/LanguageContext";
import API_URL from "api/config";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { locale: es }),
  getDay,
  locales: { es },
});

const MENSAJES = {
  allDay: "Todo el día",
  previous: "‹",
  next: "›",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Servicio",
  showMore: (n) => `+${n} más`,
  noEventsInRange: "Sin servicios este período.",
};

const ESTADO_META = {
  PENDIENTE:  { color: "bg-amber-100 text-amber-700 ring-amber-200",       dot: "bg-amber-400",   evento: "#f59e0b", label: "Pendiente" },
  CONFIRMADA: { color: "bg-emerald-100 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500", evento: "#10b981", label: "Pagada" },
  COMPLETADA: { color: "bg-slate-100 text-slate-600 ring-slate-200",       dot: "bg-slate-400",   evento: "#94a3b8", label: "Completada" },
  CANCELADA:  { color: "bg-red-100 text-red-600 ring-red-200",             dot: "bg-red-400",     evento: "#f87171", label: "Cancelada" },
};

function BadgeEstado({ reserva }) {
  const meta = ESTADO_META[reserva.estado] ?? ESTADO_META.COMPLETADA;
  const label = reserva.estado === "CONFIRMADA" && reserva.estadoPago === "PAGADO"
    ? "Pagada"
    : reserva.estado === "CONFIRMADA"
      ? "Pendiente de pago"
      : meta.label;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${meta.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {label}
    </span>
  );
}

function BarraProgreso({ progreso }) {
  const pct = Math.max(0, Math.min(100, progreso ?? 0));
  const color = pct === 100 ? "bg-emerald-500" : pct >= 66 ? "bg-blue-500" : pct >= 33 ? "bg-amber-400" : "bg-slate-300";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-full bg-slate-100 overflow-hidden h-1.5">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-slate-600 tabular-nums w-7 text-right">{pct}%</span>
    </div>
  );
}

function ModalEvento({ reserva, onCerrar, navigate }) {
  const { idioma, tx } = useLanguage();
  const locale = idioma === "en" ? "en-GB" : "es-ES";

  const foto = reserva.clienteFotoUrl
    ? reserva.clienteFotoUrl.startsWith("http") ? reserva.clienteFotoUrl : API_URL + reserva.clienteFotoUrl
    : null;
  const iniciales = (reserva.clienteNombre ?? "?").split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();

  const fechaServicio = reserva.fechaInicio
    ? new Date(reserva.fechaInicio).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : null;
  const horaServicio = reserva.fechaInicio
    ? new Date(reserva.fechaInicio).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm" onClick={onCerrar}>
      <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 flex justify-end">
          <button
            onClick={onCerrar}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow hover:bg-slate-50 transition"
            aria-label={tx("Cerrar")}>
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          <div className={`h-1.5 w-full ${
            reserva.estado === "CONFIRMADA" ? "bg-emerald-400" :
            reserva.estado === "PENDIENTE"  ? "bg-amber-400" :
            reserva.estado === "COMPLETADA" ? "bg-slate-300" : "bg-red-300"
          }`} />

          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-slate-900 text-sm leading-snug">{reserva.servicioTitulo}</h3>
              <BadgeEstado reserva={reserva} />
            </div>

            <div className="flex items-center gap-2.5">
              {foto ? (
                <img src={foto} alt="" className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200" />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">
                  {iniciales}
                </span>
              )}
              <span className="text-sm font-medium text-slate-700">{reserva.clienteNombre}</span>
            </div>

            {fechaServicio && (
              <div className="rounded-xl bg-slate-50 px-3.5 py-2.5 flex items-center justify-between gap-2">
                <div className="text-sm">
                  <span className="font-medium text-slate-700 capitalize">{fechaServicio}</span>
                  {horaServicio && (
                    <span className="ml-2 text-slate-400">{horaServicio}</span>
                  )}
                </div>
                <span className="font-bold text-slate-900 tabular-nums text-sm">
                  {Number(reserva.precioTotal).toFixed(2)}€
                </span>
              </div>
            )}

            {reserva.estado === "CONFIRMADA" && reserva.estadoPago === "PAGADO" && (
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1.5">{tx("Progreso")}</p>
                <BarraProgreso progreso={reserva.progreso} />
                {reserva.notasProgreso && (
                  <p className="mt-2 text-xs text-slate-500 italic leading-relaxed border-l-2 border-slate-200 pl-2">
                    {reserva.notasProgreso}
                  </p>
                )}
              </div>
            )}

            {reserva.descripcion && (
              <p className="text-xs text-slate-500 leading-relaxed border-l-2 border-slate-200 pl-3 line-clamp-3">
                {reserva.descripcion}
              </p>
            )}

            <div className="flex gap-2">
              {["PENDIENTE", "CONFIRMADA"].includes(reserva.estado) && (
                <button
                  onClick={() => { onCerrar(); navigate(`/dashboard/profesional/mensajes/reserva/${reserva.id}`); }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" />
                  {tx("Chat")}
                </button>
              )}
              <button
                onClick={() => { onCerrar(); navigate("/dashboard/profesional/solicitudes"); }}
                className="flex-1 rounded-full bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
              >
                {tx("Ver detalles")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventoCalendario({ event }) {
  const estado = event.resource?.estado;
  const color = ESTADO_META[estado]?.evento ?? "#94a3b8";
  const progreso = event.resource?.progreso;
  return (
    <div
      style={{ backgroundColor: color }}
      className="truncate rounded-md px-1.5 py-0.5 text-white text-[0.7rem] font-medium shadow-sm flex items-center gap-1"
    >
      <span className="truncate">{event.title}</span>
      {estado === "CONFIRMADA" && progreso > 0 && (
        <span className="shrink-0 text-white/80 text-[9px]">{progreso}%</span>
      )}
    </div>
  );
}

function reservasAEventos(reservas) {
  return reservas
    .filter((r) => r.fechaInicio && (r.estado === "COMPLETADA" || (r.estado === "CONFIRMADA" && r.estadoPago === "PAGADO")))
    .map((r) => {
      const start = new Date(r.fechaInicio);
      const duracion = r.duracionMin ?? 60;
      const end = addMinutes(start, duracion);
      return { id: r.id, title: r.servicioTitulo, start, end, resource: r };
    });
}

const FILTROS = ["todas", "CONFIRMADA", "COMPLETADA"];

function CalendarioProfesional() {
  const navigate = useNavigate();
  const { tx } = useLanguage();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("todas");
  const [eventoModal, setEventoModal] = useState(null);

  useEffect(() => {
    obtenerMisSolicitudes()
      .then(setReservas)
      .catch(() => setError(tx("No se pudieron cargar las reservas.")))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reservasFiltradas = filtro === "todas"
    ? reservas.filter((r) => r.estado === "COMPLETADA" || (r.estado === "CONFIRMADA" && r.estadoPago === "PAGADO"))
    : reservas.filter((r) => r.estado === filtro && (filtro !== "CONFIRMADA" || r.estadoPago === "PAGADO"));

  const eventos = useCallback(() => reservasAEventos(reservasFiltradas), [reservasFiltradas]);

  const confirmadas = reservas.filter((r) => r.estado === "CONFIRMADA" && r.estadoPago === "PAGADO");
  const progresoMedio = confirmadas.length > 0
    ? Math.round(confirmadas.reduce((sum, r) => sum + (r.progreso ?? 0), 0) / confirmadas.length)
    : null;

  if (loading) {
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
    <div>
      {/* Cabecera */}
      <div className="mb-6 flex items-center gap-4 flex-wrap">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
          <CalendarSolid className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{tx("Mi calendario")}</h1>
          <p className="text-sm text-slate-500">{tx("Visualiza tus servicios aceptados y pendientes.")}</p>
        </div>
        {progresoMedio !== null && (
          <div className="ml-auto rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-center">
            <p className="text-xs text-emerald-600 font-medium">{tx("Progreso medio")}</p>
            <p className="text-xl font-bold text-emerald-700">{progresoMedio}%</p>
            <p className="text-[10px] text-emerald-500">{confirmadas.length} {tx("en curso")}</p>
          </div>
        )}
      </div>

      {/* Estadísticas rápidas */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { estado: "PENDIENTE",  label: tx("Pendientes"),  bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-100", disabled: true },
          { estado: "CONFIRMADA", label: tx("Pagadas"),     bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
          { estado: "COMPLETADA", label: tx("Completadas"), bg: "bg-slate-50",   text: "text-slate-600",   border: "border-slate-100" },
          { estado: "CANCELADA",  label: tx("Canceladas"),  bg: "bg-red-50",     text: "text-red-600",     border: "border-red-100" },
        ].map(({ estado, label, bg, text, border, disabled }) => (
          <button
            key={estado}
            onClick={() => !disabled && setFiltro(filtro === estado ? "todas" : estado)}
            className={`rounded-xl border ${border} ${bg} p-3 text-center transition ${disabled ? "cursor-default" : "hover:opacity-80"} ${filtro === estado ? "ring-2 ring-offset-1 ring-current" : ""}`}
          >
            <p className={`text-2xl font-bold ${text}`}>
              {estado === "CONFIRMADA"
                ? reservas.filter((r) => r.estado === estado && r.estadoPago === "PAGADO").length
                : reservas.filter((r) => r.estado === estado).length}
            </p>
            <p className={`text-xs font-medium ${text} opacity-80`}>{label}</p>
            {disabled && <p className={`mt-0.5 text-[10px] ${text} opacity-60`}>{tx("No entra en calendario")}</p>}
          </button>
        ))}
      </div>

      {/* Filtro textual */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              filtro === f
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f === "todas" ? tx("Todas") : ESTADO_META[f]?.label ?? f}
            <span className="ml-1.5 opacity-60">
              {f === "todas"
                ? reservas.filter((r) => r.estado === "COMPLETADA" || (r.estado === "CONFIRMADA" && r.estadoPago === "PAGADO")).length
                : f === "CONFIRMADA"
                  ? reservas.filter((r) => r.estado === f && r.estadoPago === "PAGADO").length
                  : reservas.filter((r) => r.estado === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Leyenda */}
      <div className="mb-4 flex flex-wrap gap-3">
        {Object.entries(ESTADO_META).map(([estado, meta]) => (
          <span key={estado} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: meta.evento }} />
            {meta.label}
          </span>
        ))}
      </div>

      {/* Calendario */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {reservasFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CalendarDaysIcon className="h-10 w-10 text-slate-200 mb-3" />
            <p className="text-sm font-medium text-slate-500">
              {filtro !== "todas"
                ? tx("No tienes servicios {estado}", { estado: (ESTADO_META[filtro]?.label ?? filtro).toLowerCase() })
                : tx("No tienes servicios todavía")}
            </p>
          </div>
        ) : (
          <Calendar
            localizer={localizer}
            events={eventos()}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 580 }}
            culture="es"
            messages={MENSAJES}
            defaultView="month"
            views={["month", "week", "day", "agenda"]}
            components={{ event: EventoCalendario }}
            onSelectEvent={(event) => setEventoModal(event.resource)}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: ESTADO_META[event.resource?.estado]?.evento ?? "#94a3b8",
                border: "none",
                borderRadius: "6px",
              },
            })}
            popup
          />
        )}
      </div>

      {eventoModal && (
        <ModalEvento
          reserva={eventoModal}
          onCerrar={() => setEventoModal(null)}
          navigate={navigate}
        />
      )}
    </div>
  );
}

export default CalendarioProfesional;
