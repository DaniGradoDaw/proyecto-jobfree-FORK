import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Envuelve rutas que requieren autenticación.
 *
 * - Si todavía estamos comprobando la sesión (token en localStorage), no renderizamos nada
 *   para evitar que la página destello antes de redirigir.
 * - Si no hay usuario logueado, mandamos al login.
 * - Si hay usuario pero no tiene el rol requerido, lo mandamos a su dashboard correcto.
 * - Si todo está bien, mostramos la página protegida.
 *
 * Uso:
 *   <RutaProtegida rolRequerido="Cliente">
 *     <MiPaginaPrivada />
 *   </RutaProtegida>
 *
 * Si no se pasa rolRequerido, cualquier usuario autenticado puede acceder.
 */
function RutaProtegida({ children, rolRequerido }) {

  const { usuario, cargando } = useAuth();

  // Mientras verificamos si hay sesión guardada, no mostramos nada
  // (evita el parpadeo de redirigir antes de saber si estás logueado)
  if (cargando) return null;

  // Si no hay usuario logueado, mandamos al login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Si se ha especificado un rol concreto y el usuario no lo tiene,
  // lo redirigimos al dashboard que le corresponde según su rol real
  if (rolRequerido && usuario.rol !== rolRequerido) {
    if (usuario.rol === "ADMIN") {
      return <Navigate to="/dashboard/admin" replace />;
    }
    if (usuario.rol === "PROFESIONAL") {
      return <Navigate to="/dashboard/profesional" replace />;
    }
    return <Navigate to="/dashboard/cliente" replace />;
  }

  // Todo correcto → mostramos la página protegida
  return children;
}

export default RutaProtegida;
