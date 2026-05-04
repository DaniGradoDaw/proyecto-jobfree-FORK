/**
 * fix-acentos.js
 * Corrige tildes y ñ faltantes DENTRO de las llamadas tx("...") en todos los .js del src/.
 * Uso: node scripts/fix-acentos.js
 */

const fs   = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "../src");

// ── Mapa de reemplazos (ordenado: más largo primero para evitar solapamientos) ──
// Clave: texto incorrecto   Valor: texto correcto
const FIXES = [
  // ── ñ ──────────────────────────────────────────────────────────────────────
  ["anyadio",                 "añadió"],
  ["Anyadio",                 "Añadió"],
  ["Contrasenas",             "Contraseñas"],
  ["contrasenas",             "contraseñas"],
  ["Contrasena",              "Contraseña"],
  ["contrasena",              "contraseña"],
  ["Resenas",                 "Reseñas"],
  ["resenas",                 "reseñas"],
  ["Resena",                  "Reseña"],
  ["resena",                  "reseña"],
  ["Espana",                  "España"],
  ["espana",                  "españa"],
  ["anyo",                    "año"],
  ["/ano",                    "/año"],
  ["anos ",                   "años "],
  ["Anos ",                   "Años "],
  ["anos.",                   "años."],
  ["ninos",                   "niños"],
  ["Ninos",                   "Niños"],
  ["nino",                    "niño"],
  ["Nino",                    "Niño"],

  // ── -ción / -sión ───────────────────────────────────────────────────────────
  ["accion",                  "acción"],
  ["Accion",                  "Acción"],
  ["actualizacion",           "actualización"],
  ["Actualizacion",           "Actualización"],
  ["administracion",          "administración"],
  ["Administracion",          "Administración"],
  ["autenticacion",           "autenticación"],
  ["Autenticacion",           "Autenticación"],
  ["calificacion",            "calificación"],
  ["Calificacion",            "Calificación"],
  ["cancelacion",             "cancelación"],
  ["Cancelacion",             "Cancelación"],
  ["comunicacion",            "comunicación"],
  ["Comunicacion",            "Comunicación"],
  ["configuracion",           "configuración"],
  ["Configuracion",           "Configuración"],
  ["conversacion",            "conversación"],
  ["Conversacion",            "Conversación"],
  ["creacion",                "creación"],
  ["Creacion",                "Creación"],
  ["descripcion",             "descripción"],
  ["Descripcion",             "Descripción"],
  ["direccion",               "dirección"],
  ["Direccion",               "Dirección"],
  ["eliminacion",             "eliminación"],
  ["Eliminacion",             "Eliminación"],
  ["habilitacion",            "habilitación"],
  ["Habilitacion",            "Habilitación"],
  ["hidratacion",             "hidratación"],
  ["Hidratacion",             "Hidratación"],
  ["informacion",             "información"],
  ["Informacion",             "Información"],
  ["instalacion",             "instalación"],
  ["Instalacion",             "Instalación"],
  ["notificacion",            "notificación"],
  ["Notificacion",            "Notificación"],
  ["nutricion",               "nutrición"],
  ["Nutricion",               "Nutrición"],
  ["organizacion",            "organización"],
  ["Organizacion",            "Organización"],
  ["posicion",                "posición"],
  ["Posicion",                "Posición"],
  ["promocion",               "promoción"],
  ["Promocion",               "Promoción"],
  ["publicacion",             "publicación"],
  ["Publicacion",             "Publicación"],
  ["puntuacion",              "puntuación"],
  ["Puntuacion",              "Puntuación"],
  ["recuperacion",            "recuperación"],
  ["Recuperacion",            "Recuperación"],
  ["reparacion",              "reparación"],
  ["Reparacion",              "Reparación"],
  ["reservacion",             "reservación"],
  ["Reservacion",             "Reservación"],
  ["seleccion",               "selección"],
  ["Seleccion",               "Selección"],
  ["sesion",                  "sesión"],
  ["Sesion",                  "Sesión"],
  ["solucion",                "solución"],
  ["Solucion",                "Solución"],
  ["suscripcion",             "suscripción"],
  ["Suscripcion",             "Suscripción"],
  ["ubicacion",               "ubicación"],
  ["Ubicacion",               "Ubicación"],
  ["valoracion",              "valoración"],
  ["Valoracion",              "Valoración"],
  ["verificacion",            "verificación"],
  ["Verificacion",            "Verificación"],

  // ── -ón ─────────────────────────────────────────────────────────────────────
  ["boton",                   "botón"],
  ["Boton",                   "Botón"],
  ["camion",                  "camión"],
  ["razon",                   "razón"],
  ["Razon",                   "Razón"],

  // ── -ón plurales (singulares sin acento en plural) ──────────────────────────
  ["botónes",                 "botones"],
  ["Botónes",                 "Botones"],
  ["camiónes",                "camiones"],
  ["razónes",                 "razones"],
  ["Razónes",                 "Razones"],

  // ── tildes en palabras comunes ───────────────────────────────────────────────
  ["aqui",                    "aquí"],
  ["Aqui",                    "Aquí"],
  ["ahi",                     "ahí"],
  ["Ahi",                     "Ahí"],
  ["alla",                    "allá"],
  ["Alla",                    "Allá"],
  [" aun ",                   " aún "],
  [" Aun ",                   " Aún "],
  ["Aun no ",                 "Aún no "],
  ["aun no ",                 "aún no "],
  ["Todavia",                 "Todavía"],
  ["todavia",                 "todavía"],
  ["tambien",                 "también"],
  ["Tambien",                 "También"],
  ["facil",                   "fácil"],
  ["Facil",                   "Fácil"],
  ["rapido",                  "rápido"],
  ["Rapido",                  "Rápido"],
  ["rapida",                  "rápida"],
  ["publica",                 "pública"],
  ["Publica",                 "Pública"],
  ["publico",                 "público"],
  ["Publico",                 "Público"],
  ["unico",                   "único"],
  ["Unico",                   "Único"],
  ["unica",                   "única"],
  ["Unica",                   "Única"],
  ["basico",                  "básico"],
  ["Basico",                  "Básico"],
  ["tecnico",                 "técnico"],
  ["Tecnico",                 "Técnico"],
  ["tecnica",                 "técnica"],
  ["Tecnica",                 "Técnica"],
  ["economico",               "económico"],
  ["Economico",               "Económico"],
  ["logico",                  "lógico"],
  ["Logico",                  "Lógico"],
  ["logica",                  "lógica"],
  ["Logica",                  "Lógica"],
  ["numero",                  "número"],
  ["Numero",                  "Número"],
  ["numeros",                 "números"],
  ["Numeros",                 "Números"],
  ["telefono",                "teléfono"],
  ["Telefono",                "Teléfono"],
  ["minimo",                  "mínimo"],
  ["Minimo",                  "Mínimo"],
  ["minima",                  "mínima"],
  ["Minima",                  "Mínima"],
  ["maximo",                  "máximo"],
  ["Maximo",                  "Máximo"],
  ["maxima",                  "máxima"],
  ["Maxima",                  "Máxima"],
  ["busqueda",                "búsqueda"],
  ["Busqueda",                "Búsqueda"],
  ["pagina",                  "página"],
  ["Pagina",                  "Página"],
  ["codigo",                  "código"],
  ["Codigo",                  "Código"],
  ["critico",                 "crítico"],
  ["Critico",                 "Crítico"],
  ["automatico",              "automático"],
  ["Automatico",              "Automático"],
  ["automatica",              "automática"],
  ["organico",                "orgánico"],
  ["Organico",                "Orgánico"],
  ["clasico",                 "clásico"],
  ["Clasico",                 "Clásico"],
  ["dinamico",                "dinámico"],
  ["Dinamico",                "Dinámico"],
  ["estetico",                "estético"],
  ["Estetico",                "Estético"],
  ["historico",               "histórico"],
  ["Historico",               "Histórico"],
  ["juridico",                "jurídico"],
  ["Juridico",                "Jurídico"],
  ["filosofico",              "filosófico"],
  ["biologico",               "biológico"],
  // dia
  ["dia a dia",               "día a día"],
  [" dias",                   " días"],
  [" dia ",                   " día "],
  [" dia.",                   " día."],
  [" dia,",                   " día,"],
  // próximo
  ["proximo",                 "próximo"],
  ["Proximo",                 "Próximo"],
  // válido
  ["valido",                  "válido"],
  ["Valido",                  "Válido"],
  ["valida",                  "válida"],
  ["Valida",                  "Válida"],

  // ── Reversiones: plurales -ión que no llevan tilde ───────────────────────────
  // (estas deshacen el daño causado al encontrar "cion" dentro de "ciones")
  ["acciónes",                "acciones"],
  ["Acciónes",                "Acciones"],
  ["actualizaciónes",         "actualizaciones"],
  ["Actualizaciónes",         "Actualizaciones"],
  ["administraciónes",        "administraciones"],
  ["Administraciónes",        "Administraciones"],
  ["autenticaciónes",         "autenticaciones"],
  ["calificaciónes",          "calificaciones"],
  ["Calificaciónes",          "Calificaciones"],
  ["cancelaciónes",           "cancelaciones"],
  ["comunicaciónes",          "comunicaciones"],
  ["configuraciónes",         "configuraciones"],
  ["Configuraciónes",         "Configuraciones"],
  ["conversaciónes",          "conversaciones"],
  ["Conversaciónes",          "Conversaciones"],
  ["creaciónes",              "creaciones"],
  ["descripicónes",           "descripciones"],
  ["descripciónes",           "descripciones"],
  ["Descripicónes",           "Descripciones"],
  ["Descripicónes",           "Descripciones"],
  ["Descripicónes",           "Descripciones"],
  ["descripicónes",           "descripciones"],
  ["direcciónes",             "direcciones"],
  ["Direcciónes",             "Direcciones"],
  ["eliminaciónes",           "eliminaciones"],
  ["habilitaciónes",          "habilitaciones"],
  ["hidrataciónes",           "hidrataciones"],
  ["informaciónes",           "informaciones"],
  ["instalaciónes",           "instalaciones"],
  ["notificaciónes",          "notificaciones"],
  ["Notificaciónes",          "Notificaciones"],
  ["nutriciónes",             "nutriciones"],
  ["organizaciónes",          "organizaciones"],
  ["posiciónes",              "posiciones"],
  ["promociónes",             "promociones"],
  ["publicaciónes",           "publicaciones"],
  ["puntuaciónes",            "puntuaciones"],
  ["recuperaciónes",          "recuperaciones"],
  ["reparaciónes",            "reparaciones"],
  ["Reparaciónes",            "Reparaciones"],
  ["reservaciónes",           "reservaciones"],
  ["selecciónes",             "selecciones"],
  ["Selecciónes",             "Selecciones"],
  ["sesiónes",                "sesiones"],
  ["Sesiónes",                "Sesiones"],
  ["soluciónes",              "soluciones"],
  ["Soluciónes",              "Soluciones"],
  ["suscripciónes",           "suscripciones"],
  ["ubicaciónes",             "ubicaciones"],
  ["Ubicaciónes",             "Ubicaciones"],
  ["valoraciónes",            "valoraciones"],
  ["Valoraciónes",            "Valoraciones"],
  ["verificaciónes",          "verificaciones"],

  // ── Reversiones: formas verbales de publicar (publica → pública daña verbos) ─
  ["públicar",                "publicar"],
  ["Públicar",                "Publicar"],
  ["públicado",               "publicado"],
  ["Públicado",               "Publicado"],
  ["públicados",              "publicados"],
  ["Públicados",              "Publicados"],
  ["públicada",               "publicada"],
  ["Públicada",               "Publicada"],
  ["públicadas",              "publicadas"],
  ["Pública tu",              "Publica tu"],
  ["Pública mi",              "Publica mi"],

  // ── Reversiones: formas verbales de seleccionar ─────────────────────────────
  ["seleccióna",              "selecciona"],
  ["Seleccióna",              "Selecciona"],
  ["selecciónar",             "seleccionar"],
  ["selecciónan",             "seleccionan"],
];

