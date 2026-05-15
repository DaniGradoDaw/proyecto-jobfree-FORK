import { useEffect, useState } from "react";
import { obtenerMisFacturas } from "api/pagos";
import { obtenerMonedero, obtenerMovimientos, iniciarRecarga, confirmarRecarga, getCuentaBancaria, saveCuentaBancaria } from "api/monedero";
import {
    ArrowUpCircleIcon, ArrowDownCircleIcon,
    PlusIcon, BuildingLibraryIcon,
    CheckCircleIcon, XMarkIcon, ChevronRightIcon, PencilIcon,
} from "@heroicons/react/24/outline";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "context/AuthContext";
import jsPDF from "jspdf";
import logoJobFree from "assets/images/logo.png";

// Stripe se inicializa solo cuando el modal de recarga se abre (lazy)
let _stripePromise = null;
function getStripePromise() {
    if (!_stripePromise) {
        const k = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
        if (k && k.startsWith("pk_")) _stripePromise = loadStripe(k);
    }
    return _stripePromise;
}

const ESTADOS = {
    PAGADO:      { label: "Pagado",      cls: "bg-emerald-100 text-emerald-700" },
    PENDIENTE:   { label: "Pendiente",   cls: "bg-amber-100 text-amber-700"     },
    REEMBOLSADO: { label: "Reembolsado", cls: "bg-sky-100 text-sky-700"         },
};

