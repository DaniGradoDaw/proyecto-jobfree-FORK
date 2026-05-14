import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, ArrowPathIcon, ArrowUturnLeftIcon, BellIcon, BellSlashIcon, CalendarDaysIcon, CheckIcon, FaceSmileIcon, NoSymbolIcon, PaperAirplaneIcon, PencilSquareIcon, PhotoIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import EmojiPickerES from "./EmojiPickerES";
import { obtenerConversacion, obtenerConversacionPorReserva, silenciarConversacion } from "api/conversaciones";
import { bloquearUsuario, desbloquearUsuario } from "api/bloqueos";
import { crearReporte } from "api/reportes";
import { editarMensaje, eliminarMensaje, enviarMensaje, marcarMensajesLeidos, marcarMensajesRecibidos, obtenerMensajesDeConversacion, subirImagenMensaje, toggleReaccion } from "api/mensajes";
import { crearReserva } from "api/reservas";
import { obtenerServiciosActivosPorProfesionalUsuario } from "api/servicios";
import { useAuth } from "context/AuthContext";
import { useChatSocket } from "context/ChatSocketContext";
import { useLanguage } from "context/LanguageContext";
import API_URL from "api/config";
import { mergeEstadoFinal, mergeMensajes, normalizarEstadosEvento, upsertMensaje } from "./chatMensajeUtils";

function formatearUltimaConexion(fecha, tx) {
  if (!fecha) return null;
  const diff = Date.now() - new Date(fecha).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (diff < 90000) return tx("Hace un momento");
  if (mins < 60) return `${tx("Hace")} ${mins} ${mins === 1 ? tx("minuto") : tx("minutos")}`;
  if (hrs < 24) return `${tx("Hace")} ${hrs} ${hrs === 1 ? tx("hora") : tx("horas")}`;
  return `${tx("Hace")} ${days} ${days === 1 ? tx("día") : tx("días")}`;
}

function generarClientMessageId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatearHora(fecha, idioma) {
  const locale = idioma === "en" ? "en-GB" : "es-ES";
  return new Date(fecha).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
}

function EstadoMensaje({ mensaje }) {
  if (mensaje.leido) {
    // ✓✓ azul claro = leído (destinatario entró al chat)
    return (
      <svg viewBox="0 0 17 9" className="inline-block h-[10px] w-auto text-sky-200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 4.5 L4 8 L11 1"/>
        <path d="M6 4.5 L9 8 L16 1"/>
      </svg>
    );
  }
  if (mensaje.recibido) {
    // ✓✓ gris = destinatario conectado pero no ha abierto el chat
    return (
      <svg viewBox="0 0 17 9" className="inline-block h-[10px] w-auto text-white/60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 4.5 L4 8 L11 1"/>
        <path d="M6 4.5 L9 8 L16 1"/>
      </svg>
    );
  }
  // ✓ tenue = enviado, destinatario offline
  return (
    <svg viewBox="0 0 11 9" className="inline-block h-[10px] w-auto text-white/45" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 4.5 L4 8 L10 1"/>
    </svg>
  );
}