// ── Aplica todos los fixes dentro de cada tx("...") ─────────────────────────

function corregirContenidoTx(texto) {
  return texto.replace(/\btx\(\s*(["'`])([^"'`\n]+)\1\s*\)/g, (match, quote, inner) => {
    let corregido = inner;
    for (const [malo, bueno] of FIXES) {
      // Sólo reemplaza si no está ya corregido
      if (corregido.includes(malo) && !corregido.includes(bueno.replace(malo, ""))) {
        corregido = corregido.split(malo).join(bueno);
      }
    }
    if (corregido === inner) return match;
    return `tx(${quote}${corregido}${quote})`;
  });
}

// ── Recorre src/ recursivamente ──────────────────────────────────────────────

let archivosModificados = 0;
let reemplazosTotal = 0;

function recorrer(dir) {
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const ruta = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
      if (!["node_modules", "build", ".git"].includes(entrada.name)) recorrer(ruta);
      continue;
    }
    if (!entrada.isFile() || !/\.(js|jsx|ts|tsx)$/.test(entrada.name)) continue;

    const original = fs.readFileSync(ruta, "utf-8");
    const corregido = corregirContenidoTx(original);

    if (corregido !== original) {
      fs.writeFileSync(ruta, corregido, "utf-8");
      archivosModificados++;

      // Cuenta reemplazos (aprox)
      const diff = corregido.length - original.length;
      reemplazosTotal++;
      const relativo = path.relative(SRC_DIR, ruta).replace(/\\/g, "/");
      console.log(`  ✓ ${relativo}`);
    }
  }
}

console.log("\n🔧  Corrigiendo tildes y ñ en llamadas tx()...\n");
recorrer(SRC_DIR);
console.log(`\n✅  ${archivosModificados} archivo(s) corregido(s)\n`);
