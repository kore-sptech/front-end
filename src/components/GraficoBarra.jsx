import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell 
} from "recharts";

const data = [
  { mes: "Jan", Ganhos: 4000 },
  { mes: "Fev", Ganhos: 3000 },
  { mes: "Mar", Ganhos: 5000 },
  { mes: "Abr", Ganhos: 4780 },
];

export default function Grafico() {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="mes" axisLine={false} tick={{ fill: "#FFFFFF", fontSize: 12 }}/>
          <YAxis axisLine={false} tick={{ fill: "#FFFFFF", fontSize: 12 }}/>
          <Tooltip />

          <Legend verticalAlign="top" align="right" iconType="circle" />
          
          <Bar dataKey="Ganhos" radius={[20, 20, 0, 0]}>
            {data.map((entry, index) => {
              const opacity = entry.Ganhos / 7000; // ajusta escala
              const color = `rgba(0,150,280,${opacity})`;

              return <Cell key={index} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}