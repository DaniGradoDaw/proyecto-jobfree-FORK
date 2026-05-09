import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { crearValoracion } from "api/valoraciones";
import { obtenerReservaPorId } from "api/reservas";
import API_URL from "api/config";
import { useLanguage } from "context/LanguageContext";

function BotonEstrella({ activa, onClick, label }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="transition hover:scale-105">
      <StarSolidIcon className={`h-9 w-9 ${activa ? "text-amber-400" : "text-slate-200"}`} />
    </button>
  );
}

function ValorarReserva() {
  const { reservaId } = useParams();
  const navigate = useNavigate();
  const { tx } = useLanguage();
  const [reserva, setReserva] = useState(null);
  const [estrellas, setEstrellas] = useState(0);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerReservaPorId(reservaId)
      .then(setReserva)
      .catch((err) => setError(err.message || tx("No se pudo cargar la reserva")))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservaId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!reserva) return;
    if (estrellas < 1 || estrellas > 5) {
      setError(tx("Selecciona una puntuación entre 1 y 5 estrellas."));
      return;
    }
    setGuardando(true);
    setError("");
    try {
      await crearValoracion({
        reservaId: reserva.id,
        profesionalId: reserva.profesionalId,
        estrellas,
        comentario: comentario.trim(),
      });
      window.dispatchEvent(new CustomEvent("reservas:actualizadas"));
      navigate("/dashboard/cliente/resenas", { replace: true });
    } catch (err) {
      setError(err.message || tx("No se pudo guardar la valoración."));
    } finally {
      setGuardando(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
        {tx("Cargando información de la reserva...")}
      </div>
    );
  }

  if (error && !reserva) {
    return <p className="py-10 text-center text-sm text-red-500">{error}</p>;
  }

  if (!reserva) return null;

  const foto = reserva.profesionalFotoUrl
    ? reserva.profesionalFotoUrl.startsWith("http")
      ? reserva.profesionalFotoUrl
      : API_URL + reserva.profesionalFotoUrl
    : null;

  const puedeValorar = reserva.estado === "COMPLETADA" && !reserva.valorada;

  return (
    <div className="max-w-lg space-y-4">
      <Link to="/dashboard/cliente/resenas" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
        <ArrowLeftIcon className="h-4 w-4" />
        {tx("Volver a mis reseñas")}
      </Link>

      {/* Info profesional */}
      <section className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        {foto ? (
          <img src={foto} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
            {(reserva.profesionalNombre || "?").slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[11px] text-slate-400">{tx("Valorar profesional")}</p>
          <p className="truncate font-semibold text-slate-900">{reserva.profesionalNombre}</p>
          <p className="truncate text-xs text-slate-500">{reserva.servicioTitulo}</p>
        </div>
      </section>

      {!puedeValorar ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">{tx("Esta reserva ya no admite valoración")}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {reserva.valorada
              ? tx("Ya has enviado tu valoración para este servicio.")
              : tx("Solo puedes valorar servicios que ya estén completados.")}
          </p>
          <Link
            to={reserva.valorada ? "/dashboard/cliente/resenas" : "/dashboard/cliente/reservas"}
            className="mt-3 inline-flex text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            {reserva.valorada ? tx("Ver mis reseñas") : tx("Ir a mis reservas")}
          </Link>
        </section>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">{tx("Tu puntuación")}</label>
            <div className="mt-2 flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((valor) => (
                <BotonEstrella
                  key={valor}
                  activa={valor <= estrellas}
                  onClick={() => setEstrellas(valor)}
                  label={tx("{n} estrellas", { n: valor })}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">{tx("Comentario")}</label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={3}
              maxLength={1000}
              placeholder={tx("Cuéntale a otros clientes cómo fue el servicio.")}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none"
            />
            <p className="mt-0.5 text-right text-xs text-slate-400">{comentario.length}/1000</p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={guardando}
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {guardando ? tx("Enviando...") : tx("Enviar valoración")}
            </button>
            <Link to="/dashboard/cliente/resenas" className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
              {tx("Cancelar")}
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default ValorarReserva;
