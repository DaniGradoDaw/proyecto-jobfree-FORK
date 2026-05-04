import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { tx as txFn } from "i18n";

const LanguageContext = createContext();
const IDIOMAS_SOPORTADOS = new Set(["es", "en"]);
const IDIOMA_POR_DEFECTO = "es";

function resolverIdiomaInicial() {
  const guardado = localStorage.getItem("lang");
  if (guardado && IDIOMAS_SOPORTADOS.has(guardado)) return guardado;
  // Forzar español por defecto para consistencia con el proyecto
  return IDIOMA_POR_DEFECTO;
}

export function LanguageProvider({ children }) {
  const [idioma, setIdioma] = useState(resolverIdiomaInicial);

  const cambiarIdioma = (lang) => {
    const normalizado = (lang || "").toLowerCase();
    if (!IDIOMAS_SOPORTADOS.has(normalizado)) return;
    setIdioma(normalizado);
  };

  useEffect(() => {
    localStorage.setItem("lang", idioma);
  }, [idioma]);

  // tx(texto, variables?) → traducción automática según idioma activo
  const tx = useCallback((texto, variables) => txFn(idioma, texto, variables), [idioma]);

  return (
    <LanguageContext.Provider value={{ idioma, cambiarIdioma, tx }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
