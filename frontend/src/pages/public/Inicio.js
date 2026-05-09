import { useLanguage } from "context/LanguageContext";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import heroImage from "assets/images/hero-profesionales.png";

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
            <div className="aspect-video bg-gray-900">
              {/* Aquí irá el vídeo - pasame el enlace y lo integro */}
              <div className="w-full h-full flex items-center justify-center text-white">
                <p className="text-center text-gray-400">El vídeo será cargado aquí</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Inicio;
