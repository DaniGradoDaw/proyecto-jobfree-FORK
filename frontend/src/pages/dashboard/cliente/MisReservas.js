import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addHours } from "date-fns";
import { es } from "date-fns/locale";
import { obtenerMisReservas, cancelarReserva } from "api/reservas";
import {
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  XCircleIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  CreditCardIcon,
  ClockIcon,
  Bars3Icon,
  CalendarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CalendarDaysIcon as CalendarSolid } from "@heroicons/react/24/solid";
import API_URL from "api/config";
import { useLanguage } from "context/LanguageContext";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { locale: es }),
  getDay,
  locales: { es },
});

const MENSAJES_CALENDARIO = {
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
  PENDIENTE:  { color: "bg-amber-100 text-amber-700 ring-amber-200",       dot: "bg-amber-400",   evento: "#f59e0b" },
  CONFIRMADA: { color: "bg-emerald-100 text-emerald-700 ring-emerald-200", dot: "bg-emerald-400", evento: "#10b981" },
  COMPLETADA: { color: "bg-slate-100 text-slate-600 ring-slate-200",       dot: "bg-slate-400",   evento: "#94a3b8" },
  CANCELADA:  { color: "bg-red-100 text-red-600 ring-red-200",             dot: "bg-red-400",     evento: "#f87171" },
  RECHAZADA:  { color: "bg-red-100 text-red-600 ring-red-200",             dot: "bg-red-400",     evento: "#f87171" },
};

