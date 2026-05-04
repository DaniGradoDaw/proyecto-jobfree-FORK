import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { obtenerMisReservas } from "api/reservas";
import { obtenerMisValoraciones } from "api/valoraciones";
import { useLanguage } from "context/LanguageContext";

function Estrellas({ n, total = 5, size = "h-4 w-4" }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: total }).map((_, i) => (
        <StarSolidIcon key={i} className={`${size} ${i < n ? "text-amber-400" : "text-slate-200"}`} />
      ))}
    </div>
  );
}

function MisResenas() {
  const { idioma, tx } = useLanguage();
  const [valoraciones, setValoraciones] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([obtenerMisValoraciones(), obtenerMisReservas()])
      .then(([valoracionesData, reservasData]) => {
        setValoraciones(valoracionesData);
        setReservas(reservasData);
      })
      .catch((err) => setError(err.message || tx("No se pudieron cargar tus reseñas")))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
        {tx("Cargando...")}
      </div>
    );
  }

  if (error) {
    return <p className="py-10 text-center text-sm text-red-500">{error}</p>;
  }

  const reservasPorId = new Map(reservas.map((r) => [r.id, r]));
  const locale = idioma === "en" ? "en-GB" : "es-ES";

  return (
    <div className="max-w-2xl">

      {/* Cabecera con identidad visual */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100">
          <StarSolidIcon className="h-6 w-6 text-amber-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{tx("Mis reseñas")}</h1>
          <p className="text-sm text-slate-500">{tx("Opiniones que has dejado tras completar un servicio.")}</p>
        </div>
        {valoraciones.length > 0 && (
          <span className="ml-auto rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            {valoraciones.length}
          </span>
        )}
      </div>

      {valoraciones.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
            <StarSolidIcon className="h-7 w-7 text-slate-300" />
          </div>
          <p className="text-sm font-semibold text-slate-600">{tx("Todavía no has enviado ninguna reseña.")}</p>
          <Link
            to="/dashboard/cliente/reservas"
            className="mt-3 text-sm font-medium text-green-600 hover:text-green-700 underline underline-offset-2"
          >
            {tx("Ir a mis reservas")}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {valoraciones.map((valoracion) => {
            const reserva = reservasPorId.get(valoracion.reservaId);
            return (
              <article key={valoracion.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                {/* Cabecera: servicio + estrellas */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900 leading-tight">
                      {reserva?.servicioTitulo || tx("Servicio completado")}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {reserva?.profesionalNombre || tx("Profesional")}
                    </p>
                  </div>
                  <Estrellas n={valoracion.estrellas} />
                </div>

                {/* Comentario */}
                {valoracion.comentario && (
                  <p className="mt-3 border-l-2 border-amber-200 pl-3 text-sm leading-relaxed text-slate-600 italic">
                    "{valoracion.comentario}"
                  </p>
                )}

                {/* Fecha */}
                <p className="mt-3 text-xs text-slate-400">
                  {new Date(valoracion.fecha).toLocaleDateString(locale, {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MisResenas;
