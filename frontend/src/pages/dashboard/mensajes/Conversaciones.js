import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BellSlashIcon, BellIcon, ChatBubbleLeftRightIcon, ArrowPathIcon,
  MagnifyingGlassIcon, NoSymbolIcon, EllipsisVerticalIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { obtenerMisConversaciones, silenciarConversacion, fijarConversacion } from "api/conversaciones";
import { marcarMensajesRecibidos } from "api/mensajes";
import { useAuth } from "context/AuthContext";
import { useChatSocket } from "context/ChatSocketContext";
import { useLanguage } from "context/LanguageContext";
import API_URL from "api/config";

function ThumbtackIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21v-7" />
      <path d="M6.5 14h11" />
      <path d="M9 3h6l1.5 5.5a1 1 0 0 1-.9 1.5H8.4a1 1 0 0 1-.9-1.5L9 3z" />
      <path d="M8 10v4h8v-4" />
    </svg>
  );
}

function ThumbtackSlashIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21v-7" />
      <path d="M6.5 14h11" />
      <path d="M9 3h6l1.5 5.5a1 1 0 0 1-.9 1.5H8.4a1 1 0 0 1-.9-1.5L9 3z" />
      <path d="M8 10v4h8v-4" />
      <line x1="4" y1="4" x2="20" y2="20" />
    </svg>
  );
}

function formatearFechaRelativa(fecha, idioma, tx) {
  if (!fecha) return "";
  const ahora = new Date();
  const d = new Date(fecha);
  const hoyInicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()).getTime();
  const ayerInicio = hoyInicio - 86400000;
  const dInicio = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const locale = idioma === "en" ? "en-GB" : "es-ES";

  if (dInicio === hoyInicio) {
    return d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  }
  if (dInicio === ayerInicio) return tx("Ayer");
  if (hoyInicio - dInicio < 7 * 86400000) {
    return d.toLocaleDateString(locale, { weekday: "short" });
  }
  return d.toLocaleDateString(locale, { day: "numeric", month: "short" });
}

