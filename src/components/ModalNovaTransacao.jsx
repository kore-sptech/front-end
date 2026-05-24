import { Loader2, X } from "lucide-react";

import { api } from "../utils/api";
import { toast } from "sonner";
import { useState } from "react";

function parseValorBR(valorFormatado) {
  return parseFloat(valorFormatado.replace(/\./g, "").replace(",", ".")) || 0;
}

function formatarValorBR(apenasDigitos) {
  const numero = parseInt(apenasDigitos || "0", 10) / 100;
  return numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function ModalNovaTransacao({
  isOpen,
  onClose,
  obterTransacoes,
}) {
  const [form, setForm] = useState({
    nome: "",
    tipo: "ENTRADA",
    categoria: "MATERIAS",
  });

  const [valorDisplay, setValorDisplay] = useState("");

  const [valorFloat, setValorFloat] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const enabledForm = form.nome !== "" && valorFloat > 0 && form.tipo !== "";

  function handleValorChange(e) {
    const apenasDigitos = e.target.value.replace(/\D/g, "");

    const formatado = formatarValorBR(apenasDigitos);
    const limpo = parseValorBR(formatado);

    setValorDisplay("R$ " + formatado);
    setValorFloat(limpo);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const body = {
      ...form,
      valor: valorFloat,
    };

    if (form.tipo === "ENTRADA") {
      body.categoria = "SESSAO";
    }

    api
      .post("/transacoes", body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        toast.success("Transação adicionada com sucesso!");
        obterTransacoes();
        onClose();
      })
      .catch(() => {
        toast.error("Erro ao adicionar transação!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-gray-800 bg-[#061639] p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer text-gray-500 transition-colors hover:text-white"
        >
          <X size={24} />
        </button>

        <h2 className="mb-6 text-center text-2xl font-bold text-cyan-400">
          Nova Transação
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-gray-400 uppercase">
              Descrição
            </label>
            <input
              type="text"
              placeholder="Ex: Tatuagem Realista"
              className="w-full rounded-lg border border-gray-800 bg-[#000C24] px-4 py-3 text-sm focus:border-cyan-400 focus:outline-none"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-400 uppercase">
                Valor (R$)
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="R$ 0,00"
                className="w-full rounded-lg border border-gray-800 bg-[#000C24] px-4 py-3 text-sm text-white focus:border-cyan-400 focus:outline-none"
                value={valorDisplay}
                onChange={handleValorChange}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-400 uppercase">
                Tipo
              </label>
              <select
                className="w-full rounded-lg border border-gray-800 bg-[#000C24] px-4 py-3 text-sm text-gray-300 focus:border-cyan-400 focus:outline-none"
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              >
                <option value="ENTRADA">Entrada</option>
                <option value="SAIDA">Saída</option>
              </select>
            </div>
          </div>

          {form.tipo === "SAIDA" && (
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-400 uppercase">
                Categoria
              </label>
              <select
                className="w-full rounded-lg border border-gray-800 bg-[#000C24] px-4 py-3 text-sm text-gray-300 focus:border-cyan-400 focus:outline-none"
                value={form.categoria}
                onChange={(e) =>
                  setForm({ ...form, categoria: e.target.value })
                }
              >
                <option value="MATERIAS">Materias</option>
                <option value="INSUMOS">Insumos</option>
                <option value="OUTROS">Outros</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={!enabledForm}
            className="mt-4 w-full rounded-lg bg-cyan-400 py-4 text-sm font-bold tracking-widest text-black uppercase shadow-lg shadow-cyan-400/10 transition-all hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 size={20} className="animate-spin" />
                <p>Adicionando...</p>
              </span>
            ) : (
              "Adicionar Transação"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
