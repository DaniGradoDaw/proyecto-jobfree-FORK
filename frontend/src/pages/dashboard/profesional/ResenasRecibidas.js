import { useEffect, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { obtenerMiPerfil } from "api/profesional";
import { obtenerValoracionesPorProfesional } from "api/valoraciones";
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

function ResenasRecibidas() {
  const { idioma, tx } = useLanguage();
  const [perfil, setPerfil] = useState(null);
  const [valoraciones, setValoraciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerMiPerfil()
      .then(async (perfilData) => {
        setPerfil(perfilData);
        const valoracionesData = await obtenerValoracionesPorProfesional(perfilData.id);
        setValoraciones(valoracionesData);
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

  const locale = idioma === "en" ? "en-GB" : "es-ES";
  const media = perfil?.valoracionMedia ? Number(perfil.valoracionMedia).toFixed(1) : null;
  const total = perfil?.numeroValoraciones || 0;

  return (
    <div className="max-w-2xl">

      {/* Cabecera con identidad visual */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100">
          <StarSolidIcon className="h-6 w-6 text-amber-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{tx("Reseñas recibidas")}</h1>
          <p className="text-sm text-slate-500">
            {media
              ? tx("Valoracion media {media} de {count} resenas", { media, count: total })
              : tx("Todavía no has recibido valoraciones.")}
          </p>
        </div>
        {valoraciones.length > 0 && (
          <span className="ml-auto rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            {valoraciones.length}
          </span>
        )}
      </div>

      {/* Resumen de puntuación */}
      {media && (
        <div className="mb-6 flex items-center gap-5 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4">
          <p className="text-4xl font-bold text-amber-500 tabular-nums">{media}</p>
          <div>
            <Estrellas n={Math.round(Number(media))} size="h-5 w-5" />
            <p className="mt-1 text-sm text-slate-500">
              {total} {total === 1 ? tx("reseña") : tx("reseñas")}
            </p>
          </div>
        </div>
      )}

      {valoraciones.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
            <StarSolidIcon className="h-7 w-7 text-slate-300" />
          </div>
          <p className="text-sm font-semibold text-slate-600">{tx("Aún no has recibido reseñas.")}</p>
          <p className="mt-1 text-xs text-slate-400">
            {tx("Cuando un cliente valore un servicio completado, aparecera aquí.")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {valoraciones.map((valoracion) => (
            <article key={valoracion.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <Estrellas n={valoracion.estrellas} />
                <p className="text-xs text-slate-400">
                  {new Date(valoracion.fecha).toLocaleDateString(locale, {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
              </div>
              {valoracion.comentario && (
                <p className="mt-3 border-l-2 border-amber-200 pl-3 text-sm leading-relaxed text-slate-600 italic">
                  "{valoracion.comentario}"
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResenasRecibidas;
