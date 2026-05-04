import { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  TrashIcon,
  ArrowPathIcon,
  UserCircleIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { listarUsuarios, eliminarUsuario, cambiarRolUsuario } from "api/admin";
import API_URL from "api/config";
import { useLanguage } from "context/LanguageContext";

const ROL_COLORES = {
  ADMIN:        "bg-violet-100 text-violet-700 ring-violet-200",
  PROFESIONAL:  "bg-sky-100 text-sky-700 ring-sky-200",
  CLIENTE:      "bg-emerald-100 text-emerald-700 ring-emerald-200",
};

const ROLES_LABEL = {
  ADMIN:       "Admin",
  PROFESIONAL: "Profesional",
  CLIENTE:     "Cliente",
};

function BadgeRol({ rol }) {
  const label = ROLES_LABEL[rol] || rol;
  const color = ROL_COLORES[rol] ?? "bg-slate-100 text-slate-600 ring-slate-200";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${color}`}>
      {label}
    </span>
  );
}

function ModalConfirmarEliminar({ usuario, onConfirmar, onCancelar, cargando }) {
  const { tx } = useLanguage();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-[20px] bg-white p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-500 shrink-0" />
          <h3 className="text-base font-semibold text-slate-900">{tx("Eliminar usuario")}</h3>
        </div>
        <p className="text-sm text-slate-500">
          {tx("Vas a eliminar a {nombre}. Esta accion es irreversible y borrara todos sus datos asociados.", { nombre: usuario.nombreCompleto ?? usuario.email })}
        </p>
        <div className="mt-5 flex gap-3">
          <button onClick={onCancelar} className="flex-1 rounded-full border border-slate-300 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
            {tx("Cancelar")}
          </button>
          <button onClick={onConfirmar} disabled={cargando} className="flex-1 rounded-full bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-60">
            {cargando ? tx("Eliminando...") : tx("Eliminar")}
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalEditarRol({ usuario, onGuardar, onCancelar, cargando }) {
  const { tx } = useLanguage();
  const [rol, setRol] = useState(usuario.rol);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-[20px] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">{tx("Cambiar rol")}</h3>
          <button onClick={onCancelar} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 transition">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-slate-500 mb-4">
          <span className="font-medium text-slate-700">{usuario.nombreCompleto ?? usuario.email}</span>
        </p>

        <div className="space-y-2">
          {["CLIENTE", "PROFESIONAL", "ADMIN"].map((r) => (
            <button
              key={r}
              onClick={() => setRol(r)}
              className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition ${
                rol === r
                  ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>{ROLES_LABEL[r]}</span>
              {rol === r && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
            </button>
          ))}
        </div>

        <div className="mt-5 flex gap-3">
          <button onClick={onCancelar} className="flex-1 rounded-full border border-slate-300 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
            {tx("Cancelar")}
          </button>
          <button
            onClick={() => onGuardar(rol)}
            disabled={cargando || rol === usuario.rol}
            className="flex-1 rounded-full bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {cargando ? tx("Guardando...") : tx("Guardar")}
          </button>
        </div>
      </div>
    </div>
  );
}

function UsuariosAdmin() {
  const { tx } = useLanguage();
  const [usuarios, setUsuarios]               = useState([]);
  const [cargando, setCargando]               = useState(true);
  const [error, setError]                     = useState("");
  const [busqueda, setBusqueda]               = useState("");
  const [filtroRol, setFiltroRol]             = useState("todos");
  const [usuarioABorrar, setUsuarioABorrar]   = useState(null);
  const [eliminando, setEliminando]           = useState(false);
  const [usuarioAEditar, setUsuarioAEditar]   = useState(null);
  const [guardandoRol, setGuardandoRol]       = useState(false);

  useEffect(() => {
    listarUsuarios()
      .then(setUsuarios)
      .catch(() => setError(tx("No se pudieron cargar los usuarios.")))
      .finally(() => setCargando(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleEliminar() {
    if (!usuarioABorrar) return;
    setEliminando(true);
    try {
      await eliminarUsuario(usuarioABorrar.id);
      setUsuarios((prev) => prev.filter((u) => u.id !== usuarioABorrar.id));
      setUsuarioABorrar(null);
    } catch (err) {
      alert(err.message || tx("No se pudo eliminar el usuario."));
    } finally {
      setEliminando(false);
    }
  }

  async function handleGuardarRol(nuevoRol) {
    if (!usuarioAEditar) return;
    setGuardandoRol(true);
    try {
      const actualizado = await cambiarRolUsuario(usuarioAEditar.id, nuevoRol);
      setUsuarios((prev) => prev.map((u) => u.id === actualizado.id ? { ...u, rol: actualizado.rol } : u));
      setUsuarioAEditar(null);
    } catch (err) {
      alert(err.message || tx("No se pudo cambiar el rol."));
    } finally {
      setGuardandoRol(false);
    }
  }

  const roles = ["todos", "CLIENTE", "PROFESIONAL", "ADMIN"];

  const filtrados = usuarios.filter((u) => {
    const coincideBusqueda =
      busqueda === "" ||
      (u.nombreCompleto ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (u.email ?? "").toLowerCase().includes(busqueda.toLowerCase());
    const coincideRol = filtroRol === "todos" || u.rol === filtroRol;
    return coincideBusqueda && coincideRol;
  });

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
        {tx("Cargando...")}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-sm py-10 text-center">{error}</p>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{tx("Usuarios")}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {tx("{count} usuarios registrados en la plataforma.", { count: usuarios.length })}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={tx("Buscar por nombre o email...")}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setFiltroRol(r)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filtroRol === r
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {r === "todos" ? tx("Todos") : ROLES_LABEL[r] || r}
              {` (${r === "todos" ? usuarios.length : usuarios.filter((u) => u.rol === r).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <UserCircleIcon className="h-10 w-10 mb-3" />
            <p className="text-sm font-medium text-slate-600">{tx("No se encontraron usuarios")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  <th className="px-4 py-3">{tx("Usuario")}</th>
                  <th className="px-4 py-3">{tx("Email")}</th>
                  <th className="px-4 py-3">{tx("Rol")}</th>
                  <th className="px-4 py-3">{tx("Ciudad")}</th>
                  <th className="px-4 py-3 text-right">{tx("Acciones")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtrados.map((u) => {
                  const foto = u.fotoUrl
                    ? u.fotoUrl.startsWith("http") ? u.fotoUrl : API_URL + u.fotoUrl
                    : null;
                  const iniciales = (u.nombreCompleto ?? u.email ?? "?")
                    .split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();

                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {foto ? (
                            <img src={foto} alt="" className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200" />
                          ) : (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white shrink-0">
                              {iniciales}
                            </span>
                          )}
                          <div>
                            <p className="font-medium text-slate-900">{u.nombreCompleto}</p>
                            <p className="text-xs text-slate-400">ID {u.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{u.email}</td>
                      <td className="px-4 py-3"><BadgeRol rol={u.rol} /></td>
                      <td className="px-4 py-3 text-slate-500">{u.ciudad ?? "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setUsuarioAEditar(u)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                          >
                            <PencilSquareIcon className="h-3.5 w-3.5" />
                            {tx("Rol")}
                          </button>
                          {u.rol !== "ADMIN" && (
                            <button
                              onClick={() => setUsuarioABorrar(u)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition"
                            >
                              <TrashIcon className="h-3.5 w-3.5" />
                              {tx("Eliminar")}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {usuarioABorrar && (
        <ModalConfirmarEliminar
          usuario={usuarioABorrar}
          onConfirmar={handleEliminar}
          onCancelar={() => setUsuarioABorrar(null)}
          cargando={eliminando}
        />
      )}

      {usuarioAEditar && (
        <ModalEditarRol
          usuario={usuarioAEditar}
          onGuardar={handleGuardarRol}
          onCancelar={() => setUsuarioAEditar(null)}
          cargando={guardandoRol}
        />
      )}
    </div>
  );
}

export default UsuariosAdmin;
