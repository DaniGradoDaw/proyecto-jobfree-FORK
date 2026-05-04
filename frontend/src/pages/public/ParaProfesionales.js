import { useState } from "react";
import PlanSuscripcion from "components/cards/PlanSuscripcion";

import { useLanguage } from "context/LanguageContext";

function ParaProfesionales() {

  const [esAnual, setEsAnual] = useState(false);
  const { tx } = useLanguage();

  return (
    <div className="relative isolate bg-[#F2FFF3] px-6 py-12 sm:py-14 lg:px-8">

      {/* título */}
      <div className="mx-auto max-w-4xl text-center">
        <p className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
          {tx("Unete a JobFree como profesional")}
        </p>
      </div>

      {/* descripción */}
      <p className="mx-auto mt-6 max-w-2xl text-center text-base sm:text-lg font-medium text-gray-600 leading-relaxed">
        {tx("Si ofreces servicios, JobFree te ayuda a conseguir mas clientes, mejorar tu visibilidad e incrementar tus ingresos")}
      </p>

      {/* switch mensual/anual */}
      <div className="mt-8 flex justify-center">
        <div className="flex bg-zinc-300 p-1.5 rounded-full">

          <button
            onClick={() => setEsAnual(false)}
            className={`px-4 py-2 rounded-full text-xs transition ${!esAnual ? "bg-[#2596be] text-white" : "text-gray-600"}`}>
            {tx("Mensual")}
          </button>

          <button
            onClick={() => setEsAnual(true)}
            className={`px-4 py-2 rounded-full text-xs transition ${esAnual ? "bg-[#2596be] text-white" : "text-gray-600"}`}>
            {tx("Anual")}
          </button>

        </div>

      </div>

      {/* aviso descuento */}
      <div className="mt-4 text-center">
        <p className="text-sm font-semibold text-[#2596be]">
          {tx("Ahorra un 15% pagando anualmente")}
        </p>
      </div>

      <PlanSuscripcion esAnual={esAnual} />
    </div>
  );
}

export default ParaProfesionales;
