import equipo from "assets/equipo.png";

function Conocenos() {
  return (
    <div className="bg-emerald-50 min-h-screen">

      {/* Intro — texto + imagen */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 mb-4">
              IES Luis Vélez de Guevara · Écija
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Conoce JobFree</h1>
            <p className="text-gray-600 text-base leading-relaxed max-w-xl">
              Somos <strong>Pablo Román</strong> y <strong>Daniel Nevado</strong>, estudiantes del IES Luis Vélez de Guevara.
              JobFree es un proyecto creado para conectar clientes con profesionales del hogar de forma rápida y segura.
            </p>
          </div>

          <div className="flex-1 flex justify-center">
            <img
              src={equipo}
              alt="Pablo y Daniel, equipo JobFree"
              className="w-full max-w-sm drop-shadow-md"
            />
          </div>

        </div>
      </section>

      {/* Misión y Visión */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-emerald-600 mb-2">Nuestra misión</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Facilitar la contratación de servicios a domicilio de forma rápida, transparente
              y segura, poniendo en contacto a clientes con profesionales de confianza.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-emerald-600 mb-2">Nuestra visión</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Convertirnos en la plataforma de referencia para la contratación de servicios
              del hogar en España, con la mejor experiencia para clientes y profesionales.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Conocenos;
