import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { obtenerReservaPorId } from "api/reservas";
import { crearPago, crearPaymentIntent, obtenerPagoPorReserva, simularPago } from "api/pagos";
import { useLanguage } from "context/LanguageContext";

const _stripeKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
const stripePromise = _stripeKey && _stripeKey.startsWith("pk_") && _stripeKey.length > 50
  ? loadStripe(_stripeKey)
  : null;

/* ─── Helpers ─── */
function formatNumero(val) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
}
function formatExpiry(val) {
  const d = val.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
}
function detectarTipo(numero) {
  const d = numero.replace(/\s/g, "");
  if (d.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return "mastercard";
  if (/^3[47]/.test(d)) return "amex";
  return null;
}

/* ─── Chip SVG ─── */
function ChipSVG() {
  return (
    <svg viewBox="0 0 50 38" className="h-8 w-12" fill="none">
      <rect width="50" height="38" rx="6" fill="#D4A843" />
      <rect x="1" y="1" width="48" height="36" rx="5" fill="url(#chipGrad)" />
      <rect x="16" y="0" width="18" height="38" fill="#C49A2E" opacity="0.35" />
      <rect x="0" y="12" width="50" height="14" fill="#C49A2E" opacity="0.35" />
      <rect x="16" y="12" width="18" height="14" rx="2" fill="#E8C04A" opacity="0.5" />
      <line x1="16" y1="0" x2="16" y2="38" stroke="#B8880A" strokeWidth="0.5" opacity="0.5" />
      <line x1="34" y1="0" x2="34" y2="38" stroke="#B8880A" strokeWidth="0.5" opacity="0.5" />
      <line x1="0" y1="12" x2="50" y2="12" stroke="#B8880A" strokeWidth="0.5" opacity="0.5" />
      <line x1="0" y1="26" x2="50" y2="26" stroke="#B8880A" strokeWidth="0.5" opacity="0.5" />
      <defs>
        <linearGradient id="chipGrad" x1="0" y1="0" x2="50" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E8C04A" />
          <stop offset="1" stopColor="#C49A2E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Icono NFC ─── */
function NfcIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M20.5 12a8.5 8.5 0 01-8.5 8.5v1.5A10 10 0 0022.5 12h-2zm-8.5 7a7 7 0 01-7-7h-1.5A8.5 8.5 0 0012 20.5V19zm-7-7a7 7 0 017-7V3.5A8.5 8.5 0 003.5 12H5zm7-7a7 7 0 017 7h1.5A8.5 8.5 0 0012 3.5V5z" opacity="0.4" />
      <path d="M17 12a5 5 0 01-5 5v1.5A6.5 6.5 0 0018.5 12H17zm-5 3.5a3.5 3.5 0 01-3.5-3.5H7A5 5 0 0012 17v-1.5zm-3.5-3.5A3.5 3.5 0 0112 8.5V7A5 5 0 007 12h1.5zm3.5-3.5A3.5 3.5 0 0115.5 12H17A5 5 0 0012 7v1.5z" opacity="0.7" />
      <circle cx="12" cy="12" r="1.5" />
    </svg>
  );
}

/* ─── Logos de red ─── */
function LogoRed({ tipo }) {
  if (tipo === "visa") return (
    <span className="font-black italic text-white text-xl tracking-tight leading-none">VISA</span>
  );
  if (tipo === "mastercard") return (
    <span className="inline-flex items-center">
      <span className="h-7 w-7 rounded-full bg-red-500" style={{ opacity: 0.95 }} />
      <span className="-ml-3.5 h-7 w-7 rounded-full bg-yellow-400" style={{ opacity: 0.9 }} />
    </span>
  );
  if (tipo === "amex") return (
    <span className="font-black text-white text-sm tracking-widest">AMEX</span>
  );
  return null;
}

/* ─── Vista previa de tarjeta ─── */
function TarjetaPreview({ numero, titular, expiry, tipo }) {
  const numMostrado = numero.padEnd(19, "·");
  const expMostrado = expiry || "MM/AA";
  const titularMostrado = (titular || "NOMBRE APELLIDO").toUpperCase();

  return (
    <div className="relative h-48 w-full overflow-hidden rounded-2xl select-none"
      style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 35%, #4338ca 65%, #1e1b4b 100%)" }}>

      {/* Brillo superior */}
      <div className="absolute inset-0 opacity-30"
        style={{ background: "radial-gradient(ellipse at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 60%)" }} />

      {/* Patrón de líneas decorativas */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute w-full border-t border-white/40"
            style={{ top: `${15 + i * 14}%`, transform: `rotate(-8deg) scaleX(1.4)`, transformOrigin: "left" }} />
        ))}
      </div>

      {/* Círculo decorativo fondo */}
      <div className="absolute -right-16 -bottom-16 h-56 w-56 rounded-full border border-white/10" />
      <div className="absolute -right-8 -bottom-8 h-40 w-40 rounded-full border border-white/10" />

      <div className="relative flex h-full flex-col justify-between p-5">
        {/* Fila superior: chip + NFC */}
        <div className="flex items-center justify-between">
          <ChipSVG />
          <NfcIcon className="h-6 w-6 text-white/50" />
        </div>

        {/* Número */}
        <p className="font-mono text-xl font-light tracking-[0.25em] text-white/90 tabular-nums">
          {numMostrado}
        </p>

        {/* Fila inferior: titular + caducidad + logo */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/40 mb-0.5">Titular</p>
            <p className="text-sm font-medium tracking-wide text-white/90 max-w-[160px] truncate">{titularMostrado}</p>
          </div>
          <div className="flex items-end gap-4">
            <div className="text-right">
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/40 mb-0.5">Válida</p>
              <p className="text-sm font-medium text-white/90">{expMostrado}</p>
            </div>
            {tipo && <LogoRed tipo={tipo} />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Estado de procesamiento ─── */
function ProcesandoPago() {
  const [paso, setPaso] = useState(0);
  const pasos = ["Verificando datos...", "Procesando pago...", "Confirmando transacción..."];

  useEffect(() => {
    const t1 = setTimeout(() => setPaso(1), 600);
    const t2 = setTimeout(() => setPaso(2), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-5">
      {/* Spinner doble */}
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-indigo-600" />
        <div className="absolute inset-2 animate-spin rounded-full border-4 border-transparent border-t-violet-400"
          style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
      </div>

      {/* Pasos */}
      <div className="space-y-2 text-center">
        {pasos.map((p, i) => (
          <div key={i} className={`flex items-center gap-2 text-sm transition-all duration-500 ${
            i < paso ? "text-indigo-600 font-medium" :
            i === paso ? "text-slate-800 font-semibold" :
            "text-slate-300"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
              i < paso ? "bg-indigo-500" :
              i === paso ? "bg-slate-700" :
              "bg-slate-200"
            }`} />
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Formulario de simulación ─── */
function FormularioSimulacion({ reserva, pagoId, onExito }) {
  const { tx } = useLanguage();
  const [procesando, setProcesando] = useState(false);
  const [errorPago, setErrorPago] = useState("");
  const [campos, setCampos] = useState({ titular: "", numero: "", expiry: "", cvv: "" });
  const [cvvVisible, setCvvVisible] = useState(false);
  const [focused, setFocused] = useState(null);

  const tipo = detectarTipo(campos.numero);
  const digitos = campos.numero.replace(/\s/g, "");

  function handleChange(e) {
    const { name, value } = e.target;
    let v = value;
    if (name === "numero") v = formatNumero(value);
    if (name === "expiry") v = formatExpiry(value);
    if (name === "cvv") v = value.replace(/\D/g, "").slice(0, tipo === "amex" ? 4 : 3);
    setCampos(prev => ({ ...prev, [name]: v }));
    setErrorPago("");
  }

  function validar() {
    if (!campos.titular.trim()) return "El nombre del titular es obligatorio";
    if (digitos.length < 13) return "El número de tarjeta no es válido";
    if (!/^\d{2}\/\d{2}$/.test(campos.expiry)) return "Fecha de caducidad inválida (MM/AA)";
    const [mes, anio] = campos.expiry.split("/").map(Number);
    if (mes < 1 || mes > 12) return "El mes no es válido";
    if (new Date(2000 + anio, mes) <= new Date()) return "La tarjeta está caducada";
    if (campos.cvv.length < (tipo === "amex" ? 4 : 3)) return "Código de seguridad incompleto";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validar();
    if (err) { setErrorPago(err); return; }
    setProcesando(true);
    setErrorPago("");
    await new Promise(r => setTimeout(r, 2000));
    try {
      await simularPago(pagoId);
      onExito();
    } catch (ex) {
      setErrorPago(ex.message || tx("No se pudo procesar el pago."));
      setProcesando(false);
    }
  }

  const inputBase = "w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none";
  const rowBase = (name) =>
    `flex items-center gap-3 px-4 py-3.5 transition-colors ${
      focused === name ? "bg-indigo-50/60" : "hover:bg-slate-50/70"
    }`;

  if (procesando) return <ProcesandoPago />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Tarjeta preview */}
      <TarjetaPreview
        numero={campos.numero || ""}
        titular={campos.titular}
        expiry={campos.expiry}
        tipo={tipo}
      />

      {/* Campos agrupados */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Titular */}
        <div className={rowBase("titular")}>
          <UserIcon className="h-4 w-4 shrink-0 text-slate-400" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">Titular</p>
            <input
              type="text" name="titular" value={campos.titular}
              onChange={handleChange}
              onFocus={() => setFocused("titular")}
              onBlur={() => setFocused(null)}
              placeholder="Nombre como aparece en la tarjeta"
              autoComplete="cc-name"
              className={inputBase}
            />
          </div>
        </div>

        <div className="h-px bg-slate-100 mx-4" />

        {/* Número */}
        <div className={rowBase("numero")}>
          <CreditCardIcon className="h-4 w-4 shrink-0 text-slate-400" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">Número de tarjeta</p>
            <input
              type="text" name="numero" value={campos.numero}
              onChange={handleChange}
              onFocus={() => setFocused("numero")}
              onBlur={() => setFocused(null)}
              placeholder="1234 5678 9012 3456"
              autoComplete="cc-number" inputMode="numeric"
              className={`${inputBase} font-mono tracking-wider`}
            />
          </div>
          {tipo && (
            <div className="shrink-0">
              {tipo === "visa" && <span className="font-black italic text-blue-700 text-sm">VISA</span>}
              {tipo === "mastercard" && (
                <span className="inline-flex">
                  <span className="h-5 w-5 rounded-full bg-red-500" />
                  <span className="-ml-2.5 h-5 w-5 rounded-full bg-yellow-400" />
                </span>
              )}
              {tipo === "amex" && <span className="font-bold text-blue-600 text-xs">AMEX</span>}
            </div>
          )}
        </div>

        {digitos.length > 0 && digitos.length < 13 && (
          <p className="px-4 pb-2 text-xs text-red-500">Número incompleto</p>
        )}

        <div className="h-px bg-slate-100 mx-4" />

        {/* Caducidad + CVV */}
        <div className="grid grid-cols-2 divide-x divide-slate-100">
          <div className={rowBase("expiry")}>
            <CalendarDaysIcon className="h-4 w-4 shrink-0 text-slate-400" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">Caducidad</p>
              <input
                type="text" name="expiry" value={campos.expiry}
                onChange={handleChange}
                onFocus={() => setFocused("expiry")}
                onBlur={() => setFocused(null)}
                placeholder="MM/AA"
                autoComplete="cc-exp" inputMode="numeric"
                className={inputBase}
              />
            </div>
          </div>

          <div className={rowBase("cvv")}>
            <ShieldCheckIcon className="h-4 w-4 shrink-0 text-slate-400" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
                {tipo === "amex" ? "CID (4 díg.)" : "CVV"}
              </p>
              <div className="flex items-center gap-1">
                <input
                  type={cvvVisible ? "text" : "password"}
                  name="cvv" value={campos.cvv}
                  onChange={handleChange}
                  onFocus={() => setFocused("cvv")}
                  onBlur={() => setFocused(null)}
                  placeholder="···"
                  autoComplete="cc-csc" inputMode="numeric"
                  className={`${inputBase} w-14`}
                />
                <button type="button" tabIndex={-1}
                  onClick={() => setCvvVisible(v => !v)}
                  className="text-slate-300 hover:text-slate-500 transition-colors">
                  {cvvVisible
                    ? <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" /></svg>
                    : <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {errorPago && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <ExclamationTriangleIcon className="h-4 w-4 shrink-0" />
          {errorPago}
        </div>
      )}

      {/* Botón pagar */}
      <button
        type="submit"
        className="relative w-full overflow-hidden rounded-2xl py-4 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
        style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", boxShadow: "0 8px 24px rgba(79,70,229,0.35)" }}
      >
        <span className="flex items-center justify-center gap-2">
          <LockClosedIcon className="h-4 w-4" />
          Pagar {Number(reserva.precioTotal).toFixed(2)} €
        </span>
      </button>

      {/* Sellos de seguridad */}
      <div className="flex items-center justify-center gap-4 pt-1">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <LockClosedIcon className="h-3 w-3" />
          SSL 256-bit
        </div>
        <span className="text-slate-200">·</span>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheckIcon className="h-3 w-3" />
          Pago seguro
        </div>
        <span className="text-slate-200">·</span>
        <span className="text-[11px] text-slate-400">Datos cifrados</span>
      </div>
    </form>
  );
}

/* ─── Formulario Stripe real ─── */
function FormularioPago({ reserva, onExito }) {
  const { tx } = useLanguage();
  const stripe = useStripe();
  const elements = useElements();
  const [procesando, setProcesando] = useState(false);
  const [errorPago, setErrorPago] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcesando(true);
    setErrorPago("");
    const { error, paymentIntent } = await stripe.confirmPayment({ elements, redirect: "if_required" });
    if (error) { setErrorPago(error.message || tx("El pago no pudo procesarse.")); setProcesando(false); return; }
    if (paymentIntent?.status === "succeeded") { onExito(); }
    else { setErrorPago(tx("Estado inesperado. Contacta con soporte.")); setProcesando(false); }
  }

  if (procesando) return <ProcesandoPago />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>
      {errorPago && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <ExclamationTriangleIcon className="h-4 w-4 shrink-0" />{errorPago}
        </div>
      )}
      <button type="submit" disabled={!stripe}
        className="w-full rounded-2xl py-4 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", boxShadow: "0 8px 24px rgba(79,70,229,0.35)" }}>
        <span className="flex items-center justify-center gap-2">
          <LockClosedIcon className="h-4 w-4" />
          Pagar {Number(reserva.precioTotal).toFixed(2)} €
        </span>
      </button>
    </form>
  );
}

/* ─── Pantalla de éxito ─── */
function PantallaExito({ reserva, onVerReservas }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      {/* Anillo animado + check */}
      <div className="relative mb-6">
        <div className="absolute inset-0 animate-ping rounded-full bg-emerald-200 opacity-40" style={{ animationDuration: "2s" }} />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-200">
          <CheckCircleIcon className="h-10 w-10 text-white" strokeWidth={1.5} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900">¡Pago completado!</h2>
      <p className="mt-1.5 text-sm text-slate-500">Tu reserva está confirmada y pagada</p>

      {/* Recibo */}
      <div className="mt-6 w-full rounded-2xl border border-slate-100 bg-slate-50 p-5 text-left shadow-sm">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Resumen de la transacción</p>
        <div className="space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Servicio</span>
            <span className="font-medium text-slate-900 text-right max-w-[60%]">{reserva.servicioTitulo}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Profesional</span>
            <span className="font-medium text-slate-900">{reserva.profesionalNombre}</span>
          </div>
          <div className="h-px bg-slate-200" />
          <div className="flex justify-between">
            <span className="text-sm font-semibold text-slate-700">Total pagado</span>
            <span className="text-lg font-bold text-emerald-600">{Number(reserva.precioTotal).toFixed(2)} €</span>
          </div>
        </div>
      </div>

      <button onClick={onVerReservas}
        className="mt-6 w-full rounded-2xl py-3.5 text-sm font-bold text-white shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200"
        style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}>
        Ver mis reservas
      </button>
    </div>
  );
}

/* ─── Página principal ─── */
function PagarReserva() {
  const { reservaId } = useParams();
  const navigate = useNavigate();
  const { tx } = useLanguage();

  const [reserva, setReserva] = useState(null);
  const [pagoId, setPagoId] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [yaPagado, setYaPagado] = useState(false);

  const inicializar = useCallback(async () => {
    try {
      const [reservaData, pagoExistente] = await Promise.all([
        obtenerReservaPorId(reservaId),
        obtenerPagoPorReserva(reservaId),
      ]);
      setReserva(reservaData);
      if (pagoExistente?.estado === "PAGADO") { setYaPagado(true); return; }
      const pago = pagoExistente ?? (await crearPago(reservaId));
      setPagoId(pago.id);
      if (stripePromise) {
        const { clientSecret: cs } = await crearPaymentIntent(pago.id);
        setClientSecret(cs);
      }
    } catch (err) {
      setError(err.message || tx("No se pudo inicializar el pago."));
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservaId]);

  useEffect(() => { inicializar(); }, [inicializar]);

  /* ── Estados de carga / error / éxito ── */
  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-indigo-600" />
      </div>
      <p className="text-sm text-slate-500 animate-pulse">Preparando el pago...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="font-semibold text-slate-800">Ha ocurrido un error</h3>
      <p className="mt-1 text-sm text-red-600 max-w-xs">{error}</p>
      <button onClick={() => navigate(-1)}
        className="mt-5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm">
        {tx("Volver")}
      </button>
    </div>
  );

  if (exito && reserva) return (
    <div className="mx-auto max-w-lg">
      <PantallaExito reserva={reserva} onVerReservas={() => navigate("/dashboard/cliente/reservas")} />
    </div>
  );

  if (yaPagado) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircleIcon className="h-9 w-9 text-emerald-500" />
      </div>
      <h2 className="text-xl font-bold text-slate-900">Reserva ya pagada</h2>
      <p className="mt-2 text-sm text-slate-500">Esta reserva ya tiene un pago confirmado.</p>
      <button onClick={() => navigate("/dashboard/cliente/reservas")}
        className="mt-6 rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition"
        style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}>
        Mis reservas
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-lg">
      {/* Cabecera */}
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => navigate(-1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition"
          aria-label="Volver">
          <ArrowLeftIcon className="h-4 w-4 text-slate-600" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900">Completar pago</h1>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <LockClosedIcon className="h-3 w-3" />
            Conexión segura cifrada
          </p>
        </div>
      </div>

      {/* Resumen de reserva */}
      {reserva && (
        <div className="mb-5 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                <CreditCardIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 leading-tight">{reserva.servicioTitulo}</p>
                <p className="text-xs text-slate-500 mt-0.5">{reserva.profesionalNombre}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-black text-indigo-700 tabular-nums">{Number(reserva.precioTotal).toFixed(2)}€</p>
            </div>
          </div>
        </div>
      )}

      {/* Formulario */}
      {stripePromise && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe", variables: { colorPrimary: "#4f46e5", borderRadius: "12px" } } }}>
          <FormularioPago reserva={reserva} onExito={() => setExito(true)} />
        </Elements>
      )}

      {!stripePromise && pagoId && reserva && (
        <FormularioSimulacion reserva={reserva} pagoId={pagoId} onExito={() => setExito(true)} />
      )}
    </div>
  );
}

export default PagarReserva;
