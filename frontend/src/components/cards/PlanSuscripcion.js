import { useNavigate } from "react-router-dom";
import { useLanguage } from "context/LanguageContext";

function PlanSuscripcion({ esAnual }) {
    const { tx } = useLanguage();
    const navigate = useNavigate();

    const featuresBasico = [
        tx("Perfil visible en la plataforma"),
        tx("Elegir zona de trabajo"),
        tx("Recibir solicitudes de clientes"),
        tx("Recibir valoraciones"),
        tx("Prioridad estándar en búsquedas"),
        tx("Hasta 3 servicios publicados"),
    ];
    const featuresPro = [
        tx("Todo lo incluido en Básico"),
        tx("Servicios ilimitados"),
        tx("Alta prioridad en búsquedas"),
        tx("Perfil destacado con badge verificado"),
        tx("Descuentos en tiendas asociadas"),
        tx("Acceso a estadísticas de visitas"),
        tx("Soporte por email prioritario"),
    ];
    const featuresPremium = [
        tx("Todo en PRO"),
        tx("Máxima visibilidad en la plataforma"),
        tx("Insignia Top Profesional"),
        tx("Más descuentos exclusivos en tiendas"),
        tx("Asesor de éxito personal"),
        tx("Doble de puntos por servicio"),
        tx("Soporte prioritario 24/7"),
    ];

    const limiteBasico = featuresBasico.length - 2;
    const limitePro    = featuresPro.length - 2;

    return (
        <>
            {/* cards */}
            <div className="mx-auto mt-9 grid max-w-sm grid-cols-1 items-center justify-center gap-y-5 sm:mt-10 lg:max-w-3xl lg:grid-cols-3">

                {/* BASICO */}
                <div className="mx-auto w-full max-w-[17.5rem] rounded-2xl bg-white p-5 ring-1 ring-gray-200 sm:p-6 lg:mx-0">
                    <h3 className="text-base font-semibold text-gray-900">
                        {tx("Básico")}
                    </h3>

                    {/* precio */}
                    <p className="mt-3 flex items-baseline gap-x-2">
                        <span className="text-3xl font-semibold tracking-tight text-gray-900">
                            0€
                        </span>
                        <span className="text-base text-gray-500">
                            {esAnual ? tx("/año") : tx("/mes")}
                        </span>
                    </p>

                    <ul className="mt-6 space-y-2 text-[13px] leading-5 text-gray-800">
                        {featuresBasico.map((text, i) => {

                            const ok = i < limiteBasico;

                            return (
                                <li key={i} className="flex gap-x-3">
                                    {/* icono */}
                                    <span className={`grid size-4 shrink-0 place-content-center rounded-full text-white ${ok ? "bg-[#166534]" : "bg-red-300"}`}>
                                        {ok ? (
                                            <svg className="h-2.5 w-2.5" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        ) : (
                                            <svg className="h-2.5 w-2.5" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        )}
                                    </span>

                                    {text}
                                </li>
                            );
                        })}
                    </ul>

                    {/* botón */}
                    <button onClick={() => navigate("/login")} className="mt-6 w-full rounded-md bg-[#2596be] px-3 py-2 text-center text-sm font-semibold text-white shadow hover:bg-[#1e7fa3]">
                        {tx("Empezar gratis")}
                    </button>
                </div>

                {/* PRO */}
                <div className="relative mx-auto w-full max-w-[18.5rem] rounded-2xl bg-white p-5 shadow-xl ring-2 ring-[#2596be] sm:p-6 lg:mx-0 lg:scale-[1.03]">
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#2596be] px-3 py-1 text-xs text-white">
                        {tx("MAS POPULAR")}
                    </span>

                    {/* etiqueta */}
                    <h3 className="text-base font-semibold text-gray-900">
                        {tx("Pro")}
                    </h3>

                    {/* precio */}
                    <p className="mt-3 flex items-baseline gap-x-2">
                        <span className="text-3xl font-semibold tracking-tight text-gray-900">
                            {esAnual ? "99,99 €" : "9,99 €"}
                        </span>
                        <span className="text-base text-gray-800">
                            {esAnual ? tx("/año") : tx("/mes")}
                        </span>
                    </p>

                    <ul className="mt-6 space-y-2 text-[13px] leading-5 text-gray-800">
                        {featuresPro.map((text, i) => {

                            const ok = i < limitePro;

                            return (
                                <li key={i} className="flex gap-x-3">

                                    {/* icono */}
                                    <span
                                        className={`grid size-4 shrink-0 place-content-center rounded-full text-white ${ok ? "bg-[#166534]" : "bg-red-300"
                                            }`}
                                    >
                                        {ok ? (
                                            <svg className="h-2.5 w-2.5" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        ) : (
                                            <svg className="h-2.5 w-2.5" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        )}
                                    </span>

                                    {text}
                                </li>
                            );
                        })}
                    </ul>

                    {/* botón */}
                    <button onClick={() => navigate("/login")} className="mt-6 w-full rounded-md bg-[#2596be] px-3 py-2 text-center text-sm font-semibold text-white shadow hover:bg-[#1e7fa3]">
                        {tx("Contratar PRO")}
                    </button>
                </div>

                {/* PREMIUM */}
                <div className="mx-auto w-full max-w-[17.5rem] rounded-2xl bg-white p-5 ring-1 ring-gray-200 sm:p-6 lg:mx-0">
                    <h3 className="text-base font-semibold text-gray-900">
                        {tx("Premium")}
                    </h3>

                    {/* precio */}
                    <p className="mt-3 flex items-baseline gap-x-2">
                        <span className="text-3xl font-semibold tracking-tight text-gray-900">
                            {esAnual ? "149,99 €" : "19,99 €"}
                        </span>
                        <span className="text-base text-gray-500">
                            {esAnual ? tx("/año") : tx("/mes")}
                        </span>
                    </p>

                    {/* lista */}
                    <ul className="mt-6 space-y-2 text-[13px] leading-5 text-gray-800">
                        {featuresPremium.map((text, i) => (
                            <li key={i} className="flex gap-x-3">

                                {/* icono */}
                                <span className="grid size-4 shrink-0 place-content-center rounded-full bg-[#166534] text-white">
                                    <svg className="h-2.5 w-2.5" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </span>

                                {text}
                            </li>
                        ))}
                    </ul>

                    {/* botón */}
                    <button onClick={() => navigate("/login")} className="mt-6 w-full rounded-md bg-[#2596be] px-3 py-2 text-center text-sm font-semibold text-white shadow hover:bg-[#1e7fa3]">
                        {tx("Contratar PREMIUM")}
                    </button>
                </div>
            </div>
        </>
    );
}

export default PlanSuscripcion;
