import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

import logo from "assets/images/logo.png";
import SimpleFooter from "components/layout/public/SimpleFooter";
import { useLanguage } from "context/LanguageContext";
import { resetearPassword } from "api/auth";

function ResetearPassword() {
  const { tx } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (nuevaPassword !== confirmarPassword) {
      setError(tx("Las contraseñas no coinciden."));
      return;
    }

    setCargando(true);

    try {
      await resetearPassword(token, nuevaPassword);
      setExito(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("caducado") || msg.includes("expired")) {
        setError(tx("El enlace ha caducado. Solicita uno nuevo."));
      } else {
        setError(tx("El enlace no es válido o ya fue utilizado."));
      }
    } finally {
      setCargando(false);
    }
  }

  if (!token) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-green-500 to-emerald-400">
        <div className="flex flex-1 justify-center items-center">
          <div className="bg-gray-50 max-w-md w-full mx-4 p-8 rounded-xl shadow text-center">
            <p className="text-red-500 mb-4">{tx("El enlace no es válido o ya fue utilizado.")}</p>
            <Link to="/recuperar-password" className="text-blue-600 text-sm hover:underline">
              {tx("Solicitar nuevo enlace")}
            </Link>
          </div>
        </div>
      </div>
    );
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
            {tx("Crea una nueva contraseña")}
          </h2>
          <p className="text-center text-gray-500 mb-6 text-sm">
            {tx("Introduce tu nueva contraseña. Debe tener al menos 8 caracteres.")}
          </p>

          {exito ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-4 text-sm text-center">
              <p>{tx("Contraseña actualizada correctamente. Ya puedes iniciar sesión.")}</p>
              <p className="text-xs text-gray-400 mt-2">{tx("Redirigiendo al inicio de sesión...")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {tx("Nueva contraseña")}
                </label>
                <div className="relative">
                  <input
                    type={mostrarNueva ? "text" : "password"}
                    value={nuevaPassword}
                    onChange={e => setNuevaPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full bg-white border border-gray-300 rounded-full py-2.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarNueva(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {mostrarNueva ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {tx("Confirmar contraseña")}
                </label>
                <div className="relative">
                  <input
                    type={mostrarConfirmar ? "text" : "password"}
                    value={confirmarPassword}
                    onChange={e => setConfirmarPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full bg-white border border-gray-300 rounded-full py-2.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarConfirmar(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {mostrarConfirmar ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-blue-600 py-2.5 rounded-full text-white hover:bg-blue-700 disabled:opacity-60">
                {cargando ? tx("Guardando...") : tx("Guardar contraseña")}
              </button>

            </form>
          )}

        </div>
      </div>

      <SimpleFooter />
    </div>
  );
}

export default ResetearPassword;
