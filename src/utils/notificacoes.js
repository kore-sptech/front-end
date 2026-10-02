export function normalizarNotificacao(notificacao, indice) {
  const dados = notificacao.agendamento || notificacao;
  const tipo = dados.tipo || "INFORMATIVO";
  const titulo = dados.cliente
    ? `Sessão: ${dados.cliente}`
    : notificacao.titulo || "Nova notificação";
  const descricao =
    dados.descricao ||
    (dados.inicio
      ? `Sessão agendada para ${new Date(dados.inicio).toLocaleString("pt-BR")}.`
      : "Você recebeu uma nova notificação.");

  return {
    id: dados.id || notificacao.id || `evento-${indice}`,
    tipo: tipo === "CRITICO" || tipo === "ATENCAO" ? tipo : "INFORMATIVO",
    titulo,
    descricao,
    tempo: dados.inicio
      ? new Date(dados.inicio).toLocaleString("pt-BR")
      : "Agora",
  };
}
