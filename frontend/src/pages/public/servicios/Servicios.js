import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { obtenerSubcategoriasPorCategoria, obtenerTodasSubcategorias } from "api/subcategorias";
import ServicioCard from "components/cards/ServicioCard";
import { useLanguage } from "context/LanguageContext";

function Servicios() {
  const TAMANO_PAGINA_BUSQUEDA = 8;

  // estado donde guardamos las subcategorías obtenidas del backend
  const [subcategorias, setSubcategorias] = useState([]);

  // página actual de la paginación
  const [pagina, setPagina] = useState(0);

  // total de páginas que devuelve el backend
  const [totalPaginas, setTotalPaginas] = useState(0);

  // estado de carga (para mostrar "Cargando...")
  const [loading, setLoading] = useState(true);

  // hook para leer la URL (query params)
  const location = useLocation();

  const { tx } = useLanguage();

  /**
   * Este useEffect se ejecuta cada vez que:
   * - cambia la URL (location.search)
   * - cambia la página (pagina)
   */
  useEffect(() => {

    setLoading(true);

    // obtenemos parámetros de la URL
    const params = new URLSearchParams(location.search);

    // cogemos el id de la categoría (?categoria=1)
    const categoriaId = params.get("categoria");
    const query = params.get("q")?.trim().toLowerCase() || "";

    // búsqueda libre desde el buscador
    if (query) {
      obtenerTodasSubcategorias()
        .then(data => {
          const filtradas = data.filter(sub =>
            sub.nombre.toLowerCase().includes(query) ||
            (sub.descripcion || "").toLowerCase().includes(query)
          );
          const inicio = pagina * TAMANO_PAGINA_BUSQUEDA;
          const fin = inicio + TAMANO_PAGINA_BUSQUEDA;
          setSubcategorias(filtradas.slice(inicio, fin));
          setTotalPaginas(Math.max(1, Math.ceil(filtradas.length / TAMANO_PAGINA_BUSQUEDA)));
        })
        .catch(() => {
          setSubcategorias([]);
          setTotalPaginas(0);
        })
        .finally(() => setLoading(false));

    // si hay categoría, llamamos al backend
    } else if (categoriaId) {

      obtenerSubcategoriasPorCategoria(categoriaId, pagina)
        .then(data => {

          // guardamos las subcategorías
          setSubcategorias(data.content);

          // guardamos total de páginas
          setTotalPaginas(data.totalPages);
        })
        .catch(() => {

          // en caso de error, dejamos vacío
          setSubcategorias([]);
        })
        .finally(() => setLoading(false));

    } else {
      // si no hay categoría en la URL → no mostramos nada
      setSubcategorias([]);
      setLoading(false);
    }

  }, [location.search, pagina]);


  /**
   * 
   * Cuando cambiamos de categoría, reseteamos la página a 0
   * (si no, se quedaría en una página incorrecta)
   */
  useEffect(() => {
    setPagina(0);
  }, [location.search]);


  return (
    <div className="px-8 py-10">

      {/* título */}
      <h3 className="text-3xl font-bold mb-8 text-center">
        {tx("Encuentra lo que necesitas entre nuestros servicios")}
      </h3>

      {/* estado de carga */}
      {loading && (
        <p className="text-center mb-4 text-sm text-gray-500">
          {tx("Cargando...")}
        </p>
      )}
      {/* sin resultados */}
      {!loading && subcategorias.length === 0 && (
        <p className="text-center">
          {tx("No hay resultados")}
        </p>
      )}

      {/* grid de subcategorías */}
      <div className={`grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-opacity duration-200 ${loading ? "opacity-50" : "opacity-100"}`}>

        {subcategorias.map(sub => (
          <ServicioCard
            key={sub.id}
            subcategoria={sub}
          />
        ))}

      </div>

      {/* paginación */}
      {totalPaginas > 1 && (
      <div className="flex items-center justify-center gap-8 mt-10">

        {/* ANTERIOR */}
        <button
          onClick={() => setPagina(p => p - 1)}
          disabled={pagina === 0}
          className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:text-white hover:bg-slate-800 disabled:opacity-50 transition"
        >
          ←
        </button>

        {/* TEXTO */}
        <p className="text-slate-600 text-sm">
          {tx("Página")}{" "}
          <strong className="text-slate-800">{pagina + 1}</strong>{" "}
          {tx("de")}{" "}
          <strong className="text-slate-800">{totalPaginas}</strong>
        </p>

        {/* SIGUIENTE */}
        <button
          onClick={() => setPagina(p => p + 1)}
          disabled={pagina >= totalPaginas - 1}
          className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:text-white hover:bg-slate-800 disabled:opacity-50 transition"
        >
          →
        </button>

      </div>
      )}

    </div>
  );
}

export default Servicios;
