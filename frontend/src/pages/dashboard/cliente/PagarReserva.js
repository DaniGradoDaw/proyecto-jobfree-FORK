import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { obtenerReservaPorId } from "api/reservas";
import { crearPago, crearPaymentIntent, confirmarPago, obtenerPagoPorReserva, pagarConMonedero } from "api/pagos";
import { obtenerMonedero } from "api/monedero";
import { useLanguage } from "context/LanguageContext";

const _stripeKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
const stripePromise = _stripeKey && _stripeKey.startsWith("pk_") && _stripeKey.length > 50
  ? loadStripe(_stripeKey)
  : null;

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
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-indigo-600" />
        <div className="absolute inset-2 animate-spin rounded-full border-4 border-transparent border-t-violet-400"
          style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
      </div>
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

/* ─── Formulario Stripe ─── */
function FormularioPago({ reserva, pagoId, onExito }) {
  const { tx } = useLanguage();
  const stripe = useStripe();
  const elements = useElements();
  const [procesando, setProcesando] = useState(false);
  const [errorPago, setErrorPago] = useState("");
  const [elementListo, setElementListo] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements || !elementListo || procesando) return;
    setErrorPago("");
    setProcesando(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({ elements, redirect: "if_required" });
      if (error) {
        setErrorPago(error.message || tx("El pago no pudo procesarse."));
        setProcesando(false);
        return;
      }
      if (paymentIntent?.status === "succeeded") {
        try { await confirmarPago(pagoId); } catch (_) {}
        onExito();
      } else {
        setErrorPago(tx("Estado inesperado. Contacta con soporte."));
        setProcesando(false);
      }
    } catch (err) {
      setErrorPago(err.message || tx("Error inesperado al procesar el pago."));
      setProcesando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* PaymentElement: oculto visualmente durante el procesamiento pero permanece en el DOM
          para que stripe.confirmPayment() pueda completar la petición en vuelo */}
      <div className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${procesando ? "hidden" : ""}`}>
        <PaymentElement options={{ layout: "tabs" }} onReady={() => setElementListo(true)} />
      </div>

      {procesando && <ProcesandoPago />}

      {errorPago && !procesando && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <ExclamationTriangleIcon className="h-4 w-4 shrink-0" />
          {errorPago}
        </div>
      )}

      {!procesando && (
        <>
          <button
            type="submit"
            disabled={!stripe || !elementListo}
            className="w-full rounded-2xl py-4 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", boxShadow: "0 8px 24px rgba(79,70,229,0.35)" }}
          >
            <span className="flex items-center justify-center gap-2">
              <LockClosedIcon className="h-4 w-4" />
              Pagar {Number(reserva.precioTotal).toFixed(2)} €
            </span>
          </button>
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
        </>
      )}
    </form>
  );
}

/* ─── Pantalla de éxito ─── */
function PantallaExito({ reserva, onVerReservas }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 animate-ping rounded-full bg-emerald-200 opacity-40" style={{ animationDuration: "2s" }} />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-200">
          <CheckCircleIcon className="h-10 w-10 text-white" strokeWidth={1.5} />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-900">¡Pago completado!</h2>
      <p className="mt-1.5 text-sm text-slate-500">Tu reserva está confirmada y pagada</p>
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
      <button
        onClick={onVerReservas}
        className="mt-6 w-full rounded-2xl py-3.5 text-sm font-bold text-white shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200"
        style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}
      >
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
  const [clientSecret, setClientSecret] = useState(null);
  const [pagoId, setPagoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [yaPagado, setYaPagado] = useState(false);
  const [saldoMonedero, setSaldoMonedero] = useState(null);
  const [procesandoWallet, setProcesandoWallet] = useState(false);
  const initRef = useRef(null);

  useEffect(() => {
    // Bloquea la doble ejecución de React Strict Mode para no llamar crearPago dos veces
    if (initRef.current === reservaId) return;
    initRef.current = reservaId;

    if (!stripePromise) {
      setError("El sistema de pago no está configurado. Contacta con soporte.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const [reservaData, pagoExistente, monederoData] = await Promise.all([
          obtenerReservaPorId(reservaId),
          obtenerPagoPorReserva(reservaId),
          obtenerMonedero().catch(() => null),
        ]);
        setReserva(reservaData);
        if (monederoData?.saldo != null) setSaldoMonedero(Number(monederoData.saldo));
        if (pagoExistente?.estado === "PAGADO") { setYaPagado(true); return; }
        const pago = pagoExistente ?? (await crearPago(reservaId));
        setPagoId(pago.id);
        if (stripePromise) {
          const { clientSecret: cs, yaPagado: yaConfirmado } = await crearPaymentIntent(pago.id);
          if (yaConfirmado === "true") { setYaPagado(true); return; }
          setClientSecret(cs);
        }
      } catch (err) {
        setError(err.message || tx("No se pudo inicializar el pago."));
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservaId]);

  async function handlePagarConWallet() {
    if (!pagoId || procesandoWallet) return;
    setProcesandoWallet(true);
    try {
      await pagarConMonedero(pagoId);
      setExito(true);
    } catch (err) {
      setError(err.message || "Error al pagar con el monedero");
      setProcesandoWallet(false);
    }
  }

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
      <button
        onClick={() => navigate(-1)}
        className="mt-5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm"
      >
        {tx("Volver")}
      </button>
    </div>
  );

  if (exito && reserva) return (
    <div className="mx-auto max-w-lg">
      <PantallaExito
        reserva={reserva}
        onVerReservas={() => window.location.replace("/dashboard/cliente/reservas")}
      />
    </div>
  );

  if (yaPagado) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircleIcon className="h-9 w-9 text-emerald-500" />
      </div>
      <h2 className="text-xl font-bold text-slate-900">Reserva ya pagada</h2>
      <p className="mt-2 text-sm text-slate-500">Esta reserva ya tiene un pago confirmado.</p>
      <button
        onClick={() => navigate("/dashboard/cliente/reservas")}
        className="mt-6 rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition"
        style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}
      >
        Mis reservas
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition"
          aria-label="Volver"
        >
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

      {/* ── Pagar con monedero ── */}
      {saldoMonedero !== null && reserva && saldoMonedero >= Number(reserva.precioTotal) && (
        <div className="mb-5">
          {procesandoWallet ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-emerald-500" />
              </div>
              <p className="text-sm text-slate-500 animate-pulse">Procesando pago con monedero...</p>
            </div>
          ) : (
            <>
              <button
                onClick={handlePagarConWallet}
                className="w-full rounded-2xl py-4 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)", boxShadow: "0 8px 24px rgba(13,148,136,0.35)" }}
              >
                <span className="flex items-center justify-center gap-2">
                  <BanknotesIcon className="h-4 w-4" />
                  Pagar con monedero · Saldo: {Number(saldoMonedero).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                </span>
              </button>
              {clientSecret && (
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400 shrink-0">o paga con tarjeta</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {clientSecret && !procesandoWallet && (
        <Elements
          key={clientSecret}
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: { theme: "stripe", variables: { colorPrimary: "#4f46e5", borderRadius: "12px" } },
          }}
        >
          <FormularioPago reserva={reserva} pagoId={pagoId} onExito={() => setExito(true)} />
        </Elements>
      )}
    </div>
  );
}

export default PagarReserva;
