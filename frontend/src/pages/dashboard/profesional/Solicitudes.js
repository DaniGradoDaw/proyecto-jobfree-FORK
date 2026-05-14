import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  CheckCircleIcon as CheckCircleOutline,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import {
  obtenerMisSolicitudes,
  confirmarReserva,
  rechazarReserva,
  actualizarProgreso,
  completarReserva,
} from "api/reservas";
import API_URL from "api/config";

const TABS = [
  { key: "PENDIENTE",  label: "Pendiente",  bg: "bg-amber-50",   text: "text-amber-700",   ring: "ring-amber-200",   dot: "bg-amber-400" },
  { key: "CONFIRMADA", label: "Aceptada",   bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", dot: "bg-emerald-500" },
  { key: "COMPLETADA", label: "Completada", bg: "bg-slate-100",  text: "text-slate-600",   ring: "ring-slate-200",   dot: "bg-slate-400" },
  { key: "CANCELADA",  label: "Cancelada",  bg: "bg-red-50",     text: "text-red-600",     ring: "ring-red-200",     dot: "bg-red-400" },
];

function formatFecha(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-ES", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function Avatar({ reserva }) {
  const foto = reserva.clienteFotoUrl
    ? reserva.clienteFotoUrl.startsWith("http") ? reserva.clienteFotoUrl : API_URL + reserva.clienteFotoUrl
    : null;
  const iniciales = (reserva.clienteNombre ?? "?").split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  return foto
    ? <img src={foto} alt="" className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0" />
    : <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">{iniciales}</span>;
}

function ProgresoPanel({ reserva, onActualizar, onCompletar }) {
  const [progreso, setProgreso] = useState(reserva.progreso ?? 0);
  const [notas, setNotas]       = useState(reserva.notasProgreso ?? "");
  const [guardando, setGuardando]   = useState(false);
  const [completando, setCompletando] = useState(false);
  const [msj, setMsj] = useState(null);

  const pagado = reserva.estadoPago === "PAGADO";

  if (!pagado) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3.5 py-2.5">
        <CreditCardIcon className="h-4 w-4 text-amber-500 shrink-0" />
        <span className="text-xs font-medium text-amber-700">Esperando el pago del cliente</span>
      </div>
    );
  }

  const barColor = progreso === 100 ? "bg-emerald-500" : progreso >= 66 ? "bg-blue-500" : progreso >= 33 ? "bg-amber-400" : "bg-slate-300";

  async function handleGuardar() {
    setGuardando(true);
    setMsj(null);
    try {
      const actualizada = await actualizarProgreso(reserva.id, progreso, notas);
      onActualizar(actualizada);
      setMsj({ ok: true, texto: "Progreso guardado" });
      setTimeout(() => setMsj(null), 3000);
    } catch (e) {
      setMsj({ ok: false, texto: e.message });
    } finally {
      setGuardando(false);
    }
  }

  async function handleCompletar() {
    if (progreso < 100) return;
    setCompletando(true);
    setMsj(null);
    try {
      const actualizada = await completarReserva(reserva.id);
      onCompletar(actualizada);
    } catch (e) {
      setMsj({ ok: false, texto: e.message });
      setCompletando(false);
    }
  }

  return (
    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600">Progreso del servicio</span>
        <span className={`text-sm font-bold tabular-nums ${progreso === 100 ? "text-emerald-600" : "text-slate-800"}`}>
          {progreso}%
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div className={`h-full rounded-full transition-all duration-300 ${barColor}`} style={{ width: `${progreso}%` }} />
        </div>
        <input
          type="range" min="0" max="100" step="5"
          value={progreso}
          onChange={(e) => setProgreso(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 px-0.5 select-none">
          {[0, 25, 50, 75, 100].map((v) => <span key={v}>{v}%</span>)}
        </div>
      </div>

      <textarea
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
        placeholder="Notas para el cliente sobre el estado del trabajo (opcional)…"
        maxLength={500}
        rows={2}
        className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
      />
      <p className="text-right text-[10px] text-slate-400 -mt-2">{notas.length}/500</p>

      {msj && (
        <p className={`text-xs font-medium ${msj.ok ? "text-emerald-600" : "text-red-500"}`}>{msj.texto}</p>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleGuardar}
          disabled={guardando}
          className="flex-1 rounded-full border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
        >
          {guardando ? "Guardando…" : "Guardar progreso"}
        </button>
        <button
          onClick={handleCompletar}
          disabled={completando || progreso < 100}
          title={progreso < 100 ? "Lleva el progreso al 100% para completar" : ""}
          className="flex-1 rounded-full bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {completando ? "Procesando…" : "Marcar completado"}
        </button>
      </div>

      {progreso < 100 && (
        <p className="text-center text-[10px] text-slate-400">
          Si no puedes terminar hoy, guarda el progreso parcial y contacta al cliente por el chat
        </p>
      )}
    </div>
  );
}

function TarjetaSolicitud({ reserva, onAceptar, onDenegar, onActualizar, onCompletar, procesando }) {
  const navigate = useNavigate();
  const tab = TABS.find((t) => t.key === reserva.estado) ?? TABS[0];
  const puedeChat = ["PENDIENTE", "CONFIRMADA"].includes(reserva.estado);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className={`h-1 w-full ${tab.dot.replace("bg-", "bg-")}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar reserva={reserva} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{reserva.clienteNombre}</p>
              <p className="text-xs text-slate-400">Cliente</p>
            </div>
          </div>
          <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${tab.bg} ${tab.text} ${tab.ring}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${tab.dot}`} />
            {tab.label}
          </span>
        </div>

        <div className="mt-4 space-y-1.5">
          <p className="text-sm font-medium text-slate-800">{reserva.servicioTitulo}</p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CalendarDaysIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{formatFecha(reserva.fechaInicio)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ClockIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-800">{Number(reserva.precioTotal).toFixed(2)} €</span>
            <span>precio estimado</span>
          </div>
        </div>

        {/* Acciones PENDIENTE */}
        {reserva.estado === "PENDIENTE" && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onAceptar(reserva.id)}
              disabled={procesando}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
            >
              <CheckIcon className="h-4 w-4" />
              Aceptar
            </button>
            <button
              onClick={() => onDenegar(reserva.id)}
              disabled={procesando}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
            >
              <XMarkIcon className="h-4 w-4" />
              Denegar
            </button>
          </div>
        )}

        {/* Panel de progreso CONFIRMADA */}
        {reserva.estado === "CONFIRMADA" && (
          <ProgresoPanel
            reserva={reserva}
            onActualizar={onActualizar}
            onCompletar={onCompletar}
          />
        )}

        {/* COMPLETADA */}
        {reserva.estado === "COMPLETADA" && (
          <div className="mt-4 flex items-center gap-1.5 rounded-xl bg-slate-50 px-3.5 py-2.5">
            <CheckCircleIcon className="h-4 w-4 text-emerald-500 shrink-0" />
            <span className="text-xs font-medium text-slate-700">Servicio completado</span>
            {reserva.progreso > 0 && (
              <span className="ml-auto text-xs font-bold text-slate-600 tabular-nums">{reserva.progreso}%</span>
            )}
          </div>
        )}

        {/* CANCELADA */}
        {reserva.estado === "CANCELADA" && (
          <div className="mt-4 rounded-xl bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-600">
            Solicitud denegada o cancelada
          </div>
        )}

        {/* Botón chat */}
        {puedeChat && (
          <button
            onClick={() => navigate(`/dashboard/profesional/mensajes/reserva/${reserva.id}`)}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" />
            Chat con el cliente
          </button>
        )}
      </div>
    </article>
  );
}

