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
  BriefcaseIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "context/AuthContext";
import { actualizarMiUsuario, subirFotoPerfil } from "api/usuario";
import { obtenerMiPerfil, actualizarMiPerfil } from "api/profesional";
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
  const [formOriginal, setFormOriginal] = useState({ nombre: "", apellidos: "", telefono: "", ciudad: "", direccion: "" });
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
  const [formPro, setFormPro] = useState({ descripcion: "", codigoPostal: "", nombreEmpresa: "", cif: "" });
  const [formProOriginal, setFormProOriginal] = useState({ descripcion: "", codigoPostal: "", nombreEmpresa: "", cif: "" });
  const [guardandoPro, setGuardandoPro] = useState(false);
  const [exitoPro, setExitoPro] = useState(false);
  const [errorPro, setErrorPro] = useState("");


  useEffect(() => {
    cargarUsuarioActual()
      .then(u => {
        setEmailActual(u.email || "");
        const initialForm = {
          nombre: u.nombre || "",
          apellidos: u.apellidos || "",
          telefono: u.telefono || "",
          ciudad: u.ciudad || "",
          direccion: u.direccion || "",
        };
        setForm(initialForm);
        setFormOriginal(initialForm);
        setFotoUrlActual(u.fotoUrl || null);

        const esPro = u.rol?.toLowerCase() === "profesional";
        setEsProfesional(esPro);

        if (esPro) {
          obtenerMiPerfil()
            .then(p => {
              setPerfilPro(p);
              const initialPro = {
                descripcion: p.descripcion || "",
                codigoPostal: p.codigoPostal || "",
                nombreEmpresa: p.nombreEmpresa || "",
                cif: p.cif || "",
              };
              setFormPro(initialPro);
              setFormProOriginal(initialPro);
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
  const hayDirtyPersonal = !!archivoFoto || JSON.stringify(form) !== JSON.stringify(formOriginal);
  const hayDirtyPro = JSON.stringify(formPro) !== JSON.stringify(formProOriginal);
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
      setFormOriginal({ ...form });
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
        codigoPostal: formPro.codigoPostal,
        nombreEmpresa: formPro.nombreEmpresa,
        cif: formPro.cif || null,
        plan: perfilPro.plan,
      });
      setPerfilPro(perfil);
      setFormProOriginal({ ...formPro });
      setExitoPro(true);
      setTimeout(() => setExitoPro(false), 4000);
    } catch (err) {
      setErrorPro(err.message || tx("Error al guardar el perfil"));
    } finally {
      setGuardandoPro(false);
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
    ...(esProfesional ? [{ id: "profesional", label: tx("Profesional") }] : []),
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
            className={`flex-1 rounded-lg py-2 px-3 text-sm font-semibold transition-all ${
              tabActiva === t.id
                ? "bg-white text-emerald-600 shadow-sm"
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

            <div className="flex items-center justify-end gap-3 pt-1">
              {hayDirtyPersonal && !guardandoPersonal && (
                <span className="text-xs text-amber-600 font-medium">{tx("Cambios sin guardar")}</span>
              )}
              <button type="submit" disabled={guardandoPersonal || !formularioPersonalValido || !hayDirtyPersonal}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-40">
                {guardandoPersonal ? tx("Guardando...") : tx("Guardar cambios")}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ── Pestaña: Seguridad ── */}
      {tabActiva === "seguridad" && (
        <form onSubmit={handleGuardarPassword} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <ShieldCheckIcon className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">{tx("Cambiar contraseña")}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{tx("Deja los campos vacíos si no quieres cambiarla.")}</p>
            </div>
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
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-40">
                {guardandoPw ? tx("Guardando...") : tx("Cambiar contraseña")}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ── Pestaña: Profesional ── */}
      {tabActiva === "profesional" && esProfesional && (
        <form onSubmit={handleGuardarProfesional} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white px-6 py-4 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
              <BriefcaseIcon className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">{tx("Perfil profesional")}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{tx("Información visible en tus anuncios de servicio.")}</p>
            </div>
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
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none transition"
              />
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

            <div className="flex items-center justify-end gap-3">
              {hayDirtyPro && !guardandoPro && (
                <span className="text-xs text-amber-600 font-medium">{tx("Cambios sin guardar")}</span>
              )}
              <button type="submit" disabled={guardandoPro || !hayDirtyPro}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-40">
                {guardandoPro ? tx("Guardando...") : tx("Guardar perfil")}
              </button>
            </div>
          </div>
        </form>
      )}

    </div>
  );
}

export default Configuracion;
