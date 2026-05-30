import { format } from "date-fns/format";
import { parseISO } from "date-fns/parseISO";
import { ptBR } from "date-fns/locale/pt-BR";

export function formatCurrecy(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(date) {
  if (!date) return "";

  const dateObject = parseISO(date);

  return format(dateObject, "dd MMM, yyyy", { locale: ptBR });
}
