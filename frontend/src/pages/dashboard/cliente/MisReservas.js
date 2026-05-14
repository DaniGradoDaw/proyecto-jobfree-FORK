import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addMinutes } from "date-fns";
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
  BanknotesIcon,
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

const ESTADO = {
  PENDIENTE:  { border: "border-l-amber-400",   label: "Pendiente",  badgeBg: "bg-amber-100",   badgeText: "text-amber-700",   dot: "bg-amber-400",   eventoBg: "#f59e0b", eventoActivo: true  },
  CONFIRMADA: { border: "border-l-sky-400",     label: "Aceptada",   badgeBg: "bg-sky-100",     badgeText: "text-sky-700",     dot: "bg-sky-500",     eventoBg: "#0ea5e9", eventoActivo: true  },
  COMPLETADA: { border: "border-l-slate-300",   label: "Completada", badgeBg: "bg-slate-100",   badgeText: "text-slate-600",   dot: "bg-slate-400",   eventoBg: "#cbd5e1", eventoActivo: false },
  CANCELADA:  { border: "border-l-red-300",     label: "Cancelada",  badgeBg: "bg-red-100",     badgeText: "text-red-600",     dot: "bg-red-400",     eventoBg: "#f87171", eventoActivo: true  },
  RECHAZADA:  { border: "border-l-red-300",     label: "Rechazada",  badgeBg: "bg-red-100",     badgeText: "text-red-600",     dot: "bg-red-400",     eventoBg: "#f87171", eventoActivo: true  },
};

const FILTROS = ["PENDIENTE", "CONFIRMADA", "COMPLETADA", "CANCELADA", "RECHAZADA"];

function ProfesionalAvatar({ src, nombre }) {
  const foto = src ? (src.startsWith("http") ? src : API_URL + src) : null;
  const iniciales = (nombre ?? "?").split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase();
  return foto
    ? <img src={foto} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100 shrink-0" />
    : <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0 ring-2 ring-slate-100">
        <span className="text-xs font-bold text-white">{iniciales}</span>
      </div>;
}

