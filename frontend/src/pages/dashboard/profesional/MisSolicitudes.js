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
} from "@heroicons/react/24/outline";
import API_URL from "api/config";
import { useLanguage } from "context/LanguageContext";

const ESTADO_COLORES = {
  PENDIENTE:  "bg-amber-100 text-amber-700 ring-amber-200",
  CONFIRMADA: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  COMPLETADA: "bg-slate-100 text-slate-600 ring-slate-200",
  CANCELADA:  "bg-red-100 text-red-600 ring-red-200",
  RECHAZADA:  "bg-red-100 text-red-600 ring-red-200",
};

function estadoTexto(estado, tx) {
  switch (estado) {
    case "PENDIENTE":  return tx("Pendiente");
    case "CONFIRMADA": return tx("Aceptada");
    case "COMPLETADA": return tx("Completada");
    case "CANCELADA":  return tx("Cancelada");
    case "RECHAZADA":  return tx("Rechazada");
    default:           return estado;
  }
}

function BadgeEstado({ estado }) {
  const { tx } = useLanguage();
  const color = ESTADO_COLORES[estado] ?? "bg-slate-100 text-slate-600 ring-slate-200";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${color}`}>
      {estadoTexto(estado, tx)}
    </span>
  );
}

function BarraProgreso({ progreso, compact = false }) {
  const pct = Math.max(0, Math.min(100, progreso ?? 0));
  const color =
    pct === 100 ? "bg-emerald-500" :
    pct >= 66   ? "bg-blue-500" :
    pct >= 33   ? "bg-amber-400" :
                  "bg-slate-300";
  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "w-full"}`}>
      <div className="flex-1 rounded-full bg-slate-100 overflow-hidden" style={{ height: compact ? 6 : 8 }}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-600 tabular-nums w-8 text-right">{pct}%</span>
    </div>
  );
}