function fmt(dt) {
    if (!dt) return "—";
    const d = new Date(dt);
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtImporte(v) {
    return Number(v).toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

// ── HTML para la vista previa ──────────────────────────────────────────────
const ESTADO_BADGE = {
    PAGADO:      { label: "Pagado",      bg: "#d1fae5", color: "#065f46" },
    REEMBOLSADO: { label: "Reembolsado", bg: "#dbeafe", color: "#1d4ed8" },
    PENDIENTE:   { label: "Pendiente",   bg: "#fef3c7", color: "#92400e" },
};

function generarHtmlFactura(factura) {
    const fecha        = fmt(factura.fechaPago);
    const fechaServicio= fmt(factura.fechaServicio);
    const importe      = fmtImporte(factura.importe);
    const iva  = (Number(factura.importe) * 0.21).toLocaleString("es-ES", { style: "currency", currency: "EUR" });
    const base = (Number(factura.importe) / 1.21).toLocaleString("es-ES",  { style: "currency", currency: "EUR" });
    const logoUrl = window.location.origin + logoJobFree;
    const badge = ESTADO_BADGE[factura.estado] ?? ESTADO_BADGE.PAGADO;

    return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Arial,sans-serif;color:#1f2937;background:#fff;padding:40px;font-size:14px}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px}
.brand{display:flex;align-items:center;gap:10px}
.brand img{height:44px;width:44px;object-fit:contain}
.brand-name{font-size:22px;font-weight:800;color:#059669}
.factura-info{text-align:right}
.num{font-size:18px;font-weight:700}
.fecha{color:#6b7280;margin-top:4px;font-size:13px}
.badge{display:inline-block;margin-top:8px;padding:3px 12px;border-radius:999px;font-size:12px;font-weight:600;background:#dbeafe;color:#1d4ed8}
hr{border:none;border-top:2px solid #e5e7eb;margin:20px 0}
.partes{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:28px}
.parte h3{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;margin-bottom:6px}
.parte .nombre{font-weight:700;font-size:15px;margin-bottom:4px}
.parte p{color:#6b7280;font-size:13px;line-height:1.6}
table{width:100%;border-collapse:collapse;margin-bottom:20px}
thead th{background:#f9fafb;padding:9px 12px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:#6b7280;border-bottom:1px solid #e5e7eb}
tbody td{padding:13px 12px;border-bottom:1px solid #f3f4f6;vertical-align:top;font-size:13px}
.totales{width:250px;margin-left:auto}
.fila{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#6b7280}
.total-row{display:flex;justify-content:space-between;font-size:15px;font-weight:700;color:#111827;border-top:2px solid #e5e7eb;padding-top:10px;margin-top:4px}
.footer{margin-top:40px;text-align:center;font-size:11px;color:#9ca3af}
</style></head><body>
<div class="header">
  <div class="brand">
    <img src="${logoUrl}" alt="JobFree"/>
    <span class="brand-name">JobFree</span>
  </div>
  <div class="factura-info">
    <div class="num">${factura.numeroFactura}</div>
    <div class="fecha">Emitida: ${fecha}</div>
    <span class="badge" style="background:${badge.bg};color:${badge.color}">${badge.label}</span>
  </div>
</div>
<hr/>
<div class="partes">
  <div class="parte">
    <h3>Emisor</h3>
    <div class="nombre">JobFree</div>
    <p>soporte@jobfree.com<br/>Av. Blas Infante, 18<br/>Écija (Sevilla)</p>
  </div>
  <div class="parte">
    <h3>Cliente</h3>
    <div class="nombre">${factura.clienteNombre}</div>
    <p>${factura.clienteEmail}</p>
  </div>
</div>
<table>
  <thead><tr>
    <th>Descripción</th><th>Profesional</th><th>Fecha servicio</th><th>Método</th>
    <th style="text-align:right">Importe</th>
  </tr></thead>
  <tbody><tr>
    <td><strong>${factura.servicioTitulo}</strong><br/><span style="color:#9ca3af;font-size:12px">Reserva #${factura.reservaId}</span></td>
    <td>${factura.profesionalNombre}</td>
    <td>${fechaServicio}</td>
    <td>${factura.metodo}</td>
    <td style="text-align:right;font-weight:600">${importe}</td>
  </tr></tbody>
</table>
<div class="totales">
  <div class="fila"><span>Base imponible</span><span>${base}</span></div>
  <div class="fila"><span>IVA (21%)</span><span>${iva}</span></div>
  <div class="total-row"><span>Total</span><span>${importe}</span></div>
</div>
<div class="footer">
  <p>Gracias por confiar en JobFree · Este documento tiene validez como recibo de pago</p>
  <p style="margin-top:4px">Generado el ${new Date().toLocaleDateString("es-ES")}</p>
</div>
</body></html>`;
}

// ── Carga imagen como base64 para jsPDF ───────────────────────────────────
function cargarImagenBase64(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width  = img.width;
            canvas.height = img.height;
            canvas.getContext("2d").drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = () => resolve(null);
        img.src = src;
    });
}

// ── Genera y descarga el PDF ──────────────────────────────────────────────
async function descargarFactura(factura) {
    const doc  = new jsPDF();
    const W    = doc.internal.pageSize.getWidth();
    const gray = [107, 114, 128];
    const dark = [31,  41,  55 ];

    // Logo
    const logoBase64 = await cargarImagenBase64(window.location.origin + logoJobFree);
    if (logoBase64) {
        doc.addImage(logoBase64, "PNG", 20, 13, 12, 12);
    }
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(5, 150, 105);
    doc.text("JobFree", 34, 22);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    doc.text("Plataforma de servicios del hogar", 20, 31);

    // Número y fecha (derecha)
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text(factura.numeroFactura, W - 20, 20, { align: "right" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    doc.text(`Emitida: ${fmt(factura.fechaPago)}`, W - 20, 27, { align: "right" });

    // Badge estado
    const pdfBadge = {
        PAGADO:      { label: "Pagado",      fill: [209, 250, 229], text: [6, 95, 70]   },
        REEMBOLSADO: { label: "Reembolsado", fill: [219, 234, 254], text: [29, 78, 216] },
        PENDIENTE:   { label: "Pendiente",   fill: [254, 243, 199], text: [146, 64, 14] },
    };
    const bDef = pdfBadge[factura.estado] ?? pdfBadge.PAGADO;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    const badgeW = doc.getTextWidth(bDef.label) + 6;
    const badgeX = W - 20 - badgeW;
    doc.setFillColor(...bDef.fill);
    doc.roundedRect(badgeX, 30, badgeW, 6.5, 1.5, 1.5, "F");
    doc.setTextColor(...bDef.text);
    doc.text(bDef.label, badgeX + badgeW / 2, 34.5, { align: "center" });

    // Separador
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 41, W - 20, 41);

    // Emisor / Cliente
    const pY = 50;
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...gray);
    doc.text("EMISOR",   20,       pY);
    doc.text("CLIENTE",  W/2 + 5,  pY);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text("JobFree",              20,      pY + 7);
    doc.text(factura.clienteNombre,  W/2+5,   pY + 7);

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    doc.text("soporte@jobfree.com",              20,     pY + 14);
    doc.text("Av. Blas Infante, 18 — Écija",     20,     pY + 20);
    doc.text(factura.clienteEmail,               W/2+5,  pY + 14);

    // Tabla
    const tY = 86;
    doc.setFillColor(249, 250, 251);
    doc.rect(20, tY, W - 40, 9, "F");
    doc.setDrawColor(229, 231, 235);
    doc.line(20, tY,     W-20, tY);
    doc.line(20, tY + 9, W-20, tY + 9);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...gray);
    doc.text("DESCRIPCIÓN",    22,     tY + 6);
    doc.text("PROFESIONAL",    105,    tY + 6);
    doc.text("FECHA SERVICIO", 148,    tY + 6);
    doc.text("IMPORTE",        W - 22, tY + 6, { align: "right" });

    const rY = tY + 20;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text(doc.splitTextToSize(factura.servicioTitulo, 75)[0], 22, rY);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    doc.text(`Reserva #${factura.reservaId}`, 22, rY + 6);

    doc.setFontSize(9);
    doc.setTextColor(...dark);
    doc.text(factura.profesionalNombre, 105,    rY);
    doc.text(fmt(factura.fechaServicio), 148,    rY);
    doc.setFont("helvetica", "bold");
    doc.text(fmtImporte(factura.importe), W - 22, rY, { align: "right" });

    doc.setDrawColor(243, 244, 246);
    doc.line(20, rY + 13, W - 20, rY + 13);

    // Totales
    const totY = rY + 28;
    const base = Number(factura.importe) / 1.21;
    const iva  = Number(factura.importe) - base;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.text("Base imponible", 138, totY);
    doc.text(base.toLocaleString("es-ES", { style: "currency", currency: "EUR" }), W - 22, totY, { align: "right" });
    doc.text("IVA (21%)", 138, totY + 7);
    doc.text(iva.toLocaleString("es-ES",  { style: "currency", currency: "EUR" }), W - 22, totY + 7, { align: "right" });

    doc.setDrawColor(229, 231, 235);
    doc.line(138, totY + 10, W - 20, totY + 10);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...dark);
    doc.text("Total", 138, totY + 18);
    doc.text(fmtImporte(factura.importe), W - 22, totY + 18, { align: "right" });

    // Pie
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 265, W - 20, 265);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...gray);
    doc.text("Gracias por confiar en JobFree · Este documento tiene validez como recibo de pago", W/2, 271, { align: "center" });
    doc.text(`Generado el ${new Date().toLocaleDateString("es-ES")}`, W/2, 277, { align: "center" });

    doc.save(`${factura.numeroFactura}.pdf`);
}

// ── Modal de vista previa ─────────────────────────────────────────────────
function ModalPreview({ factura, onCerrar }) {
    const [descargando, setDescargando] = useState(false);
    const html = generarHtmlFactura(factura);

    async function handleDescargar() {
        setDescargando(true);
        await descargarFactura(factura);
        setDescargando(false);
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
            onClick={onCerrar}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden"
                style={{ maxHeight: "90vh" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* header modal */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
                    <div>
                        <p className="text-sm font-semibold text-gray-900">Vista previa</p>
                        <p className="text-xs text-gray-400 font-mono">{factura.numeroFactura}</p>
                    </div>
                    <button
                        onClick={onCerrar}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* preview iframe */}
                <div className="flex-1 overflow-auto bg-gray-100 p-4">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ minHeight: 500 }}>
                        <iframe
                            srcDoc={html}
                            title="Vista previa de factura"
                            className="w-full"
                            style={{ height: 560, border: "none" }}
                        />
                    </div>
                </div>

                {/* footer modal */}
                <div className="flex gap-3 px-5 py-3.5 border-t border-gray-200">
                    <button
                        onClick={onCerrar}
                        className="flex-1 rounded-lg border border-gray-300 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                        Cerrar
                    </button>
                    <button
                        onClick={handleDescargar}
                        disabled={descargando}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#2596be] hover:bg-[#1e7fa3] py-2 text-sm font-semibold text-white transition disabled:opacity-60"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {descargando ? "Generando..." : "Descargar PDF"}
                    </button>
                </div>
            </div>
        </div>
    );
}

const IMPORTES_RAPIDOS = [10, 20, 50, 100];

function FormularioStripeRecarga({ importe, piId, onExito, onError }) {
    const stripe = useStripe();
    const elements = useElements();
    const [procesando, setProcesando] = useState(false);
    const [listo, setListo] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        if (!stripe || !elements || !listo || procesando) return;
        setErrorMsg("");
        setProcesando(true);
        try {
            const { error, paymentIntent } = await stripe.confirmPayment({ elements, redirect: "if_required" });
            if (error) { setErrorMsg(error.message || "El pago no pudo procesarse."); setProcesando(false); return; }
            if (paymentIntent?.status === "succeeded") {
                try { await confirmarRecarga(piId, importe); } catch (_) {}
                onExito();
            } else {
                setErrorMsg("Estado inesperado. Inténtalo de nuevo."); setProcesando(false);
            }
        } catch (err) {
            setErrorMsg(err.message || "Error inesperado."); setProcesando(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className={listo ? "" : "opacity-60"}>
                <PaymentElement options={{ layout: "tabs" }} onReady={() => setListo(true)} />
            </div>
            {procesando && (
                <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-500">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                    Procesando pago...
                </div>
            )}
            {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
            {!procesando && (
                <button
                    type="submit"
                    disabled={!listo}
                    className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 py-3 text-sm font-bold text-white transition disabled:opacity-50"
                >
                    Recargar {fmtImporte(importe)}
                </button>
            )}
        </form>
    );
}

function ModalRecarga({ onCerrar, onExito }) {
    const [paso, setPaso] = useState("importe"); // importe | pago | exito
    const [importe, setImporte] = useState(20);
    const [importeInput, setImporteInput] = useState("20");
    const [clientSecret, setClientSecret] = useState(null);
    const [piId, setPiId] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    async function handleContinuar() {
        const val = parseFloat(importeInput);
        if (!val || val < 1) { setError("El importe mínimo es 1 €"); return; }
        setError("");
        setCargando(true);
        try {
            const data = await iniciarRecarga(val);
            setImporte(val);
            setClientSecret(data.clientSecret);
            setPiId(data.paymentIntentId);
            setPaso("pago");
        } catch (e) {
            setError(e.message || "Error al iniciar la recarga");
        } finally {
            setCargando(false);
        }
    }

    function handleExitoStripe() {
        setPaso("exito");
        onExito();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm" onClick={onCerrar}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden" style={{ maxHeight: "90vh" }} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                    <p className="font-semibold text-gray-900">
                        {paso === "importe" ? "Recargar monedero" : paso === "pago" ? "Datos de pago" : "¡Recarga completada!"}
                    </p>
                    <button onClick={onCerrar} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition">
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto">
                    {paso === "importe" && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-500">¿Cuánto quieres añadir a tu monedero?</p>
                            <div className="grid grid-cols-4 gap-2">
                                {IMPORTES_RAPIDOS.map((v) => (
                                    <button
                                        key={v}
                                        onClick={() => { setImporteInput(String(v)); setError(""); }}
                                        className={`rounded-xl border py-2 text-sm font-semibold transition ${
                                            importeInput === String(v)
                                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                : "border-gray-200 text-gray-600 hover:border-emerald-300"
                                        }`}
                                    >
                                        {v} €
                                    </button>
                                ))}
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">O introduce otro importe</label>
                                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-emerald-400">
                                    <input
                                        type="number"
                                        min="1"
                                        step="0.5"
                                        value={importeInput}
                                        onChange={(e) => { setImporteInput(e.target.value); setError(""); }}
                                        className="flex-1 px-3 py-2.5 text-sm outline-none"
                                        placeholder="0.00"
                                    />
                                    <span className="px-3 text-sm text-gray-400 font-medium">€</span>
                                </div>
                            </div>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <button
                                onClick={handleContinuar}
                                disabled={cargando}
                                className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 py-3 text-sm font-bold text-white transition disabled:opacity-60"
                            >
                                {cargando ? "Preparando pago..." : "Continuar"}
                            </button>
                        </div>
                    )}

                    {paso === "pago" && clientSecret && getStripePromise() && (
                        <Elements stripe={getStripePromise()} options={{ clientSecret, appearance: { theme: "stripe" } }}>
                            <FormularioStripeRecarga importe={importe} piId={piId} onExito={handleExitoStripe} />
                        </Elements>
                    )}

                    {paso === "exito" && (
                        <div className="flex flex-col items-center py-6 text-center gap-3">
                            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                                <CheckCircleIcon className="h-9 w-9 text-emerald-500" />
                            </div>
                            <p className="font-bold text-gray-900 text-lg">¡{fmtImporte(importe)} añadidos!</p>
                            <p className="text-sm text-gray-500">El saldo ya está disponible en tu monedero.</p>
                            <button
                                onClick={onCerrar}
                                className="mt-2 px-6 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition"
                            >
                                Cerrar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function agruparPorMes(movimientos) {
    const grupos = {};
    movimientos.forEach((m) => {
        const d = new Date(m.fecha);
        const clave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const label = d.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
        if (!grupos[clave]) grupos[clave] = { label, items: [] };
        grupos[clave].items.push(m);
    });
    return Object.values(grupos);
}

function FilaMovimiento({ m }) {
    const esEntrada = m.tipo === "ENTRADA";
    return (
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0">
            <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${esEntrada ? "bg-emerald-100" : "bg-rose-100"}`}>
                {esEntrada
                    ? <ArrowUpCircleIcon className="h-5 w-5 text-emerald-600" />
                    : <ArrowDownCircleIcon className="h-5 w-5 text-rose-500" />
                }
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{m.concepto}</p>
                <p className="text-xs text-gray-400">{fmt(m.fecha)}</p>
            </div>
            <span className={`text-sm font-semibold ${esEntrada ? "text-emerald-600" : "text-rose-500"}`}>
                {esEntrada ? "+" : "−"}{fmtImporte(m.importe)}
            </span>
        </div>
    );
}

function TarjetaIBAN({ iban, titular, onEditar }) {
    const ultimos4 = iban.slice(-4);
    const masked = `•••• •••• •••• ${ultimos4}`;
    return (
        <div className="relative rounded-2xl overflow-hidden text-white p-5" style={{ background: "linear-gradient(135deg, #0d9488 0%, #1e293b 100%)" }}>
            <div className="flex justify-between items-start mb-5">
                <span className="text-xs font-medium opacity-70">Cuenta corriente</span>
                <div className="flex items-center gap-2">
                    <BuildingLibraryIcon className="h-5 w-5 opacity-40" />
                    <button onClick={onEditar} className="p-1 rounded-lg hover:bg-white/10 transition" title="Editar">
                        <PencilIcon className="h-4 w-4 opacity-60" />
                    </button>
                </div>
            </div>
            <p className="font-mono text-sm tracking-widest mb-1 opacity-80">{masked}</p>
            <p className="font-semibold text-base">{titular}</p>
        </div>
    );
}

function FormIBAN({ ibanInicial, titularInicial, onGuardar, onCancelar }) {
    const [iban, setIban] = useState(ibanInicial || "");
    const [titular, setTitular] = useState(titularInicial || "");
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");

    async function handleGuardar() {
        const ibanLimpio = iban.toUpperCase().replace(/\s+/g, "");
        if (ibanLimpio.length < 15 || ibanLimpio.length > 34) {
            setError("Introduce un IBAN válido");
            return;
        }
        if (!titular.trim()) { setError("El titular es obligatorio"); return; }
        setError("");
        setGuardando(true);
        try {
            await saveCuentaBancaria(ibanLimpio, titular.trim());
            onGuardar(ibanLimpio, titular.trim());
        } catch {
            setError("Error al guardar. Inténtalo de nuevo.");
        } finally {
            setGuardando(false);
        }
    }

    return (
        <div className="space-y-3">
            <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">IBAN</label>
                <input
                    type="text"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    placeholder="ES00 0000 0000 0000 0000 0000"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
                    maxLength={34}
                />
            </div>
            <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Titular</label>
                <input
                    type="text"
                    value={titular}
                    onChange={(e) => setTitular(e.target.value)}
                    placeholder="Nombre y apellidos"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
                />
            </div>
            {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            <div className="flex gap-2 pt-1">
                <button onClick={onCancelar} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                    Cancelar
                </button>
                <button onClick={handleGuardar} disabled={guardando} className="flex-1 rounded-xl bg-teal-600 hover:bg-teal-700 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60">
                    {guardando ? "Guardando..." : "Guardar"}
                </button>
            </div>
        </div>
    );
}

function SeccionMonedero() {
    const { usuario } = useAuth();
    const [saldo, setSaldo] = useState(null);
    const [movimientos, setMovimientos] = useState([]);
    const [iban, setIban] = useState(null);
    const [titular, setTitular] = useState("");
    const [cargando, setCargando] = useState(true);
    const [modalRecarga, setModalRecarga] = useState(false);
    const [seccion, setSeccion] = useState(null); // "historial" | "bancario" | null
    const [editandoIBAN, setEditandoIBAN] = useState(false);
    const [filtroMov, setFiltroMov] = useState("TODO"); // "TODO" | "ENTRADA" | "SALIDA"

    function cargarDatos() {
        return Promise.all([obtenerMonedero(), obtenerMovimientos(), getCuentaBancaria()])
            .then(([mon, movs, cuenta]) => {
                setSaldo(mon.saldo);
                setMovimientos(movs);
                if (cuenta) { setIban(cuenta.iban); setTitular(cuenta.titular || ""); }
            }).catch(() => {});
    }

    useEffect(() => { cargarDatos().finally(() => setCargando(false)); }, []);

    const movsFiltrados = movimientos.filter(m => filtroMov === "TODO" || m.tipo === filtroMov);
    const grupos = agruparPorMes(movsFiltrados);
    const enteros = Math.floor(Math.abs(saldo ?? 0));
    const decimales = ((Math.abs(saldo ?? 0)) % 1).toFixed(2).slice(2);

    const ACCIONES = [
        { label: "Recargar", icono: PlusIcon,           active: true,  onClick: () => setModalRecarga(true) },
        { label: "Retirar",  icono: BuildingLibraryIcon, active: false, title: "Próximamente" },
    ];

    function toggleSeccion(s) { setSeccion(prev => prev === s ? null : s); }

    return (
        <div className="max-w-lg mx-auto space-y-3">
            {modalRecarga && (
                <ModalRecarga onCerrar={() => setModalRecarga(false)} onExito={() => cargarDatos()} />
            )}

            {/* ── Tarjeta de saldo ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                {cargando ? (
                    <div className="h-16 w-48 bg-gray-100 rounded-xl animate-pulse mx-auto mb-6" />
                ) : (
                    <div className="mb-6">
                        <span className="text-6xl font-black text-gray-900 tabular-nums">
                            {enteros.toLocaleString("es-ES")}
                        </span>
                        <span className="text-3xl font-bold text-gray-400">,{decimales} €</span>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                    {ACCIONES.map((a) => (
                        <button
                            key={a.label}
                            onClick={a.active ? a.onClick : undefined}
                            title={!a.active ? "Próximamente" : undefined}
                            className={`flex flex-col items-center gap-1.5 py-1 rounded-xl transition ${a.active ? "hover:bg-gray-50" : "cursor-default opacity-40"}`}
                        >
                            <div className={`h-14 w-14 rounded-full flex items-center justify-center ${a.active ? "bg-teal-500" : "bg-teal-100"}`}>
                                <a.icono className={`h-6 w-6 ${a.active ? "text-white" : "text-teal-400"}`} />
                            </div>
                            <span className={`text-xs font-medium ${a.active ? "text-teal-600" : "text-gray-400"}`}>{a.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Historial de movimientos ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                    onClick={() => toggleSeccion("historial")}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
                >
                    <span className="font-medium text-gray-800 text-sm">Historial de movimientos</span>
                    <ChevronRightIcon className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${seccion === "historial" ? "rotate-90" : ""}`} />
                </button>

                {seccion === "historial" && (
                    <div className="border-t border-gray-100">
                        {/* Filtros */}
                        <div className="flex gap-1 px-4 py-3 border-b border-gray-50">
                            {[["TODO","Todo"],["ENTRADA","Entradas"],["SALIDA","Salidas"]].map(([v,l]) => (
                                <button
                                    key={v}
                                    onClick={() => setFiltroMov(v)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${filtroMov === v ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>

                        {cargando ? (
                            <div className="p-4 space-y-2">
                                {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}
                            </div>
                        ) : grupos.length === 0 ? (
                            <p className="text-center py-10 text-sm text-gray-400">No hay movimientos.</p>
                        ) : (
                            <div>
                                {grupos.map((g) => (
                                    <div key={g.label}>
                                        <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 capitalize">{g.label}</span>
                                        </div>
                                        {g.items.map(m => <FilaMovimiento key={m.id} m={m} />)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Datos bancarios ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                    onClick={() => { toggleSeccion("bancario"); setEditandoIBAN(false); }}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
                >
                    <span className="font-medium text-gray-800 text-sm">Datos bancarios</span>
                    <ChevronRightIcon className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${seccion === "bancario" ? "rotate-90" : ""}`} />
                </button>

                {seccion === "bancario" && (
                    <div className="border-t border-gray-100 p-5 bg-gray-50/60">
                        {editandoIBAN || !iban ? (
                            <FormIBAN
                                ibanInicial={iban}
                                titularInicial={titular || (usuario ? `${usuario.nombre} ${usuario.apellidos}` : "")}
                                onGuardar={(i, t) => { setIban(i); setTitular(t); setEditandoIBAN(false); }}
                                onCancelar={() => setEditandoIBAN(false)}
                            />
                        ) : (
                            <TarjetaIBAN iban={iban} titular={titular} onEditar={() => setEditandoIBAN(true)} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function SkeletonRow() {
    return (
        <tr>
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <td key={i} className="px-5 py-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                </td>
            ))}
        </tr>
    );
}

export default function Facturas() {
    const [tab, setTab]                 = useState("facturas");
    const [facturas, setFacturas]       = useState([]);
    const [cargando, setCargando]       = useState(true);
    const [error, setError]             = useState(null);
    const [busqueda, setBusqueda]       = useState("");
    const [filtroEstado, setFiltro]     = useState("TODAS");
    const [facturaPreview, setPreview]  = useState(null);

    useEffect(() => {
        obtenerMisFacturas()
            .then(setFacturas)
            .catch((e) => setError(e.message))
            .finally(() => setCargando(false));
    }, []);

    const filtradas = facturas.filter((f) => {
        const matchEstado   = filtroEstado === "TODAS" || f.estado === filtroEstado;
        const q             = busqueda.toLowerCase();
        const matchBusqueda = !q || f.numeroFactura.toLowerCase().includes(q) || f.servicioTitulo.toLowerCase().includes(q) || f.profesionalNombre.toLowerCase().includes(q);
        return matchEstado && matchBusqueda;
    });

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">

            {facturaPreview && (
                <ModalPreview factura={facturaPreview} onCerrar={() => setPreview(null)} />
            )}

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Facturación</h1>
                <p className="text-sm text-gray-500 mt-1">Historial de pagos, facturas descargables y tu monedero</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-6">
                {[
                    { key: "facturas", label: "Mis facturas" },
                    { key: "monedero", label: "Monedero" },
                ].map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                            tab === t.key
                                ? "bg-white shadow text-gray-900"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === "monedero" && <SeccionMonedero />}
            {tab === "facturas" && (<>

            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <input
                    type="text"
                    placeholder="Buscar por nº factura, servicio o profesional..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2596be]/40 focus:border-[#2596be]"
                />
                <div className="flex gap-2">
                    {["TODAS", "PAGADO", "REEMBOLSADO"].map((e) => (
                        <button
                            key={e}
                            onClick={() => setFiltro(e)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                filtroEstado === e
                                    ? "bg-[#2596be] text-white"
                                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {e === "TODAS" ? "Todas" : ESTADOS[e]?.label ?? e}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {error ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                        <p className="text-sm text-red-500">{error}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Nº Factura</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Servicio</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Profesional</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Importe</th>
                                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {cargando ? (
                                    Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                                ) : filtradas.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-16 text-center">
                                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p className="text-sm font-medium">
                                                    {facturas.length === 0 ? "Todavía no tienes ninguna factura" : "No hay facturas que coincidan con el filtro"}
                                                </p>
                                                {facturas.length === 0 && <p className="text-xs">Las facturas se generan automáticamente al completar un pago</p>}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filtradas.map((f) => {
                                        const est = ESTADOS[f.estado] ?? { label: f.estado, cls: "bg-gray-100 text-gray-700" };
                                        return (
                                            <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-4 font-mono text-xs font-semibold text-gray-700">{f.numeroFactura}</td>
                                                <td className="px-5 py-4"><span className="font-medium text-gray-800 line-clamp-1">{f.servicioTitulo}</span></td>
                                                <td className="px-5 py-4 text-gray-600">{f.profesionalNombre}</td>
                                                <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{fmt(f.fechaPago)}</td>
                                                <td className="px-5 py-4">
                                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${est.cls}`}>
                                                        {est.label}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right font-semibold text-gray-900 whitespace-nowrap">{fmtImporte(f.importe)}</td>
                                                <td className="px-5 py-4 text-right">
                                                    <button
                                                        onClick={() => setPreview(f)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#2596be] bg-blue-50 hover:bg-blue-100 transition"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        Ver
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {!cargando && filtradas.length > 0 && (
                <p className="text-xs text-gray-400 mt-3 text-right">
                    Mostrando {filtradas.length} de {facturas.length} factura{facturas.length !== 1 ? "s" : ""}
                </p>
            )}
            </>)}
        </div>
    );
}
