import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerMisSolicitudes, confirmarReserva, rechazarReserva, completarReserva, actualizarProgreso } from "api/reservas";
import {
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CalendarDaysIcon,
  ClockIcon,
  BanknotesIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import API_URL from "api/config";
import { useLanguage } from "context/LanguageContext";

const ESTADO = {
  PENDIENTE:  { border: "border-l-amber-400",   label: "Pendiente",  badgeBg: "bg-amber-100",   badgeText: "text-amber-700",   dot: "bg-amber-400"  },
  CONFIRMADA: { border: "border-l-emerald-400", label: "Aceptada",   badgeBg: "bg-emerald-100", badgeText: "text-emerald-700", dot: "bg-emerald-500"},
  COMPLETADA: { border: "border-l-slate-300",   label: "Completada", badgeBg: "bg-slate-100",   badgeText: "text-slate-500",   dot: "bg-slate-400"  },
  CANCELADA:  { border: "border-l-red-300",     label: "Cancelada",  badgeBg: "bg-red-100",     badgeText: "text-red-600",     dot: "bg-red-400"    },
  RECHAZADA:  { border: "border-l-red-300",     label: "Rechazada",  badgeBg: "bg-red-100",     badgeText: "text-red-600",     dot: "bg-red-400"    },
};

const FILTROS = ["PENDIENTE", "CONFIRMADA", "COMPLETADA", "CANCELADA", "RECHAZADA"];

function ClienteAvatar({ src, nombre }) {
  const foto = src ? (src.startsWith("http") ? src : API_URL + src) : null;
  const iniciales = (nombre ?? "?").split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase();
  return foto
    ? <img src={foto} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100 shrink-0" />
    : <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0 ring-2 ring-slate-100">
        <span className="text-xs font-bold text-white">{iniciales}</span>
      </div>;
}

function PanelProgreso({ reserva, onActualizar }) {
  const { tx } = useLanguage();
  const [editando, setEditando] = useState(false);
  const [valorSlider, setValorSlider] = useState(reserva.progreso ?? 0);
  const [notas, setNotas] = useState(reserva.notasProgreso ?? "");
  const [guardando, setGuardando] = useState(false);
  const pct = Math.max(0, Math.min(100, reserva.progreso ?? 0));

  async function guardar() {
    setGuardando(true);
    try {
      const actualizada = await actualizarProgreso(reserva.id, valorSlider, notas);
      onActualizar(actualizada);
      setEditando(false);
    } catch (err) {
      alert(err.message || tx("Error al guardar el progreso."));
    } finally {
      setGuardando(false);
    }
  }

  function cancelar() {
    setEditando(false);
    setValorSlider(reserva.progreso ?? 0);
    setNotas(reserva.notasProgreso ?? "");
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      {/* Cabecera con barra */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-600">{tx("Actualización para el cliente")}</span>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold tabular-nums ${pct === 100 ? "text-emerald-600" : "text-slate-700"}`}>{pct}%</span>
            {!editando && (
              <button onClick={() => setEditando(true)}
                className="flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-500 hover:bg-slate-50 transition">
                <PencilSquareIcon className="h-3 w-3" />
                {tx("Editar")}
              </button>
            )}
          </div>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? "bg-emerald-500" : "bg-sky-400"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Nota actual (cuando no está editando) */}
      {!editando && reserva.notasProgreso && (
        <div className="mx-4 mb-3 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
          <p className="text-xs text-slate-500 leading-relaxed">"{reserva.notasProgreso}"</p>
        </div>
      )}

      {/* Formulario de edición */}
      {editando && (
        <div className="px-4 pb-3 space-y-3 border-t border-slate-100 pt-3">
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>{tx("Porcentaje completado")}</span>
              <span className="font-bold text-slate-700">{valorSlider}%</span>
            </div>
            <input type="range" min={0} max={100} step={5} value={valorSlider}
              onChange={e => setValorSlider(Number(e.target.value))}
              className="w-full accent-sky-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">{tx("Mensaje para el cliente")}</label>
            <textarea value={notas} onChange={e => setNotas(e.target.value)}
              placeholder={tx("Ej: He completado la primera parte, seguimos mañana...")}
              rows={2} maxLength={300}
              className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 placeholder-slate-400 focus:border-sky-300 focus:outline-none focus:ring-1 focus:ring-sky-200" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={cancelar}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition">
              {tx("Cancelar")}
            </button>
            <button onClick={guardar} disabled={guardando}
              className="rounded-full bg-sky-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-sky-600 transition disabled:opacity-60">
              {guardando ? tx("Guardando...") : tx("Publicar")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TarjetaSolicitud({ reserva, onActualizar }) {
  const navigate = useNavigate();
  const { idioma, tx } = useLanguage();
  const [accionando, setAccionando] = useState(false);
  const [expandida, setExpandida] = useState(false);
  const locale = idioma === "en" ? "en-GB" : "es-ES";
  const descLarga = (reserva.descripcion ?? "").length > 100;
  const pagada = reserva.estadoPago === "PAGADO";
  const meta = ESTADO[reserva.estado] ?? ESTADO.COMPLETADA;
  const pct = Math.max(0, Math.min(100, reserva.progreso ?? 0));

  async function ejecutar(fn) {
    setAccionando(true);
    try { onActualizar(await fn(reserva.id)); }
    catch (err) { alert(err.message || tx("No se pudo realizar la acción.")); }
    finally { setAccionando(false); }
  }

  const fechaServicio = reserva.fechaInicio
    ? new Date(reserva.fechaInicio).toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    : null;
  const horaServicio = reserva.fechaInicio
    ? new Date(reserva.fechaInicio).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
    : null;
  const fechaRecibida = new Date(reserva.fechaCreacion).toLocaleDateString(locale, { day: "numeric", month: "short" });

  return (
    <article className={`flex flex-col rounded-2xl border border-slate-200 border-l-4 ${meta.border} bg-white shadow-sm hover:shadow-md transition-shadow`}>
      <div className="p-5 flex flex-col gap-4">

        {/* Fila superior: avatar + info + badge */}
        <div className="flex items-start gap-3">
          <ClienteAvatar src={reserva.clienteFotoUrl} nombre={reserva.clienteNombre} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{reserva.clienteNombre}</p>
            <p className="text-xs text-slate-400 truncate mt-0.5">{reserva.servicioTitulo}</p>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${meta.badgeBg} ${meta.badgeText}`}>
            {reserva.estado === "CONFIRMADA" && pagada
              ? tx("En curso")
              : reserva.estado === "CONFIRMADA"
              ? tx("Sin pagar")
              : tx(meta.label)}
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
          <p className="text-xs text-slate-400 italic bg-slate-50 rounded-xl px-3.5 py-2.5">{tx("El cliente no añadió descripción.")}</p>
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

        {/* Aviso sin pagar */}
        {reserva.estado === "CONFIRMADA" && !pagada && (
          <div className="flex items-center gap-2.5 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
            <div className="h-2 w-2 rounded-full bg-sky-400 shrink-0 animate-pulse" />
            <p className="text-xs font-medium text-sky-700">{tx("Esperando el pago del cliente para iniciar el servicio.")}</p>
          </div>
        )}

        {/* Progreso editable — confirmada + pagada */}
        {reserva.estado === "CONFIRMADA" && pagada && (
          <PanelProgreso reserva={reserva} onActualizar={onActualizar} />
        )}

        {/* Notas — completada (sin barra, solo texto si las hay) */}
        {reserva.estado === "COMPLETADA" && reserva.notasProgreso && (
          <p className="text-xs text-slate-400 italic px-1">{reserva.notasProgreso}</p>
        )}

        {/* Acciones */}
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
          {reserva.estado === "PENDIENTE" && (
            <>
              <button onClick={() => ejecutar(confirmarReserva)} disabled={accionando}
                className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600 transition disabled:opacity-60 shadow-sm shadow-emerald-100">
                <CheckIcon className="h-3.5 w-3.5" />{tx("Aceptar")}
              </button>
              <button onClick={() => ejecutar(rechazarReserva)} disabled={accionando}
                className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition disabled:opacity-60">
                <XMarkIcon className="h-3.5 w-3.5" />{tx("Rechazar")}
              </button>
            </>
          )}
          {reserva.estado === "CONFIRMADA" && pagada && (
            <button onClick={() => ejecutar(completarReserva)} disabled={accionando}
              className="flex items-center gap-1.5 rounded-full bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 transition disabled:opacity-60">
              <CheckIcon className="h-3.5 w-3.5" />{tx("Marcar completado")}
            </button>
          )}
          {["PENDIENTE", "CONFIRMADA"].includes(reserva.estado) && (
            <button onClick={() => navigate(`/dashboard/profesional/mensajes/reserva/${reserva.id}`)}
              className="ml-auto flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
              <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" />{tx("Chat")}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function MisSolicitudes() {
  const { tx } = useLanguage();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [filtro, setFiltro]     = useState(null);

  useEffect(() => {
    obtenerMisSolicitudes()
      .then(setReservas)
      .catch(() => setError(tx("No se pudieron cargar las solicitudes.")))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleActualizar(reservaActualizada) {
    setReservas(prev => prev.map(r => r.id === reservaActualizada.id ? reservaActualizada : r));
    window.dispatchEvent(new CustomEvent("reservas:actualizadas"));
  }

  const reservasFiltradas = filtro ? reservas.filter(r => r.estado === filtro) : reservas;
  const pendientesCount = reservas.filter(r => r.estado === "PENDIENTE").length;
  const sinPagar        = reservas.filter(r => r.estado === "CONFIRMADA" && r.estadoPago !== "PAGADO").length;
  const enCurso         = reservas.filter(r => r.estado === "CONFIRMADA" && r.estadoPago === "PAGADO").length;

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
          <ClipboardDocumentListIcon className="h-6 w-6 text-emerald-600" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900">{tx("Mis solicitudes")}</h1>
          <p className="mt-0.5 text-sm text-slate-500">{tx("Gestiona las peticiones de tus clientes.")}</p>
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

      {/* Filtros — clic en activo deselecciona, sin botón Todas */}
      <div className="mb-5 flex flex-wrap gap-2">
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

      {/* Lista */}
      {reservasFiltradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-20 text-center">
          <ClipboardDocumentListIcon className="h-10 w-10 text-slate-300 mb-3" />
          <p className="text-sm font-semibold text-slate-600">
            {filtro ? tx("No tienes solicitudes con ese estado") : tx("No tienes solicitudes todavía")}
          </p>
          <p className="mt-1 text-xs text-slate-400">{tx("Aquí aparecerán las peticiones de tus clientes.")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {reservasFiltradas.map(r => (
            <TarjetaSolicitud key={r.id} reserva={r} onActualizar={handleActualizar} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MisSolicitudes;