function Solicitudes() {
  const [reservas, setReservas]     = useState([]);
  const [cargando, setCargando]     = useState(true);
  const [error, setError]           = useState("");
  const [tabActiva, setTabActiva]   = useState("PENDIENTE");
  const [procesando, setProcesando] = useState(false);
  const [feedback, setFeedback]     = useState(null);

  useEffect(() => {
    obtenerMisSolicitudes()
      .then(setReservas)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  function showFeedback(ok, texto) {
    setFeedback({ ok, texto });
    setTimeout(() => setFeedback(null), 4000);
  }

  async function handleAceptar(id) {
    setProcesando(true);
    try {
      const act = await confirmarReserva(id);
      setReservas((prev) => prev.map((r) => r.id === act.id ? { ...r, ...act } : r));
      showFeedback(true, "Solicitud aceptada correctamente.");
    } catch (e) {
      showFeedback(false, e.message);
    } finally {
      setProcesando(false);
    }
  }

  async function handleDenegar(id) {
    setProcesando(true);
    try {
      const act = await rechazarReserva(id);
      setReservas((prev) => prev.map((r) => r.id === act.id ? { ...r, ...act } : r));
      showFeedback(true, "Solicitud denegada.");
    } catch (e) {
      showFeedback(false, e.message);
    } finally {
      setProcesando(false);
    }
  }

  function handleActualizar(actualizada) {
    setReservas((prev) => prev.map((r) => r.id === actualizada.id ? { ...r, ...actualizada } : r));
  }

  function handleCompletar(actualizada) {
    setReservas((prev) => prev.map((r) => r.id === actualizada.id ? { ...r, ...actualizada } : r));
    setTabActiva("COMPLETADA");
  }

  const reservasFiltradas = reservas.filter((r) => r.estado === tabActiva);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Solicitudes recibidas</h1>
        <p className="mt-1 text-sm text-slate-500">Gestiona las solicitudes de contratación de tus clientes.</p>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-2 flex-wrap">
        {TABS.map((tab) => {
          const count = reservas.filter((r) => r.estado === tab.key).length;
          const activo = tabActiva === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setTabActiva(tab.key)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ring-1 ${
                activo
                  ? `${tab.bg} ${tab.text} ${tab.ring}`
                  : "bg-white text-slate-500 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${activo ? tab.dot : "bg-slate-300"}`} />
              {tab.label}
              <span className={`text-xs font-bold ${activo ? "opacity-70" : "opacity-50"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {feedback && (
        <p className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium ${feedback.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
          {feedback.texto}
        </p>
      )}

      {cargando ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
          Cargando…
        </div>
      ) : error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      ) : reservasFiltradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-16 text-center">
          <CalendarDaysIcon className="h-10 w-10 text-slate-200 mb-3" />
          <p className="text-sm font-medium text-slate-500">
            No hay solicitudes {TABS.find((t) => t.key === tabActiva)?.label.toLowerCase()}s
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservasFiltradas.map((r) => (
            <TarjetaSolicitud
              key={r.id}
              reserva={r}
              onAceptar={handleAceptar}
              onDenegar={handleDenegar}
              onActualizar={handleActualizar}
              onCompletar={handleCompletar}
              procesando={procesando}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Solicitudes;
