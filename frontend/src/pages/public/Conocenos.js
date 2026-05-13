import { useState } from "react";

function Conocenos() {
  const [form, setForm] = useState({
    nombre: "", apellidos: "", email: "", telefono: "",
    motivo: "", consulta: "", privacidad: false,
  });
  const [enviado, setEnviado] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setEnviado(true);
  }

  return (
    <div className="bg-emerald-50 min-h-screen">

      {/* Quiénes somos */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Conoce JobFree</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
          Somos Pablo Román y Daniel Nevado, estudiantes del IES Luis Vélez de Guevara.
          JobFree es un proyecto creado para conectar clientes con profesionales
          del hogar de forma rápida y segura.
        </p>
        <div className="grid sm:grid-cols-2 gap-6 text-left">
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

      {/* Contacto */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900">Contacto</h2>
          <p className="mt-2 text-gray-500">
            Estamos a tu disposición para resolver cualquier duda o consulta.
            <br />¿En qué podemos ayudarte?
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* Formulario */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {enviado ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">¡Mensaje enviado!</h3>
                <p className="text-gray-500 text-sm">Nos pondremos en contacto contigo lo antes posible.</p>
                <button
                  onClick={() => { setEnviado(false); setForm({ nombre: "", apellidos: "", email: "", telefono: "", motivo: "", consulta: "", privacidad: false }); }}
                  className="mt-6 text-emerald-600 text-sm font-medium hover:underline"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
                    <input
                      type="text" name="nombre" value={form.nombre} onChange={handleChange} required
                      placeholder="Nombre"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Apellidos</label>
                    <input
                      type="text" name="apellidos" value={form.apellidos} onChange={handleChange} required
                      placeholder="Apellidos"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <input
                    type="email" name="email" value={form.email} onChange={handleChange} required
                    placeholder="Email"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Teléfono</label>
                  <input
                    type="tel" name="telefono" value={form.telefono} onChange={handleChange}
                    placeholder="Teléfono"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Motivo de contacto</label>
                  <select
                    name="motivo" value={form.motivo} onChange={handleChange} required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <option value="">Motivo de contacto</option>
                    <option value="consulta">Consulta general</option>
                    <option value="problema">Problema técnico</option>
                    <option value="facturacion">Facturación</option>
                    <option value="profesional">Quiero ser profesional</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tu consulta</label>
                  <textarea
                    name="consulta" value={form.consulta} onChange={handleChange} required rows={4}
                    placeholder="Tu consulta"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                  />
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox" name="privacidad" checked={form.privacidad} onChange={handleChange} required
                    className="mt-0.5 accent-emerald-500"
                  />
                  <span className="text-xs text-gray-500">
                    He leído y estoy de acuerdo con la <span className="text-emerald-600 hover:underline cursor-pointer">Política de Privacidad</span>.
                  </span>
                </label>
                <button
                  type="submit"
                  className="w-auto px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Enviar
                </button>
              </form>
            )}
          </div>

          {/* Tarjeta de contacto */}
          <div className="bg-emerald-600 rounded-2xl shadow-sm p-8 text-white flex flex-col gap-6">
            <h3 className="text-xl font-bold">¿Prefieres contactarnos?</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                soporte@jobfree.com
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +34 600 534 213
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 opacity-80 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Av. Blas Infante, 18<br /><strong>Écija (Sevilla)</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 opacity-80 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>L-V: 9:00 – 18:00<br />Sábados: 10:00 – 14:00</span>
              </li>
            </ul>

            {/* Mapa */}
            <div className="rounded-xl overflow-hidden h-44 w-full">
              <iframe
                title="Ubicación JobFree"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3149.0!2d-5.083!3d37.542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6dd0b0000000001%3A0x0!2sAv.+Blas+Infante%2C+18%2C+41400+%C3%89cija%2C+Sevilla!5e0!3m2!1ses!2ses!4v1"
              />
            </div>

            {/* Redes sociales */}
            <div>
              <p className="text-sm opacity-80 mb-3">Síguenos</p>
              <div className="flex gap-4">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:opacity-70 transition-opacity">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:opacity-70 transition-opacity">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Conocenos;