function generarIniciales(nombre) {
  return (nombre ?? "?")
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function claveGrupoFecha(fecha) {
  if (!fecha) return "";
  const d = new Date(fecha);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function etiquetaGrupoFecha(fecha, idioma, tx) {
  if (!fecha) return "";
  const ahora = new Date();
  const d = new Date(fecha);
  const hoyInicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()).getTime();
  const ayerInicio = hoyInicio - 86400000;
  const dInicio = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const locale = idioma === "en" ? "en-GB" : "es-ES";

  if (dInicio === hoyInicio) return tx("Hoy");
  if (dInicio === ayerInicio) return tx("Ayer");
  if (hoyInicio - dInicio < 7 * 86400000) {
    return d.toLocaleDateString(locale, { weekday: "long" });
  }
  return d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
}

function SeparadorFecha({ etiqueta }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="h-px flex-1 bg-slate-200" />
      <span className="rounded-full bg-slate-100 px-3 py-0.5 text-[11px] font-medium text-slate-500">
        {etiqueta}
      </span>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

function obtenerFechaMinimaReserva() {
  const d = new Date();
  d.setHours(d.getHours() + 1);
  d.setSeconds(0, 0);
  return d.toISOString().slice(0, 16);
}

function ModalProponerServicio({ abierta, servicios, cargando, errorCarga, onCerrar, onConfirmar, enviando }) {
  const { tx } = useLanguage();
  const fechaMinima = useMemo(() => obtenerFechaMinimaReserva(), []);
  const [servicioId, setServicioId] = useState("");
  const [fechaInicio, setFechaInicio] = useState(fechaMinima);
  const [descripcion, setDescripcion] = useState("");
  const [precioHora, setPrecioHora] = useState("");
  const [error, setError] = useState("");

  const servicioSeleccionado = servicios.find((s) => String(s.id) === String(servicioId));

  useEffect(() => {
    if (!abierta) return;
    setError("");
    setDescripcion("");
    setFechaInicio(fechaMinima);
    const primero = servicios[0];
    setServicioId(String(primero?.id || ""));
    setPrecioHora(primero ? String(Number(primero.precioHora).toFixed(2)) : "");
  }, [abierta, fechaMinima, servicios]);

  function handleServicioChange(e) {
    const id = e.target.value;
    setServicioId(id);
    const s = servicios.find((sv) => String(sv.id) === id);
    if (s) setPrecioHora(String(Number(s.precioHora).toFixed(2)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!servicioId) {
      setError(tx("Selecciona un servicio para enviar la propuesta."));
      return;
    }
    const precioNum = parseFloat(precioHora);
    if (!precioHora || isNaN(precioNum) || precioNum <= 0) {
      setError(tx("Introduce un precio por hora válido."));
      return;
    }
    setError("");
    try {
      const precioOriginal = servicioSeleccionado ? Number(servicioSeleccionado.precioHora) : null;
      await onConfirmar({
        servicioId: Number(servicioId),
        fechaInicio: `${fechaInicio}:00`,
        descripcion: descripcion.trim(),
        precioPersonalizado: precioOriginal !== null && precioNum !== precioOriginal ? precioNum : undefined,
      });
    } catch (err) {
      setError(err.message || tx("No se pudo crear la solicitud."));
    }
  }

  if (!abierta) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
            {tx("Proponer servicio")}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            {tx("Crear solicitud desde esta conversación")}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {tx("La reserva quedara vinculada al chat actual y no se creara otra conversación.")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {cargando ? (
            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-500">
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
              {tx("Cargando servicios del profesional...")}
            </div>
          ) : errorCarga ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{errorCarga}</p>
          ) : servicios.length === 0 ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
              {tx("Este profesional no tiene servicios activos disponibles para proponer ahora mismo.")}
            </p>
          ) : (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {tx("Servicio")}
                </label>
                <select
                  value={servicioId}
                  onChange={handleServicioChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                >
                  {servicios.map((servicio) => (
                    <option key={servicio.id} value={servicio.id}>
                      {servicio.titulo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-2.5">
                <span className="text-sm text-slate-500">{tx("Precio por hora")}</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={precioHora}
                    onChange={(e) => setPrecioHora(e.target.value)}
                    className="w-20 text-right text-sm font-semibold text-slate-800 bg-transparent outline-none border-b border-slate-300 focus:border-emerald-500"
                    required
                  />
                  <span className="text-xs text-slate-400">€/h</span>
                  {servicioSeleccionado && parseFloat(precioHora) !== Number(servicioSeleccionado.precioHora) && (
                    <span className="text-[10px] text-amber-500 font-medium">personalizado</span>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {tx("Fecha y hora")}
                </label>
                <input
                  type="datetime-local"
                  value={fechaInicio}
                  min={fechaMinima}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {tx("Detalles para el profesional")}
                </label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={3}
                  placeholder={tx("Describe lo que necesitas...")}
                  className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCerrar}
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {tx("Cancelar")}
            </button>
            <button
              type="submit"
              disabled={cargando || servicios.length === 0 || enviando}
              className="flex-1 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {enviando ? tx("Enviando...") : tx("Enviar propuesta")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const EMOJIS_PICKER = ["👍", "❤️", "😂", "😮", "😢", "✅"];

function ChatReserva() {
  const { reservaId, conversacionId } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { idioma, tx } = useLanguage();
  const { subscribeToConversation, subscribeToUserQueue, connected, reconnectVersion, publish } = useChatSocket();

  const [conversacion, setConversacion] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [creandoReserva, setCreandoReserva] = useState(false);
  const [error, setError] = useState("");
  const [modalReservaAbierta, setModalReservaAbierta] = useState(false);
  const [serviciosProfesional, setServiciosProfesional] = useState([]);
  const [cargandoServicios, setCargandoServicios] = useState(false);
  const [errorServicios, setErrorServicios] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const [otraPersonaOnline, setOtraPersonaOnline] = useState(false);
  const [otraPersonaUltimaConexion, setOtraPersonaUltimaConexion] = useState(null);
  const [hayMas, setHayMas] = useState(false);
  const [loadingMas, setLoadingMas] = useState(false);
  const [mensajeRespondido, setMensajeRespondido] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imagenPrevia, setImagenPrevia] = useState(null);
  const [imagenUrl, setImagenUrl] = useState(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [imagenModal, setImagenModal] = useState(null);
  const [openReactionPickerId, setOpenReactionPickerId] = useState(null);
  const [mensajeEditando, setMensajeEditando] = useState(null);
  const [textoEditando, setTextoEditando] = useState("");
  const [mensajeEliminandoId, setMensajeEliminandoId] = useState(null);
  const [silenciada, setSilenciada] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);
  const [meBloqueo, setMeBloqueo] = useState(false);
  const [accionModeracion, setAccionModeracion] = useState(false);
  const [errorModeracion, setErrorModeracion] = useState("");
  const [confirmarBloqueo, setConfirmarBloqueo] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [motivoBloqueo, setMotivoBloqueo] = useState("");
  const [reportarJobFree, setReportarJobFree] = useState(false);

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const lastReconnectHandledRef = useRef(0);
  const shouldAutoScrollRef = useRef(true);
  const pendingSendKeyRef = useRef(null);
  const retryClientMessageIdsRef = useRef(new Map());
  const previousMessageCountRef = useRef(0);
  const pendingEstadosRef = useRef(new Map());
  const escribiendoTimeoutRef = useRef(null);
  const typingThrottleRef = useRef(null);
  const needsScrollCorrectionRef = useRef(false);
  const savedScrollHeightRef = useRef(0);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);

  const cargarMas = useCallback(async () => {
    if (!conversacion?.id || loadingMas || !hayMas || mensajes.length === 0) return;
    const primerMensaje = mensajes[0];
    if (!primerMensaje?.id) return;
    setLoadingMas(true);
    savedScrollHeightRef.current = scrollRef.current?.scrollHeight ?? 0;
    needsScrollCorrectionRef.current = true;
    try {
      const { mensajes: antiguos, hayMas: tieneHayMas } = await obtenerMensajesDeConversacion(
        conversacion.id, { before: primerMensaje.id }
      );
      setMensajes((prev) => mergeMensajes(prev, antiguos));
      setHayMas(tieneHayMas);
    } catch {
      needsScrollCorrectionRef.current = false;
    } finally {
      setLoadingMas(false);
    }
  }, [conversacion?.id, loadingMas, hayMas, mensajes]);

  useEffect(() => {
    if (!showEmojiPicker) return;
    function handleClickOutside(e) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  useEffect(() => {
    if (!imagenModal) return;
    function handleEsc(e) { if (e.key === "Escape") setImagenModal(null); }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [imagenModal]);

  useEffect(() => {
    if (!openReactionPickerId) return;
    function handleClickOutside(e) {
      const el = document.querySelector(`[data-reaction-anchor="${openReactionPickerId}"]`);
      if (el && !el.contains(e.target)) setOpenReactionPickerId(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openReactionPickerId]);

  useLayoutEffect(() => {
    if (needsScrollCorrectionRef.current && scrollRef.current) {
      scrollRef.current.scrollTop += scrollRef.current.scrollHeight - savedScrollHeightRef.current;
      needsScrollCorrectionRef.current = false;
    }
  });

  function actualizarEstadoScroll() {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    shouldAutoScrollRef.current = scrollHeight - (scrollTop + clientHeight) < 120;
    if (scrollTop < 80 && hayMas && !loadingMas) cargarMas();
  }

  function scrollToMessage(id) {
    const el = scrollRef.current?.querySelector(`[data-id="${id}"]`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.style.transition = "background-color 0.6s ease";
    el.style.backgroundColor = "rgba(59,130,246,0.15)";
    setTimeout(() => { el.style.backgroundColor = ""; }, 1500);
  }

  const aplicarEstadosPendientes = useCallback((listaMensajes) => {
    if (pendingEstadosRef.current.size === 0) return listaMensajes;
    return listaMensajes.map((mensaje) => {
      const pendiente = pendingEstadosRef.current.get(Number(mensaje.id));
      if (!pendiente) return mensaje;
      pendingEstadosRef.current.delete(Number(mensaje.id));
      return mergeEstadoFinal(mensaje, pendiente);
    });
  }, []);

  const aplicarEventoDeEstado = useCallback((listaMensajes, evento) => {
    const estados = normalizarEstadosEvento(evento);
    if (estados.length === 0) return listaMensajes;
    const estadosPorId = new Map(estados.map((estado) => [Number(estado.id), estado]));
    const actualizados = listaMensajes.map((mensaje) => {
      const estado = estadosPorId.get(Number(mensaje.id));
      if (!estado) return mensaje;
      estadosPorId.delete(Number(mensaje.id));
      return mergeEstadoFinal(mensaje, estado);
    });
    estadosPorId.forEach((estado, id) => {
      const previo = pendingEstadosRef.current.get(id);
      pendingEstadosRef.current.set(id, mergeEstadoFinal(previo ?? {}, estado));
    });
    return actualizados;
  }, []);

  const marcarPendientesComoRecibidos = useCallback(async (listaMensajes) => {
    const pendientes = listaMensajes.filter(
      (mensaje) => Number(mensaje.destinatarioId) === Number(usuario?.id) && !mensaje.recibido
    );
    if (pendientes.length === 0) return;
    await marcarMensajesRecibidos(pendientes.map((mensaje) => mensaje.id));
    setMensajes((prev) => prev.map((mensaje) => (
      pendientes.some((pendiente) => pendiente.id === mensaje.id)
        ? { ...mensaje, recibido: true }
        : mensaje
    )));
  }, [usuario?.id]);

  const marcarPendientesComoLeidos = useCallback(async (listaMensajes) => {
    const pendientes = listaMensajes.filter(
      (mensaje) => Number(mensaje.destinatarioId) === Number(usuario?.id) && !mensaje.leido
    );
    if (pendientes.length === 0) return;
    await marcarMensajesLeidos(pendientes.map((mensaje) => mensaje.id));
    setMensajes((prev) => prev.map((mensaje) => (
      pendientes.some((pendiente) => pendiente.id === mensaje.id)
        ? { ...mensaje, leido: true }
        : mensaje
    )));
  }, [usuario?.id]);

  useEffect(() => {
    // Reset everything when switching between conversations
    setConversacion(null);
    setMensajes([]);
    setLoading(true);
    setError("");
    setEscribiendo(false);
    setOtraPersonaOnline(false);
    setOtraPersonaUltimaConexion(null);
    setHayMas(false);
    setLoadingMas(false);
    setMensajeRespondido(null);
    setShowEmojiPicker(false);
    setImagenPrevia(null);
    setImagenUrl(null);
    setSubiendoImagen(false);
    pendingEstadosRef.current.clear();
    retryClientMessageIdsRef.current.clear();
    pendingSendKeyRef.current = null;
    previousMessageCountRef.current = 0;
    shouldAutoScrollRef.current = true;
    lastReconnectHandledRef.current = 0;
    if (escribiendoTimeoutRef.current) {
      clearTimeout(escribiendoTimeoutRef.current);
      escribiendoTimeoutRef.current = null;
    }
    if (typingThrottleRef.current) {
      clearTimeout(typingThrottleRef.current);
      typingThrottleRef.current = null;
    }

    let activo = true;
    async function cargarConversacion() {
      try {
        const data = reservaId
          ? await obtenerConversacionPorReserva(reservaId)
          : await obtenerConversacion(conversacionId);
        if (activo) {
          setConversacion(data);
          if (data.otroUsuarioUltimaConexion) setOtraPersonaUltimaConexion(data.otroUsuarioUltimaConexion);
        }
      } catch (err) {
        if (activo) {
          setError(err.message || tx("No se pudo abrir la conversación."));
          setLoading(false);
        }
      }
    }
    cargarConversacion();
    return () => { activo = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservaId, conversacionId]);

  useEffect(() => {
    if (!conversacion?.id) return undefined;
    let cancelado = false;
    async function cargarMensajes() {
      try {
        const { mensajes: data, hayMas: tieneHayMas } = await obtenerMensajesDeConversacion(conversacion.id);
        if (cancelado) return;
        setMensajes((prev) => aplicarEstadosPendientes(mergeMensajes(prev, data)));
        setHayMas(tieneHayMas);
        setLoading(false);
        await marcarPendientesComoRecibidos(data);
        await marcarPendientesComoLeidos(data);
      } catch (err) {
        if (!cancelado) {
          setError(err.message || tx("No se pudieron cargar los mensajes."));
          setLoading(false);
        }
      }
    }
    cargarMensajes();
    const interval = connected ? null : window.setInterval(cargarMensajes, 5000);
    return () => {
      cancelado = true;
      if (interval) window.clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversacion?.id, usuario?.id, connected, marcarPendientesComoLeidos, marcarPendientesComoRecibidos, aplicarEstadosPendientes]);

  useEffect(() => {
    if (!conversacion?.id || !connected || reconnectVersion === 0) return;
    if (lastReconnectHandledRef.current === reconnectVersion) return;
    lastReconnectHandledRef.current = reconnectVersion;
    obtenerMensajesDeConversacion(conversacion.id)
      .then(({ mensajes: data }) => {
        setMensajes((prev) => aplicarEstadosPendientes(mergeMensajes(prev, data)));
        return marcarPendientesComoRecibidos(data).then(() => marcarPendientesComoLeidos(data));
      })
      .catch((e) => console.warn("[Chat] Error al recargar mensajes tras reconexión:", e));
  }, [conversacion?.id, connected, reconnectVersion, marcarPendientesComoLeidos, marcarPendientesComoRecibidos, aplicarEstadosPendientes]);

  useEffect(() => {
    if (!conversacion?.id) return undefined;
    return subscribeToConversation(conversacion.id, (evento) => {
      if (evento?.tipo === "mensaje.nuevo" && evento.mensaje) {
        setMensajes((prev) => aplicarEstadosPendientes(upsertMensaje(prev, evento.mensaje)));
        if (Number(evento.mensaje.destinatarioId) === Number(usuario?.id)) {
          if (!evento.mensaje.recibido) marcarMensajesRecibidos([evento.mensaje.id]).catch((e) => console.warn("[Chat] No se pudo marcar recibido:", e));
          if (!evento.mensaje.leido) marcarMensajesLeidos([evento.mensaje.id]).catch((e) => console.warn("[Chat] No se pudo marcar leído:", e));
        }
      }
      if (
        evento?.tipo === "mensaje.recibido"
        || evento?.tipo === "mensaje.recibido.lote"
        || evento?.tipo === "mensaje.leido"
        || evento?.tipo === "mensaje.leido.lote"
      ) {
        setMensajes((prev) => aplicarEventoDeEstado(prev, evento));
      }
      if (evento?.tipo === "conversacion.actualizada" && evento.conversacion) {
        setConversacion((prev) => ({ ...prev, ...evento.conversacion }));
      }
      if (evento?.tipo === "mensaje.editado" && evento.mensaje) {
        setMensajes((prev) => prev.map((m) =>
          Number(m.id) === Number(evento.mensaje.id) ? { ...m, ...evento.mensaje } : m
        ));
      }
      if (evento?.tipo === "mensaje.eliminado" && evento.mensaje) {
        setMensajes((prev) => prev.map((m) =>
          Number(m.id) === Number(evento.mensaje.id) ? { ...m, ...evento.mensaje } : m
        ));
      }
      if (evento?.tipo === "mensaje.reaccion") {
        setMensajes((prev) => prev.map((m) =>
          Number(m.id) === Number(evento.mensajeId) ? { ...m, reacciones: evento.reacciones ?? [] } : m
        ));
      }
      if (evento?.tipo === "usuario.escribiendo" && Number(evento.usuarioId) !== Number(usuario?.id)) {
        setEscribiendo(true);
        clearTimeout(escribiendoTimeoutRef.current);
        escribiendoTimeoutRef.current = setTimeout(() => setEscribiendo(false), 3000);
      }
      if (evento?.tipo === "usuario.presencia" && Number(evento.usuarioId) !== Number(usuario?.id)) {
        setOtraPersonaOnline(evento.online === true);
        if (evento.ultimaConexion) setOtraPersonaUltimaConexion(evento.ultimaConexion);
        if (!evento.online && !evento.ultimaConexion) setOtraPersonaUltimaConexion(null);
      }
    });
  }, [conversacion?.id, subscribeToConversation, usuario?.id, aplicarEstadosPendientes, aplicarEventoDeEstado]);

  useEffect(() => {
    if (!scrollRef.current) return;
    const ultimoMensaje = mensajes[mensajes.length - 1];
    const esMio = Number(ultimoMensaje?.remitenteId) === Number(usuario?.id);
    const crecieron = mensajes.length > previousMessageCountRef.current;
    if (shouldAutoScrollRef.current || (crecieron && esMio)) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    previousMessageCountRef.current = mensajes.length;
  }, [mensajes, usuario?.id]);

  useEffect(() => {
    if (!conversacion) return;
    setSilenciada(conversacion.silenciada ?? false);
    setBloqueado(conversacion.bloqueado ?? false);
    setMeBloqueo(conversacion.meBloqueo ?? false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversacion?.id, conversacion?.silenciada, conversacion?.bloqueado, conversacion?.meBloqueo]);

  // Sincronizar estado silenciada cuando la lista de conversaciones cambia el mute
  useEffect(() => {
    function handleSilenciadaDesdeLista(e) {
      if (Number(e.detail.id) === Number(conversacion?.id)) {
        setSilenciada(e.detail.silenciada);
      }
    }
    window.addEventListener("chat:conversacion:silenciada", handleSilenciadaDesdeLista);
    return () => window.removeEventListener("chat:conversacion:silenciada", handleSilenciadaDesdeLista);
  }, [conversacion?.id]);

  const dashboardBase = usuario?.rol?.toUpperCase() === "PROFESIONAL"
    ? "/dashboard/profesional"
    : "/dashboard/cliente";
  const esClienteActual = Number(conversacion?.clienteId) === Number(usuario?.id);

  const otraPersona = useMemo(() => {
    if (!conversacion || !usuario?.id) return null;
    const soyCliente = Number(conversacion.clienteId) === Number(usuario.id);
    const fotoRaw = soyCliente ? conversacion.profesionalFotoUrl : conversacion.clienteFotoUrl;
    return {
      id: soyCliente ? conversacion.profesionalId : conversacion.clienteId,
      nombre: soyCliente ? conversacion.profesionalNombre : conversacion.clienteNombre,
      foto: fotoRaw
        ? (fotoRaw.startsWith("http") ? fotoRaw : API_URL + fotoRaw)
        : null,
    };
  }, [conversacion, usuario?.id]);

  useEffect(() => {
    if (!otraPersona?.id) return undefined;
    return subscribeToUserQueue((evento) => {
      if (evento?.tipo === "usuario.bloqueado" && Number(evento.bloqueadorId) === Number(otraPersona.id)) {
        setMeBloqueo(true);
      }
      if (evento?.tipo === "usuario.desbloqueado" && Number(evento.bloqueadorId) === Number(otraPersona.id)) {
        setMeBloqueo(false);
      }
    });
  }, [subscribeToUserQueue, otraPersona?.id]);

  useEffect(() => {
    if (!otraPersona?.id || bloqueado || meBloqueo) return;
    let activo = true;
    fetch(`${API_URL}/usuarios/${otraPersona.id}/presencia`, { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!activo || !data) return;
        setOtraPersonaOnline(data.online === true);
        if (data.ultimaConexion) setOtraPersonaUltimaConexion(data.ultimaConexion);
      })
      .catch(() => {});
    return () => { activo = false; };
  }, [otraPersona?.id, bloqueado, meBloqueo]);

  useEffect(() => {
    if (!modalReservaAbierta || !conversacion?.profesionalId) return undefined;
    let activa = true;
    setCargandoServicios(true);
    setErrorServicios("");
    obtenerServiciosActivosPorProfesionalUsuario(conversacion.profesionalId)
      .then((data) => { if (activa) setServiciosProfesional(data); })
      .catch((err) => { if (activa) setErrorServicios(err.message || tx("No se pudieron cargar los mensajes.")); })
      .finally(() => { if (activa) setCargandoServicios(false); });
    return () => { activa = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalReservaAbierta, conversacion?.profesionalId]);

  function enviarEscribiendo() {
    if (!conversacion?.id || !connected) return;
    if (typingThrottleRef.current) return;
    publish(`/app/conversaciones/${conversacion.id}/escribiendo`, {});
    typingThrottleRef.current = setTimeout(() => { typingThrottleRef.current = null; }, 2000);
  }

  async function handleImagenSeleccionada(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    if (!file.type.startsWith("image/")) {
      setError(tx("Solo se permiten imágenes."));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(tx("La imagen no puede superar 5MB."));
      return;
    }
    setImagenPrevia(URL.createObjectURL(file));
    setImagenUrl(null);
    setSubiendoImagen(true);
    try {
      const { url } = await subirImagenMensaje(file);
      setImagenUrl(url);
    } catch (err) {
      setError(err.message || tx("Error al subir la imagen."));
      setImagenPrevia(null);
    } finally {
      setSubiendoImagen(false);
    }
  }

  function quitarImagen() {
    setImagenPrevia(null);
    setImagenUrl(null);
  }

  async function handleEnviar(e) {
    e.preventDefault();
    const contenido = texto.trim();
    if ((!contenido && !imagenUrl) || !conversacion || !otraPersona) return;
    if (subiendoImagen) return;
    const sendKey = `${conversacion.id}:${otraPersona.id}:${contenido}:${imagenUrl ?? ""}`;
    if (sending || pendingSendKeyRef.current === sendKey) return;
    const clientMessageId = retryClientMessageIdsRef.current.get(sendKey) ?? generarClientMessageId();
    setSending(true);
    setError("");
    pendingSendKeyRef.current = sendKey;
    retryClientMessageIdsRef.current.set(sendKey, clientMessageId);
    shouldAutoScrollRef.current = true;
    try {
      const nuevo = await enviarMensaje({
        contenido,
        destinatarioId: otraPersona.id,
        conversacionId: conversacion.id,
        clientMessageId,
        ...(mensajeRespondido?.id ? { mensajeRespondidoId: mensajeRespondido.id } : {}),
        ...(imagenUrl ? { imagenUrl } : {}),
      });
      setMensajes((prev) => aplicarEstadosPendientes(upsertMensaje(prev, nuevo)));
      setTexto("");
      setMensajeRespondido(null);
      setImagenPrevia(null);
      setImagenUrl(null);
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      retryClientMessageIdsRef.current.delete(sendKey);
    } catch (err) {
      const msg = err.message || "";
      // Si el backend nos dice que estamos bloqueados, actualizamos el estado local inmediatamente
      if (msg.includes("No puedes enviar mensajes")) {
        setMeBloqueo(true);
      } else {
        setError(msg || tx("No se pudo enviar el mensaje."));
      }
    } finally {
      pendingSendKeyRef.current = null;
      setSending(false);
    }
  }

  async function handleCrearReserva(datos) {
    if (!conversacion?.id) return;
    setCreandoReserva(true);
    try {
      const reserva = await crearReserva({ ...datos, conversacionId: conversacion.id });
      setConversacion((prev) => ({ ...prev, reservaId: reserva.id, servicioTitulo: reserva.servicioTitulo }));
      window.dispatchEvent(new CustomEvent("reservas:actualizadas"));
      setModalReservaAbierta(false);
      navigate(`${dashboardBase}/mensajes/reserva/${reserva.id}`, { replace: true });
    } finally {
      setCreandoReserva(false);
    }
  }

  async function handleToggleSilenciar() {
    if (!conversacion?.id || accionModeracion) return;
    setAccionModeracion(true);
    setErrorModeracion("");
    try {
      const actualizada = await silenciarConversacion(conversacion.id, silenciada ? null : "siempre");
      const nuevoEstado = actualizada.silenciada ?? false;
      setSilenciada(nuevoEstado);
      setConversacion((prev) => prev ? { ...prev, silenciada: nuevoEstado } : prev);
      window.dispatchEvent(new CustomEvent("chat:header:silenciada", {
        detail: { id: conversacion.id, silenciada: nuevoEstado },
      }));
    } catch (err) {
      setErrorModeracion(err.message || tx("Error al silenciar la conversación."));
    } finally {
      setAccionModeracion(false);
    }
  }

  function handleClickBloquear() {
    if (bloqueado) {
      ejecutarBloqueo(false);
    } else {
      setMotivoBloqueo("");
      setReportarJobFree(false);
      setConfirmarBloqueo(true);
    }
  }

  async function ejecutarBloqueo(bloquear, conReporte) {
    if (!otraPersona?.id || accionModeracion) return;
    setConfirmarBloqueo(false);
    setAccionModeracion(true);
    setErrorModeracion("");
    try {
      if (bloquear) {
        await bloquearUsuario(otraPersona.id, conReporte ? "Reportado por el usuario" : null);
        if (conReporte) {
          const ultimos = mensajes
            .filter((m) => !m.eliminado)
            .slice(-10)
            .map((m) => ({
              contenido: m.contenido || "",
              esMio: Number(m.remitenteId) === Number(usuario?.id),
              fechaEnvio: m.fechaEnvio,
            }));
          await crearReporte(otraPersona.id, ultimos).catch(() => {});
        }
        setBloqueado(true);
      } else {
        await desbloquearUsuario(otraPersona.id);
        setBloqueado(false);
      }
    } catch (err) {
      setErrorModeracion(err.message || tx("Error al actualizar el bloqueo."));
    } finally {
      setAccionModeracion(false);
    }
  }

  const LIMITE_MODIFICACION_MS = 2 * 60 * 1000; // 2 minutos

  function puedeModificar(msg) {
    return Number(msg.remitenteId) === Number(usuario?.id)
      && !msg.eliminado
      && Date.now() - new Date(msg.fechaEnvio).getTime() < LIMITE_MODIFICACION_MS;
  }

  async function handleEliminarMensaje(mensajeId) {
    if (mensajeEliminandoId) return;
    setMensajeEliminandoId(mensajeId);
    try {
      const actualizado = await eliminarMensaje(mensajeId);
      setMensajes((prev) => prev.map((m) => Number(m.id) === Number(actualizado.id) ? { ...m, ...actualizado } : m));
    } catch (err) {
      setError(err.message || tx("No se pudo eliminar el mensaje."));
    } finally {
      setMensajeEliminandoId(null);
    }
  }

  async function handleGuardarEdicion() {
    if (!mensajeEditando?.id || !textoEditando.trim()) return;
    try {
      const actualizado = await editarMensaje(mensajeEditando.id, textoEditando.trim());
      setMensajes((prev) => prev.map((m) => Number(m.id) === Number(actualizado.id) ? { ...m, ...actualizado } : m));
      setMensajeEditando(null);
      setTextoEditando("");
    } catch (err) {
      setError(err.message || tx("No se pudo editar el mensaje."));
    }
  }

  function handleCancelarEdicion() {
    setMensajeEditando(null);
    setTextoEditando("");
  }

  async function handleToggleReaccion(mensajeId, emoji) {
    if (!mensajeId) return;
    try {
      const reacciones = await toggleReaccion(mensajeId, emoji);
      setMensajes((prev) => prev.map((m) =>
        Number(m.id) === Number(mensajeId) ? { ...m, reacciones } : m
      ));
    } catch (err) {
      console.warn("[Chat] Error al actualizar reacción:", err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
        {tx("Cargando conversación...")}
      </div>
    );
  }

  if (error && !conversacion) {
    return <p className="py-10 text-center text-sm text-red-500">{error}</p>;
  }

  // Modal de confirmación de bloqueo
  const modalConfirmarBloqueo = confirmarBloqueo && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white px-6 pb-5 pt-6 shadow-2xl">
        <h2 className="text-[17px] font-semibold text-slate-900">
          {tx("¿Deseas bloquear a")} {otraPersona?.nombre}?
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-500">
          {tx("Esta persona no podrá enviarte mensajes. No sabrá que la bloqueaste.")}
        </p>

        <label className="mt-4 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={reportarJobFree}
            onChange={(e) => setReportarJobFree(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-500"
          />
          <div>
            <p className="text-[13.5px] font-semibold text-slate-800">{tx("Reportar a JobFree")}</p>
            <p className="mt-0.5 text-[12px] text-slate-500">
              {tx("Se enviarán a JobFree los últimos mensajes de este usuario.")}
            </p>
          </div>
        </label>

        <div className="mt-5 flex items-center justify-end gap-6">
          <button
            type="button"
            onClick={() => setConfirmarBloqueo(false)}
            className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
          >
            {tx("Cancelar")}
          </button>
          <button
            type="button"
            onClick={() => ejecutarBloqueo(true, reportarJobFree)}
            className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            {tx("Bloquear")}
          </button>
        </div>
      </div>
    </div>
  );

  const elementosChat = [];
  let ultimaClave = null;
  mensajes.forEach((mensaje) => {
    const clave = claveGrupoFecha(mensaje.fechaEnvio);
    if (clave !== ultimaClave) {
      elementosChat.push({ tipo: "separador", clave, fecha: mensaje.fechaEnvio });
      ultimaClave = clave;
    }
    elementosChat.push({ tipo: "mensaje", ...mensaje });
  });

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      {modalConfirmarBloqueo}

      {/* Lightbox para ver imágenes a pantalla completa */}
      {imagenModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setImagenModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setImagenModal(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/70 transition hover:bg-white/20 hover:text-white"
            aria-label="Cerrar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          <img
            src={imagenModal}
            alt=""
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 bg-white px-5 py-4">
        <button
          type="button"
          onClick={() => navigate(`${dashboardBase}/mensajes`)}
          className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>

        {otraPersona?.foto ? (
          <img src={otraPersona.foto} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-sm font-bold text-white">
            {generarIniciales(otraPersona?.nombre)}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-slate-900">{otraPersona?.nombre}</p>
            {!bloqueado && !meBloqueo && otraPersonaOnline && (
              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" title={tx("En línea")} />
            )}
          </div>
          {!bloqueado && !meBloqueo && (
            escribiendo ? (
              <p className="text-[11px] italic text-emerald-500">{tx("Escribiendo...")}</p>
            ) : otraPersonaOnline ? (
              <p className="text-[11px] font-medium text-emerald-500">{tx("En línea")}</p>
            ) : (otraPersonaUltimaConexion ?? conversacion?.otroUsuarioUltimaConexion) ? (
              <p className="text-[11px] text-slate-400">
                {formatearUltimaConexion(otraPersonaUltimaConexion ?? conversacion?.otroUsuarioUltimaConexion, tx)}
              </p>
            ) : null
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {esClienteActual && (
            <button
              type="button"
              onClick={() => setModalReservaAbierta(true)}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              <CalendarDaysIcon className="h-3.5 w-3.5" />
              {tx("Proponer servicio")}
            </button>
          )}

          <button
            type="button"
            onClick={handleToggleSilenciar}
            disabled={accionModeracion}
            title={silenciada ? tx("Activar notificaciones") : tx("Silenciar conversación")}
            className={`rounded-full p-2 transition ${
              silenciada
                ? "text-amber-500 hover:bg-amber-50"
                : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            }`}
          >
            {silenciada ? <BellSlashIcon className="h-4 w-4" /> : <BellIcon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={handleClickBloquear}
            disabled={accionModeracion}
            title={bloqueado ? tx("Desbloquear usuario") : tx("Bloquear usuario")}
            className={`rounded-full p-2 transition ${
              bloqueado
                ? "text-red-500 hover:bg-red-50"
                : "text-slate-400 hover:bg-slate-100 hover:text-red-400"
            }`}
          >
            <NoSymbolIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {errorModeracion && (
        <div className="flex items-center justify-between bg-amber-50 px-4 py-2 text-xs text-amber-700">
          <span>{errorModeracion}</span>
          <button type="button" onClick={() => setErrorModeracion("")} className="ml-2 shrink-0 font-bold">✕</button>
        </div>
      )}

      {/* Área de mensajes */}
      <div
        ref={scrollRef}
        onScroll={actualizarEstadoScroll}
        className="flex-1 overflow-y-auto bg-slate-50 px-4 py-4"
      >
        {hayMas && (
          <div className="flex justify-center pb-2 pt-1">
            {loadingMas ? (
              <ArrowPathIcon className="h-4 w-4 animate-spin text-slate-400" />
            ) : (
              <button
                type="button"
                onClick={cargarMas}
                className="rounded-full bg-white px-3 py-1 text-xs text-blue-500 shadow-sm ring-1 ring-slate-200 hover:bg-blue-50 transition"
              >
                {tx("Cargar mensajes anteriores")}
              </button>
            )}
          </div>
        )}

        {elementosChat.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-slate-400">
            {tx("Aún no hay mensajes. Empieza la conversación.")}
          </div>
        ) : (
          <div className="space-y-1">
            {elementosChat.map((item) => {
              if (item.tipo === "separador") {
                return <SeparadorFecha key={`sep-${item.clave}`} etiqueta={etiquetaGrupoFecha(item.fecha, idioma, tx)} />;
              }

              const esMio = Number(item.remitenteId) === Number(usuario?.id);

              return (
                <div
                  key={item.id || item.clientMessageId}
                  data-id={item.id}
                  className={`group flex items-end gap-1 ${esMio ? "justify-end" : "justify-start"} px-1 py-0.5`}
                >
                  {esMio && (
                    <div className="mb-1 flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => setMensajeRespondido(item)}
                        title={tx("Responder")}
                        className="shrink-0 rounded-full p-1 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:text-blue-500"
                      >
                        <ArrowUturnLeftIcon className="h-3.5 w-3.5" />
                      </button>
                      {puedeModificar(item) && item.contenido?.trim() && (
                        <button
                          type="button"
                          onClick={() => { setMensajeEditando(item); setTextoEditando(item.contenido || ""); }}
                          title={tx("Editar")}
                          className="shrink-0 rounded-full p-1 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:text-blue-500"
                        >
                          <PencilSquareIcon className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {puedeModificar(item) && (
                        <button
                          type="button"
                          onClick={() => handleEliminarMensaje(item.id)}
                          disabled={mensajeEliminandoId === item.id}
                          title={tx("Eliminar")}
                          className="shrink-0 rounded-full p-1 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:text-red-500 disabled:opacity-50"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  <div className={`flex flex-col gap-0.5 ${esMio ? "items-end" : "items-start"} ${
                    item.imagenUrl ? "w-[300px]" : "max-w-[75%]"
                  }`}>
                    {/* Botón smiley → picker flotante */}
                    {item.id && (
                      <div
                        data-reaction-anchor={item.id}
                        className={`relative ${esMio ? "self-end" : "self-start"}`}
                      >
                        <button
                          type="button"
                          title="Reaccionar"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setOpenReactionPickerId((prev) => (prev === item.id ? null : item.id));
                          }}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-200 transition opacity-0 group-hover:opacity-100 hover:text-slate-600"
                        >
                          <FaceSmileIcon className="h-4 w-4" />
                        </button>

                        {openReactionPickerId === item.id && (
                          <div className={`absolute bottom-full mb-1.5 z-20 flex gap-0.5 rounded-full bg-white px-1.5 py-1 shadow-xl ring-1 ring-slate-200 ${
                            esMio ? "right-0" : "left-0"
                          }`}>
                            {EMOJIS_PICKER.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                title={emoji}
                                onClick={() => {
                                  handleToggleReaccion(item.id, emoji);
                                  setOpenReactionPickerId(null);
                                }}
                                className="flex h-7 w-7 items-center justify-center rounded-full text-base leading-none transition hover:scale-125 hover:bg-slate-50"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bubble + reaction badge overlapping the bottom corner */}
                    <div className={`relative ${item.reacciones?.length > 0 ? "mb-3" : ""}`}>
                      <div
                        className={`overflow-hidden rounded-2xl shadow-sm max-w-full ${
                          esMio
                            ? "rounded-br-sm bg-blue-500 text-white"
                            : "rounded-bl-sm border border-slate-200 bg-white text-slate-800"
                        }`}
                      >
                        {item.mensajeRespondidoId && item.mensajeRespondidoContenido && (
                          <div className="px-4 pt-2.5 pb-0">
                            <button
                              type="button"
                              onClick={() => scrollToMessage(item.mensajeRespondidoId)}
                              className={`mb-1.5 w-full cursor-pointer rounded-xl border-l-2 px-2.5 py-1.5 text-left text-xs transition ${
                                esMio
                                  ? "border-white/50 bg-white/15 hover:bg-white/25 text-white/80"
                                  : "border-emerald-400 bg-slate-50 hover:bg-slate-100 text-slate-600"
                              }`}
                            >
                              <p className={`mb-0.5 text-[10px] font-semibold ${esMio ? "text-white/90" : "text-emerald-600"}`}>
                                {Number(item.mensajeRespondidoRemitenteId) === Number(usuario?.id) ? tx("Tú") : otraPersona?.nombre}
                              </p>
                              <p className="truncate">{item.mensajeRespondidoContenido}</p>
                            </button>
                          </div>
                        )}

                        {item.imagenUrl && !item.eliminado && (
                          <button
                            type="button"
                            className="block w-full text-left"
                            onClick={() => setImagenModal(API_URL + item.imagenUrl)}
                          >
                            <img
                              src={API_URL + item.imagenUrl}
                              alt="imagen"
                              className="block h-auto w-full"
                            />
                          </button>
                        )}

                        <div className={`px-4 ${item.imagenUrl ? "pt-2 pb-2.5" : "py-2.5"}`}>
                          {item.eliminado ? (
                            <p className={`text-[13px] italic ${esMio ? "text-white/50" : "text-slate-400"}`}>
                              {tx("Este mensaje fue eliminado")}
                            </p>
                          ) : mensajeEditando?.id === item.id ? (
                            <div>
                              <textarea
                                autoFocus
                                value={textoEditando}
                                onChange={(e) => setTextoEditando(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleGuardarEdicion(); }
                                  if (e.key === "Escape") handleCancelarEdicion();
                                }}
                                maxLength={1000}
                                rows={1}
                                style={{ height: "auto", minHeight: "28px" }}
                                onInput={(e) => { e.target.style.height = "auto"; e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`; }}
                                className="w-full resize-none rounded-lg bg-blue-400/50 px-2 py-1 text-[13.5px] leading-snug text-white outline-none placeholder:text-white/50 focus:bg-blue-400/60"
                              />
                              <div className="mt-1 flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={handleGuardarEdicion}
                                  className="rounded-full p-0.5 text-white/80 transition hover:text-white"
                                  title={tx("Guardar")}
                                >
                                  <CheckIcon className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={handleCancelarEdicion}
                                  className="rounded-full p-0.5 text-white/60 transition hover:text-white"
                                  title={tx("Cancelar")}
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {item.contenido?.trim() && (
                                <p className="whitespace-pre-wrap break-words text-[13.5px] leading-snug">{item.contenido}</p>
                              )}
                            </>
                          )}
                          <p className={`${item.contenido?.trim() && mensajeEditando?.id !== item.id ? "mt-1" : "mt-1"} text-right text-[10px] ${esMio ? "text-white/60" : "text-slate-400"}`}>
                            {item.editado && !item.eliminado && mensajeEditando?.id !== item.id && (
                              <span className="mr-1 opacity-70">{tx("editado")}</span>
                            )}
                            {mensajeEditando?.id !== item.id && formatearHora(item.fechaEnvio, idioma)}
                            {esMio && mensajeEditando?.id !== item.id && (
                              <span className="ml-1 inline-flex items-center align-middle">
                                <EstadoMensaje mensaje={item} />
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Reaction badge — overlaps the bottom corner like WhatsApp */}
                      {item.reacciones?.length > 0 && (
                        <div className={`absolute bottom-0 z-10 flex gap-0.5 translate-y-1/2 ${esMio ? "right-2" : "left-2"}`}>
                          {item.reacciones.map((r) => {
                            const yoReaccione = r.usuarioIds?.includes(Number(usuario?.id));
                            return (
                              <button
                                key={r.emoji}
                                type="button"
                                onClick={() => item.id && handleToggleReaccion(item.id, r.emoji)}
                                className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-sm shadow-md ring-1 transition hover:scale-110 ${
                                  yoReaccione
                                    ? "bg-blue-50 ring-blue-200"
                                    : "bg-white ring-slate-200"
                                }`}
                              >
                                {r.emoji}
                                {r.count > 1 && (
                                  <span className="text-[11px] font-medium text-slate-600">{r.count}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {!esMio && (
                    <button
                      type="button"
                      onClick={() => setMensajeRespondido(item)}
                      title={tx("Responder")}
                      className="mb-1 shrink-0 rounded-full p-1 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:text-slate-600"
                    >
                      <ArrowUturnLeftIcon className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-slate-100 bg-white">
        {(bloqueado || meBloqueo) && (
          <div className="flex items-center gap-2 bg-red-50 px-4 py-3 text-sm text-red-600">
            <NoSymbolIcon className="h-4 w-4 shrink-0" />
            <span className="flex-1">
              {bloqueado
                ? tx("Has bloqueado a este usuario. Ninguno podéis enviaros mensajes.")
                : tx("Este usuario te ha bloqueado. No puedes enviar mensajes.")}
            </span>
            {bloqueado && (
              <button
                type="button"
                onClick={() => ejecutarBloqueo(false)}
                disabled={accionModeracion}
                className="shrink-0 rounded-lg border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                {tx("Desbloquear")}
              </button>
            )}
          </div>
        )}

        {imagenPrevia && (
          <div className="flex items-start gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2">
            <div className="relative shrink-0">
              <img src={imagenPrevia} alt="" className="h-16 w-16 rounded-xl object-cover border border-slate-200" />
              {subiendoImagen && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/70">
                  <ArrowPathIcon className="h-4 w-4 animate-spin text-blue-500" />
                </div>
              )}
            </div>
            <div className="flex-1 pt-1">
              <p className="text-xs text-slate-500">
                {subiendoImagen ? tx("Subiendo imagen...") : tx("Imagen lista para enviar")}
              </p>
            </div>
            <button
              type="button"
              onClick={quitarImagen}
              className="shrink-0 rounded-full p-0.5 text-slate-400 hover:text-slate-600 transition"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {mensajeRespondido && (
          <div className="flex items-start gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2">
            <div className="min-w-0 flex-1 border-l-2 border-blue-400 pl-2">
              <p className="text-[10px] font-semibold text-blue-500">
                {Number(mensajeRespondido.remitenteId) === Number(usuario?.id) ? tx("Tú") : otraPersona?.nombre}
              </p>
              <p className="truncate text-xs text-slate-500">
                {mensajeRespondido.contenido?.trim() || "📷 Imagen"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMensajeRespondido(null)}
              className="shrink-0 rounded-full p-0.5 text-slate-400 hover:text-slate-600 transition"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="relative px-4 py-3">
          {error && conversacion && (
            <p className="mb-2 text-xs text-red-500">{error}</p>
          )}

          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute bottom-full right-0 mb-2 z-50">
              <EmojiPickerES
                onEmojiClick={(emoji) => {
                  setTexto((prev) => prev + emoji);
                  textareaRef.current?.focus();
                }}
              />
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImagenSeleccionada}
          />

          <form onSubmit={handleEnviar} className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={texto}
              rows={1}
              disabled={bloqueado || meBloqueo}
              onChange={(e) => {
                setTexto(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                if (e.target.value.trim()) enviarEscribiendo();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!sending && texto.trim()) handleEnviar(e);
                }
              }}
              placeholder={bloqueado || meBloqueo ? tx("No puedes enviar mensajes") : tx("Escribe un mensaje...")}
              className="max-h-[120px] min-h-[44px] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label={tx("Adjuntar imagen")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <PhotoIcon className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              aria-label={tx("Emojis")}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition ${
                showEmojiPicker
                  ? "bg-blue-100 text-blue-500"
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              }`}
            >
              <FaceSmileIcon className="h-6 w-6" />
            </button>
            <button
              type="submit"
              disabled={sending || subiendoImagen || (!texto.trim() && !imagenUrl) || bloqueado || meBloqueo}
              aria-label={tx("Enviar mensaje")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <PaperAirplaneIcon className="h-5 w-5 -rotate-45" />
            </button>
          </form>
        </div>
      </div>

      <ModalProponerServicio
        abierta={modalReservaAbierta}
        servicios={serviciosProfesional}
        cargando={cargandoServicios}
        errorCarga={errorServicios}
        onCerrar={() => setModalReservaAbierta(false)}
        onConfirmar={handleCrearReserva}
        enviando={creandoReserva}
      />
    </div>
  );
}

export default ChatReserva;
