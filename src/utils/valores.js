export function converterValorBrasileiro(valorFormatado) {
  return parseFloat(valorFormatado.replace(/\./g, "").replace(",", ".")) || 0;
}

export function formatarValorBrasileiro(apenasDigitos) {
  const numero = parseInt(apenasDigitos || "0", 10) / 100;
  return numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
