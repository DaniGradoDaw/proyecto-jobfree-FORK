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
} from "@heroicons/react/24/outline";
import { obtenerReservaPorId } from "api/reservas";
import { crearPago, crearPaymentIntent, obtenerPagoPorReserva } from "api/pagos";
import { useLanguage } from "context/LanguageContext";

const stripePromise = process.env.REACT_APP_STRIPE_PUBLIC_KEY
  ? loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)
  : null;

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

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setErrorPago(error.message || tx("El pago no pudo procesarse. Intenta de nuevo."));
      setProcesando(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      onExito();
    } else {
      setErrorPago(tx("Estado de pago inesperado. Contacta con soporte."));
      setProcesando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {errorPago && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <ExclamationTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" />
          {errorPago}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || procesando}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {procesando ? (
          <>
            <ArrowPathIcon className="h-4 w-4 animate-spin" />
            {tx("Procesando...")}
          </>
        ) : (
          <>
            <CreditCardIcon className="h-4 w-4" />
            {tx("Pagar {importe}€", { importe: Number(reserva.precioTotal).toFixed(2) })}
          </>
        )}
      </button>
    </form>
  );
}

function PagarReserva() {
  const { reservaId } = useParams();
  const navigate = useNavigate();
  const { tx } = useLanguage();

  const [reserva, setReserva] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [yaPagedo, setYaPagado] = useState(false);

  const inicializar = useCallback(async () => {
    try {
      const [reservaData, pagoExistente] = await Promise.all([
        obtenerReservaPorId(reservaId),
        obtenerPagoPorReserva(reservaId),
      ]);
      setReserva(reservaData);

      if (pagoExistente?.estado === "PAGADO") {
        setYaPagado(true);
        return;
      }

      const pago = pagoExistente ?? (await crearPago(reservaId));
      const { clientSecret: cs } = await crearPaymentIntent(pago.id);
      setClientSecret(cs);
    } catch (err) {
      setError(err.message || tx("No se pudo inicializar el pago."));
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservaId]);

  useEffect(() => {
    inicializar();
  }, [inicializar]);

  if (!stripePromise) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ExclamationTriangleIcon className="mb-3 h-10 w-10 text-amber-400" />
        <p className="text-sm font-semibold text-slate-700">
          {tx("Stripe no esta configurado.")}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {tx("Añade REACT_APP_STRIPE_PUBLIC_KEY al .env del frontend.")}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
        {tx("Preparando el pago...")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ExclamationTriangleIcon className="mb-3 h-10 w-10 text-red-400" />
        <p className="text-sm font-semibold text-red-700">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-sm text-slate-500 underline underline-offset-2 hover:text-slate-700"
        >
          {tx("Volver")}
        </button>
      </div>
    );
  }

  if (exito) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircleIcon className="h-9 w-9 text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{tx("Pago realizado")}</h2>
        <p className="mt-2 text-sm text-slate-500">
          {tx("Tu pago de {importe}€ se ha procesado correctamente.", {
            importe: Number(reserva.precioTotal).toFixed(2),
          })}
        </p>
        <button
          onClick={() => navigate("/dashboard/cliente/reservas")}
          className="mt-6 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition"
        >
          {tx("Ver mis reservas")}
        </button>
      </div>
    );
  }

  if (yaPagedo) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircleIcon className="h-9 w-9 text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{tx("Ya esta pagado")}</h2>
        <p className="mt-2 text-sm text-slate-500">
          {tx("Esta reserva ya tiene un pago confirmado.")}
        </p>
        <button
          onClick={() => navigate("/dashboard/cliente/reservas")}
          className="mt-6 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition"
        >
          {tx("Mis reservas")}
        </button>
      </div>
    );
  }

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#1e293b",
      borderRadius: "10px",
      fontFamily: "inherit",
    },
  };

  return (
    <div className="mx-auto max-w-lg">
      {/* Cabecera */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition"
          aria-label={tx("Volver")}
        >
          <ArrowLeftIcon className="h-4 w-4 text-slate-600" />
        </button>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100">
          <CreditCardIcon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{tx("Completar pago")}</h1>
          <p className="text-sm text-slate-500">{tx("Pago seguro procesado por Stripe")}</p>
        </div>
      </div>

      {/* Resumen de la reserva */}
      {reserva && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
            {tx("Resumen")}
          </p>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900 leading-tight">{reserva.servicioTitulo}</p>
              <p className="mt-0.5 text-sm text-slate-500">{reserva.profesionalNombre}</p>
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              {Number(reserva.precioTotal).toFixed(2)}€
            </p>
          </div>
        </div>
      )}

      {/* Stripe Elements */}
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
          <FormularioPago reserva={reserva} onExito={() => setExito(true)} />
        </Elements>
      )}
    </div>
  );
}

export default PagarReserva;
