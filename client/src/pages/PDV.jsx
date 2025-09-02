import React, { useReducer, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MagnifyingGlassIcon,
  PhotoIcon,
  ShoppingCartIcon,
  HomeIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  CreditCardIcon,
  UserPlusIcon,
  PrinterIcon,
  ArrowPathIcon,
  PauseIcon,
  PlayIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency } from "../utils/format";
import { fetchProducts, createSale, fetchCustomers, createCustomer } from "../services/api";

// IMAGENS (em src/assets/img)
import maquininhaIcon from "../assets/img/maquininha2.png";
import pixIcon from "../assets/img/pix.svg";
import real from "../assets/img/real.png";
import logo from "../assets/img/logo.png";

/* ============================ Paleta & helpers ============================ */
const C = {
  red: "#ea1d2c",
  redDark: "#d81b28",
  border: "#d9d9d9",
  text: "#2b2b2b",
  muted: "#7a7a7a",
  bgApp: "#f3f3f3",
  card: "#ffffff",
  rightPanel: "#f1f1f1",
};

// Altura visual do rodapé fixo (para espaçamentos)
const FOOTER_H = 86;

/* FIX: Input com forwardRef para permitir foco via ref (F4) */
const Input = React.forwardRef(({ style, ...props }, ref) => (
  <input
    ref={ref}
    {...props}
    style={{
      width: "100%",
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      padding: "10px 12px",
      outline: "none",
      fontSize: 14,
      color: C.text,
      background: "#fff",
      ...style,
    }}
  />
));

const TextArea = ({ style, ...props }) => (
  <textarea
    {...props}
    style={{
      width: "100%",
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      padding: "10px 12px",
      outline: "none",
      fontSize: 14,
      color: C.text,
      background: "#fff",
      resize: "vertical",
      ...style,
    }}
  />
);

const Select = ({ options = [], value, onChange, style, placeholder }) => {
  const caret =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>`
    );

  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange && onChange(e.target.value || "")}
      style={{
        width: "100%",
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: "10px 36px 10px 12px",
        outline: "none",
        fontSize: 14,
        color: C.text,
        backgroundColor: "#fff",
        appearance: "none",
        backgroundImage: `url("${caret}")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        ...style,
      }}
    >
      <option value="">{placeholder || "Selecione"}</option>
      {options.map((o) => (
        <option key={o.value ?? o.code ?? o.id} value={o.value ?? o.code ?? o.id}>
          {o.label ?? o.name}
        </option>
      ))}
    </select>
  );
};

const Checkbox = ({ checked, onChange, id }) => (
  <input
    id={id}
    type="checkbox"
    checked={!!checked}
    onChange={(e) => onChange && onChange(e.target.checked)}
    style={{ width: 18, height: 18, accentColor: C.red, cursor: "pointer" }}
  />
);

/* FIX: botão com type="button" para evitar submits implícitos */
const Button = ({ label, icon, children, outlined, danger, onClick, style, title, disabled }) => {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    border: outlined ? `1.5px solid ${danger ? C.red : C.red}` : "none",
    background: outlined ? "#fff" : danger ? C.red : C.red,
    color: outlined ? C.red : "#fff",
    transition: "filter .15s ease",
    boxShadow: outlined ? "none" : "0 2px 4px rgba(0,0,0,0.08)",
    ...style,
  };
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      title={title}
      style={base}
      onMouseDown={(e) => (e.currentTarget.style.filter = "brightness(.95)")}
      onMouseUp={(e) => (e.currentTarget.style.filter = "none")}
      onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
      disabled={disabled}
    >
      {icon}
      {label ?? children}
    </button>
  );
};

const Modal = ({ open, onClose, title, footer, children }) => {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 520,
          maxWidth: "92vw",
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 10px 28px rgba(0,0,0,.25)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, fontWeight: 800 }}>
          {title}
        </div>
        <div style={{ padding: 16 }}>{children}</div>
        <div
          style={{
            padding: 12,
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
          }}
        >
          {footer}
        </div>
      </div>
    </div>
  );
};

/* ============================== Domínios ============================= */
const MACHINE_OPTIONS = [
  { id: "machine_a", name: "Máquina A" },
  { id: "machine_b", name: "Máquina B" },
  { id: "machine_c", name: "Máquina C" },
];

const PAYMENT_METHODS = ["Dinheiro", "PIX", "Cartão de Crédito", "Cartão de Débito", "Transferência"];

const PARKED_KEY = "pdv_parked_sales_v1";

const initialState = {
  products: [],
  customers: [],
  filteredProducts: [],
  isLoading: true,
  searchTerm: "",
  cart: [], // {id,name,brand,price,quantity,stock,total}
  selectedCustomerId: "",
  quickCustomerName: "",
  showQuickCustomer: false,
  payments: [], // {id, method, amount, machine?, installments?}
  discountValue: 0,
  discountPct: 0,
  surchargeValue: 0,
  printReceipt: true,
  notes: "",
  parked: [], // [{id, createdAt, snapshot}]
};

