import { useEffect, useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  TagIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  crearSubcategoria,
  actualizarSubcategoria,
  eliminarSubcategoria,
} from "api/admin";
import { obtenerCategorias } from "api/categorias";
import { obtenerTodasSubcategorias } from "api/subcategorias";
import { useLanguage } from "context/LanguageContext";

function FormularioInline({ valorInicial = "", placeholder, onGuardar, onCancelar, guardando }) {
  const [valor, setValor] = useState(valorInicial);

  return (
    <div className="flex items-center gap-2 mt-2">
      <input
        autoFocus
        type="text"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") onGuardar(valor.trim()); if (e.key === "Escape") onCancelar(); }}
        placeholder={placeholder}
        className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
      />
      <button
        onClick={() => onGuardar(valor.trim())}
        disabled={guardando || !valor.trim()}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:opacity-50"
      >
        {guardando ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <CheckIcon className="h-4 w-4" />}
      </button>
      <button
        onClick={onCancelar}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 transition"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

function ModalConfirmar({ texto, onConfirmar, onCancelar, cargando }) {
  const { tx } = useLanguage();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-[20px] bg-white p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-500 shrink-0" />
          <h3 className="text-base font-semibold text-slate-900">{tx("Eliminar")}</h3>
        </div>
        <p className="text-sm text-slate-500">{texto}</p>
        <div className="mt-5 flex gap-3">
          <button
            onClick={onCancelar}
            className="flex-1 rounded-full border border-slate-300 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
          >
            {tx("Cancelar")}
          </button>
          <button
            onClick={onConfirmar}
            disabled={cargando}
            className="flex-1 rounded-full bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-60"
          >
            {cargando ? tx("Eliminando...") : tx("Eliminar")}
          </button>
        </div>
      </div>
    </div>
  );
}

function SeccionCategorias({ categorias, setCategorias, categoriaSeleccionada, onSeleccionar }) {
  const { tx } = useLanguage();
  const [creando, setCreando]       = useState(false);
  const [editando, setEditando]     = useState(null);
  const [guardando, setGuardando]   = useState(false);
  const [aEliminar, setAEliminar]   = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorLocal, setErrorLocal] = useState("");

  async function handleCrear(nombre) {
    if (!nombre) return;
    setGuardando(true);
    setErrorLocal("");
    try {
      const nueva = await crearCategoria({ nombre });
      setCategorias((prev) => [...prev, nueva]);
      setCreando(false);
    } catch (err) {
      setErrorLocal(err.message);
    } finally {
      setGuardando(false);
    }
  }

  async function handleEditar(nombre) {
    if (!nombre || !editando) return;
    setGuardando(true);
    setErrorLocal("");
    try {
      const actualizada = await actualizarCategoria(editando.id, { nombre });
      setCategorias((prev) => prev.map((c) => c.id === actualizada.id ? actualizada : c));
      setEditando(null);
    } catch (err) {
      setErrorLocal(err.message);
    } finally {
      setGuardando(false);
    }
  }

  async function handleEliminar() {
    if (!aEliminar) return;
    setEliminando(true);
    try {
      await eliminarCategoria(aEliminar.id);
      setCategorias((prev) => prev.filter((c) => c.id !== aEliminar.id));
      if (categoriaSeleccionada?.id === aEliminar.id) onSeleccionar(null);
      setAEliminar(null);
    } catch (err) {
      setErrorLocal(err.message);
    } finally {
      setEliminando(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800">
          {tx("Categorias ({count})", { count: categorias.length })}
        </h2>
        <button
          onClick={() => { setCreando(true); setEditando(null); setErrorLocal(""); }}
          className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 transition"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          {tx("Nueva")}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1 max-h-[460px]">
        {errorLocal && <p className="text-xs text-red-500 px-2">{errorLocal}</p>}

        {creando && (
          <FormularioInline
            placeholder={tx("Nombre de la categoria")}
            onGuardar={handleCrear}
            onCancelar={() => setCreando(false)}
            guardando={guardando}
          />
        )}

        {categorias.map((cat) => (
          <div key={cat.id}>
            {editando?.id === cat.id ? (
              <FormularioInline
                valorInicial={cat.nombre}
                placeholder={tx("Nombre de la categoria")}
                onGuardar={handleEditar}
                onCancelar={() => setEditando(null)}
                guardando={guardando}
              />
            ) : (
              <div
                onClick={() => onSeleccionar(cat)}
                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 cursor-pointer transition ${
                  categoriaSeleccionada?.id === cat.id
                    ? "bg-emerald-50 border border-emerald-200"
                    : "hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <TagIcon className={`h-4 w-4 shrink-0 ${categoriaSeleccionada?.id === cat.id ? "text-emerald-500" : "text-slate-400"}`} />
                  <span className="text-sm font-medium text-slate-800 truncate">{cat.nombre}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditando(cat); setCreando(false); setErrorLocal(""); }}
                    className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition"
                  >
                    <PencilIcon className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setAEliminar(cat); }}
                    className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-red-100 text-red-500 transition"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {categorias.length === 0 && !creando && (
          <p className="text-xs text-slate-400 text-center py-8">
            {tx("No hay categorias. Crea la primera.")}
          </p>
        )}
      </div>

      {aEliminar && (
        <ModalConfirmar
          texto={tx("Vas a eliminar la categoria \"{nombre}\" y todas sus subcategorias.", { nombre: aEliminar.nombre })}
          onConfirmar={handleEliminar}
          onCancelar={() => setAEliminar(null)}
          cargando={eliminando}
        />
      )}
    </div>
  );
}

function SeccionSubcategorias({ categoriaSeleccionada, todasSubcategorias, setTodasSubcategorias }) {
  const { tx } = useLanguage();
  const [creando, setCreando]       = useState(false);
  const [editando, setEditando]     = useState(null);
  const [guardando, setGuardando]   = useState(false);
  const [aEliminar, setAEliminar]   = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorLocal, setErrorLocal] = useState("");

  const subcats = categoriaSeleccionada
    ? todasSubcategorias.filter((s) => s.categoriaId === categoriaSeleccionada.id)
    : [];

  async function handleCrear(nombre) {
    if (!nombre || !categoriaSeleccionada) return;
    setGuardando(true);
    setErrorLocal("");
    try {
      const nueva = await crearSubcategoria({ nombre, categoriaId: categoriaSeleccionada.id });
      setTodasSubcategorias((prev) => [...prev, nueva]);
      setCreando(false);
    } catch (err) {
      setErrorLocal(err.message);
    } finally {
      setGuardando(false);
    }
  }

  async function handleEditar(nombre) {
    if (!nombre || !editando) return;
    setGuardando(true);
    setErrorLocal("");
    try {
      const actualizada = await actualizarSubcategoria(editando.id, { nombre, categoriaId: categoriaSeleccionada?.id });
      setTodasSubcategorias((prev) => prev.map((s) => s.id === actualizada.id ? actualizada : s));
      setEditando(null);
    } catch (err) {
      setErrorLocal(err.message);
    } finally {
      setGuardando(false);
    }
  }

  async function handleEliminar() {
    if (!aEliminar) return;
    setEliminando(true);
    try {
      await eliminarSubcategoria(aEliminar.id);
      setTodasSubcategorias((prev) => prev.filter((s) => s.id !== aEliminar.id));
      setAEliminar(null);
    } catch (err) {
      setErrorLocal(err.message);
    } finally {
      setEliminando(false);
    }
  }

  if (!categoriaSeleccionada) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white flex items-center justify-center p-12 text-center">
        <div>
          <TagIcon className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500">{tx("Selecciona una categoria")}</p>
          <p className="text-xs text-slate-400 mt-1">{tx("Para ver y editar sus subcategorias")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            {tx("Subcategorias de {nombre}", { nombre: categoriaSeleccionada.nombre })}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {tx("{count} subcategorias", { count: subcats.length })}
          </p>
        </div>
        <button
          onClick={() => { setCreando(true); setEditando(null); setErrorLocal(""); }}
          className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 transition"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          {tx("Nueva")}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1 max-h-[460px]">
        {errorLocal && <p className="text-xs text-red-500 px-2">{errorLocal}</p>}

        {creando && (
          <FormularioInline
            placeholder={tx("Nombre de la subcategoria")}
            onGuardar={handleCrear}
            onCancelar={() => setCreando(false)}
            guardando={guardando}
          />
        )}

        {subcats.map((sub) => (
          <div key={sub.id}>
            {editando?.id === sub.id ? (
              <FormularioInline
                valorInicial={sub.nombre}
                placeholder={tx("Nombre de la subcategoria")}
                onGuardar={handleEditar}
                onCancelar={() => setEditando(null)}
                guardando={guardando}
              />
            ) : (
              <div className="group flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-slate-50 border border-transparent transition">
                <span className="text-sm text-slate-700 truncate">{sub.nombre}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                  <button
                    onClick={() => { setEditando(sub); setCreando(false); setErrorLocal(""); }}
                    className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition"
                  >
                    <PencilIcon className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setAEliminar(sub)}
                    className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-red-100 text-red-500 transition"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {subcats.length === 0 && !creando && (
          <p className="text-xs text-slate-400 text-center py-8">
            {tx("Esta categoría no tiene subcategorías todavía.")}
          </p>
        )}
      </div>

      {aEliminar && (
        <ModalConfirmar
          texto={tx("Vas a eliminar la subcategoria \"{nombre}\".", { nombre: aEliminar.nombre })}
          onConfirmar={handleEliminar}
          onCancelar={() => setAEliminar(null)}
          cargando={eliminando}
        />
      )}
    </div>
  );
}

function CategoriasAdmin() {
  const { tx } = useLanguage();
  const [categorias, setCategorias]          = useState([]);
  const [subcategorias, setSubcategorias]    = useState([]);
  const [categoriaSeleccionada, setCatSelec] = useState(null);
  const [cargando, setCargando]              = useState(true);
  const [error, setError]                    = useState("");

  useEffect(() => {
    Promise.all([obtenerCategorias(), obtenerTodasSubcategorias()])
      .then(([cats, subs]) => {
        setCategorias(cats);
        setSubcategorias(subs);
        if (cats.length > 0) setCatSelec(cats[0]);
      })
      .catch(() => setError(tx("No se pudieron cargar los datos.")))
      .finally(() => setCargando(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <h1 className="text-xl font-semibold text-slate-900">{tx("Categorias y subcategorias")}</h1>
        <p className="mt-1 text-sm text-slate-500">{tx("Selecciona una categoria para ver y editar sus subcategorias. Los cambios se guardan al instante.")}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SeccionCategorias
          categorias={categorias}
          setCategorias={setCategorias}
          categoriaSeleccionada={categoriaSeleccionada}
          onSeleccionar={setCatSelec}
        />
        <SeccionSubcategorias
          categoriaSeleccionada={categoriaSeleccionada}
          todasSubcategorias={subcategorias}
          setTodasSubcategorias={setSubcategorias}
        />
      </div>
    </div>
  );
}

export default CategoriasAdmin;
