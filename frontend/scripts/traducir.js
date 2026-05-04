/**
 * Generador automático de traducciones para JobFree.
 *
 * USO:
 *   npm run traducir
 *
 * QUÉ HACE:
 *   1. Escanea todos los archivos .js/.jsx en src/
 *   2. Detecta cada llamada a la función tx() con texto en español
 *   3. Consulta la BD para obtener nombres de categorías y subcategorías
 *   4. Traduce solo los textos nuevos (respeta los ya traducidos)
 *   5. Guarda el resultado en src/i18n/traducciones-auto.json
 *
 * CÓMO USAR EN COMPONENTES:
 *   const { tx } = useLanguage();
 *   return <h1>{ tx(miTextoEnEspanol) }</h1>;
 */

const fs            = require("fs");
const path          = require("path");
const { execSync }  = require("child_process");

// ─── Configuración ────────────────────────────────────────────────────────────

const SRC_DIR    = path.join(__dirname, "../src");
const CACHE_FILE = path.join(SRC_DIR, "i18n/traducciones-auto.json");
const IDIOMAS    = ["en"];          // añade más si en el futuro quieres más idiomas
const DELAY_MS   = 400;             // pausa entre peticiones para no saturar la API
const LOTE_SIZE  = 20;              // textos por lote (Google acepta hasta ~128)

// ─── Textos desde la base de datos ───────────────────────────────────────────

const MYSQL_CANDIDATES = [
  "c:/xampp/mysql/bin/mysql.exe",
  "mysql",
];

function extraerTextosBD() {
  const textos = new Set();

  const mysql = MYSQL_CANDIDATES.find(cmd => {
    try { execSync(`"${cmd}" --version`, { stdio: "ignore" }); return true; } catch { return false; }
  });

  if (!mysql) {
    console.log("ℹ️   MySQL no encontrado — se omiten textos de la BD.\n");
    return textos;
  }

  const queries = [
    "SELECT nombre FROM categoria_servicio WHERE nombre IS NOT NULL AND nombre != '';",
    "SELECT nombre FROM subcategoria_servicio WHERE nombre IS NOT NULL AND nombre != '';",
    "SELECT descripcion FROM subcategoria_servicio WHERE descripcion IS NOT NULL AND descripcion != '';",
    "SELECT titulo FROM servicio_ofrecido WHERE titulo IS NOT NULL AND titulo != '';",
    "SELECT descripcion FROM servicio_ofrecido WHERE descripcion IS NOT NULL AND descripcion != '';",
  ];

  for (const sql of queries) {
    try {
      const out = execSync(
        `"${mysql}" -u root --password="" --default-character-set=utf8 --batch --skip-column-names jobfree -e "${sql}"`,
        { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] }
      );
      out.split("\n").map(l => l.trim()).filter(Boolean).forEach(t => textos.add(t));
    } catch {
      // Si falla (BD apagada, sin acceso), simplemente continuamos
    }
  }

  if (textos.size > 0) {
    console.log(`🗄️   BD: ${textos.size} texto(s) encontrados en categorías/subcategorías\n`);
  }

  return textos;
}

// ─── Extracción de textos ─────────────────────────────────────────────────────

