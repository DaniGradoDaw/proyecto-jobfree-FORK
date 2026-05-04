import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon, HeartIcon } from "@heroicons/react/24/solid";
import { eliminarFavorito, obtenerMisFavoritos } from "api/favoritos";
import API_URL from "api/config";
import { useLanguage } from "context/LanguageContext";

function MisFavoritos() {
  const { tx } = useLanguage();
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerMisFavoritos()
      .then(setFavoritos)
      .catch((err) => setError(err.message || tx("No se pudieron cargar tus favoritos")))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function quitar(servicioId) {
    try {
      await eliminarFavorito(servicioId);
      setFavoritos((prev) => prev.filter((item) => item.servicio.id !== servicioId));
    } catch (err) {
      alert(err.message || tx("No se pudo eliminar el favorito."));
    }
  }

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
    <div>
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100">
          <HeartIcon className="h-6 w-6 text-rose-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{tx("Mis favoritos")}</h1>
          <p className="text-sm text-slate-500">{tx("Servicios guardados para volver a ellos mas tarde.")}</p>
        </div>
        {favoritos.length > 0 && (
          <span className="ml-auto rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            {favoritos.length} {favoritos.length === 1 ? tx("servicio") : tx("servicios")}
          </span>
        )}
      </div>

      {favoritos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
            <HeartIcon className="h-7 w-7 text-slate-300" />
          </div>
          <p className="text-sm font-semibold text-slate-600">{tx("Aún no has guardado ningun servicio.")}</p>
          <p className="mt-1 text-xs text-slate-400">{tx("Cuando pulses el corazón en un servicio, aparecera aquí.")}</p>
        </div>
      ) : (
        <div className="grid gap-3 xl:grid-cols-2">
          {favoritos.map((item) => {
            const servicio = item.servicio;
            const foto = servicio.fotoUrlProfesional
              ? servicio.fotoUrlProfesional.startsWith("http")
                ? servicio.fotoUrlProfesional
                : API_URL + servicio.fotoUrlProfesional
              : null;
            const inicial = (servicio.nombreProfesional || "?").slice(0, 1).toUpperCase();

            return (
              <article
                key={item.id}
                className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                {/* Botón eliminar — aparece en hover */}
                <button
                  onClick={() => quitar(servicio.id)}
                  className="absolute right-3.5 top-3.5 rounded-lg p-1.5 text-slate-300 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-400"
                  aria-label={tx("Eliminar")}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>

                {/* Título y descripción — protagonistas */}
                <h2 className="pr-8 text-base font-bold text-slate-900 leading-snug">{servicio.titulo}</h2>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500">{servicio.descripcion}</p>

                {/* Footer: profesional + precio + CTA */}
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  {/* Profesional */}
                  <div className="flex items-center gap-2 min-w-0">
                    {foto ? (
                      <img src={foto} alt="" className="h-7 w-7 shrink-0 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-100 text-[11px] font-bold text-green-700">
                        {inicial}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-slate-600">{servicio.nombreProfesional}</p>
                      <p className="truncate text-[11px] text-slate-400">{servicio.ciudadProfesional || tx("Zona no indicada")}</p>
                    </div>
                  </div>

                  {/* Precio + botón */}
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="text-right">
                      <p className="text-base font-bold text-slate-900 leading-none">
                        {Number(servicio.precioHora).toFixed(0)}€<span className="text-xs font-normal text-slate-400">/h</span>
                      </p>
                      <div className="mt-1 flex items-center justify-end gap-0.5">
                        <StarSolidIcon className="h-3 w-3 text-amber-400" />
                        <span className="text-[11px] text-slate-500">
                          {servicio.valoracionMedia ? Number(servicio.valoracionMedia).toFixed(1) : "—"}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/dashboard/cliente/buscar/profesionales/${servicio.subcategoriaId}`}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                    >
                      {tx("Ver")}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MisFavoritos;
