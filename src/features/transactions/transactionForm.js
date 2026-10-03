export const TRANSACTION_TYPES = [
  { value: "", label: "Todos" },
  { value: "ENTRADA", label: "Entrada" },
  { value: "SAIDA", label: "Saída" },
];

export const TRANSACTION_CATEGORIES = [
  { value: "MATERIAS", label: "Materias" },
  { value: "INSUMOS", label: "Insumos" },
  { value: "OUTROS", label: "Outros" },
];

export const TRANSACTION_SORTS = [
  { value: "id,DESC", label: "Mais Recentes" },
  { value: "id,ASC", label: "Mais Antigos" },
  { value: "valor,DESC", label: "Do Maior ao Menor" },
  { value: "valor,ASC", label: "Do Menor ao Maior" },
];

export const DEFAULT_FILTERS = {
  tipo: "",
  nome: "",
  dataCriacao: "",
  sort: "id,DESC",
};

export const EMPTY_METRICS = {
  saldoAtual: 0,
  totalEntradas: 0,
  totalSaidas: 0,
  gastosPorCategoria: [],
  mesPassado: {
    variacaoReceita: 0,
    variacaoDespesa: 0,
  },
};

/**
 * Valida o formulário de transação.
 *
 * @param {{name: string, type: string, value: number}} values
 * @returns {object} Mapa campo → mensagem de erro.
 */
export function validateTransaction({ name, type, value }) {
  const errors = {};

  if (name.trim().length <= 3) {
    errors.name = "Informe uma descrição com mais de 3 caracteres.";
  }

  if (!type) {
    errors.type = "Selecione o tipo da transação.";
  }

  if (!(value > 0)) {
    errors.value = "Informe um valor maior que zero.";
  }

  return errors;
}

/**
 * Monta o corpo de criação/edição. Entradas sempre pertencem à categoria
 * de sessão, conforme regra do domínio.
 *
 * @param {{name: string, type: string, category: string, value: number}} values
 * @returns {object}
 */
export function buildTransactionPayload({ name, type, category, value }) {
  return {
    nome: name.trim(),
    tipo: type,
    categoria: type === "ENTRADA" ? "SESSAO" : category,
    valor: value,
  };
}

/**
 * Indica se o formulário mudou em relação à transação original.
 *
 * @param {object} values Valores atuais do formulário.
 * @param {object|null} original Transação carregada.
 * @returns {boolean}
 */
export function hasTransactionChanged(values, original) {
  if (!original) return true;

  return (
    values.name.trim() !== original.nome ||
    values.type !== original.tipo ||
    values.category !== original.categoria ||
    values.value !== original.valor
  );
}