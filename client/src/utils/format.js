// utils/format.js

// Moeda (BRL)
export const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

/**
 * FORMATAÇÃO DE DATA (sem hora)
 * Converte SEM mudar a data original.
 * - Para strings "YYYY-MM-DD", apenas reordena para DD/MM/YYYY.
 * - Para outros formatos (ISO etc), formata fixando o fuso de Belém.
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return "—";
  const str = String(dateInput);

  // Caso 1: data "pura" YYYY-MM-DD (evita qualquer fuso)
  const m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    const [, y, mo, d] = m;
    return `${d}/${mo}/${y}`;
  }

  // Caso 2: tem horário (ISO etc). Apenas formata fixando o fuso local:
  const d = str instanceof Date ? str : new Date(str);
  if (isNaN(d)) return "—";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Belem" }).format(
    d
  );
};

/**
 * FORMATAÇÃO DE HORA (HH:mm) no fuso de Belém.
 * Ideal para exibir o horário real a partir de createdAt/paidAt (que vêm em UTC).
 */
export const formatTime = (dateInput) => {
  if (!dateInput) return "—";
  const d = dateInput instanceof Date ? dateInput : new Date(String(dateInput));
  if (isNaN(d)) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Belem",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

/**
 * DATA + HORA juntos, já no fuso de Belém.
 * Útil quando quiser mostrar tudo em uma string só.
 */
export const formatDateTime = (dateInput) => {
  if (!dateInput) return "—";
  const d = dateInput instanceof Date ? dateInput : new Date(String(dateInput));
  if (isNaN(d)) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Belem",
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
};

/**
 * Usar para COMPARAÇÕES/FILTROS de datas.
 * Cria uma Date local SEM deslocar (p.ex.: "2025-09-08" -> 08/09/2025 00:00:00 local).
 */
export const parseLocalDate = (dateInput) => {
  if (!dateInput) return null;
  const str = String(dateInput);
  const m = str.match(/^(\d{4})-(\d{2})-(\d{2})/); // pega YYYY-MM-DD mesmo que haja "T..."
  if (m) {
    const [, y, mo, d] = m.map(Number);
    return new Date(y, mo - 1, d); // meia-noite local do dia informado
  }
  const dt = new Date(str);
  return isNaN(dt.getTime()) ? null : dt;
};
