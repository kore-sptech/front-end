import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

import { api } from "../utils/api";
import { handleApiError } from "../utils/errorHandler";
import { toast } from "sonner";

export default function CategoriaSelector({ value, onChange, usuarioId }) {
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [novaCategoriaNome, setNovaCategoriaNome] = useState("");
  const [novaCategoriaDescricao, setNovaCategoriaDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarCategorias();
  }, [usuarioId]);

  async function carregarCategorias() {
    try {
      const { data } = await api.get(`/categorias/${usuarioId}`);
      setCategorias(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.response?.status === 204) {
        setCategorias([]);
      } else {
        handleApiError(err, "Erro ao carregar categorias.");
        setCategorias([]);
      }
    }
  }

  async function criarCategoria() {
    if (novaCategoriaNome.trim().length < 3) {
      toast.error("O nome deve ter no mínimo 3 caracteres.");
      return;
    }
    if (novaCategoriaNome.length > 45) {
      toast.error("O nome deve ter no máximo 45 caracteres.");
      return;
    }
    if (novaCategoriaDescricao.length > 150) {
      toast.error("A descrição não pode ultrapassar 150 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post(`/categorias/${usuarioId}`, {
        nome: novaCategoriaNome,
        descricao: novaCategoriaDescricao,
      });

      setCategorias((prev) => [...prev, data]);
      onChange(data.id); // Seleciona a categoria recém-criada
      toast.success("Categoria criada com sucesso!");

      // Limpa o modal
      setNovaCategoriaNome("");
      setNovaCategoriaDescricao("");
      setShowModal(false);
    } catch (err) {
      handleApiError(err, "Erro ao criar categoria.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {/* Botão de limpar seleção */}
        <button
          type="button"
          className="btn btn-square rounded-lg border-[#bbc9cd70] bg-transparent hover:bg-red-900/20"
          onClick={() => onChange(null)}
          title="Limpar seleção"
        >
          <X size={18} />
        </button>

        {/* Lista de categorias existentes */}
        {categorias.map((categoria) => (
          <button
            key={categoria.id}
            type="button"
            onClick={() => onChange(categoria.id)}
            className={`btn rounded-lg transition-all ${
              String(value) === String(categoria.id)
                ? "border-cyan-400 bg-cyan-400 text-[#003640]"
                : "border-[#bbc9cd70] bg-transparent text-white hover:border-cyan-400/50"
            }`}
          >
            {categoria.nome}
          </button>
        ))}

        {/* Botão para criar nova categoria */}
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="btn rounded-lg border-dashed border-[#bbc9cd70] bg-transparent text-gray-400 hover:border-cyan-400 hover:text-cyan-400"
        >
          <Plus size={18} />
          Nova Categoria
        </button>
      </div>

      {/* Modal de criação de categoria */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box border border-[#3C494D]/20 bg-[#0A1A3D]">
            <h3 className="mb-4 text-lg font-bold text-white">
              Nova Categoria
            </h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="label">
                  <span className="text-[#BBC9CD]">NOME</span>
                  <span className="label-text-alt text-[#BBC9CD]">
                    {novaCategoriaNome.length}/45 (mín. 3)
                  </span>
                </label>
                <input
                  type="text"
                  className={`input w-full bg-[#0A1A3D] ${
                    novaCategoriaNome.length > 0 && novaCategoriaNome.length < 3
                      ? "border-error"
                      : ""
                  }`}
                  value={novaCategoriaNome}
                  onChange={(e) => setNovaCategoriaNome(e.target.value)}
                  placeholder="Ex: Tintas, Agulhas, Luvas..."
                />
              </div>

              <div>
                <label className="label">
                  <span className="text-[#BBC9CD]">DESCRIÇÃO (opcional)</span>
                  <span className="label-text-alt text-[#BBC9CD]">
                    {novaCategoriaDescricao.length}/150
                  </span>
                </label>
                <textarea
                  className={`textarea w-full bg-[#0A1A3D] ${
                    novaCategoriaDescricao.length > 150 ? "border-error" : ""
                  }`}
                  value={novaCategoriaDescricao}
                  onChange={(e) => setNovaCategoriaDescricao(e.target.value)}
                  placeholder="Descrição da categoria..."
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-action">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setNovaCategoriaNome("");
                  setNovaCategoriaDescricao("");
                }}
                className="btn border-gray-600 bg-transparent text-gray-400 hover:bg-gray-800"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={criarCategoria}
                className="btn bg-linear-to-r from-[#48DCFC] to-[#0CC0DF] text-[#003640] hover:scale-105"
                disabled={loading}
              >
                {loading ? "Criando..." : "Criar"}
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => !loading && setShowModal(false)}
          />
        </div>
      )}
    </div>
  );
}
