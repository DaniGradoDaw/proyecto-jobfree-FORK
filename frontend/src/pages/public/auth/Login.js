import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

import logo from "assets/images/logo.png";
import SimpleFooter from "components/layout/public/SimpleFooter";
import API_URL from "api/config";

import { useLanguage } from "context/LanguageContext";

import { useAuth } from "context/AuthContext";

function Login() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { usuario, iniciarSesion } = useAuth();
  const { tx } = useLanguage();

  // Guardia: si ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (usuario) {
      const destino = usuario.rol?.toUpperCase() === "PROFESIONAL"
        ? "/dashboard/profesional"
        : "/dashboard/cliente";
      navigate(destino, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  const errorDeUrl = searchParams.get("error") === "cuenta_existente"
    ? tx("Ya tienes una cuenta con ese correo. Inicia sesión normalmente.")
    : null;

  const registradoExitoso = searchParams.get("registrado") === "true";

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setCargando(true);

    try {
      const usuario = await iniciarSesion(email, password);

      const pendingRaw = sessionStorage.getItem("pendingAction");
      if (pendingRaw) {
        sessionStorage.removeItem("pendingAction");
        try {
          const pending = JSON.parse(pendingRaw);
          if (pending.tipo === "contratar") {
            const destino = usuario.rol?.toUpperCase() === "PROFESIONAL"
              ? "/dashboard/profesional"
              : "/dashboard/cliente/reservas";
            navigate(destino, { replace: true, state: { pendingAction: pending } });
            return;
          }
          if (pending.tipo === "contactar") {
            navigate(pending.redirectTo || "/", { replace: true, state: { pendingAction: pending } });
            return;
          }
        } catch { /* JSON corrupto, ignorar */ }
      }

      if (usuario.rol?.toUpperCase() === "PROFESIONAL") {
        navigate("/dashboard/profesional", { replace: true });
      } else {
        navigate("/dashboard/cliente", { replace: true });
      }

    } catch (err) {
      setError(err.message || tx("Credenciales incorrectas. Intentalo de nuevo."));
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-green-500 to-emerald-400">

      <div className="w-full px-4 pt-6">
        <Link to="/" className="flex items-center gap-2 text-white/90 hover:text-white transition text-sm">
          <ArrowLeftIcon className="h-4 w-4" />
          {tx("Volver atras")}
        </Link>
      </div>

      <div className="flex flex-1 justify-center items-center py-10">
        <div className="bg-gray-50 text-gray-500 max-w-md w-full mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow mb-10">

          <div className="flex flex-col items-center mb-6">
            <img src={logo} alt="JobFree" className="h-24" />
          </div>

          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
            {tx("Accede a tu cuenta")}
          </h2>

          <div className="flex items-center gap-3 my-4">
            <hr className="flex-1 border-gray-400/50" />
          </div>

          <form onSubmit={handleSubmit}>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {tx("Email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="jobfree@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {tx("Contraseña")}
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={mostrarPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-full py-2.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={mostrarPassword ? tx("Ocultar contraseña") : tx("Mostrar contraseña")}
                >
                  {mostrarPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <label htmlFor="recordar" className="flex items-center gap-2 py-2">
              <input id="recordar" name="recordar" type="checkbox" className="accent-blue-600" />
              {tx("Recordar datos")}
            </label>

            {registradoExitoso && (
              <p className="text-emerald-700 text-sm mb-3 text-center bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                {tx("¡Cuenta creada! Inicia sesión con tus credenciales.")}
              </p>
            )}

            {errorDeUrl && (
              <p className="text-red-600 text-sm mb-3 text-center bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {errorDeUrl}
              </p>
            )}

            {error && (
              <p className="text-red-500 text-sm mb-3 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full mb-3 bg-blue-600 py-2.5 rounded-full text-white hover:bg-blue-700 disabled:opacity-60">
              {cargando ? tx("Cargando...") : tx("Entrar")}
            </button>

          </form>

          <div className="text-center text-sm">
            <Link to="/recuperar-password" className="text-blue-600">
              {tx("Has olvidado tu contraseña?")}
            </Link>
          </div>

          <p className="text-center mt-2">
            {tx("No estas registrado?")}{" "}
            <Link to="/registro" className="text-blue-600">
              {tx("Darse de alta")}
            </Link>
          </p>

          <div className="flex items-center gap-3 my-4">
            <hr className="flex-1 border-gray-400/50" />
            <span>{tx("o")}</span>
            <hr className="flex-1 border-gray-400/50" />
          </div>

          <a
            href={`${API_URL}/oauth2/authorization/google`}
            className="w-full flex items-center gap-2 justify-center my-3 bg-white border border-gray-300 py-2.5 rounded-full text-gray-800 hover:bg-gray-100 transition">
            <img className="h-4 w-4" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png" alt="google" />
            {tx("Iniciar sesión con Google")}
          </a>

          <a
            href={`${API_URL}/oauth2/authorization/microsoft`}
            className="w-full flex items-center gap-2 justify-center my-3 bg-white border border-gray-300 py-2.5 rounded-full text-gray-800 hover:bg-gray-100 transition">
            <img src="https://img.icons8.com/color/48/microsoft.png" className="h-5" alt="microsoft" />
            {tx("Iniciar sesión con Microsoft")}
          </a>

        </div>
      </div>

      <SimpleFooter />
    </div>
  );
}

export default Login;
