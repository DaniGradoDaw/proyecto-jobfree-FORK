import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDaysIcon,
  CreditCardIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  ClockIcon,
  StarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid, HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { obtenerMisReservas } from "api/reservas";
import { obtenerMisFavoritos } from "api/favoritos";
import { useAuth } from "context/AuthContext";
import { useLanguage } from "context/LanguageContext";
import API_URL from "api/config";

function saludar(nombre) {
  const h = new Date().getHours();
  const base = h < 13 ? "Buenos días" : h < 20 ? "Buenas tardes" : "Buenas noches";
  return nombre ? `${base}, ${nombre.split(" ")[0]}` : base;
}

function AvatarProfesional({ src, nombre, size = "md" }) {
  const foto = src ? (src.startsWith("http") ? src : API_URL + src) : null;
  const iniciales = (nombre ?? "?").split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  const cls = size === "sm" ? "h-8 w-8 text-[10px]" : "h-10 w-10 text-xs";
  return foto ? (
    <img src={foto} alt="" className={`${cls} rounded-full object-cover ring-2 ring-white shrink-0`} />
  ) : (
    <div className={`${cls} rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shrink-0 ring-2 ring-white`}>
      <span className="font-bold text-white">{iniciales}</span>
    </div>
  );
}

const ESTADO_META = {
  PENDIENTE:  { label: "Pendiente",  badgeBg: "bg-amber-100",   badgeText: "text-amber-700" },
  CONFIRMADA: { label: "Confirmada", badgeBg: "bg-sky-100",     badgeText: "text-sky-700"   },
  COMPLETADA: { label: "Completada", badgeBg: "bg-emerald-100", badgeText: "text-emerald-700" },
  CANCELADA:  { label: "Cancelada",  badgeBg: "bg-red-100",     badgeText: "text-red-600"   },
  RECHAZADA:  { label: "Rechazada",  badgeBg: "bg-red-100",     badgeText: "text-red-600"   },
};

