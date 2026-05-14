import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { crearCheckoutSuscripcion, cancelarSuscripcion, obtenerMiPlan, verificarSuscripcion } from "api/suscripciones";
import { useLanguage } from "context/LanguageContext";

function IconoCheck() {
  return (
    <span className="grid size-4 shrink-0 place-content-center rounded-full bg-[#166534] text-white">
      <svg className="h-2.5 w-2.5" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}

function IconoX() {
  return (
    <span className="grid size-4 shrink-0 place-content-center rounded-full bg-red-300 text-white">
      <svg className="h-2.5 w-2.5" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </span>
  );
}

const FEATURES = {
  BASICO: [
    "Perfil visible en la plataforma",
    "Elegir zona de trabajo",
    "Recibir solicitudes de clientes",
    "Recibir valoraciones",
    "Prioridad estándar en búsquedas",
    "Hasta 3 servicios publicados",
  ],
  PRO: [
    "Todo lo incluido en Básico",
    "Servicios ilimitados",
    "Alta prioridad en búsquedas",
    "Perfil destacado con badge verificado",
    "Acceso a estadísticas de visitas",
    "Descuentos en tiendas asociadas",
    "Soporte por email prioritario",
  ],
  PREMIUM: [
    "Todo en PRO",
    "Máxima visibilidad en la plataforma",
    "Insignia Top Profesional",
    "Más descuentos exclusivos en tiendas",
    "Asesor de éxito personal",
    "Doble de puntos por servicio",
    "Soporte prioritario 24/7",
  ],
};

const _B = (sector) => ({
  "Construcción": { badge: "bg-green-100 text-green-700",    cardBg: "bg-green-50/60"   },
  "Hogar":        { badge: "bg-yellow-100 text-yellow-800",  cardBg: "bg-yellow-50/60"  },
  "Herramientas": { badge: "bg-orange-100 text-orange-700",  cardBg: "bg-orange-50/60"  },
  "Jardín":       { badge: "bg-emerald-100 text-emerald-700",cardBg: "bg-emerald-50/60" },
  "Electricidad": { badge: "bg-sky-100 text-sky-700",        cardBg: "bg-sky-50/60"     },
  "Fontanería":   { badge: "bg-purple-100 text-purple-700",  cardBg: "bg-purple-50/60"  },
  "Pintura":      { badge: "bg-pink-100 text-pink-700",      cardBg: "bg-pink-50/60"    },
})[sector] ?? { badge: "bg-gray-100 text-gray-700", cardBg: "bg-gray-50/60" };

const mkd = (tienda, letra, sector, desc, label, descripcion, codigo, url, expira) => ({
  tienda, letra, sector, descuento: desc, label, descripcion, codigo, url, expira, ..._B(sector),
});

const DESCUENTOS = {
  PRO: [
    mkd("Leroy Merlin",   "LM", "Construcción",  "15%", "AHORRO", "15% en materiales de construcción, cemento, yeso y acabados",            "JFPRO-LM15",  "https://www.leroymerlin.es",       "31/05/2026"),
    mkd("Bricomart",      "BM", "Construcción",  "10%", "AHORRO", "10% en materiales a granel, bloques, ladrillos y morteros",               "JFPRO-BM10",  "https://www.bricomart.es",          "31/05/2026"),
    mkd("Ferrokey",       "FK", "Construcción",  "8%",  "AHORRO", "8% en toda la ferretería: tornillería, anclajes y fijaciones",            "JFPRO-FK08",  "https://www.ferrokey.com",          "30/06/2026"),
    mkd("Sika España",    "SK", "Construcción",  "12%", "MENOS",  "12% en impermeabilizantes, selladores y adhesivos de construcción",       "JFPRO-SK12",  "https://www.sika.es",               "30/06/2026"),
    mkd("IKEA",           "IK", "Hogar",         "10%", "MENOS",  "10% en muebles y decoración para el hogar, en tienda y online",           "JFPRO-IK10",  "https://www.ikea.com/es/es/",       "31/05/2026"),
    mkd("Maisons du Monde","MM","Hogar",         "12%", "AHORRO", "12% en decoración, muebles y textil para el hogar",                       "JFPRO-MDM12", "https://www.maisonsdumonde.com",     "30/06/2026"),
    mkd("El Corte Inglés","ECI","Hogar",         "8%",  "MENOS",  "8% en electrodomésticos, menaje y artículos para el hogar",               "JFPRO-ECI08", "https://www.elcorteingles.es",      "30/06/2026"),
    mkd("Casa Shops",     "CS", "Hogar",         "15%", "AHORRO", "15% en toda la tienda de decoración y menaje de casa",                    "JFPRO-CS15",  "https://www.casashops.com",          "31/05/2026"),
    mkd("Bricomart",      "BT", "Herramientas",  "12%", "AHORRO", "12% en herramientas manuales, eléctricas y accesorios",                   "JFPRO-BT12",  "https://www.bricomart.es",          "31/05/2026"),
    mkd("Bauhaus",        "BH", "Herramientas",  "10%", "AHORRO", "10% en maquinaria, equipos de taller y herramientas de precisión",        "JFPRO-BH10",  "https://www.bauhaus.es",            "30/06/2026"),
    mkd("Makita",         "MK", "Herramientas",  "8%",  "MENOS",  "8% en toda la gama de herramientas eléctricas y baterías Makita",         "JFPRO-MK08",  "https://www.makita.es",             "30/06/2026"),
    mkd("DeWalt",         "DW", "Herramientas",  "10%", "AHORRO", "10% en taladros, sierras, lijadoras y accesorios DeWalt",                 "JFPRO-DW10",  "https://www.dewalt.es",             "31/05/2026"),
    mkd("ManoMano",       "MN", "Jardín",        "10%", "AHORRO", "10% en herramientas de jardín, riego y mobiliario exterior",              "JFPRO-MN10",  "https://www.manomano.es",           "31/05/2026"),
    mkd("Verdecora",      "VD", "Jardín",        "12%", "MENOS",  "12% en plantas, semillas, tierra y productos de jardinería",              "JFPRO-VD12",  "https://www.verdecora.es",          "30/06/2026"),
    mkd("Jardiland",      "JL", "Jardín",        "8%",  "AHORRO", "8% en jardinería, decoración exterior y herramientas de poda",            "JFPRO-JL08",  "https://www.jardiland.es",          "30/06/2026"),
    mkd("Electro Depot",  "ED", "Electricidad",  "8%",  "AHORRO", "8% en material eléctrico, iluminación y herramientas eléctricas",         "JFPRO-ED08",  "https://www.electrodepot.es",       "31/05/2026"),
    mkd("Rexel",          "RX", "Electricidad",  "10%", "MENOS",  "10% en cable, cuadros eléctricos y material de instalación",              "JFPRO-RX10",  "https://www.rexel.es",              "30/06/2026"),
    mkd("Conrad",         "CN", "Electricidad",  "12%", "AHORRO", "12% en componentes electrónicos, cables y herramientas de medición",      "JFPRO-CN12",  "https://www.conrad.es",             "30/06/2026"),
    mkd("Würth",          "WÜ", "Fontanería",    "10%", "AHORRO", "10% en fontanería, fijaciones y herramientas de precisión",               "JFPRO-WU10",  "https://www.wurth.es",              "31/05/2026"),
    mkd("Roca",           "RC", "Fontanería",    "8%",  "MENOS",  "8% en baños completos, sanitarios y griferías Roca",                      "JFPRO-RC08",  "https://www.roca.es",               "30/06/2026"),
    mkd("Grohe",          "GR", "Fontanería",    "12%", "AHORRO", "12% en griferías, duchas y sistemas de agua Grohe",                       "JFPRO-GR12",  "https://www.grohe.com/es",          "30/06/2026"),
    mkd("Bruguer",        "BR", "Pintura",       "15%", "MENOS",  "15% en pinturas, imprimaciones y accesorios de aplicación",               "JFPRO-BR15",  "https://www.bruguer.es",            "31/05/2026"),
    mkd("Titanlux",       "TL", "Pintura",       "12%", "AHORRO", "12% en esmaltes, lacas, barnices y pinturas de interior/exterior",        "JFPRO-TL12",  "https://www.titanlux.es",           "30/06/2026"),
    mkd("Valentine",      "VL", "Pintura",       "10%", "MENOS",  "10% en pinturas plásticas, antioxidantes y tratamientos de madera",       "JFPRO-VL10",  "https://www.valentine.es",          "30/06/2026"),
    mkd("Jotun",          "JT", "Pintura",       "8%",  "AHORRO", "8% en pinturas de alta resistencia para profesionales y obra nueva",      "JFPRO-JT08",  "https://www.jotun.com/es",          "30/06/2026"),
  ],
  PREMIUM: [
    mkd("Leroy Merlin",   "LM", "Construcción",  "20%", "AHORRO", "20% en toda la tienda: materiales, herramientas, jardín y más",           "JFPREM-LM20", "https://www.leroymerlin.es",        "31/05/2026"),
    mkd("Bricomart",      "BM", "Construcción",  "15%", "AHORRO", "15% en materiales a granel, bloques, ladrillos y morteros",               "JFPREM-BM15", "https://www.bricomart.es",          "31/05/2026"),
    mkd("Ferrokey",       "FK", "Construcción",  "12%", "AHORRO", "12% en tornillería, anclajes, fijaciones y ferretería general",           "JFPREM-FK12", "https://www.ferrokey.com",          "30/06/2026"),
    mkd("Sika España",    "SK", "Construcción",  "18%", "MENOS",  "18% en impermeabilizantes, selladores y adhesivos de construcción",       "JFPREM-SK18", "https://www.sika.es",               "30/06/2026"),
    mkd("IKEA",           "IK", "Hogar",         "15%", "MENOS",  "15% en muebles y decoración para el hogar, en tienda y online",           "JFPREM-IK15", "https://www.ikea.com/es/es/",       "31/05/2026"),
    mkd("Maisons du Monde","MM","Hogar",         "18%", "AHORRO", "18% en decoración, muebles y textil para el hogar",                       "JFPREM-MDM18","https://www.maisonsdumonde.com",     "30/06/2026"),
    mkd("El Corte Inglés","ECI","Hogar",         "12%", "MENOS",  "12% en electrodomésticos, menaje y artículos para el hogar",              "JFPREM-ECI12","https://www.elcorteingles.es",      "30/06/2026"),
    mkd("Casa Shops",     "CS", "Hogar",         "20%", "AHORRO", "20% en toda la tienda de decoración y menaje de casa",                    "JFPREM-CS20", "https://www.casashops.com",          "31/05/2026"),
    mkd("Zara Home",      "ZH", "Hogar",         "15%", "MENOS",  "15% en textil, complementos y decoración Zara Home",                     "JFPREM-ZH15", "https://www.zarahome.com",           "30/06/2026"),
    mkd("Bricomart",      "BT", "Herramientas",  "18%", "AHORRO", "18% en herramientas manuales, eléctricas y todos los accesorios",         "JFPREM-BT18", "https://www.bricomart.es",          "31/05/2026"),
    mkd("Bauhaus",        "BH", "Herramientas",  "15%", "AHORRO", "15% en maquinaria, equipos de taller y herramientas de precisión",        "JFPREM-BH15", "https://www.bauhaus.es",            "30/06/2026"),
    mkd("Makita",         "MK", "Herramientas",  "12%", "MENOS",  "12% en toda la gama de herramientas eléctricas y baterías Makita",        "JFPREM-MK12", "https://www.makita.es",             "30/06/2026"),
    mkd("DeWalt",         "DW", "Herramientas",  "15%", "AHORRO", "15% en taladros, sierras, lijadoras y accesorios DeWalt",                 "JFPREM-DW15", "https://www.dewalt.es",             "31/05/2026"),
    mkd("Bosch",          "BS", "Herramientas",  "10%", "AHORRO", "10% en herramientas Bosch Professional para uso intensivo",               "JFPREM-BS10", "https://www.bosch-professional.com/es","30/06/2026"),
    mkd("ManoMano",       "MN", "Jardín",        "25%", "MENOS",  "25% en bricolaje, jardín y hogar en tu primer pedido online",             "JFPREM-MN25", "https://www.manomano.es",           "31/05/2026"),
    mkd("Verdecora",      "VD", "Jardín",        "18%", "MENOS",  "18% en plantas, semillas, tierra y productos de jardinería",              "JFPREM-VD18", "https://www.verdecora.es",          "30/06/2026"),
    mkd("Jardiland",      "JL", "Jardín",        "15%", "AHORRO", "15% en jardinería, decoración exterior y herramientas de poda",           "JFPREM-JL15", "https://www.jardiland.es",          "30/06/2026"),
    mkd("Electro Depot",  "ED", "Electricidad",  "15%", "AHORRO", "15% en material eléctrico, iluminación LED y herramientas eléctricas",    "JFPREM-ED15", "https://www.electrodepot.es",       "31/05/2026"),
    mkd("Rexel",          "RX", "Electricidad",  "18%", "MENOS",  "18% en cable, cuadros eléctricos y material de instalación profesional",  "JFPREM-RX18", "https://www.rexel.es",              "30/06/2026"),
    mkd("Conrad",         "CN", "Electricidad",  "20%", "AHORRO", "20% en componentes electrónicos, cables y herramientas de medición",      "JFPREM-CN20", "https://www.conrad.es",             "30/06/2026"),
    mkd("RS Components",  "RS", "Electricidad",  "12%", "AHORRO", "12% en componentes industriales y material de instalación eléctrica",     "JFPREM-RS12", "https://es.rs-online.com",          "30/06/2026"),
    mkd("Würth",          "WÜ", "Fontanería",    "15%", "AHORRO", "15% en fontanería, fijaciones y herramientas de precisión",               "JFPREM-WU15", "https://www.wurth.es",              "31/05/2026"),
    mkd("Roca",           "RC", "Fontanería",    "12%", "MENOS",  "12% en baños completos, sanitarios y griferías Roca",                     "JFPREM-RC12", "https://www.roca.es",               "30/06/2026"),
    mkd("Grohe",          "GR", "Fontanería",    "18%", "AHORRO", "18% en griferías, duchas y sistemas de agua Grohe",                       "JFPREM-GR18", "https://www.grohe.com/es",          "30/06/2026"),
    mkd("Hansgrohe",      "HG", "Fontanería",    "15%", "MENOS",  "15% en sistemas de ducha, grifería de baño y cocina Hansgrohe",          "JFPREM-HG15", "https://www.hansgrohe.es",          "30/06/2026"),
    mkd("Bruguer",        "BR", "Pintura",       "20%", "MENOS",  "20% en pinturas, barnices, imprimaciones y accesorios de aplicación",     "JFPREM-BR20", "https://www.bruguer.es",            "31/05/2026"),
    mkd("Titanlux",       "TL", "Pintura",       "18%", "AHORRO", "18% en esmaltes, lacas, barnices y pinturas de interior/exterior",        "JFPREM-TL18", "https://www.titanlux.es",           "30/06/2026"),
    mkd("Valentine",      "VL", "Pintura",       "15%", "MENOS",  "15% en pinturas plásticas, antioxidantes y tratamientos de madera",       "JFPREM-VL15", "https://www.valentine.es",          "30/06/2026"),
    mkd("Jotun",          "JT", "Pintura",       "12%", "AHORRO", "12% en pinturas de alta resistencia para profesionales y obra nueva",     "JFPREM-JT12", "https://www.jotun.com/es",          "30/06/2026"),
  ],
};

const DESC_POR_PAGINA = 3;

const PRECIOS = {
  PRO:     { mensual: "9,99 €",  anual: "99,99 €"  },
  PREMIUM: { mensual: "19,99 €", anual: "149,99 €" },
};

const LIMITE_BASICO = FEATURES.BASICO.length - 2;
const LIMITE_PRO    = FEATURES.PRO.length - 2;

const NOMBRES = { BASICO: "Básico", PRO: "Pro", PREMIUM: "Premium" };

export default function PlanProfesional() {
  const { tx } = useLanguage();
  const [searchParams] = useSearchParams();
  const [esAnual, setEsAnual] = useState(false);
  const [planActual, setPlanActual]           = useState(null);
  const [tieneSubscripcion, setTieneSubscripcion] = useState(false);
  const [loading, setLoading]                 = useState(true);
  const [procesando, setProcesando]           = useState(null);
  const [cancelando, setCancelando]           = useState(false);
  const [confirmando, setConfirmando]         = useState(false);
  const [error, setError]                     = useState("");
  const [tooltip, setTooltip]                 = useState(null);
  const [tab, setTab]                         = useState("plan");
  const [selectedDescuento, setSelectedDescuento] = useState(null);
  const [copiado, setCopiado]                 = useState(false);
  const [filtroSector, setFiltroSector]       = useState("Todos");
  const [paginaDesc, setPaginaDesc]           = useState(0);

  const success = searchParams.get("success") === "true";

  useEffect(() => {
    const fn = success ? verificarSuscripcion : obtenerMiPlan;
    fn()
      .then((data) => {
        setPlanActual(data.plan);
        setTieneSubscripcion(data.tieneStripeSubscription);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleContratar(plan) {
    setProcesando(plan);
    setError("");
    try {
      const { checkoutUrl } = await crearCheckoutSuscripcion(plan, esAnual ? "anual" : "mensual");
      window.location.href = checkoutUrl;
    } catch (e) {
      setError(e.message || tx("Error al iniciar el pago."));
      setProcesando(null);
    }
  }

  async function handleCancelar() {
    setCancelando(true);
    setError("");
    try {
      await cancelarSuscripcion();
      setPlanActual("BASICO");
      setTieneSubscripcion(false);
      setConfirmando(false);
    } catch (e) {
      setError(e.message || tx("Error al cancelar la suscripción"));
    } finally {
      setCancelando(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
        {success ? tx("Verificando tu suscripción...") : tx("Cargando...")}
      </div>
    );
  }

  const esSuscrito = tieneSubscripcion && planActual !== "BASICO";
  const otrosPlanes = ["PRO", "PREMIUM"].filter(p => p !== planActual);

  return (
    <div className="relative isolate px-2 py-4 sm:px-4">

      {error && (
        <div className="mx-auto mb-5 max-w-lg rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ── VISTA SUSCRITO ── */}
      {esSuscrito ? (
        <>
        {/* Pestañas */}
        <div className="max-w-3xl mx-auto w-full mb-6">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 max-w-xs">
            <button
              onClick={() => setTab("plan")}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${tab === "plan" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              {tx("Mi plan")}
            </button>
            <button
              onClick={() => { setTab("descuentos"); setFiltroSector("Todos"); setPaginaDesc(0); }}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition flex items-center justify-center gap-1.5 ${tab === "descuentos" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              🏷️ {tx("Descuentos")}
            </button>
          </div>
        </div>

        {tab === "plan" && (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-start max-w-3xl mx-auto">

          {/* IZQUIERDA — card plan activo */}
          <div className="relative rounded-2xl bg-violet-50 p-6 shadow-xl ring-2 ring-[#2596be] w-full lg:max-w-xs">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-600 px-4 py-1.5 text-xs font-bold text-white shadow">
              ✓ {tx("Tu plan actual")}
            </span>

            <div className="pt-2">
              <h2 className="text-xl font-bold text-gray-900">{NOMBRES[planActual]}</h2>
              <p className="mt-1 flex items-baseline gap-x-2">
                <span className="text-3xl font-semibold tracking-tight text-gray-900">
                  {PRECIOS[planActual]?.mensual}
                </span>
                <span className="text-base text-gray-500">{tx("/mes")}</span>
              </p>
              <p className="mt-1 text-xs text-gray-400">{tx("Tu suscripción se renueva automáticamente cada mes.")}</p>
            </div>

            <ul className="mt-5 mb-6 space-y-2.5 text-[13px] leading-5 text-gray-800">
              {(FEATURES[planActual] ?? []).map((text, i) => (
                <li key={i} className="flex gap-x-3">
                  <IconoCheck />
                  {tx(text)}
                </li>
              ))}
            </ul>

            {/* Cancelar — confirmación inline */}
            {!confirmando ? (
              <button
                onClick={() => setConfirmando(true)}
                className="mt-4 w-full rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 hover:border-red-400 transition"
              >
                {tx("Cancelar suscripción")}
              </button>
            ) : (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
                <p className="text-sm text-red-700 font-medium">
                  {tx("¿Cancelar tu suscripción? Podrás seguir usando el plan hasta el final del período actual.")}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelar}
                    disabled={cancelando}
                    className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    {cancelando && <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />}
                    {tx("Sí, cancelar")}
                  </button>
                  <button
                    onClick={() => setConfirmando(false)}
                    className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                  >
                    {tx("No, mantener")}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* DERECHA — cambiar de plan */}
          <div className="lg:w-56 shrink-0">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">{tx("Cambiar de plan")}</p>
            <div className="flex flex-col gap-2">
              {otrosPlanes.map((plan) => (
                <div key={plan} className="relative">
                  <button
                    onClick={() => handleContratar(plan)}
                    disabled={!!procesando}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm hover:border-[#2596be] hover:shadow-sm transition disabled:opacity-60 flex items-center justify-between"
                  >
                    <span>
                      <span className="font-semibold text-gray-900">{NOMBRES[plan]}</span>
                      <span className="ml-1.5 text-gray-400 text-xs">{PRECIOS[plan]?.mensual}{tx("/mes")}</span>
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-[#2596be] shrink-0">
                      {procesando === plan && <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />}
                      <span
                        role="button"
                        tabIndex={-1}
                        onMouseEnter={(e) => { e.stopPropagation(); setTooltip(plan); }}
                        onMouseLeave={() => setTooltip(null)}
                        onClick={(e) => e.stopPropagation()}
                        className="text-gray-400 hover:text-[#2596be] transition"
                      >
                        <InformationCircleIcon className="h-4 w-4" />
                      </span>
                      {plan === "PREMIUM" && planActual === "PRO" ? tx("Mejorar") : tx("Cambiar")}
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </button>
                  {tooltip === plan && (
                    <div className="absolute right-0 top-full mt-1.5 z-30 w-56 rounded-xl bg-gray-900 p-3.5 shadow-xl text-white text-xs">
                      <p className="font-semibold mb-2 text-[#7dd3fc]">{NOMBRES[plan]}</p>
                      <ul className="space-y-1.5">
                        {(FEATURES[plan] ?? []).map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="mt-0.5 text-emerald-400 shrink-0">✓</span>
                            <span className="text-gray-200">{tx(f)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={() => setConfirmando(true)}
                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-left text-sm hover:bg-gray-100 transition flex items-center justify-between text-gray-500"
              >
                <span className="font-medium">{tx("Básico")}<span className="ml-1.5 text-gray-300 text-xs">0€{tx("/mes")}</span></span>
                <span className="text-xs text-gray-400">{tx("Cancelar")}</span>
              </button>
            </div>
          </div>

        </div>

        )}

        {tab === "descuentos" && DESCUENTOS[planActual] && (() => {
          const todos = DESCUENTOS[planActual];
          const sectores = ["Todos", ...Array.from(new Set(todos.map(d => d.sector)))];
          const filtrados = filtroSector === "Todos" ? todos : todos.filter(d => d.sector === filtroSector);
          const totalPags = Math.ceil(filtrados.length / DESC_POR_PAGINA);
          const visibles  = filtrados.slice(paginaDesc * DESC_POR_PAGINA, (paginaDesc + 1) * DESC_POR_PAGINA);
          return (
            <div className="max-w-3xl mx-auto w-full">
              {/* Filtros sector */}
              <div className="flex flex-wrap gap-2 mb-5">
                {sectores.map(s => (
                  <button
                    key={s}
                    onClick={() => { setFiltroSector(s); setPaginaDesc(0); }}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition border ${
                      filtroSector === s
                        ? "bg-slate-800 text-white border-slate-800"
                        : "bg-white text-slate-600 border-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3">
                {visibles.map((d) => (
                  <div key={d.tienda} className={`${d.cardBg} rounded-2xl border border-gray-100 shadow-sm overflow-hidden`}>
                    <div className="flex items-center">
                      <div className="w-24 shrink-0 flex flex-col items-center justify-center border-r border-black/5 py-5 px-2 text-center">
                        <p className="text-2xl font-extrabold text-gray-900 leading-none">{d.descuento}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">{d.label}</p>
                      </div>
                      <div className="flex-1 px-4 py-4 flex items-center justify-between gap-3 min-w-0">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${d.badge}`}>
                              🏷️ Cupón
                            </span>
                            <span className="text-[11px] text-gray-400">{d.sector}</span>
                          </div>
                          <p className="text-sm text-gray-700 leading-snug">{d.descripcion}</p>
                        </div>
                        <button
                          onClick={() => { setSelectedDescuento(d); setCopiado(false); }}
                          className="shrink-0 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2.5 transition whitespace-nowrap"
                        >
                          Ver cupón ›
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-black/5 px-4 py-2">
                      <span className="text-xs text-orange-500 font-medium">{d.tienda}</span>
                      <span className="text-xs text-gray-400">Expira el {d.expira}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginación */}
              {totalPags > 1 && (
                <div className="flex items-center justify-center gap-8 mt-8">
                  <button
                    onClick={() => setPaginaDesc(p => p - 1)}
                    disabled={paginaDesc === 0}
                    className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:text-white hover:bg-slate-800 disabled:opacity-50 transition"
                  >
                    ←
                  </button>
                  <p className="text-slate-600 text-sm">
                    {tx("Página")} <strong className="text-slate-800">{paginaDesc + 1}</strong> {tx("de")} <strong className="text-slate-800">{totalPags}</strong>
                  </p>
                  <button
                    onClick={() => setPaginaDesc(p => p + 1)}
                    disabled={paginaDesc >= totalPags - 1}
                    className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:text-white hover:bg-slate-800 disabled:opacity-50 transition"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        {/* Modal cupón */}
        {selectedDescuento && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4" onClick={() => setSelectedDescuento(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black ${selectedDescuento.badge}`}>
                  {selectedDescuento.letra}
                </span>
                <div>
                  <p className="font-bold text-gray-900">{selectedDescuento.tienda}</p>
                  <p className="text-xs text-gray-400">Expira el {selectedDescuento.expira}</p>
                </div>
                <button onClick={() => setSelectedDescuento(null)} className="ml-auto text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
              </div>
              <p className="text-3xl font-extrabold text-gray-900 mb-1">{selectedDescuento.descuento} <span className="text-base font-semibold text-gray-400">{selectedDescuento.label}</span></p>
              <p className="text-sm text-gray-600 mb-5">{selectedDescuento.descripcion}</p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Código de descuento</p>
              <div className="flex items-center gap-2 mb-5">
                <code className="flex-1 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-mono font-bold text-gray-800 tracking-widest text-center">
                  {selectedDescuento.codigo}
                </code>
                <button
                  onClick={() => { navigator.clipboard.writeText(selectedDescuento.codigo).catch(() => {}); setCopiado(true); }}
                  className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-3 transition shrink-0"
                >
                  {copiado ? "✓" : "Copiar"}
                </button>
              </div>
              <a
                href={selectedDescuento.url}
                target="_blank"
                rel="noreferrer"
                className="block w-full rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold py-3 text-center transition"
              >
                Ir a {selectedDescuento.tienda} →
              </a>
            </div>
          </div>
        )}
        </>
      ) : (
        /* ── VISTA BÁSICO: 3 cards ── */
        <>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">{tx("Elige tu plan")}</p>
          </div>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm sm:text-base font-medium text-gray-500 leading-relaxed">
            {tx("Aumenta tu visibilidad y consigue más clientes con el plan que mejor se adapte a ti")}
          </p>

          <div className="mt-7 flex justify-center">
            <div className="flex bg-zinc-300 p-1.5 rounded-full">
              <button onClick={() => setEsAnual(false)} className={`px-4 py-2 rounded-full text-xs transition ${!esAnual ? "bg-[#2596be] text-white" : "text-gray-600"}`}>{tx("Mensual")}</button>
              <button onClick={() => setEsAnual(true)}  className={`px-4 py-2 rounded-full text-xs transition ${esAnual  ? "bg-[#2596be] text-white" : "text-gray-600"}`}>{tx("Anual")}</button>
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="text-sm font-semibold text-[#2596be]">{tx("Ahorra un 15% pagando anualmente")}</p>
          </div>

          <div className="mx-auto mt-8 grid max-w-sm grid-cols-1 items-center gap-y-5 sm:mt-10 lg:max-w-3xl lg:grid-cols-3">

            {/* BÁSICO */}
            <div className="relative mx-auto w-full max-w-[17.5rem] rounded-2xl bg-white p-5 sm:p-6 lg:mx-0 ring-2 ring-slate-400 shadow-lg">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-600 px-3 py-1 text-xs font-semibold text-white shadow">
                ✓ {tx("Tu plan actual")}
              </span>
              <h3 className="text-base font-semibold text-gray-900">{tx("Básico")}</h3>
              <p className="mt-3 flex items-baseline gap-x-2">
                <span className="text-3xl font-semibold tracking-tight text-gray-900">0€</span>
                <span className="text-base text-gray-500">{esAnual ? tx("/año") : tx("/mes")}</span>
              </p>
              <ul className="mt-6 space-y-2 text-[13px] leading-5 text-gray-800">
                {FEATURES.BASICO.map((text, i) => (
                  <li key={i} className="flex gap-x-3">{i < LIMITE_BASICO ? <IconoCheck /> : <IconoX />}{tx(text)}</li>
                ))}
              </ul>
              <button disabled className="mt-6 w-full rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-400 cursor-default">{tx("Plan actual")}</button>
            </div>

            {/* PRO */}
            <div className="relative mx-auto w-full max-w-[18.5rem] rounded-2xl bg-white p-5 shadow-xl sm:p-6 lg:mx-0 lg:scale-[1.03] ring-2 ring-[#2596be]">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#2596be] px-3 py-1 text-xs font-semibold text-white shadow">{tx("MÁS POPULAR")}</span>
              <h3 className="text-base font-semibold text-gray-900">{tx("Pro")}</h3>
              <p className="mt-3 flex items-baseline gap-x-2">
                <span className="text-3xl font-semibold tracking-tight text-gray-900">{esAnual ? "99,99 €" : "9,99 €"}</span>
                <span className="text-base text-gray-800">{esAnual ? tx("/año") : tx("/mes")}</span>
              </p>
              <ul className="mt-6 space-y-2 text-[13px] leading-5 text-gray-800">
                {FEATURES.PRO.map((text, i) => (
                  <li key={i} className="flex gap-x-3">{i < LIMITE_PRO ? <IconoCheck /> : <IconoX />}{tx(text)}</li>
                ))}
              </ul>
              <button onClick={() => !procesando && handleContratar("PRO")} disabled={!!procesando} className="mt-6 w-full rounded-md bg-[#2596be] px-3 py-2 text-sm font-semibold text-white shadow hover:bg-[#1e7fa3] disabled:opacity-60 flex items-center justify-center gap-2">
                {procesando === "PRO" && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
                {tx("Contratar PRO")}
              </button>
            </div>

            {/* PREMIUM */}
            <div className="relative mx-auto w-full max-w-[17.5rem] rounded-2xl bg-white p-5 sm:p-6 lg:mx-0 ring-1 ring-gray-200">
              <h3 className="text-base font-semibold text-gray-900">{tx("Premium")}</h3>
              <p className="mt-3 flex items-baseline gap-x-2">
                <span className="text-3xl font-semibold tracking-tight text-gray-900">{esAnual ? "149,99 €" : "19,99 €"}</span>
                <span className="text-base text-gray-500">{esAnual ? tx("/año") : tx("/mes")}</span>
              </p>
              <ul className="mt-6 space-y-2 text-[13px] leading-5 text-gray-800">
                {FEATURES.PREMIUM.map((text, i) => (
                  <li key={i} className="flex gap-x-3"><IconoCheck />{tx(text)}</li>
                ))}
              </ul>
              <button onClick={() => !procesando && handleContratar("PREMIUM")} disabled={!!procesando} className="mt-6 w-full rounded-md bg-[#2596be] px-3 py-2 text-sm font-semibold text-white shadow hover:bg-[#1e7fa3] disabled:opacity-60 flex items-center justify-center gap-2">
                {procesando === "PREMIUM" && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
                {tx("Contratar PREMIUM")}
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