function readParked() {
  try {
    const raw = localStorage.getItem(PARKED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function writeParked(arr) {
  localStorage.setItem(PARKED_KEY, JSON.stringify(arr));
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_DATA": {
      const { products, customers } = action.payload;
      const available = products.filter((p) => Number(p.stock) > 0);
      return { ...state, products, customers, filteredProducts: available, isLoading: false, parked: readParked() };
    }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_SEARCH": {
      const searchTerm = action.payload.trim().toLowerCase();
      const filtered = searchTerm
        ? state.products.filter((p) => `${p.name} ${p.brand} ${p.code ?? ""}`.toLowerCase().includes(searchTerm))
        : state.products.filter((p) => Number(p.stock) > 0);
      return { ...state, searchTerm: action.payload, filteredProducts: filtered };
    }

    // CART
    case "ADD_TO_CART": {
      const p = action.payload;
      const existing = state.cart.find((i) => i.id === p.id);
      if (existing) {
        if (existing.quantity >= p.stock) {
          toast.warning(`Estoque máximo atingido para ${p.name}`);
          return state;
        }
        const cart = state.cart.map((i) =>
          i.id === p.id ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price } : i
        );
        return { ...state, cart };
      }
      return {
        ...state,
        cart: [
          ...state.cart,
          { id: p.id, name: p.name, brand: p.brand, price: Number(p.price) || 0, quantity: 1, stock: Number(p.stock) || 0, total: Number(p.price) || 0 },
        ],
      };
    }
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((i) => i.id !== action.payload) };
    case "UPDATE_QTY": {
      const { id, qty } = action.payload;
      if (qty <= 0) return state;
      const it = state.cart.find((i) => i.id === id);
      if (!it) return state;
      if (qty > it.stock) {
        toast.warning(`Estoque máximo atingido para ${it.name}`);
        return state;
      }
      const cart = state.cart.map((i) => (i.id === id ? { ...i, quantity: qty, total: qty * i.price } : i));
      return { ...state, cart };
    }
    case "CLEAR_CART":
      return { ...state, cart: [] };

    // CLIENTE
    case "SET_CUSTOMER":
      return { ...state, selectedCustomerId: action.payload };
    case "SET_QUICK_CUSTOMER":
      return { ...state, quickCustomerName: action.payload };
    case "TOGGLE_QUICK_CUSTOMER":
      return { ...state, showQuickCustomer: !state.showQuickCustomer };

    // PAGAMENTOS
    /* FIX: ADD_PAYMENT agora aceita número (restante) OU objeto { amount, method } */
    case "ADD_PAYMENT": {
      const payload = action.payload;
      const isObj = typeof payload === "object" && payload !== null;
      const amt = Number((isObj ? payload.amount : payload) || 0);
      if (amt <= 0) {
        toast.info("Nada a adicionar — total já coberto.");
        return state;
      }
      const pm = {
        id: Date.now(),
        method: isObj && payload.method ? payload.method : "Dinheiro",
        amount: Number(amt.toFixed(2)),
        machine: "",
        installments: 1,
      };
      return { ...state, payments: [...state.payments, pm] };
    }
    case "UPDATE_PAYMENT": {
      const { id, field, value } = action.payload;
      const payments = state.payments.map((pm) =>
        pm.id === id
          ? {
              ...pm,
              [field]: field === "amount" || field === "installments" ? Number(value) || 0 : value,
              ...(field === "method" && value !== "Cartão de Crédito" && value !== "Cartão de Débito"
                ? { machine: "", installments: 1 }
                : {}),
            }
          : pm
      );
      return { ...state, payments };
    }
    case "REMOVE_PAYMENT":
      return { ...state, payments: state.payments.filter((p) => p.id !== action.payload) };
    case "CLEAR_PAYMENTS":
      return { ...state, payments: [] };

    // TOTAIS
    case "SET_DISCOUNT_VALUE":
      return { ...state, discountValue: Number(action.payload) || 0, discountPct: 0 };
    case "SET_DISCOUNT_PCT":
      return { ...state, discountPct: Number(action.payload) || 0 };
    case "SET_SURCHARGE":
      return { ...state, surchargeValue: Number(action.payload) || 0 };

    // OUTROS
    case "SET_PRINT":
      return { ...state, printReceipt: !!action.payload };
    case "SET_NOTES":
      return { ...state, notes: action.payload };

    // ESTACIONAR
    case "LOAD_PARKED":
      return { ...state, parked: readParked() };
    case "PARK_CURRENT": {
      const snapshot = {
        cart: state.cart,
        payments: state.payments,
        selectedCustomerId: state.selectedCustomerId,
        discountValue: state.discountValue,
        discountPct: state.discountPct,
        surchargeValue: state.surchargeValue,
        notes: state.notes,
      };
      const entry = { id: Date.now(), createdAt: new Date().toISOString(), snapshot };
      const next = [entry, ...state.parked];
      writeParked(next);
      toast.success("Venda estacionada!");
      return { ...state, parked: next };
    }
    case "RESUME_PARKED": {
      const id = action.payload;
      const entry = state.parked.find((p) => p.id === id);
      if (!entry) return state;
      return { ...state, ...entry.snapshot };
    }
    case "DELETE_PARKED": {
      const id = action.payload;
      const next = state.parked.filter((p) => p.id !== id);
      writeParked(next);
      return { ...state, parked: next };
    }

    case "RESET_ALL":
      return {
        ...initialState,
        products: state.products,
        customers: state.customers,
        filteredProducts: state.filteredProducts,
        parked: state.parked,
        isLoading: false,
      };
    default:
      return state;
  }
}

