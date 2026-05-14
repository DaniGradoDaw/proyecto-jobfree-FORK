import {
    HomeIcon,
    MagnifyingGlassIcon,
    CalendarDaysIcon,
    ChatBubbleLeftRightIcon,
    StarIcon,
    CreditCardIcon,
    HeartIcon,
    Cog6ToothIcon,
    Squares2X2Icon,
    ClipboardDocumentListIcon,
    WrenchScrewdriverIcon,
    ArrowRightOnRectangleIcon,
    UsersIcon,
    TagIcon,
    ShieldCheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    FlagIcon,
} from "@heroicons/react/24/outline";

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { useLanguage } from "context/LanguageContext";

// importamos el contexto de sesión para mostrar el nombre real y poder cerrar sesión
import { useAuth } from "context/AuthContext";
import logoJobFree from "assets/images/logo.png";
import Avatar from "components/Avatar";
import { obtenerConteoMensajesNoLeidos } from "api/mensajes";
import { obtenerMiPlan, verificarSuscripcion } from "api/suscripciones";
import { useChatSocket } from "context/ChatSocketContext";

function Sidebar({ tipo, open, setOpen, collapsed = false, onToggle }) {

    const navigate = useNavigate();

    const location = useLocation();

    const { tx } = useLanguage();

    const { usuario, cerrarSesion } = useAuth();
    const { subscribeToUserQueue } = useChatSocket();
    const [mensajesNoLeidos, setMensajesNoLeidos] = useState(0);
    const [planLabel, setPlanLabel] = useState(null);

    useEffect(() => {
        if (tipo !== "profesional" || !usuario?.id) return;
        const fn = location.search.includes("success=true") ? verificarSuscripcion : obtenerMiPlan;
        fn()
            .then((data) => {
                const map = { BASICO: "Básico", PRO: "Pro", PREMIUM: "Premium" };
                setPlanLabel(map[data?.plan] ?? data?.plan ?? null);
            })
            .catch(() => {});
    }, [tipo, usuario?.id, location.pathname, location.search]);

    useEffect(() => {
        if (!usuario?.id) {
            setMensajesNoLeidos(0);
            return undefined;
        }

        function cargarConteo() {
            obtenerConteoMensajesNoLeidos()
                .then((data) => setMensajesNoLeidos(Number(data?.total || 0)))
                .catch(() => {});
        }

        cargarConteo();

        return subscribeToUserQueue((evento) => {
            if (
                evento?.tipo === "mensaje.nuevo"
                || evento?.tipo === "mensaje.leido"
                || evento?.tipo === "mensaje.leido.lote"
                || evento?.tipo === "mensaje.recibido"
                || evento?.tipo === "mensaje.recibido.lote"
                || evento?.tipo === "usuario.mensajes.actualizados"
                || evento?.tipo === "conversacion.actualizada"
            ) {
                cargarConteo();
            }
        });
    }, [usuario?.id, subscribeToUserQueue]);

    const labels = {
        panelPrincipal: tx("Panel principal"),
        buscarServicios: tx("Buscar servicios"),
        reservas: tx("Reservas"),
        mensajes: tx("Mensajes"),
        resenas: tx("Reseñas"),
        facturas: tx("Facturas"),
        favoritos: tx("Favoritos"),
        configuracion: tx("Configuración"),
        solicitudes: tx("Solicitudes"),
        miCalendario: tx("Mi calendario"),
        misServicios: tx("Mis servicios"),
        miPlan: tx("Mi plan"),
        panelAdmin: tx("Panel admin"),
        adminUsuarios: tx("Usuarios"),
        adminReservas: tx("Reservas"),
        adminPagos: tx("Pagos"),
        adminServicios: tx("Servicios"),
        adminValoraciones: tx("Valoraciones"),
        adminCategorias: tx("Categorias"),
        adminReportes: tx("Reportes"),
    };

    const menuItems =
        tipo === "cliente"
            ? [
                { key: "panelPrincipal", icono: HomeIcon, ruta: "/dashboard/cliente" },
                { key: "buscarServicios", icono: MagnifyingGlassIcon, ruta: "/dashboard/cliente/buscar/servicios" },
                { key: "reservas", icono: CalendarDaysIcon, ruta: "/dashboard/cliente/reservas" },
                { key: "mensajes", icono: ChatBubbleLeftRightIcon, ruta: "/dashboard/cliente/mensajes" },
                { key: "resenas", icono: StarIcon, ruta: "/dashboard/cliente/resenas" },
                { key: "facturas", icono: CreditCardIcon, ruta: "/dashboard/cliente/facturas" },
                { key: "favoritos", icono: HeartIcon, ruta: "/dashboard/cliente/favoritos" },
                { key: "configuracion", icono: Cog6ToothIcon, ruta: "/dashboard/cliente/configuracion" },
            ]
            : tipo === "profesional"
            ? [
                { key: "panelPrincipal", icono: Squares2X2Icon, ruta: "/dashboard/profesional" },
                { key: "solicitudes", icono: ClipboardDocumentListIcon, ruta: "/dashboard/profesional/solicitudes" },
                { key: "mensajes", icono: ChatBubbleLeftRightIcon, ruta: "/dashboard/profesional/mensajes" },
                { key: "miCalendario", icono: CalendarDaysIcon, ruta: "/dashboard/profesional/calendario" },
                { key: "misServicios", icono: WrenchScrewdriverIcon, ruta: "/dashboard/profesional/servicios" },
                { key: "resenas", icono: StarIcon, ruta: "/dashboard/profesional/resenas" },
                { key: "miPlan", icono: CreditCardIcon, ruta: "/dashboard/profesional/plan" },
                { key: "configuracion", icono: Cog6ToothIcon, ruta: "/dashboard/profesional/configuracion" },
            ]
            : [
                { key: "panelAdmin",       icono: ShieldCheckIcon,        ruta: "/dashboard/admin" },
                { key: "adminUsuarios",    icono: UsersIcon,               ruta: "/dashboard/admin/usuarios" },
                { key: "adminReservas",    icono: CalendarDaysIcon,        ruta: "/dashboard/admin/reservas" },
                { key: "adminPagos",       icono: CreditCardIcon,          ruta: "/dashboard/admin/pagos" },
                { key: "adminServicios",   icono: WrenchScrewdriverIcon,   ruta: "/dashboard/admin/servicios" },
                { key: "adminValoraciones",icono: StarIcon,                ruta: "/dashboard/admin/valoraciones" },
                { key: "adminCategorias",  icono: TagIcon,                 ruta: "/dashboard/admin/categorias" },
                { key: "adminReportes",    icono: FlagIcon,                ruta: "/dashboard/admin/reportes" },
            ];

    /**
     * Cierra la sesión y redirige al inicio.
     */
    function handleCerrarSesion() {
        cerrarSesion();
        navigate("/");
    }

    return (
        <aside
            className={`
                h-screen overflow-y-auto bg-gradient-to-b from-green-500 to-emerald-400 text-white flex flex-col justify-between
                fixed left-0 top-0 pt-4 z-50 transform transition-all duration-300
                w-64 ${collapsed ? "md:w-16" : "md:w-64"}
                ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}
        >
            <div className={`px-4 pt-5 pb-4 flex ${collapsed ? "justify-center" : "items-center gap-2.5"}`}>
                <button
                    type="button"
                    onClick={() => navigate(tipo === "admin" ? "/dashboard/admin" : `/dashboard/${tipo}`)}
                    className="flex items-center gap-2.5 focus:outline-none"
                    aria-label="JobFree"
                >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/70 p-1">
                        <img src={logoJobFree} alt="JobFree" className="h-full w-full object-contain" />
                    </span>
                    {!collapsed && (
                        <span className="text-lg font-bold tracking-tight text-white drop-shadow-sm">
                            JobFree
                        </span>
                    )}
                </button>
            </div>

            <nav className="flex-1 p-3 space-y-1">

                {onToggle && (
                    <div className={`flex ${collapsed ? "justify-center" : "justify-end"} mb-2 px-1`}>
                        <button
                            onClick={onToggle}
                            className="hidden md:flex p-1.5 rounded-lg hover:bg-white/30 transition"
                            title={collapsed ? tx("Expandir menú") : tx("Colapsar menú")}
                        >
                            {collapsed
                                ? <ChevronRightIcon className="h-4 w-4" />
                                : <ChevronLeftIcon className="h-4 w-4" />
                            }
                        </button>
                    </div>
                )}

                {menuItems.map((item) => {
                    const Icono = item.icono;
                    const esRutaBaseDashboard = item.key === "panelPrincipal" || item.key === "panelAdmin";
                    const isActivo = esRutaBaseDashboard
                        ? location.pathname === item.ruta
                        : location.pathname === item.ruta || location.pathname.startsWith(`${item.ruta}/`);
                    const contador = item.key === "mensajes" ? mensajesNoLeidos : 0;

                    return (
                        <button
                            key={item.key}
                            onClick={() => {
                                setOpen(false);
                                navigate(item.ruta);
                            }}
                            title={collapsed ? (labels[item.key] ?? item.key) : undefined}
                            className={`relative w-full flex items-center py-2 rounded-lg transition
                                ${collapsed ? "justify-center px-2" : "gap-3 px-3"}
                                ${isActivo ? "bg-white text-emerald-600" : "hover:bg-white/30"}
                            `}
                        >
                            <Icono className="w-5 h-5 shrink-0" />

                            {!collapsed && (
                                <>
                                    <span className="truncate">{labels[item.key] ?? item.key}</span>
                                    {item.key === "miPlan" && planLabel && (
                                        <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                            isActivo ? "bg-emerald-500 text-white" : "bg-white/30 text-white"
                                        }`}>
                                            {planLabel}
                                        </span>
                                    )}
                                    {contador > 0 && (
                                        <span className={`ml-auto flex min-w-[1.35rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                                            isActivo ? "bg-emerald-500 text-white" : "bg-white text-emerald-600"
                                        }`}>
                                            {contador > 99 ? "99+" : contador}
                                        </span>
                                    )}
                                </>
                            )}

                            {collapsed && contador > 0 && (
                                <span className="absolute top-0.5 right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-white px-1 text-[9px] font-bold text-emerald-600">
                                    {contador > 9 ? "9+" : contador}
                                </span>
                            )}
                        </button>
                    );
                })}

            </nav>

            {/* pie del sidebar */}
            <div className={`border-t border-white/20 ${collapsed ? "p-3 flex flex-col items-center gap-2" : "p-4 flex items-center justify-between"}`}>

                {collapsed ? (
                    <>
                        <div className="relative">
                            <Avatar
                                src={usuario?.fotoUrl}
                                nombre={usuario?.nombre}
                                className="w-8 h-8 rounded-full shrink-0 ring-2 ring-white/40"
                                iconFallback
                            />
                            {planLabel === "Premium" && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[8px] shadow" title="Premium">★</span>
                            )}
                        </div>
                        <button
                            onClick={handleCerrarSesion}
                            className="cursor-pointer hover:text-red-200"
                            title={tx("Cerrar sesión")}
                            aria-label={tx("Cerrar sesión")}
                        >
                            <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-2 overflow-hidden">
                            <div className="relative shrink-0">
                            <Avatar
                                src={usuario?.fotoUrl}
                                nombre={usuario?.nombre}
                                className="w-8 h-8 rounded-full ring-2 ring-white/40"
                                iconFallback
                            />
                            {planLabel === "Premium" && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[8px] shadow" title="Premium">★</span>
                            )}
                            </div>
                            <span className="text-sm font-medium truncate">
                                {tipo === "admin" ? "Admin JobFree" : (usuario?.nombreCompleto ?? "...")}
                            </span>
                        </div>
                        <button
                            onClick={handleCerrarSesion}
                            className="cursor-pointer hover:text-red-200 shrink-0"
                            title={tx("Cerrar sesión")}
                            aria-label={tx("Cerrar sesión")}
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        </button>
                    </>
                )}

            </div>

        </aside>
    );
}

export default Sidebar;
