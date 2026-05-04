import { Link } from "react-router-dom";
import { useLanguage } from "context/LanguageContext";

function ServicioOfrecidoCard({ servicio }) {
  const { tx } = useLanguage();

  return (
    <div className="bg-white border rounded-lg shadow p-5">

      <h3 className="text-lg font-semibold">
        {servicio.titulo}
      </h3>

      <p className="text-gray-600 mt-1">
        {servicio.descripcion}
      </p>

      <p className="text-green-600 mt-2 font-semibold">
        {servicio.precioHora}€/{tx("hora")}
      </p>

      <Link
        to={"/profesionales/" + servicio.subcategoriaId}
        className="mt-3 inline-block px-4 py-2 bg-green-500 text-white rounded"
      >
        {tx("Ver profesionales")}
      </Link>

    </div>
  );
}

export default ServicioOfrecidoCard;
