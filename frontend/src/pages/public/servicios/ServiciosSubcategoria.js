import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerSubcategoriaPorId } from "api/subcategorias";
import ServicioCard from "components/cards/ServicioCard";
import { useLanguage } from "context/LanguageContext";

function ServiciosSubcategoria() {

  // id de la subcategoría
  const { id } = useParams();

  // estados
  const [subcategoria, setSubcategoria] = useState(null);
  const [loading, setLoading] = useState(true);

  const { tx } = useLanguage();

  useEffect(() => {
    setLoading(true);

    obtenerSubcategoriaPorId(id)
      .then(setSubcategoria)
      .catch(() => setSubcategoria(null))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="px-6 py-10 md:px-8">

      <div className="mx-auto max-w-5xl">
        <h3 className="mb-8 text-center text-3xl font-bold text-gray-900">
          {subcategoria?.nombre ? tx(subcategoria.nombre) : tx("Encuentra lo que necesitas entre nuestros servicios")}
        </h3>

        {loading ? (
          <p className="text-center text-sm text-gray-500">
            {tx("Cargando...")}
          </p>
        ) : !subcategoria ? (
          <p className="text-center text-sm text-gray-500">
            {tx("No hay resultados")}
          </p>
        ) : (
          <div className="flex justify-start pl-2 sm:pl-6">
            <ServicioCard subcategoria={subcategoria} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiciosSubcategoria;