function PanelProgreso({ reserva, onActualizar }) {
  const { tx } = useLanguage();
  const [abierto, setAbierto] = useState(false);
  const [valorSlider, setValorSlider] = useState(reserva.progreso ?? 0);
  const [notas, setNotas] = useState(reserva.notasProgreso ?? "");
  const [guardando, setGuardando] = useState(false);

  async function guardar() {
    setGuardando(true);
    try {
      const actualizada = await actualizarProgreso(reserva.id, valorSlider, notas);
      onActualizar(actualizada);
      setAbierto(false);
    } catch (err) {
      alert(err.message || tx("Error al guardar el progreso."));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <button
        onClick={() => setAbierto((v) => !v)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <span className="text-xs font-semibold text-slate-600">{tx("Progreso del servicio")}</span>
          <BarraProgreso progreso={reserva.progreso} />
        </div>
        {abierto
          ? <ChevronUpIcon className="h-4 w-4 text-slate-400 shrink-0" />
          : <ChevronDownIcon className="h-4 w-4 text-slate-400 shrink-0" />
        }
      </button>

      {abierto && (
        <div className="mt-3 flex flex-col gap-3 border-t border-slate-200 pt-3">
          <div>
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>{tx("Completado")}</span>
              <span className="font-bold text-slate-700">{valorSlider}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={valorSlider}
              onChange={(e) => setValorSlider(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </div>

          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder={tx("Notas para el cliente (opcional)...")}
            rows={2}
            maxLength={500}
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          />

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { setAbierto(false); setValorSlider(reserva.progreso ?? 0); setNotas(reserva.notasProgreso ?? ""); }}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 transition"
            >
              {tx("Cancelar")}
            </button>
            <button
              onClick={guardar}
              disabled={guardando}
              className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-60"
            >
              {guardando ? tx("Guardando...") : tx("Guardar")}
            </button>
          </div>
        </div>
      )}

      {!abierto && reserva.notasProgreso && (
        <p className="mt-2 border-l-2 border-slate-200 pl-2 text-xs text-slate-500 italic leading-relaxed">
          {reserva.notasProgreso}
        </p>
      )}
    </div>
  );
}

function TarjetaSolicitud({ reserva, onActualizar }) {
  const navigate = useNavigate();
  const { idioma, tx } = useLanguage();
  const [accionando, setAccionando] = useState(false);

  const foto = reserva.clienteFotoUrl
    ? reserva.clienteFotoUrl.startsWith("http")
      ? reserva.clienteFotoUrl
      : API_URL + reserva.clienteFotoUrl
    : null;

  const iniciales = (reserva.clienteNombre ?? "?")
    .split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();

  const locale = idioma === "en" ? "en-GB" : "es-ES";

  async function ejecutar(fn) {
    setAccionando(true);
    try {
      const actualizada = await fn(reserva.id);
      onActualizar(actualizada);
    } catch (err) {
      alert(err.message || tx("No se pudo realizar la acción."));
    } finally {
      setAccionando(false);
    }
  }

  const fechaServicio = reserva.fechaInicio
    ? new Date(reserva.fechaInicio).toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <div className={`rounded-2xl border bg-white shadow-sm flex flex-col gap-4 overflow-hidden transition-shadow hover:shadow-md ${
      reserva.estado === "CONFIRMADA" ? "border-emerald-200" : "border-slate-200"
    }`}>
      {/* Franja de color superior */}
      <div className={`h-1 w-full ${
        reserva.estado === "CONFIRMADA" ? "bg-emerald-400" :
        reserva.estado === "PENDIENTE"  ? "bg-amber-400" :
        reserva.estado === "COMPLETADA" ? "bg-slate-300" : "bg-red-300"
      }`} />

      <div className="flex flex-col gap-4 px-5 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {foto ? (
              <img src={foto} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow" />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
                {iniciales}
              </span>
            )}
            <div>
              <p className="text-sm font-semibold text-slate-900">{reserva.clienteNombre}</p>
              <p className="text-xs text-slate-500">{reserva.servicioTitulo}</p>
            </div>
          </div>
          <BadgeEstado estado={reserva.estado} />
        </div>

        {reserva.descripcion ? (
          <p className="text-sm text-slate-600 leading-relaxed border-l-2 border-slate-200 pl-3">
            {reserva.descripcion}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic">{tx("El cliente no añadió descripción.")}</p>
        )}

        <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
          {fechaServicio && (
            <span className="font-medium text-slate-700">{fechaServicio}</span>
          )}
          <span>
            {tx("Recibida el")}{" "}
            {new Date(reserva.fechaCreacion).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span className="font-semibold text-slate-700 ml-auto">
            {Number(reserva.precioTotal).toFixed(2)}€ {tx("est.")}
          </span>
        </div>

        {/* Panel de progreso — solo para CONFIRMADA */}
        {reserva.estado === "CONFIRMADA" && (
          <PanelProgreso reserva={reserva} onActualizar={onActualizar} />
        )}

        {/* Barra de progreso compacta para COMPLETADA */}
        {reserva.estado === "COMPLETADA" && (
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-600 mb-1.5">{tx("Progreso final")}</p>
            <BarraProgreso progreso={reserva.progreso} />
            {reserva.notasProgreso && (
              <p className="mt-2 border-l-2 border-slate-200 pl-2 text-xs text-slate-500 italic">
                {reserva.notasProgreso}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {reserva.estado === "PENDIENTE" && (
            <>
              <button
                onClick={() => ejecutar(confirmarReserva)}
                disabled={accionando}
                className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-60">
                <CheckIcon className="h-3.5 w-3.5" />
                {tx("Aceptar")}
              </button>
              <button
                onClick={() => ejecutar(rechazarReserva)}
                disabled={accionando}
                className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition disabled:opacity-60">
                <XMarkIcon className="h-3.5 w-3.5" />
                {tx("Rechazar")}
              </button>
            </>
          )}

          {reserva.estado === "CONFIRMADA" && (
            <button
              onClick={() => ejecutar(completarReserva)}
              disabled={accionando}
              className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition disabled:opacity-60">
              {tx("Marcar como completado")}
            </button>
          )}

          {["PENDIENTE", "CONFIRMADA"].includes(reserva.estado) && (
            <button
              onClick={() => navigate(`/dashboard/profesional/mensajes/reserva/${reserva.id}`)}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">
              <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" />
              {tx("Chat")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MisSolicitudes() {
  const { tx } = useLanguage();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [filtro, setFiltro]     = useState("todas");

  useEffect(() => {
    obtenerMisSolicitudes()
      .then(setReservas)
      .catch(() => setError(tx("No se pudieron cargar las solicitudes.")))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleActualizar(reservaActualizada) {
    setReservas((prev) => prev.map((r) => r.id === reservaActualizada.id ? reservaActualizada : r));
    window.dispatchEvent(new CustomEvent("reservas:actualizadas"));
  }

  const estados = ["todas", "PENDIENTE", "CONFIRMADA", "COMPLETADA", "CANCELADA"];
  const reservasFiltradas = filtro === "todas" ? reservas : reservas.filter((r) => r.estado === filtro);
  const pendientesCount = reservas.filter((r) => r.estado === "PENDIENTE").length;
  const confirmadas = reservas.filter((r) => r.estado === "CONFIRMADA").length;

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
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{tx("Mis solicitudes")}</h1>
          <p className="mt-1 text-sm text-slate-500">{tx("Gestiona las peticiones de tus clientes.")}</p>
        </div>
        {pendientesCount > 0 && (
          <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white">
            {pendientesCount} {pendientesCount > 1 ? tx("pendientes") : tx("pendiente")}
          </span>
        )}
        {confirmadas > 0 && (
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            {confirmadas} {tx("en curso")}
          </span>
        )}
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
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
            {e === "todas" ? tx("Todas") : estadoTexto(e, tx)}
            {e === "todas"
              ? ` (${reservas.length})`
              : ` (${reservas.filter((r) => r.estado === e).length})`}
          </button>
        ))}
      </div>

      {reservasFiltradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <ClipboardDocumentListIcon className="h-10 w-10 text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-600">
            {filtro !== "todas"
              ? tx("No tienes solicitudes con estado \"{estado}\"", { estado: estadoTexto(filtro, tx) })
              : tx("No tienes solicitudes todavía")}
          </p>
          <p className="mt-1 text-xs text-slate-400">{tx("Aquí aparecerán las peticiones de tus clientes.")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {reservasFiltradas.map((r) => (
            <TarjetaSolicitud key={r.id} reserva={r} onActualizar={handleActualizar} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MisSolicitudes;