function extraerTextos(dir) {
  const textos = new Set();
  // Captura:  tx("...")  tx('...')  tx(`...`)
  const patron = /\btx\(\s*["'`]([^"'`\n]+)["'`]\s*\)/g;

  function recorrer(carpeta) {
    let entradas;
    try {
      entradas = fs.readdirSync(carpeta, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entrada of entradas) {
      const ruta = path.join(carpeta, entrada.name);

      if (entrada.isDirectory()) {
        if (!["node_modules", "build", ".git", "scripts"].includes(entrada.name)) {
          recorrer(ruta);
        }
      } else if (entrada.isFile() && /\.(js|jsx|ts|tsx)$/.test(entrada.name)) {
        const contenido = fs.readFileSync(ruta, "utf-8");
        let match;
        patron.lastIndex = 0;
        while ((match = patron.exec(contenido)) !== null) {
          const texto = match[1].trim();
          if (texto) textos.add(texto);
        }
      }
    }
  }

  recorrer(dir);
  return [...textos];
}

// ─── Traducción via Google Translate (sin API key) ───────────────────────────

async function traducirLote(textos, idiomaDestino) {
  // Google Translate acepta múltiples "q=" en la misma petición
  const params = new URLSearchParams();
  params.append("client", "gtx");
  params.append("sl", "es");
  params.append("tl", idiomaDestino);
  params.append("dt", "t");
  for (const texto of textos) {
    params.append("q", texto);
  }

  const url = `https://translate.googleapis.com/translate_a/single?${params}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  // La respuesta es un array de arrays; cada elemento principal corresponde
  // a un segmento traducido: data[0] = [ ["traducido","original",...], ... ]
  const resultado = [];
  if (Array.isArray(data[0])) {
    for (const fragmento of data[0]) {
      if (Array.isArray(fragmento) && fragmento[0]) {
        resultado.push(String(fragmento[0]));
      }
    }
  }
  return resultado;
}

async function traducirUno(texto, idiomaDestino) {
  const traducciones = await traducirLote([texto], idiomaDestino);
  return traducciones[0] ?? texto;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🔍  Buscando llamadas tx() en src/...\n");
  const textosCodigoSet = new Set(extraerTextos(SRC_DIR));
  const textosBDSet     = extraerTextosBD();

  // Unión de ambas fuentes
  const todosLosTextos = [...new Set([...textosCodigoSet, ...textosBDSet])];

  if (todosLosTextos.length === 0) {
    console.log("ℹ️   No se encontraron textos. Añade tx(\"Texto\") en tus componentes.\n");
  }

  console.log(`📝  Total: ${todosLosTextos.length} texto(s) únicos (${textosCodigoSet.size} código + ${textosBDSet.size} BD)\n`);

  const cache = fs.existsSync(CACHE_FILE)
    ? JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"))
    : {};

  let nuevos   = 0;
  let errores  = 0;

  for (const idioma of IDIOMAS) {
    // Filtramos solo los textos que aún no tienen traducción
    const pendientes = todosLosTextos.filter(
      (t) => !cache[t] || !cache[t][idioma]
    );

    if (pendientes.length === 0) {
      console.log(`✅  [${idioma}] Todo ya estaba traducido.\n`);
      continue;
    }

    console.log(`🌐  Traduciendo ${pendientes.length} texto(s) nuevo(s) al [${idioma}]...\n`);

    // Traducimos en lotes para ser más eficientes
    for (let i = 0; i < pendientes.length; i += LOTE_SIZE) {
      const lote = pendientes.slice(i, i + LOTE_SIZE);

      try {
        // Intentamos traducir el lote completo de una vez
        const traducciones = await traducirLote(lote, idioma);

        // Google a veces devuelve menos fragmentos si une oraciones cortas;
        // en ese caso caemos a traducción individual para mayor fiabilidad.
        if (traducciones.length !== lote.length) {
          for (const texto of lote) {
            try {
              const tr = await traducirUno(texto, idioma);
              if (!cache[texto]) cache[texto] = {};
              cache[texto][idioma] = tr;
              nuevos++;
              console.log(`  ✓ "${texto.substring(0, 55)}..." → "${tr.substring(0, 55)}..."`);
              await sleep(DELAY_MS);
            } catch (err) {
              console.warn(`  ⚠️  Error en "${texto}": ${err.message}`);
              errores++;
            }
          }
        } else {
          for (let j = 0; j < lote.length; j++) {
            const texto     = lote[j];
            const traducido = traducciones[j];
            if (!cache[texto]) cache[texto] = {};
            cache[texto][idioma] = traducido;
            nuevos++;
            const preview = texto.length > 50 ? texto.substring(0, 50) + "…" : texto;
            console.log(`  ✓ "${preview}"`);
          }
          await sleep(DELAY_MS);
        }
      } catch (err) {
        console.warn(`  ⚠️  Error en lote (intentando uno a uno): ${err.message}`);
        // Fallback: traducir uno a uno
        for (const texto of lote) {
          try {
            const tr = await traducirUno(texto, idioma);
            if (!cache[texto]) cache[texto] = {};
            cache[texto][idioma] = tr;
            nuevos++;
            console.log(`  ✓ "${texto.substring(0, 55)}…"`);
            await sleep(DELAY_MS);
          } catch (e2) {
            console.warn(`  ✗ No se pudo traducir "${texto}": ${e2.message}`);
            errores++;
          }
        }
      }
    }
  }

  // Limpieza: eliminamos del caché textos que ya no existen en el código
  const textosActuales = new Set(todosLosTextos);
  let eliminados = 0;
  for (const clave of Object.keys(cache)) {
    if (!textosActuales.has(clave)) {
      delete cache[clave];
      eliminados++;
    }
  }

  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");

  console.log("\n─────────────────────────────────────────");
  if (nuevos > 0)     console.log(`✅  ${nuevos} nueva(s) traducción(es) generadas`);
  if (eliminados > 0) console.log(`🗑️   ${eliminados} entrada(s) obsoleta(s) eliminadas`);
  if (errores > 0)    console.log(`⚠️   ${errores} error(es) — esos textos muestran español como fallback`);
  console.log(`📁  Guardado en: src/i18n/traducciones-auto.json`);
  console.log("─────────────────────────────────────────\n");
}

main().catch((err) => {
  console.error("Error fatal:", err);
  process.exit(1);
});
