import { useState, useEffect, useRef } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { obtenerTodasSubcategorias } from "api/subcategorias";
import {
  obtenerMisServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
  activarServicio,
  desactivarServicio,
} from "api/servicios";
import { useLanguage } from "context/LanguageContext";

const DURACION_KEYS = ["30", "60", "90", "120", "180", "240", "480"];

const DURACION_LABELS = {
  "30": "30 minutos",
  "60": "1 hora",
  "90": "1h 30min",
  "120": "2 horas",
  "180": "3 horas",
  "240": "4 horas",
  "480": "Jornada completa (8h)",
};

const FORM_VACIO = {
  subcategoriaId: "",
  titulo: "",
  descripcion: "",
  precioHora: "",
  duracionMin: "60",
};

function findSubById(agrupadas, id) {
  for (const grupo of Object.values(agrupadas)) {
    const found = grupo.find(s => s.id === Number(id));
    if (found) return found;
  }
  return null;
}

function SubcategoriaCombobox({ agrupadas, value, onChange, tx }) {
  const [query, setQuery] = useState("");
  const [abierto, setAbierto] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setAbierto(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const seleccionada = value ? findSubById(agrupadas, value) : null;

  const filtradas = query.trim()
    ? Object.entries(agrupadas).reduce((acc, [cat, subs]) => {
        const filtered = subs.filter(s => s.nombre.toLowerCase().includes(query.toLowerCase()));
        if (filtered.length > 0) acc[cat] = filtered;
        return acc;
      }, {})
    : agrupadas;

  const totalResultados = Object.values(filtradas).reduce((n, g) => n + g.length, 0);

  function handleSelect(sub) {
    onChange(sub.id);
    setAbierto(false);
    setQuery("");
  }

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`flex items-center w-full border rounded-xl px-3.5 py-2.5 gap-2 cursor-text transition ${
          abierto ? "border-emerald-500 ring-2 ring-emerald-500" : "border-gray-300 hover:border-gray-400"
        }`}
        onClick={() => setAbierto(true)}>
        {abierto ? (
          <>
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={tx("Buscar tipo de servicio...")}
              className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
            />
            {query && (
              <button type="button" onClick={e => { e.stopPropagation(); setQuery(""); }} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <>
            <span className={`flex-1 text-sm ${seleccionada ? "text-gray-800" : "text-gray-400"}`}>
              {seleccionada ? tx(seleccionada.nombre) : tx("Selecciona o busca un servicio...")}
            </span>
            <ChevronDownIcon className="w-4 h-4 text-gray-400 shrink-0" />
          </>
        )}
      </div>

      {abierto && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
          {totalResultados === 0 ? (
            <p className="px-4 py-4 text-sm text-gray-400 text-center">{tx("Sin resultados")}</p>
          ) : (
            Object.entries(filtradas)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([cat, subs]) => (
                <div key={cat}>
                  <div className="sticky top-0 px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50 border-b border-gray-100">
                    {tx(cat)}
                  </div>
                  {subs.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => handleSelect(s)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition ${
                        s.id === Number(value)
                          ? "bg-emerald-50 text-emerald-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}>
                      {tx(s.nombre)}
                    </button>
                  ))}
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
}

function MisServicios() {
  const { tx } = useLanguage();
  const [subcategorias, setSubcategorias] = useState({});
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [errorForm, setErrorForm] = useState("");

  const [confirmarBorrado, setConfirmarBorrado] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { cargarDatos(); }, []);

  async function cargarDatos() {
    setCargando(true);
    setError("");

    const [subsResult, misResult] = await Promise.allSettled([
      obtenerTodasSubcategorias(),
      obtenerMisServicios(),
    ]);

    if (subsResult.status === "fulfilled") {
      const agrupadas = subsResult.value.reduce((acc, sub) => {
        const cat = sub.categoriaNombre || "Otros";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(sub);
        return acc;
      }, {});
      Object.values(agrupadas).forEach(g => g.sort((a, b) => a.nombre.localeCompare(b.nombre)));
      setSubcategorias(agrupadas);
    } else {
      setError(tx("No se pudieron cargar los tipos de servicio."));
    }

    if (misResult.status === "fulfilled") {
      setServicios(misResult.value);
    }

    setCargando(false);
  }

  function abrirCrear() {
    setEditandoId(null);
    setForm(FORM_VACIO);
    setErrorForm("");
    setModalAbierto(true);
  }

  function abrirEditar(s) {
    setEditandoId(s.id);
    setForm({
      subcategoriaId: String(s.subcategoriaId),
      titulo: s.titulo || "",
      descripcion: s.descripcion || "",
      precioHora: String(s.precioHora),
      duracionMin: String(s.duracionMin),
    });
    setErrorForm("");
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setEditandoId(null);
    setForm(FORM_VACIO);
    setErrorForm("");
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubcategoria(id) {
    const sub = findSubById(subcategorias, id);
    setForm(prev => ({
      ...prev,
      subcategoriaId: String(id),
      titulo: editandoId ? prev.titulo : (sub?.nombre || prev.titulo),
    }));
  }

  async function handleGuardar(e) {
    e.preventDefault();
    if (!form.subcategoriaId) {
      setErrorForm(tx("Selecciona un tipo de servicio."));
      return;
    }
    setErrorForm("");
    setGuardando(true);

    const datos = {
      subcategoriaId: Number(form.subcategoriaId),
      titulo: form.titulo.trim() || findSubById(subcategorias, form.subcategoriaId)?.nombre || "Servicio",
      descripcion: form.descripcion.trim(),
      precioHora: Number(form.precioHora),
      duracionMin: Number(form.duracionMin),
    };

    try {
      if (editandoId) {
        const actualizado = await actualizarServicio(editandoId, datos);
        setServicios(prev => prev.map(s => s.id === editandoId ? actualizado : s));
      } else {
        const nuevo = await crearServicio(datos);
        setServicios(prev => [...prev, nuevo]);
      }
      cerrarModal();
    } catch (err) {
      setErrorForm(err.message || tx("Error al guardar el servicio"));
    } finally {
      setGuardando(false);
    }
  }

  async function handleToggle(s) {
    try {
      const actualizado = s.activa ? await desactivarServicio(s.id) : await activarServicio(s.id);
      setServicios(prev => prev.map(x => x.id === s.id ? actualizado : x));
    } catch (err) {
      setError(err.message || tx("Error al cambiar el estado"));
    }
  }

  async function handleEliminar(id) {
    try {
      await eliminarServicio(id);
      setServicios(prev => prev.filter(s => s.id !== id));
      setConfirmarBorrado(null);
    } catch (err) {
      setError(err.message || tx("Error al eliminar el servicio"));
    }
  }

  function duracionLabel(min) {
    const texto = DURACION_LABELS[String(min)];
    if (texto) return tx(texto);
    const h = Math.floor(min / 60), m = min % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400 text-sm">
        {tx("Cargando...")}
      </div>
    );
  }

  const subTitulo = servicios.length === 0
    ? tx("Aún no has publicado ningun servicio.")
    : servicios.length === 1
      ? tx("{count} servicio publicado", { count: 1 })
      : tx("{count} servicios publicados", { count: servicios.length });

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{tx("Mis servicios")}</h1>
          <p className="text-sm text-gray-500 mt-1">{subTitulo}</p>
        </div>
        <button
          onClick={abrirCrear}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition">
          <PlusIcon className="w-4 h-4" />
          {tx("Nuevo servicio")}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>
      )}

      {servicios.length === 0 && !error && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <div className="text-5xl mb-4">🛠️</div>
          <h3 className="text-gray-700 font-semibold mb-1">{tx("Sin servicios todavía")}</h3>
          <p className="text-gray-400 text-sm mb-6">{tx("Publica tu primer servicio para aparecer en las búsquedas.")}</p>
          <button
            onClick={abrirCrear}
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition">
            {tx("Publicar mi primer servicio")}
          </button>
        </div>
      )}

      {servicios.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {servicios.map(s => (
            <div
              key={s.id}
              className={`bg-white rounded-2xl border p-5 flex flex-col gap-3 transition ${
                s.activa ? "border-gray-200" : "border-gray-100 opacity-60"
              }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mb-1">
                    {s.subcategoriaNombre}
                  </span>
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight truncate">{s.titulo}</h3>
                </div>
                <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                  s.activa ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {s.activa ? tx("Activo") : tx("Inactivo")}
                </span>
              </div>

              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{s.descripcion}</p>

              <div className="flex items-center gap-4 text-sm">
                <span className="font-bold text-gray-800">{Number(s.precioHora).toFixed(2)} €/h</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500">{duracionLabel(s.duracionMin)}</span>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                <button onClick={() => abrirEditar(s)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition">
                  <PencilIcon className="w-3.5 h-3.5" />
                  {tx("Editar")}
                </button>
                <button onClick={() => handleToggle(s)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition">
                  {s.activa ? <EyeSlashIcon className="w-3.5 h-3.5" /> : <EyeIcon className="w-3.5 h-3.5" />}
                  {s.activa ? tx("Desactivar") : tx("Activar")}
                </button>
                <button onClick={() => setConfirmarBorrado(s.id)}
                  className="ml-auto flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition">
                  <TrashIcon className="w-3.5 h-3.5" />
                  {tx("Eliminar")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal crear / editar */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">
                {editandoId ? tx("Editar servicio") : tx("Nuevo servicio")}
              </h2>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600 transition">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGuardar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {tx("Tipo de servicio")} <span className="text-red-500">*</span>
                </label>
                <SubcategoriaCombobox agrupadas={subcategorias} value={form.subcategoriaId} onChange={handleSubcategoria} tx={tx} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {tx("Titulo del anuncio")} <span className="text-red-500">*</span>
                </label>
                <input type="text" name="titulo" value={form.titulo} onChange={handleChange}
                  required maxLength={120}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {tx("Descripción")} <span className="text-red-500">*</span>
                </label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
                  required rows={3}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {tx("Precio / hora (EUR)")} <span className="text-red-500">*</span>
                  </label>
                  <input type="number" name="precioHora" value={form.precioHora} onChange={handleChange}
                    required min="1" step="0.5"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {tx("Duracion estimada")}
                  </label>
                  <select name="duracionMin" value={form.duracionMin} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                    {DURACION_KEYS.map(key => (
                      <option key={key} value={key}>{tx(DURACION_LABELS[key])}</option>
                    ))}
                  </select>
                </div>
              </div>

              {errorForm && <p className="text-red-500 text-sm">{errorForm}</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={cerrarModal}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm font-medium">
                  {tx("Cancelar")}
                </button>
                <button type="submit" disabled={guardando}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition disabled:opacity-60 flex items-center justify-center gap-2">
                  {guardando ? tx("Guardando...") : (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      {editandoId ? tx("Guardar cambios") : tx("Publicar servicio")}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal confirmar borrado */}
      {confirmarBorrado !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xs w-full text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{tx("Eliminar servicio?")}</h3>
            <p className="text-sm text-gray-400 mb-6">{tx("Esta acción no se puede deshacer.")}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmarBorrado(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm font-medium">
                {tx("Cancelar")}
              </button>
              <button onClick={() => handleEliminar(confirmarBorrado)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition text-sm font-medium">
                {tx("Eliminar")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MisServicios;