const downloadCarnet = async () => {
  try {
    const response = await fetch("http://localhost:3000/gerar-carne", { method: "GET" });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "carne-pagamento-12x.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (e) {
    toast.error("Falha ao gerar carnê");
  }
};

/* ============================== Subcomponentes UI ============================= */
const NavigationSteps = ({ currentStep, setCurrentStep }) => {
  const steps = React.useMemo(
    () => [
      { label: "Produto (Alt+Z)", key: "produto" },
      { label: "Cliente (Alt+C)", key: "cliente" },
      { label: "Pagamento (Alt+B)", key: "pagamento" },
    ],
    []
  );
  const ARROW_W = 18;
  return (
    <div
      style={{
        display: "flex",
        background: "#fff",
        borderRadius: 8,
        marginBottom: 10,
        overflow: "hidden",
        padding: 4,
        border: `1px solid ${C.border}`,
      }}
    >
      {steps.map((step, index) => {
        const active = currentStep === step.key;
        return (
          <div
            key={step.key}
            onClick={() => setCurrentStep(step.key)}
            style={{
              flex: 1,
              position: "relative",
              padding: "10px 16px",
              textAlign: "center",
              fontWeight: 800,
              fontSize: 14,
              color: active ? "#fff" : "#666",
              background: active ? C.red : "#e1e1e1",
              cursor: "pointer",
              userSelect: "none",
              transition: "background .2s ease",
              borderTopLeftRadius: index === 0 ? 6 : 0,
              borderBottomLeftRadius: index === 0 ? 6 : 0,
              borderTopRightRadius: index === steps.length - 1 ? 6 : 0,
              borderBottomRightRadius: index === steps.length - 1 ? 6 : 0,
              zIndex: active ? 3 : 1,
            }}
          >
            {step.label}
            {active && index < steps.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: "calc(100% - 1px)",
                  width: ARROW_W,
                  background: C.red,
                  clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                  zIndex: 4,
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ============================== Tela principal ============================= */
export default function PDVPro() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentStep, setCurrentStep] = useState("produto");
  const [barcodeReader, setBarcodeReader] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Load data
  useEffect(() => {
    (async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const [prods, custs] = await Promise.all([fetchProducts(), fetchCustomers()]);
        dispatch({ type: "SET_DATA", payload: { products: prods, customers: custs } });
      } catch (e) {
        console.error(e);
        toast.error("Erro ao carregar dados");
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    })();
  }, []);

  // Totais
  const subtotal = useMemo(() => state.cart.reduce((s, i) => s + i.total, 0), [state.cart]);
  const discountFromPct = useMemo(() => {
    const pct = Math.max(0, Math.min(100, state.discountPct || 0));
    return Number(((subtotal * pct) / 100).toFixed(2));
  }, [subtotal, state.discountPct]);
  const discount = state.discountPct > 0 ? discountFromPct : Math.min(state.discountValue || 0, subtotal);
  const surcharge = Math.max(0, state.surchargeValue || 0);
  const totalDue = useMemo(() => Math.max(0, Number((subtotal - discount + surcharge).toFixed(2))), [subtotal, discount, surcharge]);
  const totalPayments = useMemo(() => state.payments.reduce((s, p) => s + (Number(p.amount) || 0), 0), [state.payments]);
  const remaining = Number((totalDue - totalPayments).toFixed(2));
  const change = remaining < 0 ? Math.abs(remaining) : 0;

  /* FIX: refs para valores dinâmicos usados nos atalhos (evita closures “stale”) */
  const totalsRef = useRef({ totalDue: 0, totalPayments: 0 });
  useEffect(() => {
    totalsRef.current = { totalDue, totalPayments };
  }, [totalDue, totalPayments]);

  // Atalhos — com guarda para não interferir enquanto o usuário digita
  const finalizeRef = useRef(null);
  const handleFinalizeRefSetter = (fn) => (finalizeRef.current = fn);

  // definimos handleFinalize primeiro e logo abaixo registramos no ref
  const addDefaultPaymentIfEmpty = () => {
    if (state.cart.length === 0) return toast.error("Adicione produtos ao carrinho.");
    if (state.payments.length === 0) dispatch({ type: "ADD_PAYMENT", payload: totalsRef.current.totalDue - totalsRef.current.totalPayments });
  };

  const handleQuickCustomerAdd = async () => {
    const name = state.quickCustomerName?.trim();
    if (!name) return toast.error("Digite o nome do cliente.");
    try {
      const created = await createCustomer({ name });
      toast.success("Cliente adicionado");
      dispatch({ type: "SET_DATA", payload: { products: state.products, customers: [...state.customers, created] } });
      dispatch({ type: "SET_CUSTOMER", payload: created.id });
      dispatch({ type: "SET_QUICK_CUSTOMER", payload: "" });
      if (state.showQuickCustomer) dispatch({ type: "TOGGLE_QUICK_CUSTOMER" });
    } catch (e) {
      console.error(e);
      toast.error("Erro ao adicionar cliente");
    }
  };

  const validateBeforeFinalize = () => {
    if (state.cart.length === 0) return toast.error("Carrinho vazio."), false;
    if (state.payments.length === 0) return toast.error("Adicione um método de pagamento."), false;
    if (totalPayments + 0.001 < totalDue) return toast.error("Pagamentos devem cobrir o total."), false;
    const cardPays = state.payments.filter((p) => p.method === "Cartão de Crédito" || p.method === "Cartão de Débito");
    if (cardPays.some((p) => !p.machine)) return toast.error("Selecione a máquina para todos cartões."), false;
    return true;
  };

  const openReceipt = (payload) => {
    try {
      const toBRL = (n) => (Number(n) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      const d = new Date(payload.date);
      const itemsRows = payload.items
        .map(
          (it) =>
            `<tr><td>${it.name}</td><td style="text-align:right">${it.qty}</td><td style="text-align:right">${toBRL(it.unitPrice)}</td><td style="text-align:right">${toBRL(it.total)}</td></tr>`
        )
        .join("");
      const payRows = (payload.payments || [])
        .map(
          (pm) =>
            `<div>${pm.method}${pm.machine ? " (" + pm.machine + ")" : ""}${pm.installments > 1 ? ` ${pm.installments}x` : ""}: <strong>${toBRL(
              pm.amount
            )}</strong></div>`
        )
        .join("");
      const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Recibo</title>
      <style>body{font-family:Arial,sans-serif;margin:16px}h1{font-size:18px;margin:0}small{color:#555}table{width:100%;border-collapse:collapse;margin-top:8px}th,td{border-bottom:1px solid #eee;padding:6px 4px;font-size:12px}.right{text-align:right}.tot{margin-top:8px;border-top:1px dashed #333;padding-top:8px}</style>
      <body><h1>Recibo de Venda</h1><small>${d.toLocaleString("pt-BR")}</small>
      <div style="margin-top:6px">Cliente: <strong>${payload.customerName || "—"}</strong></div>
      <table><thead><tr><th>Produto</th><th class="right">Qtd</th><th class="right">Unit.</th><th class="right">Total</th></tr></thead><tbody>${itemsRows}</tbody></table>
      <div class="tot"><div>Subtotal: <strong>${toBRL(payload.subtotal)}</strong></div>
      <div>Desconto: <strong>${toBRL(payload.discount)}</strong> &nbsp; Acréscimo: <strong>${toBRL(payload.surcharge)}</strong></div>
      <div>Total: <strong>${toBRL(payload.total)}</strong></div>${payload.change > 0 ? `<div>Troco: <strong>${toBRL(payload.change)}</strong></div>` : ""}</div>
      <div style="margin-top:8px">${payRows}</div>${payload.notes ? `<div style="margin-top:8px"><em>${payload.notes}</em></div>` : ""}
      <script>window.onload=()=>{window.print()}</script></body></html>`;
      const w = window.open("", "_blank");
      w.document.write(html);
      w.document.close();
    } catch {}
  };

  const handleFinalize = async () => {
    if (!validateBeforeFinalize()) return;
    const customerName = state.selectedCustomerId
      ? state.customers.find((c) => c.id === state.selectedCustomerId)?.name || "Cliente não identificado"
      : "Cliente não identificado";

    const payload = {
      customerId: state.selectedCustomerId || null,
      customerName,
      items: state.cart.map((i) => ({ productId: i.id, name: i.name, qty: i.quantity, unitPrice: i.price, total: i.total })),
      payments: state.payments,
      subtotal,
      discount,
      surcharge,
      total: totalDue,
      change,
      notes: state.notes?.trim() || undefined,
      date: new Date().toISOString(),
    };

    try {
      await createSale(payload);
      toast.success("Venda finalizada!");
      if (state.printReceipt) openReceipt(payload);
      dispatch({ type: "RESET_ALL" });
      const prods = await fetchProducts();
      dispatch({ type: "SET_DATA", payload: { products: prods, customers: state.customers } });
    } catch (e) {
      console.error(e);
      toast.error("Erro ao finalizar venda");
    }
  };

  // manter referência atualizada da função para uso no listener
  useEffect(() => {
    handleFinalizeRefSetter(handleFinalize);
  }, [handleFinalize]);

  /* FIX: Listener único + ignorar atalhos quando digitando em inputs/textarea/select/contenteditable */
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      const tag = t?.tagName;
      const isTyping =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t?.isContentEditable;

      if (isTyping) return; // não processar atalhos enquanto digita

      if (e.altKey && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        setCurrentStep("produto");
        return;
      }
      if (e.altKey && (e.key === "c" || e.key === "C")) {
        e.preventDefault();
        setCurrentStep("cliente");
        return;
      }
      if (e.altKey && (e.key === "b" || e.key === "B")) {
        e.preventDefault();
        setCurrentStep("pagamento");
        return;
      }

      if (e.key === "F4") {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === "F2") {
        e.preventDefault();
        const { totalDue: td, totalPayments: tp } = totalsRef.current;
        dispatch({ type: "ADD_PAYMENT", payload: Math.max(0, td - tp) });
      } else if (e.key === "F3") {
        e.preventDefault();
        finalizeRef.current?.();
      } else if (e.altKey && (e.key === "q" || e.key === "Q")) {
        e.preventDefault();
        dispatch({ type: "RESET_ALL" });
      } else if (e.key === "Escape") {
        e.preventDefault();
        navigate("/");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const firstFiltered = state.filteredProducts[0];

  /* ============================== Steps ============================= */
  const ProdutoStep = () => (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Input
           ref={searchRef}
          placeholder="F4 para focar — pesquise por nome, marca ou código (Enter adiciona 1º)"
          value={state.searchTerm}
          onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter" && firstFiltered) dispatch({ type: "ADD_TO_CART", payload: firstFiltered });
          }}
          style={{ flex: 1 }}
        />
        <Button
          title="F2 — adiciona método com o restante"
          onClick={() => dispatch({ type: "ADD_PAYMENT", payload: Math.max(0, totalDue - totalPayments) })}
          icon={<CreditCardIcon style={{ width: 18, height: 18 }} />}
          outlined
          style={{ padding: "10px 12px" }}
        />
        <Button
          title="Estacionar venda atual"
          onClick={() => {
            dispatch({ type: "PARK_CURRENT" });
            dispatch({ type: "RESET_ALL" });
          }}
          outlined
          style={{ background: "#fff", color: "#333", borderColor: C.border }}
          icon={<PauseIcon style={{ width: 18, height: 18 }} />}
        />
        <Button
          title="Recarregar estacionadas"
          onClick={() => dispatch({ type: "LOAD_PARKED" })}
          outlined
          style={{ background: "#fff", color: "#333", borderColor: C.border }}
          icon={<ArrowPathIcon style={{ width: 18, height: 18 }} />}
        />
      </div>

      <label htmlFor="barcodeReader" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: "#555", fontSize: 14 }}>
        <Checkbox id="barcodeReader" checked={barcodeReader} onChange={setBarcodeReader} />
        Leitor de código de barras
      </label>

      <div
        style={{
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          height: 380,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <div style={{ padding: 10, borderBottom: `1px solid ${C.border}`, fontWeight: 800, display: "flex", justifyContent: "space-between" }}>
          <span>Produtos ({state.filteredProducts.length})</span>
          <span style={{ color: C.muted, fontWeight: 600 }}>Enter adiciona o primeiro</span>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {state.isLoading ? (
            <div style={{ padding: 16, color: C.muted }}>Carregando…</div>
          ) : state.filteredProducts.length ? (
            state.filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => dispatch({ type: "ADD_TO_CART", payload: p })}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderBottom: `1px solid ${C.border}`,
                  cursor: "pointer",
                  background: "#fff",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>
                    <span style={{ background: "#f3f3f3", padding: "2px 6px", borderRadius: 6, marginRight: 6 }}>{p.brand}</span>
                    Est.: {p.stock} {p.code ? ` • ${p.code}` : ""}
                  </div>
                </div>
                <div style={{ fontWeight: 800 }}>{formatCurrency(p.price)}</div>
              </div>
            ))
          ) : (
            <div style={{ padding: 16, color: C.muted, display: "flex", alignItems: "center", gap: 8 }}>
              <PhotoIcon style={{ width: 18, height: 18 }} /> Nenhum produto encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ClienteStep = () => (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end", marginBottom: 10 }}>
        <div>
          <label style={{ display: "block", marginBottom: 6, color: "#444", fontSize: 14 }}>Cliente (opcional)</label>
          <Select
            value={state.selectedCustomerId}
            onChange={(v) => dispatch({ type: "SET_CUSTOMER", payload: v })}
            options={state.customers.map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Selecione um cliente"
          />
        </div>
        <Button
          title="Cadastro rápido"
          onClick={() => dispatch({ type: "TOGGLE_QUICK_CUSTOMER" })}
          icon={<UserPlusIcon style={{ width: 18, height: 18 }} />}
          style={{ background: "#16a34a" }}
        >
          Novo
        </Button>
      </div>

      {state.showQuickCustomer && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 10 }}>
          <Input
            placeholder="Nome rápido do cliente"
            value={state.quickCustomerName}
            onChange={(e) => dispatch({ type: "SET_QUICK_CUSTOMER", payload: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleQuickCustomerAdd()}
          />
          <Button onClick={handleQuickCustomerAdd} style={{ background: "#16a34a" }}>
            Salvar
          </Button>
        </div>
      )}

      <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#555", fontSize: 14 }}>
        <Checkbox checked={state.printReceipt} onChange={(v) => dispatch({ type: "SET_PRINT", payload: v })} />
        Imprimir recibo
      </label>

      <TextArea
        rows={3}
        placeholder="Observações na venda (opcional)"
        value={state.notes}
        onChange={(e) => dispatch({ type: "SET_NOTES", payload: e.target.value })}
        style={{ marginTop: 10 }}
      />
    </div>
  );

  const [openCarnet, setOpenCarnet] = useState(false);
  const PagamentoStep = () => (
    <div>
      <h5 style={{ margin: "0 0 8px", fontWeight: 800 }}>Totais</h5>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 8 }}>
        <div>
          <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Subtotal</label>
          <Input type="text" value={formatCurrency(subtotal)} readOnly />
        </div>
        <div>
          <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Desconto (R$)</label>
          <Input type="number" step="0.01" min="0" value={state.discountPct > 0 ? 0 : state.discountValue} onChange={(e) => dispatch({ type: "SET_DISCOUNT_VALUE", payload: e.target.value })} />
        </div>
        <div>
          <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Desconto (%)</label>
          <Input type="number" step="0.1" min="0" max="100" value={state.discountPct} onChange={(e) => dispatch({ type: "SET_DISCOUNT_PCT", payload: e.target.value })} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        <div>
          <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Acréscimo (R$)</label>
          <Input type="number" step="0.01" min="0" value={state.surchargeValue} onChange={(e) => dispatch({ type: "SET_SURCHARGE", payload: e.target.value })} />
        </div>
        <div>
          <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Total a pagar</label>
          <Input type="text" value={formatCurrency(totalDue)} readOnly />
        </div>
        <div>
          <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Total pago</label>
          <Input type="text" value={formatCurrency(totalPayments)} readOnly />
        </div>
      </div>

      <h5 style={{ margin: "12px 0 8px", fontWeight: 800 }}>Forma de Pagamento</h5>

      {/* Ações rápidas */}
      <div style={{ display: "flex", gap: 10, justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap" }}>
        <Button
          outlined
          label="Dinheiro (F2)"
          icon={<img src={real} alt="Real Icon" style={{ width: 28, height: 28 }} />}
          onClick={() => {
            const val = Math.max(0, totalDue - totalPayments);
            if (!val) return toast.info("Sem restante.");
            dispatch({ type: "ADD_PAYMENT", payload: val });
          }}
          style={{ flex: 1, minWidth: 160, maxWidth: 200, background: "#fff", borderColor: C.red, color: C.red }}
        />

        <Button
          outlined
          label="PIX — Gerar QR Code"
          icon={<img src={pixIcon} alt="Pix Icon" style={{ width: 28, height: 28 }} />}
          onClick={() => {
            const val = Math.max(0, totalDue - totalPayments);
            if (!val) return toast.info("Sem restante.");
            dispatch({ type: "ADD_PAYMENT", payload: { amount: val, method: "PIX" } });
            toast.success("PIX adicionado (simulado). Integração real do QR fica no backend.");
          }}
          style={{ flex: 1, minWidth: 160, maxWidth: 230, background: "#fff", borderColor: C.red, color: C.red }}
        />

        <Button
          outlined
          label="Maquininha — Débito/Crédito"
          icon={<img src={maquininhaIcon} alt="POS" style={{ width: 40 }} />}
          onClick={() => {
            const val = Math.max(0, totalDue - totalPayments);
            if (!val) return toast.info("Sem restante.");
            dispatch({ type: "ADD_PAYMENT", payload: { amount: val, method: "Cartão de Crédito" } });
            toast.info("Selecione a máquina e, se crédito, informe as parcelas.");
          }}
          style={{ flex: 1, minWidth: 180, maxWidth: 240, background: "#fff", borderColor: C.red, color: C.red }}
        />
      </div>

      {/* Lista de pagamentos - agora isolada e rolável */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
        <div style={{ display: "grid", gap: 10, maxHeight: "40vh", overflowY: "auto", paddingRight: 4 }}>
          {state.payments.map((p) => (
            <div key={p.id} style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#555" }}>Método</label>
                  <Select
                    value={p.method}
                    onChange={(v) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "method", value: v } })}
                    options={PAYMENT_METHODS.map((m) => ({ value: m, label: m }))}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#555" }}>Valor</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={p.amount}
                    onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "amount", value: e.target.value } })}
                  />
                </div>
                {(p.method === "Cartão de Crédito" || p.method === "Cartão de Débito") && (
                  <>
                    <div>
                      <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#555" }}>Máquina</label>
                      <Select
                        value={p.machine}
                        onChange={(v) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "machine", value: v } })}
                        options={MACHINE_OPTIONS.map((m) => ({ value: m.name, label: m.name }))}
                        placeholder="Selecione a máquina"
                      />
                    </div>
                    {p.method === "Cartão de Crédito" && (
                      <div>
                        <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#555" }}>Parcelas</label>
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          value={p.installments || 1}
                          onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "installments", value: e.target.value } })}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
              <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                <button
                  type="button"
                  onClick={() =>
                    dispatch({
                      type: "UPDATE_PAYMENT",
                      payload: {
                        id: p.id,
                        field: "amount",
                        value: Math.max(0, totalDue - totalPayments + p.amount),
                      },
                    })
                  }
                  style={{ fontSize: 12, color: "#555" }}
                >
                  Usar restante
                </button>
                <button type="button" onClick={() => dispatch({ type: "REMOVE_PAYMENT", payload: p.id })} style={{ color: C.red, fontWeight: 700 }}>
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Rodapé da lista (fora da área rolável) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <small style={{ color: "#666" }}>Dica: F2 adiciona o restante automaticamente.</small>
          <div style={{ display: "flex", gap: 8 }}>
            <Button outlined title="Limpar pagamentos" onClick={() => dispatch({ type: "CLEAR_PAYMENTS" })} icon={<XMarkIcon style={{ width: 18, height: 18 }} />} />
            <Button title="Adicionar método (restante)" onClick={() => dispatch({ type: "ADD_PAYMENT", payload: Math.max(0, totalDue - totalPayments) })}>
              Adicionar Método
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Carnê */}
      <Modal
        open={openCarnet}
        onClose={() => setOpenCarnet(false)}
        title="Confirme os Dados do Carnê"
        footer={
          <>
            <Button outlined label="Cancelar" onClick={() => setOpenCarnet(false)} style={{ borderColor: C.border, color: "#555" }} />
            <Button
              label="Confirmar e Baixar"
              onClick={async () => {
                await downloadCarnet();
                setOpenCarnet(false);
              }}
            />
          </>
        }
      >
        <h5 style={{ marginTop: 0, marginBottom: 8, fontWeight: 800 }}>Resumo do Carnê</h5>
        <ul style={{ marginLeft: 18, lineHeight: 1.6 }}>
          <li>Total: {formatCurrency(totalDue)}</li>
        </ul>
      </Modal>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case "produto":
        return <ProdutoStep />;
      case "cliente":
        return <ClienteStep />;
      case "pagamento":
        return <PagamentoStep />;
      default:
        return null;
    }
  };

  /* ============================== UI principal ============================= */
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", overflow: "auto", background: C.bgApp }}>
      {/* Header */}
      <div
        style={{
          background: C.red,
          color: "white",
          padding: "8px 12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,.12)",
        }}
      >
        <img src={logo} alt="Venda-PRO" style={{ height: 50, width: 150, display: "block" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative", width: 320, maxWidth: "48vw" }}>
            <MagnifyingGlassIcon
              style={{ position: "absolute", right: 36, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#666" }}
            />
            <Input
              placeholder="Buscar venda — (Alt+P)"
              style={{ paddingRight: 44, background: "#fff", borderColor: "#efefef", fontWeight: 600 }}
              onFocus={() => setCurrentStep("produto")}
            />
          </div>

          <Button
            outlined
            title="Voltar ao Dashboard"
            icon={<HomeIcon style={{ width: 18, height: 18, color: C.red }} />}
            onClick={() => navigate("/")}
            style={{
              background: "#fff",
              color: C.red,
              borderColor: "#ffd8dc",
              padding: 10,
              width: 38,
              height: 38,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ display: "flex", flexGrow: 1, minHeight: 0, gap: 16, padding: 8, marginBottom: FOOTER_H }}>
        {/* Coluna esquerda */}
        <div
          style={{
            flexBasis: "43%",
            minWidth: 420,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            background: C.card,
            borderRadius: 10,
            padding: 10,
            border: `1px solid ${C.border}`,
          }}
        >
          <NavigationSteps currentStep={currentStep} setCurrentStep={setCurrentStep} />

          {/* ★ Wrapper rolável do conteúdo do step */}
          <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            <div style={{ height: "100%", minHeight: 0, overflowY: "auto", paddingRight: 4 }}>
              {renderStepContent()}
            </div>
          </div>
        </div>

        {/* Coluna direita — Carrinho */}
        <div
          style={{
            flexBasis: "57%",
            minWidth: 520,
            minHeight: 0,
            background: C.rightPanel,
            borderRadius: 10,
            border: `1px solid ${C.border}`,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: 12, borderBottom: `1px solid ${C.border}`, fontWeight: 800 }}>CAIXA</div>

          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 7, paddingBottom: FOOTER_H }}>
            {state.cart.length === 0 ? (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#888" }}>
                <div style={{ color: C.red, fontWeight: 800, marginBottom: 8 }}>Nenhum produto no carrinho</div>
                <ShoppingCartIcon style={{ width: 120, height: 120, color: "#c9c9c9" }} />
              </div>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {state.cart.map((it) => (
                  <div
                    key={it.id}
                    style={{
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      padding: "8px 10px",
                      background: "#fff",
                    }}
                  >
                    {/* Linha 1: Nome (esq)  •  Stepper (dir) */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                          fontWeight: 800,
                          fontSize: 15,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={it.name}
                      >
                        {it.name}
                      </div>

                      {/* Stepper quadrado */}
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "stretch",
                          height: 30,
                          border: `1px solid ${C.border}`,
                          borderRadius: 8,
                          overflow: "hidden",
                          background: "#fff",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            dispatch({ type: "UPDATE_QTY", payload: { id: it.id, qty: it.quantity - 1 } })
                          }
                          style={{
                            width: 34,
                            height: 30,
                            display: "grid",
                            placeItems: "center",
                            background: "#fafafa",
                            borderRight: `1px solid ${C.border}`,
                            lineHeight: 1,
                            fontSize: 18,
                            fontWeight: 700,
                            cursor: it.quantity <= 1 ? "not-allowed" : "pointer",
                            opacity: it.quantity <= 1 ? 0.5 : 1,
                          }}
                          aria-label="Diminuir"
                          disabled={it.quantity <= 1}
                        >
                          –
                        </button>

                        <Input
                          type="number"
                          min="1"
                          value={it.quantity}
                          onWheel={(e) => e.currentTarget.blur()}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_QTY",
                              payload: { id: it.id, qty: Number(e.target.value) || 1 },
                            })
                          }
                          style={{
                            width: 40,
                            height: 30,
                            textAlign: "center",
                            border: "none",
                            borderRadius: 0,
                            background: "transparent",
                            padding: 0,
                            fontWeight: 700,
                            outline: "none",
                            appearance: "textfield",
                            MozAppearance: "textfield",
                          }}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            dispatch({ type: "UPDATE_QTY", payload: { id: it.id, qty: it.quantity + 1 } })
                          }
                          style={{
                            width: 34,
                            height: 30,
                            display: "grid",
                            placeItems: "center",
                            background: "#fafafa",
                            borderLeft: `1px solid ${C.border}`,
                            lineHeight: 1,
                            fontSize: 18,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                          aria-label="Aumentar"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Linha 2: meta (esq)  •  total + lixeira (dir) */}
                    <div
                      style={{
                        marginTop: 6,
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0, fontSize: 12, color: C.muted }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 6px",
                            borderRadius: 999,
                            background: "#f5f5f5",
                            border: `1px solid ${C.border}`,
                            marginRight: 6,
                            fontWeight: 600,
                          }}
                        >
                          {it.brand}
                        </span>
                        {formatCurrency(it.price)} • estoque {it.stock}
                      </div>

                      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 900, letterSpacing: ".2px" }}>
                          {formatCurrency(it.total)}
                        </span>
                        <button
                          type="button"
                          onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: it.id })}
                          title="Remover"
                          style={{
                            color: C.red,
                            opacity: 0.9,
                          }}
                        >
                          <TrashIcon style={{ width: 16, height: 16 }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resumo à direita */}
          <div style={{ padding: 12, background: "#fff", borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", rowGap: 6, fontSize: 14 }}>
              <div>Subtotal</div><div style={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</div>
              <div>Desconto</div><div>- {formatCurrency(discount)}</div>
              <div>Acréscimo</div><div>+ {formatCurrency(surcharge)}</div>
              <div style={{ gridColumn: "1 / span 2", borderTop: `1px dashed ${C.border}`, marginTop: 6 }} />
              <div style={{ fontWeight: 800 }}>Total a pagar</div>
              <div style={{ fontWeight: 900 }}>{formatCurrency(totalDue)}</div>
              <div>Total pago</div><div style={{ fontWeight: 600 }}>{formatCurrency(totalPayments)}</div>
              {change > 0 && (<><div>Troco</div><div style={{ fontWeight: 800 }}>{formatCurrency(change)}</div></>)}
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé fixo */}
      <div
        style={{
          background: "#fff",
          padding: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `1px solid ${C.border}`,
          boxShadow: "0 -2px 6px rgba(0,0,0,.06)",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <Button
          outlined
          danger
          label="Excluir venda (Alt+Q)"
          onClick={() => dispatch({ type: "RESET_ALL" })}
          style={{ background: "#fff", color: C.red, borderColor: "#ffccd2", paddingLeft: 16, paddingRight: 16 }}
        />

        <Button
          label="Finalizar venda (F3)"
          onClick={handleFinalize}
          disabled={state.cart.length === 0 || totalPayments + 0.001 < totalDue}
          style={{ background: C.red, margin: "0 auto", borderRadius: 8, paddingLeft: 18, paddingRight: 18 }}
          icon={<PrinterIcon style={{ width: 18, height: 18 }} />}
        />

        <div style={{ display: "flex", alignItems: "baseline", gap: 10, color: "#333" }}>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Total</div>
          <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: ".5px" }}>{formatCurrency(totalDue)}</div>
        </div>
      </div>

      {/* VENDAS ESTACIONADAS */}
      {state.parked.length > 0 && (
        <div style={{ position: "fixed", right: 8, bottom: 98, width: 360, maxHeight: 320, overflow: "auto", background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10 }}>
          <div style={{ padding: 10, borderBottom: `1px solid ${C.border}`, fontWeight: 800, display: "flex", justifyContent: "space-between" }}>
            <span>Vendas Estacionadas</span>
            <span style={{ color: C.muted, fontSize: 12 }}>{state.parked.length}</span>
          </div>
          <div style={{ padding: 10, display: "grid", gap: 8 }}>
            {state.parked.map((p) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${C.border}`, borderRadius: 8, padding: 8 }}>
                <div style={{ fontSize: 12 }}>
                  <div style={{ fontWeight: 700 }}>#{p.id}</div>
                  <div style={{ color: C.muted }}>{new Date(p.createdAt).toLocaleString("pt-BR")}{" • "}{p.snapshot.cart.length} itens</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Button
                    onClick={() => {
                      dispatch({ type: "RESUME_PARKED", payload: p.id });
                      toast.info("Venda retomada no checkout.");
                    }}
                    style={{ background: "#2563eb" }}
                    icon={<PlayIcon style={{ width: 16, height: 16 }} />}
                  >
                    Retomar
                  </Button>
                  <Button outlined onClick={() => dispatch({ type: "DELETE_PARKED", payload: p.id })}>Excluir</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
