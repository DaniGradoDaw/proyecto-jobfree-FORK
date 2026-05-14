import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { obtenerProfesionalPorId } from "api/profesional";
import { obtenerServiciosActivosPorProfesionalUsuario } from "api/servicios";
import { obtenerValoracionesPorProfesional } from "api/valoraciones";
import { crearOObtenerConversacionContacto } from "api/conversaciones";
import { enviarMensaje } from "api/mensajes";
import { useLanguage } from "context/LanguageContext";
import { useAuth } from "context/AuthContext";
import API_URL from "api/config";

function generarClientMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ── Estrellas ─────────────────────────────────────────────────
function Estrellas({ valor, max = 5 }) {
  const llenas = Math.round(valor || 0);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <StarSolid key={i} className={`h-4 w-4 ${i < llenas ? "text-amber-400" : "text-slate-200"}`} />
      ))}
    </div>
  );
}

// ── Modal de contacto ─────────────────────────────────────────
function ModalContacto({ servicio, onClose, onExito }) {
  const { tx } = useLanguage();
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const contenido = mensaje.trim();
    if (!contenido) {
      setError(tx("Escribe el primer mensaje para iniciar la conversación."));
      return;
    }
    setEnviando(true);
    setError("");
    try {
      const conv = await crearOObtenerConversacionContacto(servicio.profesionalUsuarioId);
      const mensajeEnviar = `📌 ${tx("Consulta sobre")}: ${servicio.titulo}\n\n${contenido}`;
      await enviarMensaje({
        contenido: mensajeEnviar,
        destinatarioId: servicio.profesionalUsuarioId,
        conversacionId: conv.id,
        clientMessageId: generarClientMessageId(),
      });
      onExito(conv);
    } catch (err) {
      setError(err.message || tx("No se pudo iniciar la conversación."));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-emerald-600">{tx("Nuevo contacto")}</p>
            <h2 className="mt-0.5 text-lg font-semibold text-slate-900 leading-tight">{servicio.titulo}</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {tx("Cuéntale que necesitas")}
            </label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder={tx("Describe brevemente tu necesidad, cuando lo necesitas, cualquier detalle relevante...")}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
              required
            />
            <p className="mt-1 text-right text-xs text-slate-400">{mensaje.length}/1000</p>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{tx("Precio estimado")}</span>
              <span className="font-semibold text-slate-900">{Number(servicio.precioHora).toFixed(0)}€/{tx("hora")}</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">{tx("El precio final se acordará con el profesional.")}</p>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-full border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
              {tx("Cancelar")}
            </button>
            <button type="submit" disabled={enviando}
              className="flex-1 rounded-full border border-sky-200 bg-sky-100 py-2.5 text-sm font-medium text-sky-900 hover:border-sky-300 hover:bg-sky-200 transition disabled:opacity-60">
              {enviando ? tx("Abriendo chat...") : tx("Ir al chat")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────
function PerfilProfesional() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { idioma, tx } = useLanguage();
  const { usuario } = useAuth();

  const [perfil, setPerfil]           = useState(null);
  const [servicios, setServicios]     = useState([]);
  const [valoraciones, setValoraciones] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [servicioContacto, setServicioContacto] = useState(null);

  useEffect(() => {
    let activo = true;
    obtenerProfesionalPorId(id)
      .then(async (perfilData) => {
        if (!activo) return;
        setPerfil(perfilData);
        const [srvData, valData] = await Promise.all([
          obtenerServiciosActivosPorProfesionalUsuario(perfilData.usuarioId),
          obtenerValoracionesPorProfesional(perfilData.id),
        ]);
        if (!activo) return;
        setServicios(srvData);
        setValoraciones(valData);
      })
      .catch((err) => { if (activo) setError(err.message || tx("No se pudo cargar el perfil")); })
      .finally(() => { if (activo) setLoading(false); });
    return () => { activo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function handleContactar(servicio) {
    if (!usuario) {
      sessionStorage.setItem("pendingAction", JSON.stringify({
        tipo: "contactar",
        servicioId: servicio.id,
        redirectTo: window.location.pathname,
      }));
      navigate("/login");
      return;
    }
    setServicioContacto(servicio);
  }

  function handleExitoContacto(conv) {
    const rol = usuario?.rol?.toLowerCase() === "profesional" ? "profesional" : "cliente";
    navigate(`/dashboard/${rol}/mensajes/${conv.id}`);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
        {tx("Cargando perfil...")}
      </div>
    );
  }

  if (error || !perfil) {
    return <p className="py-16 text-center text-sm text-red-500">{error || tx("Perfil no encontrado")}</p>;
  }

  const foto = perfil.fotoUrl
    ? perfil.fotoUrl.startsWith("http") ? perfil.fotoUrl : API_URL + perfil.fotoUrl
    : null;

  const locale = idioma === "en" ? "en-GB" : "es-ES";
  const mediaStr = perfil.valoracionMedia ? Number(perfil.valoracionMedia).toFixed(1) : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <Link to={-1} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition mb-6">
            <ArrowLeftIcon className="h-4 w-4" />
            {tx("Volver")}
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            {/* Avatar */}
            {foto ? (
              <img src={foto} alt="" className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-2 ring-slate-100 shadow-sm" />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-800 text-2xl font-bold text-white">
                {(perfil.nombreCompleto || "?").slice(0, 1).toUpperCase()}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-1">{tx("Profesional")}</p>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">{perfil.nombreCompleto}</h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-500">
                {perfil.ciudad && (
                  <span className="flex items-center gap-1.5">
                    <MapPinIcon className="h-4 w-4 shrink-0" />
                    {perfil.ciudad}
                  </span>
                )}
                {mediaStr && (
                  <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <StarSolid className="h-4 w-4 text-amber-400 shrink-0" />
                    {mediaStr}
                    {perfil.numeroValoraciones > 0 && (
                      <span className="font-normal text-slate-400">
                        ({perfil.numeroValoraciones} {tx("opiniones")})
                      </span>
                    )}
                  </span>
                )}
              </div>

              {perfil.descripcion && (
                <p className="mt-4 text-sm leading-relaxed text-slate-600 max-w-2xl">{perfil.descripcion}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8">

        {/* Servicios */}
        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-4">
            {tx("Servicios")}
            <span className="ml-2 text-sm font-normal text-slate-400">({servicios.length})</span>
          </h2>
          {servicios.length === 0 ? (
            <p className="text-sm text-slate-500">{tx("Este profesional no tiene servicios activos ahora mismo.")}</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {servicios.map((s) => {
                const dur = s.duracionMin >= 60
                  ? `${Math.floor(s.duracionMin / 60)}h${s.duracionMin % 60 > 0 ? ` ${s.duracionMin % 60}min` : ""}`
                  : `${s.duracionMin} min`;
                return (
                  <article key={s.id} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-sm transition">
                    <h3 className="text-sm font-semibold text-slate-900 leading-snug">{s.titulo}</h3>
                    {s.descripcion && (
                      <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">{s.descripcion}</p>
                    )}
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs text-slate-400">{tx("Desde")}</p>
                        <p className="text-xl font-bold text-slate-900 leading-none">
                          {Number(s.precioHora).toFixed(0)}€
                          <span className="text-xs font-normal text-slate-400">/{tx("hora")}</span>
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                          <ClockIcon className="h-3.5 w-3.5" />
                          {dur}
                        </p>
                      </div>
                      <button
                        onClick={() => handleContactar(s)}
                        className="flex items-center gap-1.5 rounded-md border border-sky-200 bg-sky-100 px-3 py-1.5 text-xs font-medium text-sky-900 hover:border-sky-300 hover:bg-sky-200 transition"
                      >
                        <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" />
                        {tx("Contactar")}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Reseñas */}
        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-4">
            {tx("Reseñas")}
            <span className="ml-2 text-sm font-normal text-slate-400">({valoraciones.length})</span>
          </h2>
          {valoraciones.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-10 text-center">
              <StarIcon className="mx-auto mb-2 h-8 w-8 text-slate-300" />
              <p className="text-sm text-slate-500">{tx("Todavía no ha recibido reseñas.")}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {valoraciones.map((v) => {
                const clienteFoto = v.clienteFotoUrl
                  ? v.clienteFotoUrl.startsWith("http") ? v.clienteFotoUrl : API_URL + v.clienteFotoUrl
                  : null;
                const iniciales = (v.clienteNombre || "?")
                  .split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();

                return (
                  <article key={v.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                    {/* Autor */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        {clienteFoto ? (
                          <img src={clienteFoto} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-sm" />
                        ) : (
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">
                            {iniciales}
                          </span>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-slate-900 leading-tight">
                            {v.clienteNombre || tx("Usuario")}
                          </p>
                          <p className="text-xs text-slate-400">
                            {new Date(v.fecha).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <Estrellas valor={v.estrellas} />
                    </div>
                    {v.comentario && (
                      <p className="text-sm leading-relaxed text-slate-600 border-t border-slate-100 pt-3">{v.comentario}</p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Modal de contacto */}
      {servicioContacto && (
        <ModalContacto
          servicio={servicioContacto}
          onClose={() => setServicioContacto(null)}
          onExito={handleExitoContacto}
        />
      )}
    </div>
  );
}

export default PerfilProfesional;
