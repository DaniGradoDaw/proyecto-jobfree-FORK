import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import logo from "assets/images/logo.png";
import SimpleFooter from "components/layout/public/SimpleFooter";
import { useLanguage } from "context/LanguageContext";
import { solicitarResetPassword } from "api/auth";

function OlvidoPassword() {
  const { tx } = useLanguage();

  const [email, setEmail] = useState("");
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      await solicitarResetPassword(email);
      setEnviado(true);
    } catch (err) {
      if (err.message?.toLowerCase().includes("intentos")) {
        setError(err.message);
      } else {
        setEnviado(true);
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-green-500 to-emerald-400">

      <div className="w-full px-4 pt-6">
        <Link to="/login" className="flex items-center gap-2 text-white/90 hover:text-white transition text-sm">
          <ArrowLeftIcon className="h-4 w-4" />
          {tx("Volver atrás")}
        </Link>
      </div>

      <div className="flex flex-1 justify-center items-center py-10">
        <div className="bg-gray-50 text-gray-500 max-w-md w-full mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow mb-10">

          <div className="flex flex-col items-center mb-6">
            <img src={logo} alt="JobFree" className="h-24" />
          </div>

          <h2 className="text-2xl font-semibold mb-2 text-center text-gray-900">
            {tx("Olvidaste tu contraseña?")}
          </h2>
          <p className="text-center text-gray-500 mb-6 text-sm">
            {tx("Introduce tu email y te enviaremos un enlace para crear una nueva.")}
          </p>

          {enviado ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-4 text-sm text-center">
              <p>{tx("Si ese correo está registrado, recibirás un enlace en breve. Revisa también tu carpeta de spam.")}</p>
              <Link
                to="/login"
                className="mt-4 inline-block text-blue-600 hover:underline text-sm">
                {tx("Volver al inicio de sesión")}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {tx("Email")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="jobfree@gmail.com"
                  className="w-full bg-white border border-gray-300 rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={cargando}
                className="w-full mb-4 bg-blue-600 py-2.5 rounded-full text-white hover:bg-blue-700 disabled:opacity-60">
                {cargando ? tx("Enviando...") : tx("Enviar enlace")}
              </button>

              <p className="text-center">
                <Link to="/login" className="text-blue-600 text-sm">
                  {tx("Volver al inicio de sesión")}
                </Link>
              </p>
            </form>
          )}

        </div>
      </div>

      <SimpleFooter />
    </div>
  );
}

export default OlvidoPassword;
