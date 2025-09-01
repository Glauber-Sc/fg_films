// utils/format.js
export const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Converte SEM mudar a data original.
// - Para strings "YYYY-MM-DD", apenas reordena para DD/MM/YYYY.
// - Para outros formatos, formata com timezone explícito de Belém.
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
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Belem" })
    .format(str instanceof Date ? str : new Date(str));
};

// Usar para COMPARAÇÕES de datas (filtros); cria uma Date local sem deslocar.
export const parseLocalDate = (dateInput) => {
  if (!dateInput) return null;
  const str = String(dateInput);
  const m = str.match(/^(\d{4})-(\d{2})-(\d{2})/); // pega YYYY-MM-DD mesmo que haja "T..."
  if (m) {
    const [ , y, mo, d ] = m.map(Number);
    return new Date(y, mo - 1, d); // meia-noite local do dia informado
  }
  const dt = new Date(str);
  return isNaN(dt.getTime()) ? null : dt;
};
