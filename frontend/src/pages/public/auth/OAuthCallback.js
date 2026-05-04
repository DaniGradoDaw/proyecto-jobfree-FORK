import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "context/AuthContext";

function OAuthCallback() {

  const [params] = useSearchParams();
  const { completarLoginOAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (params.get("error")) {
      navigate("/login?error=oauth");
      return;
    }

    // La cookie httpOnly ya fue seteada por el backend — solo llamamos a getMe()
    completarLoginOAuth()
      .then(usuario => {
        const rol = usuario.rol?.toUpperCase();
        navigate(rol === "PROFESIONAL" ? "/dashboard/profesional" : "/dashboard/cliente");
      })
      .catch(() => navigate("/login?error=oauth"));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-green-500 to-emerald-400">
      <div className="bg-white rounded-xl p-8 shadow text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600 text-sm">Completando el acceso...</p>
      </div>
    </div>
  );
}

export default OAuthCallback;
