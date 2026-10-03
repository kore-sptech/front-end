import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const MONTHS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const BAR = "rgba(0, 150, 250)";
const BAR_CURRENT = "rgba(0, 220, 252, 1)";

/**
 * Organism: gráfico de barras de ganhos por mês, destacando o mês atual.
 *
 * @param {object} props
 * @param {Array<{mes: string, Ganhos: number}>} props.data Série exibida.
 */
export default function RevenueChart({ data = [] }) {
  const currentMonth = MONTHS[new Date().getMonth()];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="mes" axisLine={false} tick={{ fill: "#FFFFFF", fontSize: 12 }} />
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(255, 255, 255, 0.2)"
          />
          <YAxis axisLine={false} tick={{ fill: "#FFFFFF", fontSize: 12 }} />
          <Tooltip
            cursor={false}
            contentStyle={{
              backgroundColor: "#48DCFC80",
              border: "none",
              boxShadow: "none",
              borderRadius: "10px",
            }}
            itemStyle={{ color: "#FFFFFF", fontWeight: "bold" }}
            labelStyle={{ color: "#FFFFFF" }}
          />

          <Bar dataKey="Ganhos" radius={[20, 20, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`${entry.mes}-${index}`}
                fill={entry.mes === currentMonth ? BAR_CURRENT : BAR}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}