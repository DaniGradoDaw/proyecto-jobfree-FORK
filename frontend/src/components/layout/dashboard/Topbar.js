import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

import { useLanguage } from "context/LanguageContext";
import LanguageMenu from "components/layout/public/LanguageMenu";
import { useAuth } from "context/AuthContext";
import { useTheme } from "context/ThemeContext";
import { obtenerTodasSubcategorias } from "api/subcategorias";
import API_URL from "api/config";
import { obtenerMisNotificaciones, marcarNotificacionComoLeida } from "api/notificaciones";
import { useChatSocket } from "context/ChatSocketContext";

function formatearFechaNotificacion(fecha) {
  if (!fecha) return "";
  return new Date(fecha).toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Topbar({ setOpen, collapsed = false }) {

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [confirmarCierre, setConfirmarCierre] = useState(false);

  const [query, setQuery] = useState("");
  const [todosServicios, setTodosServicios] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [indiceActivo, setIndiceActivo] = useState(-1);
  const [notificaciones, setNotificaciones] = useState([]);

  const menuRef = useRef();
  const bellRef = useRef();
  const buscadorRef = useRef();

  const navigate = useNavigate();
  const { tx } = useLanguage();
  const { usuario, cerrarSesion } = useAuth();
  const { tema } = useTheme();
  useChatSocket();

  const esTemaOscuro = tema.texto === "#ffffff";
  const noLeidas = notificaciones.filter((n) => !n.leida);

  useEffect(() => {
    obtenerTodasSubcategorias()
      .then(setTodosServicios)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!usuario?.id) {
      setNotificaciones([]);
      return undefined;
    }

    function cargarNotificaciones() {
      obtenerMisNotificaciones()
        .then(setNotificaciones)
        .catch(() => {});
    }

    cargarNotificaciones();

    // Refrescar notificaciones cuando cambian reservas
    window.addEventListener("reservas:actualizadas", cargarNotificaciones);

    // Refrescar silenciosamente cada minuto
    const intervalo = setInterval(cargarNotificaciones, 60_000);

    return () => {
      window.removeEventListener("reservas:actualizadas", cargarNotificaciones);
      clearInterval(intervalo);
    };
  }, [usuario?.id]);

  function resolverImagenBusqueda(imagen) {
    if (!imagen) return null;
    if (imagen.startsWith("http")) return imagen;
    if (imagen.startsWith("/images/")) return imagen;
    return API_URL + imagen;
  }

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
      if (buscadorRef.current && !buscadorRef.current.contains(e.target)) {
        setQuery("");
        setResultados([]);
        setIndiceActivo(-1);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function obtenerBaseBusquedaDashboard() {
    const rol = usuario?.rol?.toLowerCase();
    if (rol === "cliente") return "/dashboard/cliente/buscar";
    if (rol === "profesional") return "/dashboard/profesional/buscar";
    return "";
  }

  function navegarASubcategoria(id) {
    const base = obtenerBaseBusquedaDashboard();
    navigate(base ? `${base}/servicios/subcategoria/${id}` : `/servicios/subcategoria/${id}`);
    setQuery("");
    setResultados([]);
    setIndiceActivo(-1);
  }

  function handleQuery(e) {
    const valor = e.target.value;
    setQuery(valor);
    setIndiceActivo(-1);
    if (!valor.trim()) { setResultados([]); return; }
    setResultados(
      todosServicios
        .filter(s => s.nombre.toLowerCase().includes(valor.toLowerCase().trim()))
        .slice(0, 6)
    );
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      if (resultados.length === 0) return;
      e.preventDefault();
      setIndiceActivo((prev) => (prev + 1) % resultados.length);
      return;
    }
    if (e.key === "ArrowUp") {
      if (resultados.length === 0) return;
      e.preventDefault();
      setIndiceActivo((prev) => (prev <= 0 ? resultados.length - 1 : prev - 1));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (resultados.length > 0 && indiceActivo >= 0) {
        navegarASubcategoria(resultados[indiceActivo].id);
      } else if (query.trim()) {
        const base = obtenerBaseBusquedaDashboard();
        navigate(base
          ? `${base}/servicios?q=${encodeURIComponent(query.trim())}`
          : `/servicios?q=${encodeURIComponent(query.trim())}`);
        setQuery("");
        setResultados([]);
        setIndiceActivo(-1);
      }
      return;
    }
    if (e.key === "Escape") {
      setQuery("");
      setResultados([]);
      setIndiceActivo(-1);
    }
  }

  function handleCerrarSesion() {
    cerrarSesion();
    navigate("/");
  }

  function rutaDesdeNotificacion(mensaje) {
    const rol = usuario?.rol?.toLowerCase();
    const base = rol === "profesional" ? "/dashboard/profesional" : "/dashboard/cliente";
    const m = mensaje?.toLowerCase() ?? "";
    if (m.includes("solicitud") && rol === "profesional") return `${base}/solicitudes`;
    if (m.includes("solicitud") || m.includes("aceptada") || m.includes("rechazada")) return `${base}/reservas`;
    if (m.includes("completado") || m.includes("valoración") || m.includes("valoracion")) return `${base}/reservas`;
    if (m.includes("pago")) return rol === "profesional" ? `${base}/solicitudes` : `${base}/reservas`;
    return `${base}/reservas`;
  }

  async function handleClickNotificacion(item) {
    setBellOpen(false);
    if (!item.leida) {
      try {
        const actualizada = await marcarNotificacionComoLeida(item.id);
        setNotificaciones((prev) => prev.map((n) => n.id === actualizada.id ? actualizada : n));
      } catch { /* silencioso */ }
    }
    navigate(rutaDesdeNotificacion(item.mensaje));
  }

  async function handleMarcarTodasLeidas() {
    const sinLeer = notificaciones.filter((n) => !n.leida);
    await Promise.allSettled(sinLeer.map((n) => marcarNotificacionComoLeida(n.id)));
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
  }

  function obtenerRutaConfiguracion() {
    return usuario?.rol?.toUpperCase() === "PROFESIONAL"
      ? "/dashboard/profesional/configuracion"
      : "/dashboard/cliente/configuracion";
  }

  const clsIcono = esTemaOscuro ? "text-white/80 hover:text-white" : "text-gray-500 hover:text-gray-700";
  const clsBorde = esTemaOscuro ? "border-white/10" : "border-gray-200";

  return (
    <header
      style={{ backgroundColor: tema.bg, borderColor: tema.borde }}
      className={`h-16 border-b flex items-center px-6 fixed top-0 right-0 left-0 z-30 transition-all duration-300 ${collapsed ? "md:left-16" : "md:left-64"}`}
    >
      {/* Botón menú móvil */}
      <button onClick={() => setOpen(true)} className={`md:hidden mr-4 ${clsIcono}`}>
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* Buscador */}
      <div className="flex-1 flex justify-start">
        <div className="relative w-72 ml-2" ref={buscadorRef}>
          <input
            type="text"
            value={query}
            onChange={handleQuery}
            onKeyDown={handleKeyDown}
            placeholder={tx("Buscar servicios...")}
            style={{
              color: tema.texto,
              backgroundColor: esTemaOscuro ? "rgba(255,255,255,0.1)" : "#f9fafb",
              borderColor: esTemaOscuro ? "rgba(255,255,255,0.2)" : "#e5e7eb",
            }}
            className="w-full rounded-full px-4 py-2 pr-10 border focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm placeholder-gray-500"
          />
          <MagnifyingGlassIcon className={`w-5 h-5 absolute right-3 top-2.5 ${clsIcono}`} />

          {query.trim().length > 0 && (
            <div className="absolute top-full mt-1 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden" style={{boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"}}>
              {resultados.length > 0 ? (
                resultados.map((s, index) => (
                  <button
                    key={s.id}
                    onClick={() => navegarASubcategoria(s.id)}
                    onMouseEnter={() => setIndiceActivo(index)}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 border-b last:border-0 transition ${
                      indiceActivo === index ? "bg-emerald-50" : "hover:bg-gray-50"
                    }`}>
                    {s.imagen ? (
                      <img
                        src={resolverImagenBusqueda(s.imagen)}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover shrink-0 bg-gray-100 border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200">
                        <span className="text-emerald-600 text-base font-bold">{s.nombre?.charAt(0)}</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{tx(s.nombre)}</p>
                      {s.categoriaNombre && (
                        <p className="text-xs text-gray-400 truncate">{tx(s.categoriaNombre)}</p>
                      )}
                      {s.descripcion && (
                        <p className="text-xs text-gray-500 truncate">{tx(s.descripcion)}</p>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 text-sm text-gray-400">
                  {tx("No hay resultados")}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Zona derecha */}
      <div className="flex items-center gap-3 shrink-0">

        {/* ── Notificaciones ── */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => { setBellOpen(v => !v); setUserMenuOpen(false); }}
            className={`relative p-1.5 rounded-full transition ${clsIcono}`}>
            <BellIcon className="w-6 h-6" />
            {noLeidas.length > 0 && (
              <span className="absolute -right-1 -top-1 flex min-w-[1.1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {noLeidas.length > 99 ? "99+" : noLeidas.length}
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-30 overflow-hidden" style={{boxShadow: "0 20px 40px -8px rgba(0,0,0,0.15)"}}>
              {/* Cabecera */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{tx("Notificaciones")}</p>
                  {noLeidas.length > 0 && (
                    <p className="text-xs text-slate-400">{tx("{count} sin leer", { count: noLeidas.length })}</p>
                  )}
                </div>
                {noLeidas.length > 0 && (
                  <button
                    onClick={handleMarcarTodasLeidas}
                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition">
                    {tx("Marcar todas leídas")}
                  </button>
                )}
              </div>

              {/* Lista — solo no leídas */}
              {noLeidas.length === 0 ? (
                <div className="py-12 text-center px-4">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                    <BellIcon className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">{tx("Todo al día")}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{tx("No tienes notificaciones nuevas")}</p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                  {noLeidas.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleClickNotificacion(item)}
                      className="w-full px-4 py-3.5 text-left transition hover:bg-slate-50 flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 leading-snug">{item.mensaje}</p>
                        <p className="mt-1 text-xs text-slate-400">{formatearFechaNotificacion(item.fecha)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Idioma ── */}
        <LanguageMenu variant={esTemaOscuro ? "dark" : "light"} />

        {/* ── Menú de usuario ── */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => { setUserMenuOpen(v => !v); setBellOpen(false); }}
            className={`transition ${clsIcono}`}>
            {usuario?.fotoUrl ? (
              <img
                src={usuario.fotoUrl.startsWith("http") ? usuario.fotoUrl : API_URL + usuario.fotoUrl}
                alt=""
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white/30"
              />
            ) : (
              <UserCircleIcon className="w-9 h-9" />
            )}
          </button>

          {userMenuOpen && (
            <div className={`absolute right-0 mt-2 w-48 bg-white border ${clsBorde} rounded-xl shadow-xl overflow-hidden z-30`} style={{boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"}}>
              {usuario && (
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-800 truncate">{usuario.nombreCompleto}</p>
                  <p className="text-xs text-gray-400 truncate">{usuario.email}</p>
                </div>
              )}
              <button
                onClick={() => { setUserMenuOpen(false); navigate("/perfil"); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 transition">
                {tx("Perfil")}
              </button>
              <button
                onClick={() => { setUserMenuOpen(false); navigate(obtenerRutaConfiguracion()); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 transition">
                {tx("Configuración")}
              </button>
              <div className="border-t border-gray-100" />
              <button
                onClick={() => { setUserMenuOpen(false); setConfirmarCierre(true); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 text-red-500 transition">
                {tx("Cerrar sesión")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal confirmación cierre de sesión */}
      {confirmarCierre && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xs w-full text-center border border-gray-100">
            <div className="text-4xl mb-3">👋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{tx("Cerrar sesión?")}</h3>
            <p className="text-sm text-gray-400 mb-6">{tx("Podras volver a entrar cuando quieras.")}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmarCierre(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm font-medium">
                {tx("Cancelar")}
              </button>
              <button
                onClick={handleCerrarSesion}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition text-sm font-medium">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Topbar;
