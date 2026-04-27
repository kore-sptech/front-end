import { addDays, startOfWeek } from "date-fns";

import { CLIENT_COLORS } from "../const/Day";

export function buildColorMapByClient(sessions) {
  return [...new Set(sessions.map((s) => s.cliente))]
    .sort()
    .reduce((map, name, i) => {
      map[name] = CLIENT_COLORS[i % CLIENT_COLORS.length];
      return map;
    }, {});
}

export function buildWeekDays(referenceDate) {
  const monday = startOfWeek(referenceDate, { weekStartsOn: 1 }); // semana começa na SEG
  const labels = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];

  return labels.map((label, i) => {
    const date = addDays(monday, i);
    return {
      label,
      day: date.getDate(), // número do dia para exibir
      date, // Date completo para comparações
    };
  });
}