function TarjetaReserva({ reserva, onCancelar, modoModal = false }) {
  const navigate = useNavigate();
  const { idioma, tx } = useLanguage();
  const [expandida, setExpandida] = useState(false);
  const locale = idioma === "en" ? "en-GB" : "es-ES";

  const pagada = reserva.estadoPago === "PAGADO";
  const reembolsado = reserva.estadoPago === "REEMBOLSADO";
  const meta = ESTADO[reserva.estado] ?? ESTADO.COMPLETADA;
  const descLarga = (reserva.descripcion ?? "").length > 100;

  const puedeChat     = ["PENDIENTE", "CONFIRMADA"].includes(reserva.estado);
  const puedeCancelar = ["PENDIENTE", "CONFIRMADA"].includes(reserva.estado) && !modoModal;
  const puedePagar    = reserva.estado === "CONFIRMADA" && !pagada;

  const badgeLabel = reserva.estado === "CONFIRMADA" && pagada
    ? tx("Pagada")
    : reserva.estado === "CONFIRMADA"
    ? tx("Sin pagar")
    : reserva.estado === "CANCELADA" && reembolsado
    ? tx("Cancelada · Reembolsada")
    : tx(meta.label);

  const fechaServicio = reserva.fechaInicio
    ? new Date(reserva.fechaInicio).toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    : null;
  const horaServicio = reserva.fechaInicio
    ? new Date(reserva.fechaInicio).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
    : null;
  const fechaRecibida = new Date(reserva.fechaCreacion).toLocaleDateString(locale, { day: "numeric", month: "short" });
  const pct = Math.max(0, Math.min(100, reserva.progreso ?? 0));

  return (
    <article className={`flex flex-col rounded-2xl border border-slate-200 border-l-4 ${meta.border} bg-white shadow-sm hover:shadow-md transition-shadow`}>
      <div className="p-5 flex flex-col gap-4">

        {/* Fila superior: avatar + info + badge */}
        <div className="flex items-start gap-3">
          <ProfesionalAvatar src={reserva.profesionalFotoUrl} nombre={reserva.profesionalNombre} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{reserva.profesionalNombre}</p>
            <p className="text-xs text-slate-400 truncate mt-0.5">{reserva.servicioTitulo}</p>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${meta.badgeBg} ${meta.badgeText}`}>
            {badgeLabel}
          </span>
        </div>

        {/* Descripción */}
        {reserva.descripcion ? (
          <div className="bg-slate-50 rounded-xl px-3.5 py-2.5">
            <p className={`text-xs text-slate-500 leading-relaxed ${expandida ? "" : "line-clamp-2"}`}>{reserva.descripcion}</p>
            {descLarga && (
              <button onClick={() => setExpandida(v => !v)}
                className="mt-1 text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition">
                {expandida ? tx("Ver menos") : tx("Ver más")}
              </button>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic bg-slate-50 rounded-xl px-3.5 py-2.5">{tx("Sin descripción.")}</p>
        )}

        {/* Meta: fecha + recibida + precio */}
        <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
          {fechaServicio ? (
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <CalendarDaysIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              {fechaServicio}
              {horaServicio && (
                <span className="flex items-center gap-1 text-slate-400 font-normal">
                  <ClockIcon className="h-3 w-3" />{horaServicio}
                </span>
              )}
            </span>
          ) : null}
          <span className="text-slate-400">{tx("Recibida")} {fechaRecibida}</span>
          <span className="ml-auto flex items-center gap-1">
            <BanknotesIcon className="h-4 w-4 text-emerald-500" />
            <span className="text-base font-bold text-slate-900 tabular-nums">
              {Number(reserva.precioTotal).toFixed(2)}€
            </span>
          </span>
        </div>

        {/* Aviso: pendiente de pago */}
        {puedePagar && (
          <div className="flex items-center gap-2.5 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
            <div className="h-2 w-2 rounded-full bg-sky-400 shrink-0 animate-pulse" />
            <p className="text-xs font-medium text-sky-700 flex-1">{tx("El profesional ha aceptado tu reserva. Completa el pago para iniciar el servicio.")}</p>
          </div>
        )}

        {/* Progreso — en curso (pagada) */}
        {reserva.estado === "CONFIRMADA" && pagada && (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-4 pt-3 pb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600">{tx("Progreso del servicio")}</span>
                <span className={`text-sm font-bold tabular-nums ${pct === 100 ? "text-emerald-600" : "text-sky-600"}`}>{pct}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? "bg-emerald-500" : "bg-sky-400"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            {reserva.notasProgreso && (
              <div className="mx-4 mb-3 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
                <p className="text-[11px] font-semibold text-slate-400 mb-0.5">{tx("Mensaje del profesional")}</p>
                <p className="text-xs text-slate-600 leading-relaxed">"{reserva.notasProgreso}"</p>
              </div>
            )}
          </div>
        )}


        {/* Acciones */}
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
          {puedePagar && (
            <button
              onClick={() => navigate(`/dashboard/cliente/pagar/${reserva.id}`)}
              className="flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition shadow-sm shadow-blue-100">
              <CreditCardIcon className="h-3.5 w-3.5" />
              {tx("Pagar ahora")}
            </button>
          )}
          {reserva.estado === "CONFIRMADA" && pagada && (
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700">
              <CheckBadgeIcon className="h-3.5 w-3.5" />
              {tx("Pagada")}
            </span>
          )}
          {reserva.estado === "COMPLETADA" && !reserva.valorada && (
            <button
              onClick={() => navigate(`/dashboard/cliente/valorar/${reserva.id}`)}
              className="flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-600 transition active:scale-95">
              <span className="text-sm leading-none">⭐</span>
              {tx("Valorar")}
            </button>
          )}
          {puedeCancelar && (
            <button
              onClick={() => onCancelar(reserva)}
              className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition">
              <XCircleIcon className="h-3.5 w-3.5" />
              {tx("Cancelar")}
            </button>
          )}
          {puedeChat && (
            <button
              onClick={() => navigate(`/dashboard/cliente/mensajes/reserva/${reserva.id}`)}
              className="ml-auto flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
              <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" />
              {tx("Chat")}
            </button>
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
  const tienePagado = reserva.estadoPago === "PAGADO";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-[20px] bg-white p-6 shadow-2xl">
        <h3 className="text-base font-semibold text-slate-900">{tx("¿Cancelar esta reserva?")}</h3>
        <p className="mt-1 text-sm text-slate-500">
          {tx("Vas a cancelar la reserva de {servicio} con {profesional}.", {
            servicio: reserva.servicioTitulo,
            profesional: reserva.profesionalNombre,
          })}
        </p>

        {tienePagado && (
          <div className="mt-3 rounded-xl bg-sky-50 border border-sky-200 p-3 flex gap-2.5 items-start">
            <svg className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <div>
              <p className="text-xs font-semibold text-sky-700">{tx("Se procesará un reembolso")}</p>
              <p className="text-xs text-sky-600 mt-0.5">
                {tx("El importe pagado se devolverá a tu forma de pago original en 3–5 días hábiles.")}
              </p>
            </div>
          </div>
        )}

        <div className="mt-5 flex gap-3">
          <button onClick={onCancelar} className="flex-1 rounded-full border border-slate-300 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
            {tx("Volver")}
          </button>
          <button onClick={onConfirmar} disabled={cargando}
            className="flex-1 rounded-full bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-60">
            {cargando ? tx("Procesando...") : tx("Sí, cancelar")}
          </button>
        </div>
      </div>
    </div>
  );
}

function vistaCalendario(reservas) {
  return reservas
    .filter((r) => r.fechaInicio && (r.estado === "COMPLETADA" || (r.estado === "CONFIRMADA" && r.estadoPago === "PAGADO")))
    .map((r) => {
      const start = new Date(r.fechaInicio);
      const end   = addMinutes(start, r.duracionMin ?? 60);
      return { id: r.id, title: r.servicioTitulo, start, end, resource: r };
    });
}

function EventoCalendario({ event }) {
  const meta = ESTADO[event.resource?.estado] ?? ESTADO.COMPLETADA;
  const hora = event.start ? event.start.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) : null;
  const profesional = event.resource?.profesionalNombre?.split(" ").slice(0, 2).join(" ") ?? null;
  return (
    <div className={`truncate px-1.5 py-0.5 text-[0.7rem] font-semibold ${meta.eventoActivo ? "text-white" : "text-slate-500"}`}>
      {hora && <span>{hora}</span>}
      {profesional && <span className="ml-1 opacity-90">· {profesional}</span>}
    </div>
  );
}

function AgendaEvento({ event }) {
  const reserva = event.resource;
  const meta = ESTADO[reserva?.estado] ?? ESTADO.COMPLETADA;
  return (
    <div className="flex items-center gap-2.5 py-0.5">
      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: meta.eventoBg }} />
      <span className="text-sm font-semibold text-slate-800 flex-1 min-w-0 truncate">{event.title}</span>
      <span className="text-xs text-slate-400 shrink-0">· {reserva?.profesionalNombre}</span>
      <span className="text-xs font-bold text-slate-700 tabular-nums shrink-0">
        {Number(reserva?.precioTotal ?? 0).toFixed(2)} €
      </span>
    </div>
  );
}

function MisReservas() {
  const { tx } = useLanguage();
  const [reservas, setReservas]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [filtro, setFiltro]         = useState(null);
  const [vista, setVista]           = useState("lista");
  const [reservaACancelar, setReservaACancelar] = useState(null);
  const [reservaModal, setReservaModal]         = useState(null);
  const [cancelando, setCancelando] = useState(false);
  const [calView, setCalView] = useState("month");
  const [calDate, setCalDate] = useState(new Date());

  useEffect(() => {
    obtenerMisReservas()
      .then(setReservas)
      .catch(() => setError(tx("No se pudieron cargar tus reservas.")))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reservasFiltradas = filtro ? reservas.filter(r => r.estado === filtro) : reservas;

  const pendientesCount = reservas.filter(r => r.estado === "PENDIENTE").length;
  const sinPagar        = reservas.filter(r => r.estado === "CONFIRMADA" && r.estadoPago !== "PAGADO").length;
  const enCurso         = reservas.filter(r => r.estado === "CONFIRMADA" && r.estadoPago === "PAGADO").length;

  const eventosCalendario = useCallback(() => vistaCalendario(reservas), [reservas]);

  async function handleCancelar() {
    if (!reservaACancelar) return;
    setCancelando(true);
    try {
      const actualizada = await cancelarReserva(reservaACancelar.id);
      setReservas(prev => prev.map(r => r.id === actualizada.id ? actualizada : r));
      window.dispatchEvent(new CustomEvent("reservas:actualizadas"));
      setReservaACancelar(null);
    } catch (err) {
      alert(err.message || tx("No se pudo cancelar la reserva."));
    } finally {
      setCancelando(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-slate-500">
      <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />{tx("Cargando...")}
    </div>
  );
  if (error) return <p className="text-red-500 text-sm py-10 text-center">{error}</p>;

  return (
    <div>
      {/* Cabecera */}
      <div className="mb-6 flex items-start gap-4 flex-wrap">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
          <CalendarSolid className="h-6 w-6 text-emerald-600" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900">{tx("Mis reservas")}</h1>
          <p className="mt-0.5 text-sm text-slate-500">{tx("Seguimiento de todos tus servicios contratados.")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {pendientesCount > 0 && (
            <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white">
              {pendientesCount} {pendientesCount > 1 ? tx("pendientes") : tx("pendiente")}
            </span>
          )}
          {sinPagar > 0 && (
            <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-700">
              {sinPagar} {tx("sin pagar")}
            </span>
          )}
          {enCurso > 0 && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              {enCurso} {tx("en curso")}
            </span>
          )}
        </div>
      </div>

      {/* Barra de controles: filtros + toggle vista */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        {/* Filtros — clic en activo deselecciona, sin botón Todas */}
        {vista === "lista" && (
          <div className="flex flex-wrap gap-2 flex-1">
            {FILTROS.map(e => {
              const count = reservas.filter(r => r.estado === e).length;
              const activo = filtro === e;
              const meta = ESTADO[e];
              return (
                <button key={e} onClick={() => setFiltro(activo ? null : e)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    activo
                      ? `${meta.badgeBg} ${meta.badgeText}`
                      : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  }`}>
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${meta.dot}`} />
                  {tx(meta.label)}
                  <span className="opacity-60 tabular-nums">{count}</span>
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
            }`}>
            <Bars3Icon className="h-3.5 w-3.5" />
            {tx("Lista")}
          </button>
          <button
            onClick={() => setVista("calendario")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              vista === "calendario" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}>
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
              {filtro ? tx("No tienes reservas con ese estado") : tx("No tienes reservas todavía")}
            </p>
            <p className="mt-1 text-xs text-slate-400">{tx("Cuando contrates un profesional, aparecerá aquí.")}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {reservasFiltradas.map(r => (
              <TarjetaReserva key={r.id} reserva={r} onCancelar={setReservaACancelar} />
            ))}
          </div>
        )
      )}

      {/* Vista calendario */}
      {vista === "calendario" && (
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {[
              { key: "CONFIRMADA", label: tx("Activas"),     color: ESTADO.CONFIRMADA.eventoBg },
              { key: "COMPLETADA", label: tx("Completadas"), color: ESTADO.COMPLETADA.eventoBg },
            ].map(({ key, label, color }) => {
              const count = key === "CONFIRMADA"
                ? reservas.filter(r => r.estado === "CONFIRMADA" && r.estadoPago === "PAGADO").length
                : reservas.filter(r => r.estado === key).length;
              return (
                <span key={key} className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  {label}
                  <span className="opacity-60">{count}</span>
                </span>
              );
            })}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            {eventosCalendario().length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <CalendarDaysIcon className="h-10 w-10 text-slate-200 mb-3" />
                <p className="text-sm font-medium text-slate-500">{tx("No tienes servicios para mostrar en el calendario")}</p>
                <p className="text-xs text-slate-400 mt-1">{tx("Aparecerán aquí tus reservas pagadas y completadas")}</p>
              </div>
            ) : (
              <Calendar
                localizer={localizer}
                events={eventosCalendario()}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 560 }}
                culture="es"
                messages={MENSAJES_CALENDARIO}
                view={calView}
                date={calDate}
                onView={setCalView}
                onNavigate={setCalDate}
                views={["month", "agenda"]}
                components={{ event: EventoCalendario, agenda: { event: AgendaEvento } }}
                onSelectEvent={(event) => setReservaModal(event.resource)}
                eventPropGetter={(event) => {
                  const meta = ESTADO[event.resource?.estado] ?? ESTADO.COMPLETADA;
                  return {
                    style: calView === "agenda"
                      ? { backgroundColor: "transparent", border: "none" }
                      : { backgroundColor: meta.eventoBg, border: "none", borderRadius: "6px" },
                  };
                }}
                popup
              />
            )}
          </div>
        </div>
      )}

      {reservaModal && (
        <ModalReserva reserva={reservaModal} onCerrar={() => setReservaModal(null)} />
      )}

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
