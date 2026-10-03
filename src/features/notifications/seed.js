/**
 * Dados de exemplo exibidos enquanto não há eventos SSE na sessão.
 * Mantidos em um único lugar para facilitar a troca por dados reais.
 */
export const SEED_NOTIFICATIONS = [
  {
    id: 1,
    tipo: "CRITICO",
    titulo: "Estoque Crítico: Tinta Dynamic Black",
    descricao:
      "O estoque de tinta Dynamic Black (240ml) atingiu o nível mínimo. Restam apenas 2 unidades.",
    tempo: "Há 5 min",
  },
  {
    id: 2,
    tipo: "ATENCAO",
    titulo: "Validade Próxima: Agulhas RL-03",
    descricao:
      "O lote #K8829 de agulhas RL-03 vence em 15 dias. Priorize o uso ou remova do estoque principal.",
    tempo: "Há 2 horas",
  },
  {
    id: 3,
    tipo: "INFORMATIVO",
    titulo: "Próxima Sessão: Marcelo Oliveira",
    descricao: "Sessão de fechamento de braço agendada para as 14:00.",
    tempo: "Há 42 min",
    hasDetails: true,
  },
  {
    id: 4,
    tipo: "ATENCAO",
    titulo: "Manutenção Agendada: Máquina Rotativa",
    descricao:
      "Manutenção preventiva da máquina rotativa #02 agendada para sexta-feira.",
    tempo: "Há 5 horas",
  },
  {
    id: 5,
    tipo: "CRITICO",
    titulo: "Estoque Crítico: Tinta Branca Premium",
    descricao:
      "O estoque de tinta Branca Premium (120ml) está zerado. Reposição urgente necessária.",
    tempo: "Há 10 min",
  },
  {
    id: 6,
    tipo: "INFORMATIVO",
    titulo: "Próxima Sessão: João Mendes",
    descricao: "Sessão de sombreado nas costas agendada para as 16:30.",
    tempo: "Há 30 min",
    hasDetails: true,
  },
  {
    id: 7,
    tipo: "ATENCAO",
    titulo: "Validade Próxima: Película Protetora",
    descricao:
      "O lote #P2241 de película protetora vence em 10 dias. Verifique o estoque.",
    tempo: "Há 3 horas",
  },
  {
    id: 8,
    tipo: "CRITICO",
    titulo: "Estoque Crítico: Agulhas Magnum 9",
    descricao:
      "Restam apenas 3 pacotes de agulhas Magnum 9. Estoque abaixo do mínimo.",
    tempo: "Há 15 min",
  },
  {
    id: 9,
    tipo: "INFORMATIVO",
    titulo: "Próxima Sessão: Fernanda Lima",
    descricao: "Sessão de retoque de aquarela agendada para as 11:00.",
    tempo: "Há 20 min",
    hasDetails: true,
  },
  {
    id: 10,
    tipo: "ATENCAO",
    titulo: "Validade Próxima: Tinta Vermelha Sangue",
    descricao:
      "O lote #T5512 vence em 7 dias. Utilize com prioridade ou descarte adequadamente.",
    tempo: "Há 4 horas",
  },
  {
    id: 11,
    tipo: "CRITICO",
    titulo: "Estoque Crítico: Papel Transfer",
    descricao: "Restam apenas 5 folhas de papel transfer. Reposição urgente.",
    tempo: "Há 8 min",
  },
  {
    id: 12,
    tipo: "INFORMATIVO",
    titulo: "Próxima Sessão: Marina Souza",
    descricao: "Sessão de geometria no pescoço agendada para as 13:30.",
    tempo: "Há 1 hora",
    hasDetails: true,
  },
];