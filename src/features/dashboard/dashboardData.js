import { Calendar, CircleDollarSign, Clock } from "lucide-react";

export const DASHBOARD_KPIS = [
  {
    id: "lucro",
    label: "LUCRO LÍQUIDO",
    value: "R$ 10.000",
    description: "+12.5% em relação ao mês passado",
    icon: null,
  },
  {
    id: "agendamentos",
    label: "AGENDAMENTOS",
    value: "142",
    description: "+5 novos no último mês",
    icon: Calendar,
  },
  {
    id: "ocupacao",
    label: "OCUPAÇÃO",
    value: "88%",
    description: "da agenda semanal ocupada",
    icon: Clock,
  },
];

export const CRITICAL_STOCK_ALERTS = [
  {
    id: 1,
    title: "Estoque Baixo - Agulhas RL-03",
    description: "Apenas 5 unidades restantes no inventário principal.",
  },
  {
    id: 2,
    title: "Estoque Baixo - Luvas",
    description: "Apenas 2 unidades restantes no inventário principal.",
  },
  {
    id: 3,
    title: "Estoque Baixo - Tintas",
    description: "Apenas 8 unidades restantes no inventário principal.",
  },
];

export const RECENT_ACTIVITIES = [
  {
    id: 1,
    icon: Clock,
    tipo: "Lembrete",
    title: "Proxima sessao em 20 minutos",
    description: "",
    time: "Há 20 minutos",
  },
  {
    id: 2,
    icon: CircleDollarSign,
    tipo: "Saida",
    title: "Compra efetuada!",
    description: "Material X - Valor R$ 300,00",
    time: "Há 42 minutos",
  },
  {
    id: 3,
    icon: CircleDollarSign,
    tipo: "Entrada",
    title: "Pagamento recebido!",
    description: "Sessão finalizada - Valor R$ 530,00",
    time: "Há 2 horas",
  },
  {
    id: 4,
    icon: Calendar,
    tipo: "Agendamento",
    title: "Agendamento realizado!",
    description: "Sessão Marcada - Data: 15/07/2026",
    time: "Há 3 horas",
  },
];

export const MONTHLY_REVENUE = [
  { mes: "Jan", Ganhos: 3200 },
  { mes: "Fev", Ganhos: 5100 },
  { mes: "Mar", Ganhos: 4300 },
  { mes: "Abr", Ganhos: 7600 },
  { mes: "Mai", Ganhos: 6100 },
  { mes: "Jun", Ganhos: 8900 },
  { mes: "Jul", Ganhos: 7400 },
  { mes: "Ago", Ganhos: 9800 },
  { mes: "Set", Ganhos: 8600 },
  { mes: "Out", Ganhos: 11200 },
  { mes: "Nov", Ganhos: 9400 },
  { mes: "Dez", Ganhos: 12500 },
];
