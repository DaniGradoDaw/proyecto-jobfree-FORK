import { useState, useEffect, useRef } from "react";
import {
  UserCircleIcon,
  CameraIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  HomeIcon,
  BuildingOfficeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  SignalIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "context/AuthContext";
import { actualizarMiUsuario, subirFotoPerfil } from "api/usuario";
import { obtenerMiPerfil, actualizarMiPerfil, actualizarUbicacion, limpiarUbicacion } from "api/profesional";
import { useGeolocalizacion } from "hooks/useGeolocalizacion";
import UbicacionMap from "components/maps/UbicacionMap";
import API_URL from "api/config";
import { useLanguage } from "context/LanguageContext";

function validarPassword(pw) {
  return {
    longitud:  pw.length >= 8,
    numero:    /\d/.test(pw),
    mayuscula: /[A-Z]/.test(pw),
  };
}

function telefonoValido(v) {
  return !v || /^\+?[\d\s-]{6,20}$/.test(v);
}

function Banner({ tipo, texto }) {
  if (!texto) return null;
  const esError = tipo === "error";
  return (
    <div className={`rounded-xl px-4 py-3 text-sm ${
      esError
        ? "bg-red-50 border border-red-200 text-red-600"
        : "bg-emerald-50 border border-emerald-200 text-emerald-700"
    }`}>
      {texto}
    </div>
  );
}

function Campo({ label, name, value, onChange, onBlur, type = "text", placeholder = "", icono, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        {icono && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icono}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full border rounded-xl py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 transition ${
            error
              ? "border-red-300 focus:ring-red-400"
              : "border-slate-200 focus:ring-green-500 focus:border-transparent"
          } ${icono ? "pl-10 pr-4" : "px-4"}`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function Configuracion() {
  const { cargarUsuarioActual } = useAuth();
  const { tx } = useLanguage();
  const fileInputRef = useRef();

  const [tabActiva, setTabActiva] = useState("perfil");
  const [esProfesional, setEsProfesional] = useState(false);
  const [fotoUrlActual, setFotoUrlActual] = useState(null);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  const [emailActual, setEmailActual] = useState("");
  const [form, setForm] = useState({ nombre: "", apellidos: "", telefono: "", ciudad: "", direccion: "" });
  const [tocados, setTocados] = useState({});
  const [preview, setPreview] = useState(null);
  const [archivoFoto, setArchivoFoto] = useState(null);
  const [guardandoPersonal, setGuardandoPersonal] = useState(false);
  const [exitoPersonal, setExitoPersonal] = useState(false);
  const [errorPersonal, setErrorPersonal] = useState("");

  const [pw, setPw] = useState({ nueva: "", confirmar: "" });
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [guardandoPw, setGuardandoPw] = useState(false);
  const [exitoPw, setExitoPw] = useState(false);
  const [errorPw, setErrorPw] = useState("");

  const [perfilPro, setPerfilPro] = useState(null);
  const [formPro, setFormPro] = useState({ descripcion: "", experiencia: 0, codigoPostal: "", nombreEmpresa: "", cif: "" });
  const [guardandoPro, setGuardandoPro] = useState(false);
  const [exitoPro, setExitoPro] = useState(false);
  const [errorPro, setErrorPro] = useState("");

  const { posicion: posicionGps, cargando: gpsDetectando, error: gpsError, obtenerPosicion } = useGeolocalizacion();
  const [coordsGuardadas, setCoordsGuardadas] = useState(null);
  const [ubicacionManual, setUbicacionManual] = useState(false);
  const [guardandoUbicacion, setGuardandoUbicacion] = useState(false);
  const [exitoUbicacion, setExitoUbicacion] = useState("");
  const [errorUbicacion, setErrorUbicacion] = useState("");

  useEffect(() => {
    cargarUsuarioActual()
      .then(u => {
        setEmailActual(u.email || "");
        setForm({
          nombre: u.nombre || "",
          apellidos: u.apellidos || "",
          telefono: u.telefono || "",
          ciudad: u.ciudad || "",
          direccion: u.direccion || "",
        });
        setFotoUrlActual(u.fotoUrl || null);

        const esPro = u.rol?.toLowerCase() === "profesional";
        setEsProfesional(esPro);

        if (esPro) {
          obtenerMiPerfil()
            .then(p => {
              setPerfilPro(p);
              setFormPro({
                descripcion: p.descripcion || "",
                experiencia: p.experiencia ?? 0,
                codigoPostal: p.codigoPostal || "",
                nombreEmpresa: p.nombreEmpresa || "",
                cif: p.cif || "",
              });
              if (p.latitud != null && p.longitud != null) {
                setCoordsGuardadas({ latitud: p.latitud, longitud: p.longitud });
              } else {
                setCoordsGuardadas(null);
              }
              setUbicacionManual(Boolean(p.ubicacionManual));
            })
            .catch(() => {});
        }
      })
      .catch(() => setErrorCarga(tx("No se pudieron cargar tus datos. Recarga la página.")))
      .finally(() => setCargandoDatos(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const erroresForm = {
    telefono: tocados.telefono && !telefonoValido(form.telefono) ? tx("Teléfono no válido") : "",
  };

  const formularioPersonalValido = telefonoValido(form.telefono);
  const reglasPw = validarPassword(pw.nueva);
  const pwValida = reglasPw.longitud && reglasPw.numero && reglasPw.mayuscula;
  const pwCoincide = pw.confirmar.length > 0 && pw.nueva === pw.confirmar;
  const pwNoCoincide = pw.confirmar.length > 0 && pw.nueva !== pw.confirmar;

  function handleChange(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); }
  function handleBlur(e) { setTocados(prev => ({ ...prev, [e.target.name]: true })); }
  function handleFotoChange(e) {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setArchivoFoto(archivo);
    setPreview(URL.createObjectURL(archivo));
  }

  async function handleGuardarPersonal(e) {
    e.preventDefault();
    if (!formularioPersonalValido) return;
    setErrorPersonal("");
    setExitoPersonal(false);
    setGuardandoPersonal(true);

    try {
      if (archivoFoto) {
        const res = await subirFotoPerfil(archivoFoto);
        setFotoUrlActual(res.fotoUrl);
        setArchivoFoto(null);
      }
      const payload = {};
      if (form.nombre)    payload.nombre    = form.nombre;
      if (form.apellidos) payload.apellidos = form.apellidos;
      if (form.telefono)  payload.telefono  = form.telefono;
      if (form.ciudad)    payload.ciudad    = form.ciudad;
      if (form.direccion) payload.direccion = form.direccion;

      await actualizarMiUsuario(payload);
      await cargarUsuarioActual();
      setExitoPersonal(true);
      setTimeout(() => setExitoPersonal(false), 4000);
    } catch (err) {
      setErrorPersonal(err.message || tx("Error al guardar los datos"));
    } finally {
      setGuardandoPersonal(false);
    }
  }

  async function handleGuardarPassword(e) {
    e.preventDefault();
    if (!pwValida || !pwCoincide) return;
    setErrorPw("");
    setExitoPw(false);
    setGuardandoPw(true);

    try {
      await actualizarMiUsuario({ password: pw.nueva });
      setPw({ nueva: "", confirmar: "" });
      setExitoPw(true);
      setTimeout(() => setExitoPw(false), 4000);
    } catch (err) {
      setErrorPw(err.message || tx("Error al cambiar la contraseña"));
    } finally {
      setGuardandoPw(false);
    }
  }

  async function handleGuardarProfesional(e) {
    e.preventDefault();
    if (!perfilPro) return;
    setErrorPro("");
    setExitoPro(false);
    setGuardandoPro(true);

    try {
      const perfil = await actualizarMiPerfil(perfilPro.id, {
        descripcion: formPro.descripcion,
        experiencia: Number(formPro.experiencia),
        codigoPostal: formPro.codigoPostal,
        nombreEmpresa: formPro.nombreEmpresa,
        cif: formPro.cif || null,
        plan: perfilPro.plan,
      });
      setPerfilPro(perfil);
      if (perfil.latitud != null && perfil.longitud != null) {
        setCoordsGuardadas({ latitud: perfil.latitud, longitud: perfil.longitud });
      } else {
        setCoordsGuardadas(null);
      }
      setUbicacionManual(Boolean(perfil.ubicacionManual));
      setExitoPro(true);
      setTimeout(() => setExitoPro(false), 4000);
    } catch (err) {
      setErrorPro(err.message || tx("Error al guardar el perfil"));
    } finally {
      setGuardandoPro(false);
    }
  }

  async function handleDetectarUbicacion() {
    setErrorUbicacion("");
    setExitoUbicacion("");
    try {
      const coords = await obtenerPosicion();
      setGuardandoUbicacion(true);
      const perfil = await actualizarUbicacion(coords.latitud, coords.longitud);
      setCoordsGuardadas({ latitud: perfil.latitud, longitud: perfil.longitud });
      setUbicacionManual(Boolean(perfil.ubicacionManual));
      setExitoUbicacion(tx("Ubicacion guardada (precision ±{precision} m).", { precision: coords.precision }));
      setTimeout(() => setExitoUbicacion(""), 5000);
    } catch (err) {
      setErrorUbicacion(err.message || tx("No se pudo guardar la ubicación."));
    } finally {
      setGuardandoUbicacion(false);
    }
  }

  async function handleLimpiarUbicacion() {
    setErrorUbicacion("");
    setExitoUbicacion("");
    setGuardandoUbicacion(true);
    try {
      const perfil = await limpiarUbicacion();
      setCoordsGuardadas(null);
      setUbicacionManual(Boolean(perfil.ubicacionManual));
      setExitoUbicacion(tx("Ubicación eliminada."));
      setTimeout(() => setExitoUbicacion(""), 4000);
    } catch (err) {
      setErrorUbicacion(err.message || tx("Error al eliminar la ubicación."));
    } finally {
      setGuardandoUbicacion(false);
    }
  }

  const fotoActual = preview || (fotoUrlActual ? API_URL + fotoUrlActual : null);

  if (cargandoDatos) {
    return (
      <div className="flex items-center justify-center py-32 text-slate-400 text-sm">
        {tx("Cargando tu configuración...")}
      </div>
    );
  }

  if (errorCarga) {
    return (
      <div className="max-w-2xl">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-4 text-sm">{errorCarga}</div>
      </div>
    );
  }

  const tabs = [
    { id: "perfil",      label: tx("Perfil") },
    { id: "seguridad",   label: tx("Seguridad") },
    ...(esProfesional ? [
      { id: "profesional", label: tx("Profesional") },
      { id: "ubicacion",   label: tx("Ubicación") },
    ] : []),
  ];

  return (
    <div className="max-w-2xl">

      {/* Cabecera */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">{tx("Configuración")}</h1>
        <p className="mt-1 text-sm text-slate-500">{tx("Gestiona tu información de cuenta.")}</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-slate-100 p-1">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTabActiva(t.id)}
            className={`flex-1 rounded-lg py-2 px-3 text-sm font-medium transition-all ${
              tabActiva === t.id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Pestaña: Perfil ── */}
      {tabActiva === "perfil" && (
        <form onSubmit={handleGuardarPersonal} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

          {/* Foto de perfil */}
          <div className="flex items-center gap-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 px-6 py-5">
            <div className="relative shrink-0">
              {fotoActual ? (
                <img src={fotoActual} alt={tx("Foto de perfil")}
                  className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white shadow" />
              ) : (
                <div className="h-20 w-20 rounded-2xl bg-green-100 ring-4 ring-white shadow flex items-center justify-center">
                  <UserCircleIcon className="h-10 w-10 text-green-400" />
                </div>
              )}
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-white shadow transition hover:bg-slate-700">
                <CameraIcon className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {archivoFoto ? archivoFoto.name : tx("Foto de perfil")}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{tx("JPG, PNG o WebP · max. 5 MB")}</p>
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="mt-2.5 text-xs font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900 transition">
                {tx("Cambiar foto")}
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
          </div>

          {/* Campos personales */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Campo label={tx("Nombre")} name="nombre" value={form.nombre}
                onChange={handleChange} onBlur={handleBlur} />
              <Campo label={tx("Apellidos")} name="apellidos" value={form.apellidos}
                onChange={handleChange} onBlur={handleBlur} />

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{tx("Email")}</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
                  <div className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-400">
                    {emailActual}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1">{tx("El email no se puede cambiar desde aquí.")}</p>
              </div>

              <Campo label={tx("Teléfono")} name="telefono" value={form.telefono}
                onChange={handleChange} onBlur={handleBlur} placeholder="+34 612 345 678"
                icono={<PhoneIcon className="h-4 w-4" />} error={erroresForm.telefono} />
              <Campo label={tx("Ciudad")} name="ciudad" value={form.ciudad}
                onChange={handleChange} onBlur={handleBlur}
                icono={<MapPinIcon className="h-4 w-4" />} />
              <div className="sm:col-span-2">
                <Campo label={tx("Dirección")} name="direccion" value={form.direccion}
                  onChange={handleChange} onBlur={handleBlur}
                  icono={<HomeIcon className="h-4 w-4" />} />
              </div>
            </div>

            {(errorPersonal || exitoPersonal) && (
              <Banner tipo={errorPersonal ? "error" : "exito"} texto={errorPersonal || `✓ ${tx("Datos personales guardados.")}`} />
            )}

            <div className="flex justify-end pt-1">
              <button type="submit" disabled={guardandoPersonal || !formularioPersonalValido}
                className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-40">
                {guardandoPersonal ? tx("Guardando...") : tx("Guardar cambios")}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ── Pestaña: Seguridad ── */}
      {tabActiva === "seguridad" && (
        <form onSubmit={handleGuardarPassword} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
            <h2 className="text-sm font-semibold text-slate-800">{tx("Cambiar contraseña")}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{tx("Deja los campos vacios si no quieres cambiarla.")}</p>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{tx("Nueva contraseña")}</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type={mostrarNueva ? "text" : "password"}
                  value={pw.nueva}
                  onChange={e => setPw(prev => ({ ...prev, nueva: e.target.value }))}
                  placeholder={tx("Min. 8 caracteres")}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                <button type="button" onClick={() => setMostrarNueva(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {mostrarNueva ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
              {pw.nueva.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {[
                    { ok: reglasPw.longitud,  texto: tx("8 caracteres") },
                    { ok: reglasPw.numero,    texto: tx("1 número") },
                    { ok: reglasPw.mayuscula, texto: tx("1 mayúscula") },
                  ].map(r => (
                    <span key={r.texto} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                      r.ok ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-400"
                    }`}>
                      {r.ok ? <CheckCircleIcon className="h-3.5 w-3.5" /> : <XCircleIcon className="h-3.5 w-3.5" />}
                      {r.texto}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{tx("Confirmar contraseña")}</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type={mostrarConfirmar ? "text" : "password"}
                  value={pw.confirmar}
                  onChange={e => setPw(prev => ({ ...prev, confirmar: e.target.value }))}
                  placeholder={tx("Repite la contraseña")}
                  className={`w-full rounded-xl border bg-white pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${
                    pwCoincide    ? "border-green-300 focus:ring-green-400"
                    : pwNoCoincide ? "border-red-300 focus:ring-red-400"
                    : "border-slate-200 focus:ring-green-500"
                  }`}
                />
                <button type="button" onClick={() => setMostrarConfirmar(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {mostrarConfirmar ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
              {pwCoincide    && <p className="flex items-center gap-1 text-xs text-green-600 mt-1.5"><CheckCircleIcon className="h-3.5 w-3.5" />{tx("Las contraseñas coinciden")}</p>}
              {pwNoCoincide  && <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5"><XCircleIcon className="h-3.5 w-3.5" />{tx("Las contraseñas no coinciden")}</p>}
            </div>

            {(errorPw || exitoPw) && (
              <Banner tipo={errorPw ? "error" : "exito"} texto={errorPw || `✓ ${tx("Contraseña actualizada correctamente.")}`} />
            )}

            <div className="flex justify-end">
              <button type="submit" disabled={guardandoPw || !pw.nueva || !pwValida || !pwCoincide}
                className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-40">
                {guardandoPw ? tx("Guardando...") : tx("Cambiar contraseña")}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ── Pestaña: Profesional ── */}
      {tabActiva === "profesional" && esProfesional && (
        <form onSubmit={handleGuardarProfesional} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
            <h2 className="text-sm font-semibold text-slate-800">{tx("Perfil profesional")}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{tx("Información visible en tus anuncios de servicio.")}</p>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{tx("Descripción profesional")}</label>
              <textarea
                name="descripcion"
                value={formPro.descripcion}
                onChange={e => setFormPro(prev => ({ ...prev, descripcion: e.target.value }))}
                rows={4}
                placeholder={tx("Describe tu experiencia y especialidades...")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-slate-700">{tx("Años de experiencia")}</label>
                <span className="text-lg font-bold text-slate-900 tabular-nums">{formPro.experiencia}</span>
              </div>
              <input
                type="range" name="experiencia" value={formPro.experiencia}
                onChange={e => setFormPro(prev => ({ ...prev, experiencia: e.target.value }))}
                min="0" max="40" step="1"
                className="w-full accent-green-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                <span>0</span><span>10</span><span>20</span><span>30</span><span>40</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Campo label={tx("Código postal")} name="codigoPostal" value={formPro.codigoPostal}
                onChange={e => setFormPro(prev => ({ ...prev, codigoPostal: e.target.value }))}
                icono={<MapPinIcon className="h-4 w-4" />} />
              <Campo label={tx("Nombre de empresa")} name="nombreEmpresa" value={formPro.nombreEmpresa}
                onChange={e => setFormPro(prev => ({ ...prev, nombreEmpresa: e.target.value }))}
                icono={<BuildingOfficeIcon className="h-4 w-4" />} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{tx("CIF (opcional)")}</label>
              <input
                type="text" value={formPro.cif}
                onChange={e => setFormPro(prev => ({ ...prev, cif: e.target.value.toUpperCase() }))}
                maxLength={12}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition uppercase"
              />
              <p className="text-xs text-slate-400 mt-1">{tx("Identificador fiscal de tu empresa.")}</p>
            </div>

            {(errorPro || exitoPro) && (
              <Banner tipo={errorPro ? "error" : "exito"} texto={errorPro || `✓ ${tx("Perfil profesional guardado.")}`} />
            )}

            <div className="flex justify-end">
              <button type="submit" disabled={guardandoPro}
                className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-40">
                {guardandoPro ? tx("Guardando...") : tx("Guardar perfil")}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ── Pestaña: Ubicación ── */}
      {tabActiva === "ubicacion" && esProfesional && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
            <h2 className="text-sm font-semibold text-slate-800">{tx("Ubicación de trabajo")}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {tx("Fija tu ubicación para aparecer en búsquedas por proximidad. La posición se obtiene del GPS de tu dispositivo.")}
            </p>
          </div>
          <div className="p-6 space-y-5">

          <UbicacionMap coordsGuardadas={coordsGuardadas} posicionGps={posicionGps} />

          <div className={`flex flex-wrap items-center gap-3 rounded-xl px-4 py-3 text-sm ${
            coordsGuardadas
              ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
              : "bg-slate-50 border border-slate-200 text-slate-500"
          }`}>
            <MapPinIcon className="h-4 w-4 shrink-0" />
            {coordsGuardadas ? (
              <span>
                {tx("Ubicación fijada")} —{" "}
                <strong>{coordsGuardadas.latitud.toFixed(5)}</strong>,{" "}
                <strong>{coordsGuardadas.longitud.toFixed(5)}</strong>
              </span>
            ) : (
              <span>{tx("Sin ubicación guardada. Los clientes no podran filtrarte por distancia.")}</span>
            )}
            {coordsGuardadas && (
              <span className={`ml-auto inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                ubicacionManual ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}>
                {ubicacionManual ? tx("GPS manual") : tx("Aproximada por ciudad/CP")}
              </span>
            )}
          </div>

          {(errorUbicacion || gpsError || exitoUbicacion) && (
            <Banner
              tipo={errorUbicacion || gpsError ? "error" : "exito"}
              texto={errorUbicacion || gpsError || exitoUbicacion}
            />
          )}

          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleDetectarUbicacion}
              disabled={gpsDetectando || guardandoUbicacion}
              className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-40"
            >
              <SignalIcon className="h-4 w-4" />
              {gpsDetectando
                ? tx("Detectando...")
                : guardandoUbicacion
                  ? tx("Guardando...")
                  : tx("Detectar mi ubicación")}
            </button>

            {coordsGuardadas && (
              <button
                type="button"
                onClick={handleLimpiarUbicacion}
                disabled={guardandoUbicacion}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-40"
              >
                <TrashIcon className="h-4 w-4" />
                {tx("Eliminar ubicación")}
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400">
            {tx("Las coordenadas solo quedan visibles para ti en tu panel. En la parte pública solo se usa la distancia calculada.")}
          </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Configuracion;