function TarjetaReservaCompacta({ reserva }) {
  const navigate = useNavigate();
  const { idioma, tx } = useLanguage();
  const locale = idioma === "en" ? "en-GB" : "es-ES";
  const meta = ESTADO_META[reserva.estado] ?? ESTADO_META.COMPLETADA;
  const pagada = reserva.estadoPago === "PAGADO";
  const puedePagar = reserva.estado === "CONFIRMADA" && !pagada;
  const puedeValorar = reserva.estado === "COMPLETADA" && !reserva.valorada;
  const puedeChat = ["PENDIENTE", "CONFIRMADA"].includes(reserva.estado);

  const fecha = reserva.fechaInicio
    ? new Date(reserva.fechaInicio).toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" })
    : null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 hover:bg-slate-50 transition group">
      <AvatarProfesional src={reserva.profesionalFotoUrl} nombre={reserva.profesionalNombre} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate leading-tight">{reserva.servicioTitulo}</p>
        <p className="text-xs text-slate-400 truncate">{reserva.profesionalNombre}</p>
        {fecha && (
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
            <ClockIcon className="h-3 w-3" />{fecha}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.badgeBg} ${meta.badgeText}`}>
          {tx(meta.label)}
        </span>
        <div className="flex gap-1">
          {puedePagar && (
            <button
              onClick={() => navigate(`/dashboard/cliente/pagar/${reserva.id}`)}
              className="flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700 transition"
            >
              <CreditCardIcon className="h-3 w-3" />{tx("Pagar")}
            </button>
          )}
          {puedeValorar && (
            <button
              onClick={() => navigate(`/dashboard/cliente/valorar/${reserva.id}`)}
              className="flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-amber-600 transition"
            >
              <StarSolid className="h-3 w-3" />{tx("Valorar")}
            </button>
          )}
          {puedeChat && (
            <button
              onClick={() => navigate(`/dashboard/cliente/mensajes/reserva/${reserva.id}`)}
              className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              <ChatBubbleLeftRightIcon className="h-3 w-3" />{tx("Chat")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PanelCliente() {
  const { usuario } = useAuth();
  const { tx } = useLanguage();
  const navigate = useNavigate();

  const [reservas, setReservas] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.allSettled([obtenerMisReservas(), obtenerMisFavoritos()]).then(([resR, resF]) => {
      if (resR.status === "fulfilled") setReservas(resR.value);
      if (resF.status === "fulfilled") setFavoritos(resF.value);
      setCargando(false);
    });
  }, []);

  const activas     = reservas.filter((r) => ["PENDIENTE", "CONFIRMADA"].includes(r.estado));
  const sinPagar    = reservas.filter((r) => r.estado === "CONFIRMADA" && r.estadoPago !== "PAGADO");
  const completadas = reservas.filter((r) => r.estado === "COMPLETADA");
  const porValorar  = completadas.filter((r) => !r.valorada);

  const proximas = activas
    .filter((r) => r.fechaInicio)
    .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));

  const hoy = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
        {tx("Cargando...")}
      </div>
    );
  }

  const accesos = [
    { icon: MagnifyingGlassIcon, label: tx("Buscar"),    to: "/dashboard/cliente/buscar/servicios", bg: "bg-emerald-400/20 hover:bg-emerald-400/30" },
    { icon: ChatBubbleLeftRightIcon, label: tx("Mensajes"),  to: "/dashboard/cliente/mensajes",          bg: "bg-sky-400/20 hover:bg-sky-400/30"     },
    { icon: HeartSolid,           label: tx("Favoritos"), to: "/dashboard/cliente/favoritos",         bg: "bg-rose-400/20 hover:bg-rose-400/30"    },
    { icon: StarIcon,             label: tx("Reseñas"),   to: "/dashboard/cliente/resenas",           bg: "bg-amber-400/20 hover:bg-amber-400/30"  },
  ];

  return (
    <div className="space-y-5">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-700 to-emerald-800 px-7 py-7 shadow-lg">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-emerald-500/10" />
        <div className="pointer-events-none absolute -bottom-8 right-24 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative">
          <p className="text-sm font-medium text-emerald-300 capitalize mb-1">{hoy}</p>
          <h1 className="text-2xl font-bold text-white">{saludar(usuario?.nombreCompleto)}</h1>
          <p className="mt-1 text-sm text-slate-300">
            {activas.length > 0
              ? tx("Tienes {n} reserva(s) activa(s).", { n: activas.length })
              : tx("Explora servicios y encuentra tu próximo profesional.")}
          </p>

          {/* Acceso rápido dentro del hero */}
          <div className="mt-5 flex flex-wrap gap-2">
            {accesos.map(({ icon: Icon, label, to, bg }) => (
              <button
                key={to}
                onClick={() => navigate(to)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white transition ${bg}`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contenido principal ──────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* Próximas reservas — ocupa 2 de 3 columnas */}
        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="h-4 w-4 text-violet-500" />
              <h2 className="text-sm font-semibold text-slate-800">{tx("Próximas reservas")}</h2>
            </div>
            <button
              onClick={() => navigate("/dashboard/cliente/reservas")}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition"
            >
              {tx("Ver todas")} <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
          </div>
          {proximas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-slate-400">
              <CalendarDaysIcon className="h-9 w-9 mb-2 opacity-40" />
              <p className="text-xs text-slate-400">{tx("No tienes reservas próximas")}</p>
            </div>
          ) : (
            <div className="p-4 space-y-2.5">
              {proximas.slice(0, 6).map((r) => (
                <TarjetaReservaCompacta key={r.id} reserva={r} />
              ))}
            </div>
          )}
        </div>

        {/* Pendientes de valorar — ocupa 1 de 3 columnas */}
        {porValorar.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-amber-100 bg-amber-50/60">
              <div className="flex items-center gap-2">
                <StarSolid className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm font-semibold text-amber-900">{tx("Por valorar")}</h2>
              </div>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">{porValorar.length}</span>
            </div>
            <div className="p-4 space-y-2.5">
              {porValorar.slice(0, 6).map((r) => (
                <div key={r.id} className="flex items-center gap-3 rounded-xl border border-amber-100/60 bg-amber-50/30 px-3 py-3 hover:bg-amber-50 transition">
                  <AvatarProfesional src={r.profesionalFotoUrl} nombre={r.profesionalNombre} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">{r.servicioTitulo}</p>
                    <p className="text-[11px] text-slate-400 truncate">{r.profesionalNombre}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/dashboard/cliente/valorar/${r.id}`)}
                    className="flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-amber-600 transition shrink-0"
                  >
                    <StarSolid className="h-3 w-3" />{tx("Valorar")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col items-center justify-center py-14 text-center px-6">
            <StarSolid className="h-8 w-8 text-slate-200 mb-2" />
            <p className="text-xs font-medium text-slate-400">{tx("Sin valoraciones pendientes")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PanelCliente;
