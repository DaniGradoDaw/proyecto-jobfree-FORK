import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { obtenerSubcategoriasPorCategoria, obtenerTodasSubcategorias, obtenerSubcategoriasPopulares } from "api/subcategorias";
import ServicioCard from "components/cards/ServicioCard";
import { useLanguage } from "context/LanguageContext";

const TAMANO_PAGINA = 8;

function Servicios() {
  const [subcategorias, setSubcategorias] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { tx } = useLanguage();

  const params = new URLSearchParams(location.search);
  const categoriaId = params.get("categoria");
  const query = params.get("q")?.trim().toLowerCase() || "";

  useEffect(() => {
    setLoading(true);

    if (query) {
      obtenerTodasSubcategorias()
        .then(data => {
          const filtradas = data.filter(sub =>
            sub.nombre.toLowerCase().includes(query) ||
            (sub.descripcion || "").toLowerCase().includes(query)
          );
          const inicio = pagina * TAMANO_PAGINA;
          setSubcategorias(filtradas.slice(inicio, inicio + TAMANO_PAGINA));
          setTotalPaginas(Math.max(1, Math.ceil(filtradas.length / TAMANO_PAGINA)));
        })
        .catch(() => { setSubcategorias([]); setTotalPaginas(0); })
        .finally(() => setLoading(false));

    } else if (categoriaId) {
      obtenerSubcategoriasPorCategoria(categoriaId, pagina)
        .then(data => {
          setSubcategorias(data.content);
          setTotalPaginas(data.totalPages);
        })
        .catch(() => setSubcategorias([]))
        .finally(() => setLoading(false));

    } else {
      obtenerSubcategoriasPopulares()
        .then(data => {
          setSubcategorias(data);
          setTotalPaginas(0);
        })
        .catch(() => { setSubcategorias([]); setTotalPaginas(0); })
        .finally(() => setLoading(false));
    }
  }, [location.search, pagina]);

  useEffect(() => { setPagina(0); }, [location.search]);

  return (
    <div className="px-8 py-10">
      <h3 className="text-3xl font-bold mb-2 text-center">
        {tx("Encuentra lo que necesitas entre nuestros servicios")}
      </h3>
      {!query && !categoriaId && (
        <p className="text-center text-slate-400 text-sm mb-8">{tx("Los servicios más contratados de la plataforma")}</p>
      )}
      {(query || categoriaId) && <div className="mb-8" />}

      {loading && (
        <p className="text-center mb-4 text-sm text-gray-500">{tx("Cargando...")}</p>
      )}
      {!loading && subcategorias.length === 0 && (
        <p className="text-center text-slate-400 text-sm">
          {tx("No se encontraron servicios para tu búsqueda.")}
        </p>
      )}

      <div className={`grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-opacity duration-200 ${loading ? "opacity-50" : "opacity-100"}`}>
        {subcategorias.map(sub => (
          <ServicioCard key={sub.id} subcategoria={sub} />
        ))}
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-8 mt-10">
          <button onClick={() => setPagina(p => p - 1)} disabled={pagina === 0}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:text-white hover:bg-slate-800 disabled:opacity-50 transition">
            ←
          </button>
          <p className="text-slate-600 text-sm">
            {tx("Página")} <strong className="text-slate-800">{pagina + 1}</strong> {tx("de")} <strong className="text-slate-800">{totalPaginas}</strong>
          </p>
          <button onClick={() => setPagina(p => p + 1)} disabled={pagina >= totalPaginas - 1}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:text-white hover:bg-slate-800 disabled:opacity-50 transition">
            →
          </button>
        </div>
      )}
    </div>
  );
}

export default Servicios;
