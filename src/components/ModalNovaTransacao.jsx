import { X } from "lucide-react";
import { toast } from "sonner";

export default function ModalNovaTransacao({ isOpen, onClose }) {
  if (!isOpen) return null; 

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Transação adicionada com sucesso!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-[#061639] border border-gray-800 w-full max-w-md rounded-2xl p-8 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-cyan-400 text-center">Nova Transação</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase text-gray-400 font-bold mb-1 block">Descrição</label>
            <input 
              type="text" 
              placeholder="Ex: Tatuagem Realista"
              className="w-full bg-[#000C24] border border-gray-800 rounded-lg py-3 px-4 focus:outline-none focus:border-cyan-400 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase text-gray-400 font-bold mb-1 block">Valor (R$)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="0,00"
                className="w-full bg-[#000C24] border border-gray-800 rounded-lg py-3 px-4 focus:outline-none focus:border-cyan-400 text-sm text-white"
                required
              />
            </div>
            <div>
              <label className="text-xs uppercase text-gray-400 font-bold mb-1 block">Tipo</label>
              <select className="w-full bg-[#000C24] border border-gray-800 rounded-lg py-3 px-4 focus:outline-none focus:border-cyan-400 text-sm text-gray-300">
                <option value="ENTRADA">Entrada</option>
                <option value="SAIDA">Saída</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase text-gray-400 font-bold mb-1 block">Categoria</label>
            <input 
              type="text" 
              placeholder="Ex: Serviço / Tatuagem"
              className="w-full bg-[#000C24] border border-gray-800 rounded-lg py-3 px-4 focus:outline-none focus:border-cyan-400 text-sm"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-cyan-400 text-black font-bold py-4 rounded-lg mt-4 hover:bg-cyan-300 transition-all uppercase text-sm tracking-widest shadow-lg shadow-cyan-400/10"
          >
            Adicionar Transação
          </button>
        </form>
      </div>
    </div>
  );
}