function generarIniciales(nombre) {
  return (nombre ?? "?")
    .split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

function MenuContexto({ conversacion, posicion, onCerrar, onSilenciar, onFijar }) {
  const { tx } = useLanguage();
  const [submenu, setSubmenu] = useState(false);

  useEffect(() => {
    function handleKey(e) { if (e.key === "Escape") onCerrar(); }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onCerrar]);

  const style = { position: "fixed", zIndex: 9999, top: posicion.y, left: posicion.x };
  const itemCls = "flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[13px] text-slate-700 hover:bg-slate-50 rounded-lg transition-colors";

  return (
    <div
      style={style}
      className="min-w-[210px] rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="px-1.5">
        {conversacion.silenciada ? (
          <button className={itemCls} onClick={() => onSilenciar(null)}>
            <BellIcon className="h-4 w-4 shrink-0 text-slate-500" />
            {tx("Activar notificaciones")}
          </button>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setSubmenu(true)}
            onMouseLeave={() => setSubmenu(false)}
          >
            <button className={`${itemCls} justify-between`}>
              <span className="flex items-center gap-2.5">
                <BellSlashIcon className="h-4 w-4 shrink-0 text-slate-500" />
                {tx("Silenciar notificaciones")}
              </span>
              <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            </button>
            {submenu && (
              <div className="absolute left-full top-0 ml-1 min-w-[130px] rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl">
                <div className="px-1.5">
                  {[
                    { label: tx("8 horas"), value: "8h" },
                    { label: tx("1 semana"), value: "1s" },
                    { label: tx("Siempre"), value: "siempre" },
                  ].map(({ label, value }) => (
                    <button key={value} className={itemCls} onClick={() => onSilenciar(value)}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="my-1 h-px bg-slate-100" />

        <button className={itemCls} onClick={onFijar}>
          {conversacion.fijada ? (
            <>
              <ThumbtackSlashIcon className="h-4 w-4 shrink-0 text-slate-500" />
              {tx("Desfijar chat")}
            </>
          ) : (
            <>
              <ThumbtackIcon className="h-4 w-4 shrink-0 text-slate-500" />
              {tx("Fijar chat")}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function TarjetaConversacion({ conversacion, dashboardBase, usuarioId, estaActiva, onMenuAbrir }) {
  const navigate = useNavigate();
  const { idioma, tx } = useLanguage();
  const esCliente = Number(conversacion.clienteId) === Number(usuarioId);
  const nombreOtraPersona = esCliente ? conversacion.profesionalNombre : conversacion.clienteNombre;
  const fotoOtraPersona = esCliente ? conversacion.profesionalFotoUrl : conversacion.clienteFotoUrl;
  const foto = fotoOtraPersona
    ? (fotoOtraPersona.startsWith("http") ? fotoOtraPersona : API_URL + fotoOtraPersona)
    : null;
  const noLeidos = (estaActiva || conversacion.silenciada) ? 0 : (conversacion.noLeidos || 0);

  return (
    <div className={`group relative flex items-center transition-colors ${estaActiva ? "bg-emerald-50/80 border-l-[3px] border-emerald-400" : "hover:bg-slate-50 active:bg-slate-100 border-l-[3px] border-transparent"}`}>
      <button
        type="button"
        onClick={() => navigate(
          conversacion.reservaId
            ? `${dashboardBase}/mensajes/reserva/${conversacion.reservaId}`
            : `${dashboardBase}/mensajes/${conversacion.id}`
        )}
        className="flex min-w-0 flex-1 items-center gap-3 pl-4 pr-5 py-3.5 text-left"
      >
        {foto ? (
          <img src={foto} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
        ) : (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-sm font-bold text-white">
            {generarIniciales(nombreOtraPersona)}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              {conversacion.fijada && (
                <ThumbtackIcon className="h-3 w-3 shrink-0 text-emerald-500" />
              )}
              <p className={`truncate text-[13.5px] ${noLeidos > 0 ? "font-bold text-slate-900" : "font-semibold text-slate-800"}`}>
                {nombreOtraPersona}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {conversacion.silenciada && (
                <BellSlashIcon className="h-3.5 w-3.5 text-amber-400" title={tx("Silenciada")} />
              )}
              {(conversacion.bloqueado || conversacion.meBloqueo) && (
                <NoSymbolIcon className="h-3.5 w-3.5 text-red-400" title={tx("Bloqueado")} />
              )}
              <span className={`text-[11px] ${noLeidos > 0 ? "font-bold text-emerald-500" : "text-slate-400"}`}>
                {formatearFechaRelativa(conversacion.fechaUltimoMensaje, idioma, tx)}
              </span>
            </div>
          </div>
          <div className="mt-0.5 flex items-center justify-between gap-2">
            <p className={`truncate text-xs ${noLeidos > 0 ? "font-medium text-slate-700" : "text-slate-400"}`}>
              {conversacion.ultimoMensaje || tx("Sin mensajes aun")}
            </p>
            {noLeidos > 0 && (
              <span className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[10px] font-bold text-white">
                {noLeidos > 99 ? "99+" : noLeidos}
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Botón "···" visible en hover */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onMenuAbrir(conversacion, e.clientX, e.clientY);
        }}
        className="mr-2 shrink-0 rounded-full p-1.5 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-600"
        title={tx("Opciones")}
      >
        <EllipsisVerticalIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

function upsertConversacion(lista, actualizada) {
  const resto = lista.filter((item) => Number(item.id) !== Number(actualizada.id));
  return [actualizada, ...resto].sort((a, b) => {
    // Fijadas primero
    if ((b.fijada ? 1 : 0) !== (a.fijada ? 1 : 0)) return (b.fijada ? 1 : 0) - (a.fijada ? 1 : 0);
    const fechaA = new Date(a.fechaUltimoMensaje || a.fechaCreacion || 0).getTime();
    const fechaB = new Date(b.fechaUltimoMensaje || b.fechaCreacion || 0).getTime();
    return fechaB - fechaA;
  });
}

function Conversaciones({ panelMode = false }) {
  const { usuario } = useAuth();
  const { tx } = useLanguage();
  const { subscribeToUserQueue, connectionState } = useChatSocket();
  const location = useLocation();
  const [conversaciones, setConversaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [menu, setMenu] = useState(null); // { conv, x, y } | null

  useEffect(() => {
    let activo = true;

    async function cargar(silencioso = false) {
      if (!silencioso) setLoading(true);
      try {
        const data = await obtenerMisConversaciones();
        if (activo) setConversaciones(data);
      } catch {
        if (activo) setError(tx("No se pudieron cargar tus conversaciones."));
      } finally {
        if (activo && !silencioso) setLoading(false);
      }
    }

    cargar();
    return () => { activo = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return subscribeToUserQueue((evento) => {
      if (evento?.tipo === "conversacion.actualizada" && evento.conversacion) {
        setConversaciones((prev) => upsertConversacion(prev, evento.conversacion));
        return;
      }
      if (evento?.tipo === "mensaje.nuevo" && evento.mensaje?.conversacionId) {
        if (Number(evento.mensaje.destinatarioId) === Number(usuario?.id) && !evento.mensaje.recibido) {
          marcarMensajesRecibidos([evento.mensaje.id]).catch((e) =>
            console.warn("[Conversaciones] No se pudo marcar mensaje como recibido:", e)
          );
        }
      }
      if (evento?.tipo === "usuario.bloqueado" || evento?.tipo === "usuario.desbloqueado") {
        const esBloqueado = evento.tipo === "usuario.bloqueado";
        setConversaciones((prev) =>
          prev.map((c) => {
            const otroId = Number(usuario?.id) === Number(c.clienteId)
              ? Number(c.profesionalId)
              : Number(c.clienteId);
            return otroId === Number(evento.bloqueadorId)
              ? { ...c, meBloqueo: esBloqueado }
              : c;
          })
        );
      }
    });
  }, [subscribeToUserQueue, usuario?.id]);

  // Bug fix: cuando el usuario entra a una conversación, poner noLeidos=0 inmediatamente
  // en lugar de depender solo del evento WebSocket (que puede llegar tarde o no llegar).
  useEffect(() => {
    setConversaciones((prev) => {
      let changed = false;
      const updated = prev.map((c) => {
        if (c.noLeidos === 0) return c;
        const byId = `${dashboardBase}/mensajes/${c.id}`;
        const byReserva = c.reservaId ? `${dashboardBase}/mensajes/reserva/${c.reservaId}` : null;
        const activa = location.pathname === byId || (byReserva && location.pathname === byReserva);
        if (!activa) return c;
        changed = true;
        return { ...c, noLeidos: 0 };
      });
      return changed ? updated : prev;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Sincronizar estado silenciada cuando ChatReserva lo cambia desde la cabecera del chat
  useEffect(() => {
    function handleSilenciadaDesdeChat(e) {
      setConversaciones((prev) => prev.map((c) =>
        Number(c.id) === Number(e.detail.id)
          ? { ...c, silenciada: e.detail.silenciada }
          : c
      ));
    }
    window.addEventListener("chat:header:silenciada", handleSilenciadaDesdeChat);
    return () => window.removeEventListener("chat:header:silenciada", handleSilenciadaDesdeChat);
  }, []);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    if (!menu) return;
    function handleClick() { setMenu(null); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menu]);

  async function handleSilenciar(convId, duracion) {
    setMenu(null);
    try {
      const actualizada = await silenciarConversacion(convId, duracion);
      setConversaciones((prev) => upsertConversacion(prev, actualizada));
      window.dispatchEvent(new CustomEvent("chat:conversacion:silenciada", {
        detail: { id: convId, silenciada: actualizada.silenciada ?? false },
      }));
    } catch (e) {
      console.warn("[Conversaciones] Error al silenciar:", e);
    }
  }

  async function handleFijar(convId) {
    setMenu(null);
    try {
      const actualizada = await fijarConversacion(convId);
      setConversaciones((prev) => upsertConversacion(prev, actualizada));
    } catch (e) {
      console.warn("[Conversaciones] Error al fijar:", e);
    }
  }

  const dashboardBase = usuario?.rol?.toUpperCase() === "PROFESIONAL"
    ? "/dashboard/profesional"
    : "/dashboard/cliente";

  function esActiva(conv) {
    const byId = `${dashboardBase}/mensajes/${conv.id}`;
    const byReserva = conv.reservaId ? `${dashboardBase}/mensajes/reserva/${conv.reservaId}` : null;
    return location.pathname === byId || (byReserva && location.pathname === byReserva);
  }

  const conversacionesFiltradas = busqueda.trim()
    ? conversaciones.filter((c) => {
        const q = busqueda.toLowerCase();
        const nombre = `${c.clienteNombre ?? ""} ${c.profesionalNombre ?? ""}`.toLowerCase();
        const msg = (c.ultimoMensaje ?? "").toLowerCase();
        return nombre.includes(q) || msg.includes(q);
      })
    : conversaciones;

  const tooltipConexion =
    connectionState === "connected"
      ? tx("Tiempo real activo")
      : connectionState === "reconnecting"
        ? tx("Reconectando...")
        : tx("Sin tiempo real");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
        {tx("Cargando...")}
      </div>
    );
  }

  if (error) {
    return <p className="py-10 text-center text-sm text-red-500">{error}</p>;
  }

  return (
    <div className={panelMode
      ? "flex h-full flex-col overflow-hidden bg-white"
      : "flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    }>
      <div className="border-b border-slate-200 bg-white px-5 pb-4 pt-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800">{tx("Mensajes")}</h1>
          </div>
          <span
            title={tooltipConexion}
            className={`h-2.5 w-2.5 rounded-full ring-2 ring-white ${
              connectionState === "connected"
                ? "bg-emerald-400"
                : connectionState === "reconnecting"
                  ? "animate-pulse bg-amber-400"
                  : "bg-slate-300"
            }`}
          />
        </div>

        <div className="relative mt-3">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder={tx("Buscar conversación...")}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      <div className="flex-1 divide-y divide-slate-100/80 overflow-y-auto">
        {conversacionesFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ChatBubbleLeftRightIcon className="mb-3 h-10 w-10 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">
              {busqueda
                ? tx("Sin resultados para tu búsqueda.")
                : tx("Todavía no tienes conversaciones.")}
            </p>
            {!busqueda && (
              <p className="mt-1 text-xs text-slate-400">{tx("Se crearan cuando contactes con un profesional.")}</p>
            )}
          </div>
        ) : (
          conversacionesFiltradas.map((conversacion) => (
            <TarjetaConversacion
              key={conversacion.id}
              conversacion={conversacion}
              dashboardBase={dashboardBase}
              usuarioId={usuario?.id}
              estaActiva={esActiva(conversacion)}
              onMenuAbrir={(conv, x, y) => setMenu({ conv, x, y })}
            />
          ))
        )}
      </div>

      {/* Menú contextual flotante */}
      {menu && (
        <MenuContexto
          conversacion={menu.conv}
          posicion={{ x: menu.x, y: menu.y }}
          onCerrar={() => setMenu(null)}
          onSilenciar={(duracion) => handleSilenciar(menu.conv.id, duracion)}
          onFijar={() => handleFijar(menu.conv.id)}
        />
      )}
    </div>
  );
}

export default Conversaciones;
