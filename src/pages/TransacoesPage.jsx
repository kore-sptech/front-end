import Sidebar from "../components/Sidebar";
import { Plus, Search, Calendar, Filter, Download, MoreVertical, ShoppingCart, Paintbrush, Zap, User } from "lucide-react";
import { useState } from "react";
import ModalNovaTransacao from "../components/ModalNovaTransacao";

// Dados fictícios para a tabela
const transacoes = [
  { id: 1, nome: "Pigmentos Dynamic Triple Black", categoria: "ESTOQUE / SUPRIMENTOS", valor: -450.00, tipo: "SAÍDA", data: "12 Out, 2023", icon: <Paintbrush size={20}/> },
  { id: 2, nome: "Tatuagem Realista (Sessão 2) - Marcos V.", categoria: "SERVIÇO / TATUAGEM", valor: 1200.00, tipo: "ENTRADA", data: "12 Out, 2023", icon: <User size={20}/> },
  { id: 3, nome: "Conta de Luz - Unidade Central", categoria: "FIXO / OPERACIONAL", valor: -380.45, tipo: "SAÍDA", data: "11 Out, 2023", icon: <Zap size={20}/> },
  { id: 4, nome: "Venda de Joia Piercing Titânio", categoria: "VENDA / PRODUTO", valor: 220.00, tipo: "ENTRADA", data: "11 Out, 2023", icon: <ShoppingCart size={20}/> },
  { id: 5, nome: "Venda de Joia Piercing Titânio", categoria: "VENDA / PRODUTO", valor: 220.00, tipo: "ENTRADA", data: "11 Out, 2023", icon: <ShoppingCart size={20}/> },
];

export default function TransacoesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-[#000C24] text-white">
      <Sidebar />

      <main className="flex-1 p-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Transações financeiras</h1>
          <button onClick={() => setIsModalOpen(true)}
          className="bg-cyan-400 text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-cyan-300 transition-all">
            <Plus size={20} /> Nova Transação
          </button>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-[#061639] p-6 rounded-2xl border border-gray-800">
            <p className="text-xs text-cyan-400 font-bold uppercase mb-2">Receita Mensal</p>
            <h2 className="text-3xl font-bold">R$ 42.890,00</h2>
            <p className="text-xs text-gray-500 mt-2">+12.4% em relação ao mês passado</p>
          </div>
          <div className="bg-[#061639] p-6 rounded-2xl border border-gray-800">
            <p className="text-xs text-red-400 font-bold uppercase mb-2">Despesas Mensais</p>
            <h2 className="text-3xl font-bold">R$ 12.430,50</h2>
            <p className="text-xs text-gray-500 mt-2">-4.2% em relação ao mês passado</p>
          </div>
          <div className="bg-gradient-to-br from-[#061639] to-cyan-900/30 p-6 rounded-2xl border border-cyan-500/20 shadow-lg">
            <p className="text-xs text-gray-300 font-bold uppercase mb-2">Saldo em Conta</p>
            <h2 className="text-3xl font-bold">R$ 84.120,45</h2>
            <button className="text-xs text-cyan-400 mt-2 hover:underline">VER EXTRATO DETALHADO →</button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 mb-8">
          <div className="flex bg-[#061639] rounded-lg p-1 border border-gray-800">
             <button className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] rounded-md text-sm"><Calendar size={16}/> Data</button>
             <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400">Status: Todos</button>
          </div>
          
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Nome, descrição ou categoria..." 
              className="w-full bg-[#061639] border border-gray-800 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button className="p-3 bg-[#061639] border border-gray-800 rounded-lg text-gray-400 hover:text-white"><Filter size={20}/></button>
          <button className="p-3 bg-[#061639] border border-gray-800 rounded-lg text-gray-400 hover:text-white"><Download size={20}/></button>
        </div>

        {/* Tabela de Transações */}
        <div className="bg-[#061639]/50 rounded-2xl border border-gray-800 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-xs uppercase border-b border-gray-800">
                <th className="px-8 py-5 font-semibold">Nome</th>
                <th className="px-8 py-5 font-semibold">Valor</th>
                <th className="px-8 py-5 font-semibold text-center">Tipo</th>
                <th className="px-8 py-5 font-semibold">Data</th>
                <th className="px-8 py-5 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {transacoes.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="bg-cyan-500/10 p-3 rounded-full text-cyan-400">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{item.nome}</p>
                        <p className="text-[10px] text-gray-500 font-bold">{item.categoria}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`px-8 py-5 font-bold ${item.valor > 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                    {item.valor > 0 ? `+ R$ ${item.valor.toLocaleString()}` : `- R$ ${Math.abs(item.valor).toLocaleString()}`}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${item.tipo === 'ENTRADA' ? 'bg-cyan-400/20 text-cyan-400' : 'bg-red-400/20 text-red-400'}`}>
                      {item.tipo}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-400">{item.data}</td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-gray-500 hover:text-white"><MoreVertical size={20}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Paginação */}
          <div className="p-6 border-t border-gray-800 flex justify-between items-center text-xs text-gray-500">
            <p>Exibindo 1 - 5 de 128 transações</p>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center bg-cyan-400 text-black rounded font-bold">1</button>
              <button className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded">2</button>
              <button className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded">3</button>
              <span className="flex items-center px-1">...</span>
              <button className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded">12</button>
            </div>
          </div>
        </div>
      </main>
      <ModalNovaTransacao isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}