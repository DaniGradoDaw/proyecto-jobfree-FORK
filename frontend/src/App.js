import './App.css';
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { ChatSocketProvider } from "./context/ChatSocketContext";
import { ThemeProvider } from "./context/ThemeContext";

// Componente que protege rutas privadas (redirige al login si no hay sesión)
import RutaProtegida from "./components/RutaProtegida";

import Layout from "components/layout/public/Layout";

// PUBLIC
import Inicio from "pages/public/Inicio";
import Servicios from "pages/public/servicios/Servicios";
import ServiciosSubcategoria from "pages/public/servicios/ServiciosSubcategoria";
import Profesionales from "pages/public/profesionales/Profesionales";
import PerfilProfesional from "pages/public/profesionales/PerfilProfesional";
import Conocenos from "pages/public/Conocenos";
import ParaProfesionales from "pages/public/ParaProfesionales";
import Contacto from "pages/public/Contacto";
import Terminos from "pages/public/Terminos";
import Login from "pages/public/auth/Login";
import Registro from "pages/public/auth/Registro";
import OAuthCallback from "pages/public/auth/OAuthCallback";
import OlvidoPassword from "pages/public/auth/OlvidoPassword";
import ResetearPassword from "pages/public/auth/ResetearPassword";

// DASHBOARD
import ClienteDashboard from "./pages/dashboard/cliente/ClienteDashboard";
import PanelCliente from "./pages/dashboard/cliente/PanelCliente";
import MisFavoritos from "./pages/dashboard/cliente/MisFavoritos";
import MisReservas from "./pages/dashboard/cliente/MisReservas";
import MisResenas from "./pages/dashboard/cliente/MisResenas";
import Facturas from "./pages/dashboard/cliente/Facturas";
import ValorarReserva from "./pages/dashboard/cliente/ValorarReserva";
import PagarReserva from "./pages/dashboard/cliente/PagarReserva";
import ProfesionalDashboard from "./pages/dashboard/profesional/ProfesionalDashboard";
import ResenasRecibidas from "./pages/dashboard/profesional/ResenasRecibidas";
import PlanProfesional from "./pages/dashboard/profesional/PlanProfesional";
import MisSolicitudes from "./pages/dashboard/profesional/MisSolicitudes";
import MisServicios from "./pages/dashboard/profesional/MisServicios";
import CalendarioProfesional from "./pages/dashboard/profesional/CalendarioProfesional";
import FacturasProfesional from "./pages/dashboard/profesional/FacturasProfesional";
import Configuracion from "./pages/dashboard/Configuracion";
import ChatReserva from "./pages/dashboard/mensajes/ChatReserva";
import MensajesLayout, { PlaceholderChat } from "./pages/dashboard/mensajes/MensajesLayout";

