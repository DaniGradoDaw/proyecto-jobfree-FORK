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
          <p className="text-sm text-slate-500">{tx("Servicios guardados para volver a ellos más tarde.")}</p>
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
          <p className="mt-1 text-xs text-slate-400">{tx("Cuando pulses el corazón en un servicio, aparecerá aquí.")}</p>
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

            const rawImagen = servicio.subcategoriaImagenUrl;
            const imgSubcat = rawImagen
                ? rawImagen.startsWith("http") || rawImagen.startsWith("/images/")
                  ? rawImagen
                  : API_URL + rawImagen
                : null;

            return (
              <article
                key={item.id}
                className="relative flex rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-shadow duration-200 hover:shadow-md min-h-[9.5rem]"
              >
                {/* Imagen cuadrada a la izquierda */}
                <div className="w-28 shrink-0 sm:w-36 rounded-l-2xl overflow-hidden">
                  {imgSubcat ? (
                    <img src={imgSubcat} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200" />
                  )}
                </div>

                {/* Contenido */}
                <div className="flex flex-1 flex-col justify-between p-4 min-w-0">
                  {/* Cabecera: título + papelera */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="text-sm font-bold text-slate-900 leading-snug">{tx(servicio.titulo)}</h2>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{tx(servicio.descripcion)}</p>
                    </div>
                    <button
                      onClick={() => quitar(servicio.id)}
                      className="shrink-0 rounded-lg p-1.5 text-slate-300 transition hover:bg-red-50 hover:text-red-400"
                      aria-label={tx("Eliminar de favoritos")}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Footer: profesional + precio + botón */}
                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    {/* Profesional */}
                    <div className="flex items-center gap-2 min-w-0">
                      {foto ? (
                        <img src={foto} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                          {inicial}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-semibold text-slate-700">{servicio.nombreProfesional}</p>
                        <p className="truncate text-[10px] text-slate-400">{tx(servicio.ciudadProfesional) || tx("Zona no indicada")}</p>
                      </div>
                    </div>

                    {/* Precio + rating + botón */}
                    <div className="flex shrink-0 items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 leading-none">
                          {Number(servicio.precioHora).toFixed(0)}€<span className="text-[10px] font-normal text-slate-400">/h</span>
                        </p>
                        <div className="mt-0.5 flex items-center justify-end gap-0.5">
                          <StarSolidIcon className="h-3 w-3 text-amber-400" />
                          <span className="text-[10px] text-slate-500">
                            {servicio.valoracionMedia ? Number(servicio.valoracionMedia).toFixed(1) : "—"}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/dashboard/cliente/buscar/profesionales/${servicio.subcategoriaId}`}
                        className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                      >
                        {tx("Ver")}
                      </Link>
                    </div>
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
