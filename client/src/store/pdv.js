import { toast } from "react-toastify";

export const PARKED_KEY = "pdv_parked_sales_v1";

export const initialState = {
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

export function readParked() {
    try {
        const raw = localStorage.getItem(PARKED_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}
export function writeParked(arr) {
    localStorage.setItem(PARKED_KEY, JSON.stringify(arr));
}

export function reducer(state, action) {
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
                    {
                        id: p.id,
                        name: p.name,
                        brand: p.brand,
                        price: Number(p.price) || 0,
                        quantity: 1,
                        stock: Number(p.stock) || 0,
                        total: Number(p.price) || 0,
                    },
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
            // remove do array e persiste no localStorage
            const nextParked = state.parked.filter((p) => p.id !== id);
            writeParked(nextParked);
            // carrega o snapshot e atualiza a lista
            return { ...state, ...entry.snapshot, parked: nextParked };
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
