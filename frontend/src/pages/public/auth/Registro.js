import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import logo from "assets/images/logo.png";
import SimpleFooter from "components/layout/public/SimpleFooter";

import {
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import { useLanguage } from "context/LanguageContext";

import { useAuth } from "context/AuthContext";
import API_URL from "api/config";
import { iniciarOAuth } from "api/auth";

const PREFIJOS = [
  { codigo: "+34",  bandera: "🇪🇸" },
  { codigo: "+351", bandera: "🇵🇹" },
  { codigo: "+33",  bandera: "🇫🇷" },
  { codigo: "+49",  bandera: "🇩🇪" },
  { codigo: "+44",  bandera: "🇬🇧" },
  { codigo: "+39",  bandera: "🇮🇹" },
  { codigo: "+1",   bandera: "🇺🇸" },
];

function validarPassword(pw) {
  return {
    longitud:  pw.length >= 8,
    numero:    /\d/.test(pw),
    mayuscula: /[A-Z]/.test(pw),
  };
}

function Registro() {

  const navigate = useNavigate();
  const { usuario, registrar } = useAuth();
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

  const [esProfesional, setEsProfesional] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const enviandoRef = useRef(false);

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    prefijo: "+34",
    telefono: "",
    ciudad: "",
    direccion: "",
    password: "",
    confirmarPassword: "",
  });

  const reglas = validarPassword(form.password);
  const passwordValida = reglas.longitud && reglas.numero && reglas.mayuscula;

  const passwordsCoinciden   = form.confirmarPassword.length > 0 && form.password === form.confirmarPassword;
  const passwordsNoCoinciden = form.confirmarPassword.length > 0 && form.password !== form.confirmarPassword;

  const telefonoValido = /^\d{6,15}$/.test(form.telefono);
  const telefonoTocado = form.telefono.length > 0;

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "telefono") {
      setForm({ ...form, telefono: value.replace(/\D/g, "") });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (enviandoRef.current) return;

    if (!passwordValida) {
      setError("La contraseña no cumple los requisitos mínimos");
      return;
    }

    if (form.password !== form.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!telefonoValido) {
      setError("Introduce un número de teléfono válido (6-15 dígitos)");
      return;
    }

    setError("");
    enviandoRef.current = true;
    setCargando(true);

    try {
      const usuario = await registrar(
        {
          nombre:    form.nombre,
          apellidos: form.apellidos,
          email:     form.email,
          telefono:  form.prefijo + form.telefono,
          ciudad:    form.ciudad,
          direccion: form.direccion,
          password:  form.password,
        },
        esProfesional
      );

      if (usuario.rol?.toUpperCase() === "PROFESIONAL") {
        navigate("/dashboard/profesional", { replace: true });
      } else {
        navigate("/dashboard/cliente", { replace: true });
      }

    } catch (err) {
      if (err.registroExitoso) {
        navigate(`/login?email=${encodeURIComponent(err.email)}&registrado=true`, { replace: true });
        return;
      }
      setError(err.message || tx("Error al crear la cuenta. Intentalo de nuevo."));
      enviandoRef.current = false;
      setCargando(false);
    }
  }

  const formInvalido = cargando || passwordsNoCoinciden;

  const [proveedorOAuth, setProveedorOAuth] = useState(null);

  async function confirmarOAuth(rol) {
    await iniciarOAuth(rol);
    window.location.href = `${API_URL}/oauth2/authorization/${proveedorOAuth}`;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-green-500 to-emerald-400">

      <div className="w-full px-4 pt-6">
        <Link to="/" className="flex items-center gap-2 text-white/90 hover:text-white transition text-sm">
          <ArrowLeftIcon className="h-4 w-4" />
          {tx("Volver atras")}
        </Link>
      </div>

      <div className="flex flex-1 justify-center items-center py-8">

        <div className="bg-gray-50 text-gray-500 max-w-md w-full mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow mb-8">

          <div className="flex flex-col items-center mb-3">
            <img src={logo} alt="JobFree" className="h-16" />
          </div>

          <h2 className="text-xl font-semibold mb-3 text-center text-gray-900">
            {tx("Crea tu cuenta")}
          </h2>

          <div className="flex justify-center mb-2">
            <div className="flex bg-gray-200 p-1 rounded-full shadow-inner gap-1">
              <button
                type="button"
                onClick={() => setEsProfesional(false)}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  !esProfesional
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                {tx("Usuario")}
              </button>
              <button
                type="button"
                onClick={() => setEsProfesional(true)}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  esProfesional
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                {tx("Profesional")}
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mb-3">
            {esProfesional
              ? tx("Ofreces servicios en la plataforma")
              : tx("Contratas servicios en la plataforma")}
          </p>

          <hr className="border-gray-300/60 mb-4" />

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label htmlFor="nombre" className="block text-xs font-medium text-gray-700 mb-1">
                  {tx("Nombre")}<span className="text-red-500">*</span>
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-full py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <label htmlFor="apellidos" className="block text-xs font-medium text-gray-700 mb-1">
                  {tx("Apellidos")}<span className="text-red-500">*</span>
                </label>
                <input
                  id="apellidos"
                  name="apellidos"
                  value={form.apellidos}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-full py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                {tx("Email")}<span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-full py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required />
            </div>

            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {tx("Teléfono")}<span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  name="prefijo"
                  value={form.prefijo}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 rounded-full py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0 cursor-pointer">
                  {PREFIJOS.map(p => (
                    <option key={p.codigo} value={p.codigo}>
                      {p.bandera} {p.codigo}
                    </option>
                  ))}
                </select>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  inputMode="numeric"
                  value={form.telefono}
                  onChange={handleChange}
                  className={`w-full bg-white border rounded-full py-2 px-3 text-sm focus:outline-none focus:ring-2 transition-colors ${
                    telefonoTocado && !telefonoValido
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  required />
              </div>
              {telefonoTocado && !telefonoValido && (
                <p className="text-xs text-red-500 mt-1">Solo números, entre 6 y 15 dígitos</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label htmlFor="ciudad" className="block text-xs font-medium text-gray-700 mb-1">
                  {tx("Ciudad")}
                </label>
                <input
                  id="ciudad"
                  name="ciudad"
                  value={form.ciudad}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-full py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="direccion" className="block text-xs font-medium text-gray-700 mb-1">
                  {tx("Dirección")}
                </label>
                <input
                  id="direccion"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-full py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="mb-1">
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                {tx("Contraseña")}<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={mostrarPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-full py-2 px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  aria-label={mostrarPassword ? tx("Ocultar contraseña") : tx("Mostrar contraseña")}>
                  {mostrarPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {form.password.length > 0 && (
              <ul className="flex gap-3 text-xs mb-3 mt-1.5">
                <li className={reglas.longitud ? "text-green-600" : "text-gray-400"}>
                  {reglas.longitud ? "✓" : "○"} {tx("8 caracteres")}
                </li>
                <li className={reglas.numero ? "text-green-600" : "text-gray-400"}>
                  {reglas.numero ? "✓" : "○"} {tx("1 número")}
                </li>
                <li className={reglas.mayuscula ? "text-green-600" : "text-gray-400"}>
                  {reglas.mayuscula ? "✓" : "○"} {tx("1 mayuscula")}
                </li>
              </ul>
            )}

            <div className="mb-4">
              <label htmlFor="confirmarPassword" className="block text-xs font-medium text-gray-700 mb-1">
                {tx("Confirmar contraseña")}<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmarPassword"
                  name="confirmarPassword"
                  type={mostrarConfirmar ? "text" : "password"}
                  value={form.confirmarPassword}
                  onChange={handleChange}
                  className={`w-full bg-white border rounded-full py-2 px-3 pr-10 text-sm focus:outline-none focus:ring-2 transition-colors ${
                    passwordsCoinciden
                      ? "border-green-400 focus:ring-green-400"
                      : passwordsNoCoinciden
                      ? "border-red-400   focus:ring-red-400"
                      : "border-gray-300  focus:ring-blue-500"
                  }`}
                  required />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  aria-label={mostrarConfirmar ? tx("Ocultar contraseña") : tx("Mostrar contraseña")}>
                  {mostrarConfirmar ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
              {passwordsCoinciden && (
                <p className="flex items-center gap-1 text-xs text-green-600 mt-1">
                  <CheckCircleIcon className="w-3.5 h-3.5" /> {tx("Las contraseñas coinciden")}
                </p>
              )}
              {passwordsNoCoinciden && (
                <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                  <XCircleIcon className="w-3.5 h-3.5" /> {tx("Las contraseñas no coinciden")}
                </p>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-xs mb-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={formInvalido}
              className="w-full bg-blue-600 text-white py-2.5 rounded-full hover:bg-blue-700 disabled:opacity-60 transition text-sm font-medium">
              {cargando ? tx("Cargando...") : tx("Crear cuenta")}
            </button>

          </form>

          <div className="flex items-center gap-3 my-4">
            <hr className="flex-1 border-gray-300/60" />
            <span className="text-xs text-gray-400">{tx("o")}</span>
            <hr className="flex-1 border-gray-300/60" />
          </div>

          <button
            type="button"
            onClick={() => setProveedorOAuth("google")}
            className="w-full flex items-center gap-2 justify-center mb-3 bg-white border border-gray-300 py-2.5 rounded-full text-gray-800 hover:bg-gray-100 transition text-sm">
            <img className="h-4 w-4" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png" alt="google" />
            {tx("Iniciar sesión con Google")}
          </button>

          <button
            type="button"
            onClick={() => setProveedorOAuth("microsoft")}
            className="w-full flex items-center gap-2 justify-center bg-white border border-gray-300 py-2.5 rounded-full text-gray-800 hover:bg-gray-100 transition text-sm">
            <img src="https://img.icons8.com/color/48/microsoft.png" className="h-5" alt="microsoft" />
            {tx("Iniciar sesión con Microsoft")}
          </button>

        </div>
      </div>

      {proveedorOAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">

            <div className="flex justify-center mb-4">
              {proveedorOAuth === "google"
                ? <img className="h-8 w-8" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png" alt="Google" />
                : <img className="h-8" src="https://img.icons8.com/color/48/microsoft.png" alt="Microsoft" />
              }
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {tx("Como quieres usar JobFree?")}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {tx("Elige tu rol para continuar con {proveedor}", {
                proveedor: proveedorOAuth === "google" ? "Google" : "Microsoft",
              })}
            </p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => confirmarOAuth("CLIENTE")}
                className="group w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition text-left">
                <span className="text-2xl">🔍</span>
                <span>
                  <span className="block font-semibold text-gray-800 group-hover:text-blue-600">{tx("Soy Cliente")}</span>
                  <span className="block text-xs text-gray-400">{tx("Quiero contratar servicios")}</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => confirmarOAuth("PROFESIONAL")}
                className="group w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition text-left">
                <span className="text-2xl">🛠️</span>
                <span>
                  <span className="block font-semibold text-gray-800 group-hover:text-emerald-600">{tx("Soy Profesional")}</span>
                  <span className="block text-xs text-gray-400">{tx("Quiero ofrecer mis servicios")}</span>
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setProveedorOAuth(null)}
              className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition">
              {tx("Cancelar")}
            </button>
          </div>
        </div>
      )}

      <SimpleFooter />
    </div>
  );
}

export default Registro;
