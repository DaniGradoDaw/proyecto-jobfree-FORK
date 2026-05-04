import traduccionesAuto from "i18n/traducciones-auto.json";

const IDIOMA_FALLBACK = "es";

function escaparRegex(valor) {
  return valor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// El texto en español ES la clave → tx(idioma, "Texto en español")
// Traducciones generadas automáticamente con: npm run traducir
export function tx(idioma, texto, variables = {}) {
  let resultado = texto;
  if (texto && idioma !== IDIOMA_FALLBACK) {
    const entrada = traduccionesAuto[texto];
    if (entrada && entrada[idioma]) {
      resultado = entrada[idioma];
      // Si el original empieza en mayúscula, la traducción también
      if (texto.charAt(0) !== texto.charAt(0).toLowerCase()) {
        resultado = resultado.charAt(0).toUpperCase() + resultado.slice(1);
      }
    }
  }
  if (!resultado) return texto;
  for (const key of Object.keys(variables)) {
    const patron = new RegExp(`\\{${escaparRegex(key)}\\}`, "g");
    resultado = resultado.replace(patron, String(variables[key]));
  }
  return resultado;
}
