import { useLanguage } from "context/LanguageContext";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import heroImage from "assets/images/hero-profesionales.png";

const RESENAS = [
  { nombre: "Carlos M.",     servicio: "Fontanería",       estrellas: 5, comentario: "Llegó puntual y resolvió la avería en un momento. Sin líos, sin sorpresas en el precio. Repetiré seguro." },
  { nombre: "Paco R.",       servicio: "Reformas",         estrellas: 5, comentario: "Macho, no veas qué bien quedó el cuarto de baño. El chaval sabía mu bien lo que hacía, lo recomiendo a tó el mundo." },
  { nombre: "Laura G.",      servicio: "Electricidad",     estrellas: 4, comentario: "La electricista fue muy profesional, nos explicó cada paso y el precio fue más que razonable. Muy contenta." },
  { nombre: "Ana T.",        servicio: "Limpieza",         estrellas: 5, comentario: "Contraté una limpieza del hogar y quedó impecable. Mejor de lo que esperaba, una maravilla." },
  { nombre: "Mari Carmen P.", servicio: "Pintura",         estrellas: 5, comentario: "Qué maravilla, tía. Le contraté pa que pintaran el salón y quedó de lujo. La chica que vino era un sol." },
  { nombre: "David S.",      servicio: "Mudanzas",         estrellas: 4, comentario: "Muy buena experiencia, rápido y sin complicaciones. El equipo muy amable y cuidadoso con los muebles." },
  { nombre: "Roberto F.",    servicio: "Cerrajería",       estrellas: 5, comentario: "Me quedé sin llaves a las 10 de la noche y el cerrajero llegó en menos de media hora. Me salvó la noche." },
  { nombre: "Elena P.",      servicio: "Jardinería",       estrellas: 5, comentario: "El jardín ha quedado precioso, mejor que nunca. El jardinero muy atento y con muy buen ojo para el diseño." },
  { nombre: "Antonio J.",    servicio: "Fontanería",       estrellas: 4, comentario: "Pos mira, tenía mis dudas pero el fontanero que me mandaron era un fenómeno. Arregló lo que otros no pudieron." },
  { nombre: "Isabel M.",     servicio: "Aire acondicionado", estrellas: 5, comentario: "Muy contenta con la plataforma. Fácil de usar y el técnico muy cualificado. En dos horas lo tenía funcionando." },
  { nombre: "Javi L.",       servicio: "Electricidad",     estrellas: 5, comentario: "Rápido, limpio y sin darte el coñazo con presupuestos inflados. Exactamente lo que buscaba." },
  { nombre: "Rocío S.",      servicio: "Limpieza",         estrellas: 5, comentario: "Oleee, qué servicio más majo. Llegaron dos chicas y dejaron la casa como los chorros del oro. Repetiré." },
];

const RADIUS = 55;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const HOVER_DURATION = 2000; // ms para completar el círculo

function Inicio() {
  const { tx } = useLanguage();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  function startAnimation() {
    if (animFrameRef.current) return;
    startTimeRef.current = Date.now();
    function animate() {
      const p = Math.min((Date.now() - startTimeRef.current) / HOVER_DURATION, 1);
      setProgress(p);
      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        animFrameRef.current = null;
        setProgress(0);
        setShowVideoModal(true);
      }
    }
    animFrameRef.current = requestAnimationFrame(animate);
  }

  function stopAnimation() {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setProgress(0);
  }

  useEffect(() => () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); }, []);

  return (
    <>
      <section className="bg-emerald-50">
        <div className="max-w-6xl mx-auto px-6 py-12 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(340px,580px)] lg:items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
                {tx("Soluciones para tu día a día,")} <span className="text-emerald-500">{tx("en un solo lugar.")}</span>
              </h1>
              <p className="mt-4 text-lg text-gray-800 leading-relaxed max-w-xl mx-auto md:mx-0">
                {tx("Contrata servicios a domicilio de forma rápida y sencilla en una sola plataforma para tu hogar.")}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center md:justify-start items-center">
                <Link
                  to="/registro"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-500 hover:bg-blue-600 hover:shadow-lg hover:scale-105 px-6 py-2 text-base font-semibold text-white transition-all duration-200 active:scale-95"
                >
                  {tx("Empezar aquí")}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>

                <button
                  onMouseEnter={startAnimation}
                  onMouseLeave={stopAnimation}
                  onClick={() => { stopAnimation(); setShowVideoModal(true); }}
                  className="relative w-16 h-16 flex items-center justify-center hover:scale-110 transition-transform duration-200"
                >
                  <svg className="w-16 h-16 absolute" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="55" fill="none" stroke="#f3a461" strokeWidth="3" opacity="0.3" />
                    <circle
                      cx="60"
                      cy="60"
                      r="55"
                      fill="none"
                      stroke="#f3a461"
                      strokeWidth="3"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px" }}
                    />
                  </svg>
                  <div className="relative z-10 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
                    <svg className="w-6 h-6 text-orange-400 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </button>

                <span className="text-gray-700 text-sm">{tx("Cómo funciona JobFree")}</span>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[520px] lg:ml-auto">
              <div className="overflow-hidden rounded-[2.5rem] shadow-[0_24px_60px_-24px_rgba(16,185,129,0.35)]">
                <img
                  src={heroImage}
                  alt="Profesionales realizando servicios en el hogar"
                  className="block h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900">{tx("Lo que dicen nuestros clientes")}</h2>
          <p className="mt-2 text-gray-500">{tx("Opiniones reales de personas que contrataron a través de JobFree")}</p>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex gap-6 animate-marquee" style={{ width: "max-content" }}>
            {[...RESENAS, ...RESENAS].map((r, i) => (
              <div key={i} className="w-72 flex-shrink-0 bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} className={`w-4 h-4 ${s < r.estrellas ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{r.comentario}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm flex-shrink-0">
                    {r.nombre.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{r.nombre}</p>
                    <p className="text-xs text-gray-400">{r.servicio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showVideoModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-2xl bg-black rounded-xl overflow-hidden">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="aspect-video bg-black">
              <video
                className="w-full h-full"
                src="/video.mp4"
                controls
                autoPlay
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Inicio;
