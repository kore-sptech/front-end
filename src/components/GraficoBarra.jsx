import {
  Bar,
  BarChart,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const data = [
  { mes: "Jan", Ganhos: 4000 },
  { mes: "Fev", Ganhos: 3000 },
  { mes: "Mar", Ganhos: 5000 },
  { mes: "Abr", Ganhos: 4780 },
  { mes: "Mai", Ganhos: 2080 }
];

export default function Grafico() {

  const listaMeses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const mesAtualTexto = listaMeses[new Date().getMonth()]; // Ex: Se for Maio, retorna "Mai"

  return (
    <div className="h-72 w-full ">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis
            dataKey="mes"
            axisLine={false}
            tick={{ fill: "#FFFFFF", fontSize: 12 }}
          />
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="rgba(255, 255, 255, 0.2)" 
          />
          <YAxis axisLine={false} tick={{ fill: "#FFFFFF", fontSize: 12 }} />
          <Tooltip cursor={false} /* Mantém a barra sem aquele foco cinza/branco no fundo */
                  contentStyle={{ 
                    backgroundColor: "#48DCFC80",
                    border: "none",
                    boxShadow: "none",
                    borderRadius: "10px"
                  }}
                  itemStyle={{ color: "#FFFFFF", fontWeight: "bold" }} /* Cor do texto "Ganhos: 4000" */
                    labelStyle={{ color: "#FFFFFF" }}
  />

          {/* <Legend verticalAlign="top" align="right" iconType="circle" /> */}

          <Bar dataKey="Ganhos" radius={[20, 20, 0, 0]}>
            {data.map((entry, index) => {
              // --- INÍCIO DA LÓGICA DE COR ALTERNADA ---
              
              let color;

              // Verifica se o mês desse bloco é IGUAL ao mês atual do sistema
              if (entry.mes === mesAtualTexto) {
                // Cor de destaque para o mês atual (Ex: um Ciano brilhante e sólido)
                color = "rgba(0, 220, 252, 1)"; 
              } else {
                // Mantém a sua lógica de opacidade gradual para os outros meses
                color = `rgba(0, 150, 250)`;
              }

              // --- FIM DA LÓGICA ---

              return <Cell key={index} fill={color} />;
              })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