// ADMIN
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import PanelAdmin from "./pages/dashboard/admin/PanelAdmin";
import UsuariosAdmin from "./pages/dashboard/admin/UsuariosAdmin";
import ReservasAdmin from "./pages/dashboard/admin/ReservasAdmin";
import PagosAdmin from "./pages/dashboard/admin/PagosAdmin";
import ServiciosAdmin from "./pages/dashboard/admin/ServiciosAdmin";
import ValoracionesAdmin from "./pages/dashboard/admin/ValoracionesAdmin";
import ReportesAdmin from "./pages/dashboard/admin/ReportesAdmin";
import CategoriasAdmin from "./pages/dashboard/admin/CategoriasAdmin";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false, errorMsg: "", componentStack: "" };
  }

  static getDerivedStateFromError(error) {
    return { error: true, errorMsg: String(error) };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info?.componentStack);
    this.setState({ componentStack: info?.componentStack || "" });
  }

  render() {
    if (this.state.error) {
      const isDev = process.env.NODE_ENV === "development";
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6" style={{fontFamily:"monospace"}}>
          <p className="text-lg font-semibold text-red-700">
            {isDev ? `Error: ${this.state.errorMsg}` : "Ha ocurrido un error inesperado."}
          </p>
          {isDev && (
            <pre className="bg-gray-100 border rounded p-4 text-xs text-left max-w-2xl w-full overflow-auto max-h-64">
              {this.state.componentStack}
            </pre>
          )}
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            onClick={() => { this.setState({ error: false, errorMsg: "", componentStack: "" }); window.location.href = "/"; }}
          >
            Volver al inicio
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
    {/* LanguageProvider gestiona el idioma de la app */}
    <LanguageProvider>
      <AuthProvider>
        <ChatSocketProvider>
        <ThemeProvider>
        <BrowserRouter>
          <Routes>

            {/* ── PÁGINAS PÚBLICAS CON LAYOUT (navbar + footer) ── */}
            <Route element={<Layout />}>
              <Route path="/" element={<Inicio />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/servicios/subcategoria/:id" element={<ServiciosSubcategoria />} />
              <Route path="/profesionales/:id" element={<Profesionales />} />
              <Route path="/perfil-profesional/:id" element={<PerfilProfesional />} />
              <Route path="/conocenos" element={<Conocenos />} />
              <Route path="/para-profesionales" element={<ParaProfesionales />} />
              <Route path="/contacto" element={<Contacto />} />
            </Route>

            {/* ── PÁGINAS LEGALES (sin navbar ni footer) ── */}
            <Route path="/terminos" element={<Terminos />} />

            {/* ── AUTENTICACIÓN (sin layout) ── */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/oauth2/callback" element={<OAuthCallback />} />
            <Route path="/recuperar-password" element={<OlvidoPassword />} />
            <Route path="/reset-password" element={<ResetearPassword />} />

            {/* ── DASHBOARD CLIENTE ──
                RutaProtegida verifica que haya sesión activa con rol "Cliente".
                ClienteDashboard tiene un <Outlet /> donde se renderizan las subrutas internas.
                Las subrutas (reservas, mensajes...) se añadirán aquí cuando existan las páginas. */}
            <Route
              path="/dashboard/cliente"
              element={
                <RutaProtegida rolRequerido="CLIENTE">
                  <ClienteDashboard />
                </RutaProtegida>
              }
            >
              {/* Ruta raíz del dashboard: mensaje de bienvenida mientras no hay páginas internas */}
              <Route
                index
                element={<PanelCliente />}
              />
              <Route path="favoritos" element={<MisFavoritos />} />
              <Route path="reservas" element={<MisReservas />} />
              <Route path="resenas" element={<MisResenas />} />
              <Route path="facturas" element={<Facturas />} />
              <Route path="valorar/:reservaId" element={<ValorarReserva />} />
              <Route path="pagar/:reservaId" element={<PagarReserva />} />
              <Route path="mensajes" element={<MensajesLayout />}>
                <Route index element={<PlaceholderChat />} />
                <Route path=":conversacionId" element={<ChatReserva />} />
                <Route path="reserva/:reservaId" element={<ChatReserva />} />
              </Route>
              <Route path="buscar/servicios" element={<Servicios />} />
              <Route path="buscar/servicios/subcategoria/:id" element={<ServiciosSubcategoria />} />
              <Route path="buscar/profesionales/:id" element={<Profesionales />} />
              <Route path="perfil-profesional/:id" element={<PerfilProfesional />} />
              <Route path="configuracion" element={<Configuracion />} />
            </Route>

            {/* ── DASHBOARD PROFESIONAL ──
                Igual que el de cliente pero con rol "Profesional". */}
            <Route
              path="/dashboard/profesional"
              element={
                <RutaProtegida rolRequerido="PROFESIONAL">
                  <ProfesionalDashboard />
                </RutaProtegida>
              }
            >
              <Route
                index
                element={
                  <p className="text-gray-400 mt-6 text-sm">
                    Bienvenido a tu panel profesional.
                  </p>
                }
              />
              <Route path="solicitudes" element={<MisSolicitudes />} />
              <Route path="calendario" element={<CalendarioProfesional />} />
              {/* Página para publicar y gestionar servicios */}
              <Route path="servicios" element={<MisServicios />} />
              <Route path="resenas" element={<ResenasRecibidas />} />
              <Route path="facturas" element={<FacturasProfesional />} />
              <Route path="plan" element={<PlanProfesional />} />
              <Route path="mensajes" element={<MensajesLayout />}>
                <Route index element={<PlaceholderChat />} />
                <Route path=":conversacionId" element={<ChatReserva />} />
                <Route path="reserva/:reservaId" element={<ChatReserva />} />
              </Route>
              <Route path="buscar/servicios" element={<Servicios />} />
              <Route path="buscar/servicios/subcategoria/:id" element={<ServiciosSubcategoria />} />
              <Route path="buscar/profesionales/:id" element={<Profesionales />} />
              <Route path="perfil-profesional/:id" element={<PerfilProfesional />} />
              <Route path="configuracion" element={<Configuracion />} />
            </Route>

            {/* ── DASHBOARD ADMIN ── */}
            <Route
              path="/dashboard/admin"
              element={
                <RutaProtegida rolRequerido="ADMIN">
                  <AdminDashboard />
                </RutaProtegida>
              }
            >
              <Route index element={<PanelAdmin />} />
              <Route path="usuarios" element={<UsuariosAdmin />} />
              <Route path="reservas" element={<ReservasAdmin />} />
              <Route path="pagos" element={<PagosAdmin />} />
              <Route path="servicios" element={<ServiciosAdmin />} />
              <Route path="valoraciones" element={<ValoracionesAdmin />} />
              <Route path="reportes" element={<ReportesAdmin />} />
              <Route path="categorias" element={<CategoriasAdmin />} />
            </Route>

          </Routes>
        </BrowserRouter>
        </ThemeProvider>
        </ChatSocketProvider>
      </AuthProvider>
    </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