const FILTRO_COLORES = {
  todas:      { activo: "bg-slate-800 text-white",        inactivo: "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50" },
  PENDIENTE:  { activo: "bg-amber-500 text-white",        inactivo: "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100" },
  CONFIRMADA: { activo: "bg-emerald-500 text-white",      inactivo: "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
  COMPLETADA: { activo: "bg-slate-500 text-white",        inactivo: "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100" },
  CANCELADA:  { activo: "bg-red-500 text-white",          inactivo: "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100" },
};

function estadoTexto(estado, tx) {
  const map = { PENDIENTE: "Pendiente", CONFIRMADA: "Aceptada", COMPLETADA: "Completada", CANCELADA: "Cancelada", RECHAZADA: "Rechazada" };
  return tx(map[estado] ?? estado);
}

function BadgeEstado({ estado }) {
  const { tx } = useLanguage();
  const meta = ESTADO_META[estado] ?? ESTADO_META.COMPLETADA;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${meta.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {estadoTexto(estado, tx)}
    </span>
  );
}

function TarjetaReserva({ reserva, onCancelar, modoModal = false }) {
  const navigate = useNavigate();
  const { idioma, tx } = useLanguage();
  const locale = idioma === "en" ? "en-GB" : "es-ES";

  const foto = reserva.profesionalFotoUrl
    ? reserva.profesionalFotoUrl.startsWith("http")
      ? reserva.profesionalFotoUrl
      : API_URL + reserva.profesionalFotoUrl
    : null;

  const iniciales = (reserva.profesionalNombre ?? "?")
    .split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();

  const puedeChat     = ["PENDIENTE", "CONFIRMADA"].includes(reserva.estado);
  const puedeCancelar = ["PENDIENTE", "CONFIRMADA"].includes(reserva.estado) && !modoModal;
  const puedePagar    = reserva.estado === "CONFIRMADA";

  const fechaServicio = reserva.fechaInicio
    ? new Date(reserva.fechaInicio).toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    : null;
  const horaServicio = reserva.fechaInicio
    ? new Date(reserva.fechaInicio).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
    : null;

  const activa = ["PENDIENTE", "CONFIRMADA"].includes(reserva.estado);

  return (
    <article className={`flex flex-col rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md ${activa ? "border-slate-200" : "border-slate-100 opacity-80"}`}>
      <div className={`h-1 w-full rounded-t-2xl ${
        reserva.estado === "CONFIRMADA" ? "bg-emerald-400" :
        reserva.estado === "PENDIENTE"  ? "bg-amber-400" :
        reserva.estado === "COMPLETADA" ? "bg-slate-300" : "bg-red-300"
      }`} />

      <div className="flex flex-col gap-3.5 p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900 leading-snug pr-2">{reserva.servicioTitulo}</h2>
          <BadgeEstado estado={reserva.estado} />
        </div>

        <div className="flex items-center gap-2">
          {foto ? (
            <img src={foto} alt="" className="h-7 w-7 shrink-0 rounded-lg object-cover" />
          ) : (
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-100 text-[11px] font-bold text-green-700">
              {iniciales}
            </div>
          )}
          <p className="text-sm text-slate-600 font-medium">{reserva.profesionalNombre}</p>
        </div>

        {reserva.descripcion && (
          <p className="line-clamp-2 border-l-2 border-slate-200 pl-3 text-sm leading-relaxed text-slate-500">
            {reserva.descripcion}
          </p>
        )}

        {reserva.estado === "CONFIRMADA" && (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-emerald-700">{tx("Progreso del servicio")}</span>
              <span className="text-xs font-bold text-emerald-700 tabular-nums">{reserva.progreso ?? 0}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-emerald-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${reserva.progreso ?? 0}%` }}
              />
            </div>
            {reserva.notasProgreso && (
              <p className="mt-2 text-xs text-emerald-700/80 italic leading-relaxed">
                {reserva.notasProgreso}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3.5 py-2.5">
          <div className="flex items-center gap-2 text-sm">
            {fechaServicio ? (
              <>
                <CalendarDaysIcon className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="font-medium text-slate-700">{fechaServicio}</span>
                {horaServicio && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <ClockIcon className="h-3.5 w-3.5" />
                    {horaServicio}
                  </span>
                )}
              </>
            ) : (
              <span className="text-slate-400 text-xs">{tx("Fecha no indicada")}</span>
            )}
          </div>
          <p className="font-bold text-slate-900 tabular-nums">
            {Number(reserva.precioTotal).toFixed(2)}€
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          {puedeChat && (
            <button
              onClick={() => navigate(`/dashboard/cliente/mensajes/reserva/${reserva.id}`)}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">
              <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" />
              {tx("Chat")}
            </button>
          )}
          {puedePagar && (
            <button
              onClick={() => navigate(`/dashboard/cliente/pagar/${reserva.id}`)}
              className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition">
              <CreditCardIcon className="h-3.5 w-3.5" />
              {tx("Pagar")}
            </button>
          )}
          {puedeCancelar && (
            <button
              onClick={() => onCancelar(reserva)}
              className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition">
              <XCircleIcon className="h-3.5 w-3.5" />
              {tx("Cancelar")}
            </button>
          )}
          {reserva.estado === "COMPLETADA" && !reserva.valorada && (
            <button
              onClick={() => navigate(`/dashboard/cliente/valorar/${reserva.id}`)}
              className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 transition">
              <span>⭐</span>
              {tx("Valorar")}
            </button>
          )}
          {reserva.estado === "COMPLETADA" && reserva.valorada && (
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-medium text-emerald-700">
              <CheckBadgeIcon className="h-3.5 w-3.5" />
              {tx("Ya valorado")}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function ModalReserva({ reserva, onCerrar }) {
  const { tx } = useLanguage();
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
        <TarjetaReserva reserva={reserva} onCancelar={() => {}} modoModal />
      </div>
    </div>
  );
}

function ModalConfirmarCancelar({ reserva, onConfirmar, onCancelar, cargando }) {
  const { tx } = useLanguage();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-[20px] bg-white p-6 shadow-2xl">
        <h3 className="text-base font-semibold text-slate-900">{tx("Cancelar esta reserva?")}</h3>
        <p className="mt-1 text-sm text-slate-500">
          {tx("Vas a cancelar la reserva de {servicio} con {profesional}. Esta accion no se puede deshacer.", {
            servicio: reserva.servicioTitulo,
            profesional: reserva.profesionalNombre,
          })}
        </p>
        <div className="mt-5 flex gap-3">
          <button onClick={onCancelar} className="flex-1 rounded-full border border-slate-300 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
            {tx("Volver")}
          </button>
          <button onClick={onConfirmar} disabled={cargando}
            className="flex-1 rounded-full bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-60">
            {cargando ? tx("Cancelando...") : tx("Si, cancelar")}
          </button>
        </div>
      </div>
    </div>
  );
}

function vistaCalendario(reservas) {
  return reservas
    .filter((r) => r.fechaInicio && r.estado !== "RECHAZADA")
    .map((r) => {
      const start = new Date(r.fechaInicio);
      const end = addHours(start, 1);
      return {
        id: r.id,
        title: r.servicioTitulo,
        start,
        end,
        resource: r,
      };
    });
}

function EventoCalendario({ event }) {
  const estado = event.resource?.estado;
  const color = ESTADO_META[estado]?.evento ?? "#94a3b8";
  return (
    <div style={{ backgroundColor: color }} className="truncate rounded-md px-1.5 py-0.5 text-white text-[0.7rem] font-medium shadow-sm">
      {event.title}
    </div>
  );
}

function MisReservas() {
  const { tx } = useLanguage();
  const [reservas, setReservas]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [filtro, setFiltro]         = useState("todas");
  const [vista, setVista]           = useState("lista");
  const [reservaACancelar, setReservaACancelar] = useState(null);
  const [reservaModal, setReservaModal]         = useState(null);
  const [cancelando, setCancelando] = useState(false);

  useEffect(() => {
    obtenerMisReservas()
      .then(setReservas)
      .catch(() => setError(tx("No se pudieron cargar tus reservas.")))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const estados = ["todas", "PENDIENTE", "CONFIRMADA", "COMPLETADA", "CANCELADA"];
  const reservasFiltradas = filtro === "todas"
    ? reservas
    : reservas.filter((r) => r.estado === filtro);

  const activas = reservas.filter((r) => ["PENDIENTE", "CONFIRMADA"].includes(r.estado)).length;

  const eventosCalendario = useCallback(() => vistaCalendario(reservas), [reservas]);

  async function handleCancelar() {
    if (!reservaACancelar) return;
    setCancelando(true);
    try {
      const actualizada = await cancelarReserva(reservaACancelar.id);
      setReservas((prev) => prev.map((r) => r.id === actualizada.id ? actualizada : r));
      window.dispatchEvent(new CustomEvent("reservas:actualizadas"));
      setReservaACancelar(null);
    } catch (err) {
      alert(err.message || tx("No se pudo cancelar la reserva."));
    } finally {
      setCancelando(false);
    }
  }

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
      <div className="mb-7 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
          <CalendarSolid className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{tx("Mis reservas")}</h1>
          <p className="text-sm text-slate-500">{tx("Seguimiento de todos tus servicios contratados.")}</p>
        </div>
        {activas > 0 && (
          <span className="ml-auto rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            {activas} {activas === 1 ? tx("activa") : tx("activas")}
          </span>
        )}
      </div>

      {/* Barra de controles: filtros + toggle de vista */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        {/* Filtros — solo visibles en lista */}
        {vista === "lista" && (
          <div className="flex flex-wrap gap-2">
            {estados.map((e) => {
              const colores = FILTRO_COLORES[e] ?? FILTRO_COLORES.todas;
              const count = e === "todas" ? reservas.length : reservas.filter((r) => r.estado === e).length;
              return (
                <button
                  key={e}
                  onClick={() => setFiltro(e)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${filtro === e ? colores.activo : colores.inactivo}`}
                >
                  {e === "todas" ? tx("Todas") : estadoTexto(e, tx)}
                  <span className={`ml-1.5 ${filtro === e ? "opacity-70" : "opacity-60"}`}>{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Toggle Lista / Calendario */}
        <div className="ml-auto flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => setVista("lista")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              vista === "lista" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Bars3Icon className="h-3.5 w-3.5" />
            {tx("Lista")}
          </button>
          <button
            onClick={() => setVista("calendario")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              vista === "calendario" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            {tx("Calendario")}
          </button>
        </div>
      </div>

      {/* Vista lista */}
      {vista === "lista" && (
        reservasFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
              <CalendarDaysIcon className="h-7 w-7 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-600">
              {filtro !== "todas"
                ? tx("No tienes reservas {estado}", { estado: estadoTexto(filtro, tx).toLowerCase() })
                : tx("No tienes reservas todavía")}
            </p>
            <p className="mt-1 text-xs text-slate-400">{tx("Cuando contrates un profesional, aparecera aquí.")}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {reservasFiltradas.map((r) => (
              <TarjetaReserva key={r.id} reserva={r} onCancelar={setReservaACancelar} />
            ))}
          </div>
        )
      )}

      {/* Vista calendario */}
      {vista === "calendario" && (
        <div>
          {/* Leyenda */}
          <div className="mb-4 flex flex-wrap gap-3">
            {[["PENDIENTE", "Pendiente"], ["CONFIRMADA", "Aceptada"], ["COMPLETADA", "Completada"], ["CANCELADA", "Cancelada"]].map(([estado, label]) => (
              <span key={estado} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ESTADO_META[estado].evento }} />
                {tx(label)}
              </span>
            ))}
          </div>

          <Calendar
            localizer={localizer}
            events={eventosCalendario()}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 560 }}
            culture="es"
            messages={MENSAJES_CALENDARIO}
            defaultView="month"
            views={["month", "week", "agenda"]}
            components={{ event: EventoCalendario }}
            onSelectEvent={(event) => setReservaModal(event.resource)}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: ESTADO_META[event.resource?.estado]?.evento ?? "#94a3b8",
                border: "none",
              },
            })}
            popup
          />
        </div>
      )}

      {/* Modal detalle desde calendario */}
      {reservaModal && (
        <ModalReserva reserva={reservaModal} onCerrar={() => setReservaModal(null)} />
      )}

      {/* Modal confirmar cancelación */}
      {reservaACancelar && (
        <ModalConfirmarCancelar
          reserva={reservaACancelar}
          onConfirmar={handleCancelar}
          onCancelar={() => setReservaACancelar(null)}
          cargando={cancelando}
        />
      )}
    </div>
  );
}

export default MisReservas;
