import { createContext, useContext, useState, useEffect } from "react";
import { login as loginAPI, logout as logoutAPI, getMe, registrarCliente, registrarProfesional, refreshToken } from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // La cookie httpOnly se envía automáticamente — no hace falta leer localStorage
    getMe()
      .then(setUsuario)
      .catch(() => setUsuario(null))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    // Cuando apiFetch recibe un 401 en endpoints protegidos (sesión expirada),
    // emite este evento para cerrar la sesión y redirigir al login.
    function handleSesionExpirada() {
      setUsuario(null);
      window.location.href = "/login";
    }
    window.addEventListener("auth:sesion-expirada", handleSesionExpirada);
    return () => window.removeEventListener("auth:sesion-expirada", handleSesionExpirada);
  }, []);

  // Renueva el token silenciosamente cada 90 min mientras el usuario está activo.
  // El JWT dura 2h, así que el refresco se hace antes de que expire.
  useEffect(() => {
    if (!usuario?.id) return;
    const MS_90_MIN = 90 * 60 * 1000;
    const id = setInterval(async () => {
      const ok = await refreshToken();
      if (!ok) {
        setUsuario(null);
        window.location.href = "/login";
      }
    }, MS_90_MIN);
    return () => clearInterval(id);
  }, [usuario?.id]);

  async function iniciarSesion(email, password) {
    const respuesta = await loginAPI(email, password);
    setUsuario(respuesta.usuario);
    return respuesta.usuario;
  }

  async function registrar(datos, esProfesional) {
    if (esProfesional) {
      await registrarProfesional(datos);
    } else {
      await registrarCliente(datos);
    }
    try {
      return await iniciarSesion(datos.email, datos.password);
    } catch {
      // Registro exitoso pero el auto-login falló; comunicarlo al llamador.
      const err = new Error("Cuenta creada. Inicia sesión con tus credenciales.");
      err.registroExitoso = true;
      err.email = datos.email;
      throw err;
    }
  }

  async function completarLoginOAuth() {
    const datosUsuario = await getMe();
    setUsuario(datosUsuario);
    return datosUsuario;
  }

  async function cargarUsuarioActual() {
    const datosUsuario = await getMe();
    setUsuario(datosUsuario);
    return datosUsuario;
  }

  async function cerrarSesion() {
    await logoutAPI(); // el backend limpia la cookie
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, iniciarSesion, completarLoginOAuth, cargarUsuarioActual, registrar, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
