import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "context/LanguageContext";

function ServicioCard({ subcategoria }) {
  const { tx } = useLanguage();
  const location = useLocation();

  const rutaProfesionales = location.pathname.startsWith("/dashboard/cliente")
    ? `/dashboard/cliente/buscar/profesionales/${subcategoria.id}`
    : location.pathname.startsWith("/dashboard/profesional")
      ? `/dashboard/profesional/buscar/profesionales/${subcategoria.id}`
      : `/profesionales/${subcategoria.id}`;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow shadow-black/10 hover:-translate-y-1 transition duration-300 overflow-hidden max-w-80">

      {/* imagen */}
      <img
        src={subcategoria.imagen}
        alt={subcategoria.nombre}
        className="w-full h-44 object-cover"
      />

      <div className="p-5">

        {/* título */}
        <h3 className="text-lg font-semibold text-gray-900">
          {tx(subcategoria.nombre)}
        </h3>

        {/* descripción */}
        <p className="text-gray-600 mt-1 mb-4">
          {tx(subcategoria.descripcion)}
        </p>

        {/* botón */}
        <Link
          to={rutaProfesionales}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          {tx("Ver profesionales")}
        </Link>

      </div>

    </div>
  );
}

export default ServicioCard;
