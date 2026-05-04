import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import logo from "assets/images/logo.png";
import { useLanguage } from "context/LanguageContext";
import { obtenerTodasSubcategorias } from "api/subcategorias";
import API_URL from "api/config";

function Header() {

  const { tx } = useLanguage();
  const navigate = useNavigate();

  // texto que escribe el usuario
  const [query, setQuery] = useState("");

  // lista completa de subcategorías cargada una vez al montar
  const [todasSubcategorias, setTodasSubcategorias] = useState([]);

  // resultados filtrados para el dropdown
  const [resultados, setResultados] = useState([]);
  const [indiceActivo, setIndiceActivo] = useState(-1);

  // referencia para cerrar el dropdown al hacer click fuera
  const buscadorRef = useRef();

  // Cargamos todas las subcategorías al montar el componente
  useEffect(() => {
    obtenerTodasSubcategorias()
      .then(setTodasSubcategorias)
      .catch(() => { }); // si falla, el buscador simplemente no sugiere nada
  }, []);

  function resolverImagenBusqueda(imagen) {
    if (!imagen) return null;
    if (imagen.startsWith("http")) return imagen;
    if (imagen.startsWith("/images/")) return imagen;
    return API_URL + imagen;
  }

  // Cierra el dropdown si el usuario hace click fuera del buscador
  useEffect(() => {
    function handleClickOutside(event) {
      if (buscadorRef.current && !buscadorRef.current.contains(event.target)) {
        setQuery("");
        setResultados([]);
        setIndiceActivo(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Filtra las subcategorías en memoria según lo que escribe el usuario.
   */
  function handleQuery(e) {
    const valor = e.target.value;
    setQuery(valor);

    if (!valor.trim()) {
      setResultados([]);
      setIndiceActivo(-1);
      return;
    }

    const filtrados = todasSubcategorias.filter(sub =>
      sub.nombre.toLowerCase().includes(valor.toLowerCase().trim())
    );

    setResultados(filtrados.slice(0, 6));
    setIndiceActivo(-1);
  }

  /**
   * Enter: navega al primer resultado o a /servicios si no hay ninguno.
   * Escape: cierra el dropdown.
   */
  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      if (resultados.length === 0) return;
      e.preventDefault();
      setIndiceActivo((prev) => (prev + 1) % resultados.length);
      return;
    }

    if (e.key === "ArrowUp") {
      if (resultados.length === 0) return;
      e.preventDefault();
      setIndiceActivo((prev) => (prev <= 0 ? resultados.length - 1 : prev - 1));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (resultados.length > 0 && indiceActivo >= 0) {
        navigate(`/servicios/subcategoria/${resultados[indiceActivo].id}`);
      } else if (query.trim()) {
        navigate(`/servicios?q=${encodeURIComponent(query.trim())}`);
      } else if (resultados.length > 0) {
        navigate(`/servicios/subcategoria/${resultados[0].id}`);
      }
      setQuery("");
      setResultados([]);
      setIndiceActivo(-1);
    }
    if (e.key === "Escape") {
      setQuery("");
      setResultados([]);
      setIndiceActivo(-1);
    }
  }

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 bg-gray-100 border-b">

      {/* logo */}
      <Link to="/">
        <img src={logo} className="h-16" alt="Logo de JobFree" />
      </Link>

      {/* buscador con dropdown */}
      <div className="w-full md:flex-1 flex justify-center">
        <div className="relative w-full max-w-md" ref={buscadorRef}>

          <MagnifyingGlassIcon
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

          <input
            type="text"
            value={query}
            onChange={handleQuery}
            onKeyDown={handleKeyDown}
            placeholder={tx("Buscar servicios...")}
            aria-label={tx("Buscar servicios...")}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={query.trim().length > 0}
            aria-controls="header-search-results"
            aria-activedescendant={indiceActivo >= 0 ? `header-search-option-${resultados[indiceActivo]?.id}` : undefined}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Dropdown — aparece solo cuando hay texto */}
          {query.trim().length > 0 && (
            <div
              id="header-search-results"
              role="listbox"
              className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
            >

              {resultados.length > 0 ? (
                resultados.map((sub, index) => (
                  <button
                    id={`header-search-option-${sub.id}`}
                    key={sub.id}
                    onClick={() => {
                      navigate(`/servicios/subcategoria/${sub.id}`);
                      setQuery("");
                      setResultados([]);
                      setIndiceActivo(-1);
                    }}
                    onMouseEnter={() => setIndiceActivo(index)}
                    role="option"
                    aria-selected={indiceActivo === index}
                    className={`w-full text-left flex items-center gap-4 px-4 py-3 border-b last:border-0 transition ${
                      indiceActivo === index ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}>
                    {sub.imagen ? (
                      <img
                        src={resolverImagenBusqueda(sub.imagen)}
                        alt=""
                        className="w-14 h-14 rounded-xl object-cover shrink-0 bg-gray-100 border border-gray-200"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200">
                        <span className="text-emerald-600 text-lg font-bold">{sub.nombre?.charAt(0)}</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{tx(sub.nombre)}</p>
                      {sub.categoriaNombre && (
                        <p className="text-xs text-gray-400 truncate">{tx(sub.categoriaNombre)}</p>
                      )}
                      {sub.descripcion && (
                        <p className="text-xs text-gray-500 truncate">{tx(sub.descripcion)}</p>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 text-sm text-gray-400">
                  {tx("No hay resultados")}
                </p>
              )}

            </div>
          )}
        </div>
      </div>

      {/* botones de autenticación */}
      <nav className="flex gap-3">

        <Link to="/login" className="border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-full whitespace-nowrap hover:bg-blue-50 transition font-medium">
          {tx("Iniciar sesión")}
        </Link>

        <Link to="/registro" className="bg-blue-600 text-white px-4 py-2 rounded-full whitespace-nowrap hover:bg-blue-700 hover:shadow-md transition font-medium">
          {tx("Registrarse")}
        </Link>

      </nav>

    </header>
  );
}

export default Header;
