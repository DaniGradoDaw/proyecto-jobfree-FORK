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
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/dashboard/cliente/reservas" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
        <ArrowLeftIcon className="h-4 w-4" />
        {tx("Volver a mis reservas")}
      </Link>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          {foto ? (
            <img src={foto} alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-lg font-bold text-white">
              {(reserva.profesionalNombre || "?").slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm text-slate-500">{tx("Valorar profesional")}</p>
            <h1 className="text-2xl font-semibold text-slate-900">{reserva.profesionalNombre}</h1>
            <p className="mt-1 text-sm text-slate-500">{reserva.servicioTitulo}</p>
          </div>
        </div>
      </section>

      {!puedeValorar ? (
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{tx("Esta reserva ya no admite valoración")}</h2>
          <p className="mt-2 text-sm text-slate-500">
            {reserva.valorada
              ? tx("Ya has enviado tu valoración para este servicio.")
              : tx("Solo puedes valorar servicios que ya esten completados.")}
          </p>
          <Link
            to={reserva.valorada ? "/dashboard/cliente/resenas" : "/dashboard/cliente/reservas"}
            className="mt-4 inline-flex text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            {reserva.valorada
              ? tx("Ver mis reseñas")
              : tx("Ir a mis reservas")}
          </Link>
        </section>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-medium text-slate-700">{tx("Tu puntuación")}</label>
          <div className="mt-3 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((valor) => (
              <BotonEstrella
                key={valor}
                activa={valor <= estrellas}
                onClick={() => setEstrellas(valor)}
                label={tx("{n} estrellas", { n: valor })}
              />
            ))}
          </div>

          <label className="mt-6 block text-sm font-medium text-slate-700">{tx("Comentario")}</label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={5}
            maxLength={1000}
            placeholder={tx("Cuentale a otros clientes como fue el servicio.")}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <p className="mt-1 text-right text-xs text-slate-400">{comentario.length}/1000</p>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={guardando}
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {guardando ? tx("Enviando...") : tx("Enviar valoración")}
            </button>
            <Link to="/dashboard/cliente/reservas" className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              {tx("Cancelar")}
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default ValorarReserva;
