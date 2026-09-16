import {
  AlertCircle,
  ArrowRight,
  ImageOff,
  Phone,
  Plus,
  X,
} from "lucide-react";
import { data, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import CardProduto from "../../components/CardProduto";
import SearchBar from "../../components/SearchBar";
import Sidebar from "../../components/Sidebar";
import { api } from "../../utils/api";
import { handleApiError } from "../../utils/errorHandler";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

export default function CadastroProdutoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const usuarioId = localStorage.getItem("usuarioId");

  const pesquisa = location.state?.pesquisa || "";

  // imagem
  const [images, setImages] = useState([]); // Armazena as imagens {id, url}
  const [imageError, setImageError] = useState(false); // Controle de validação
  const [imageShaking, setImageShaking] = useState(false); // Efeito visual de erro
  const fileInputRef = useRef();

  const [nome, setNome] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNome(pesquisa);
  }, [pesquisa]);

  const [descricao, setDescricao] = useState("");
  const [possuiValidade, setPossuiValidade] = useState(false);
  const [qtdMinAlerta, setQtdMinAlerta] = useState(0);
  const [tipo, setTipo] = useState("");

  // Abre a janela de seleção de arquivos do sistema
  const handleClickAdd = () => fileInputRef.current.click();

  // Processa os arquivos selecionados
  const handleFileChange = async (e) => {
    try {
      await Promise.all(
        Array.from(e.target.files).map(async (file) => {
          const formData = new FormData();
          formData.append("foto", file);

          // Faz o upload para o servidor
          const { data } = await api.postForm("/fotos", formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const { id } = data;

          // Gera o preview local para o usuário ver na hora
          const reader = new FileReader();
          reader.onload = (ev) => {
            setImages((prev) => [...prev, { id, url: ev.target.result }]);
          };
          reader.readAsDataURL(file);
        }),
      );

      e.target.value = ""; // Limpa o input para permitir selecionar o mesmo arquivo de novo
      setImageError(false);
    } catch (err) {
      handleApiError(err, "Erro ao enviar a foto.");
    }
  };

  // Remove a imagem da lista
  const handleRemoveImage = (id) => {
    setImages((prev) => {
      const next = prev.filter((img) => img.id !== id);
      if (next.length === 0) {
        setImageError(true);
        setImageShaking(true);
      }
      return next;
    });
  };
  async function cadastrar() {
    if (nome.trim().length < 3) {
      toast.error("O nome deve ter no mínimo 3 caracteres.");
      return;
    }
    if (nome.length > 45) {
      toast.error("O nome deve ter no máximo 45 caracteres.");
      return;
    }
    if (descricao.length > 80) {
      toast.error("A descrição não pode ultrapassar 80 caracteres.");
      return;
    }
    if (qtdMinAlerta === "" || parseInt(qtdMinAlerta) < 0) {
      toast.error("A quantidade mínima deve ser um número positivo.");
      return;
    }
    if (tipo === "") {
      toast.error("O produto deve possuir uma categoria.");
      return;
    }
    const produto = {
      nome,
      descricao,
      possuiValidade,
      qtdMinAlerta: parseInt(qtdMinAlerta),
      tipo,
      usuarioId,
    };
    await fetch(`http://localhost:8080/produtos/${usuarioId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(produto),
    }).then((response) => {
      if (response.status === 201) {
        navigate("/produtos", {
          state: {
            successMessage: "Produto cadastrado com sucesso!",
          },
        });
      } else {
        console.log(response.status);
      }
    });
  }

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#000C24]">
      <Sidebar />

      <svg
        className="pointer-events-none absolute top-0 right-0"
        width="745"
        height="721"
        viewBox="0 0 745 721"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_460_506)">
          <rect
            x="120"
            y="68"
            width="532"
            height="533"
            rx="266"
            fill="#48DCFC"
            fill-opacity="0.05"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_460_506"
            x="0"
            y="-52"
            width="772"
            height="773"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="60"
              result="effect1_foregroundBlur_460_506"
            />
          </filter>
        </defs>
      </svg>

      <svg
        className="pointer-events-none absolute bottom-5 left-0"
        width="745"
        height="721"
        viewBox="0 0 745 721"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_460_506)">
          <rect
            x="120"
            y="68"
            width="532"
            height="533"
            rx="266"
            fill="#48DCFC"
            fill-opacity="0.05"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_460_506"
            x="0"
            y="-52"
            width="772"
            height="773"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="60"
              result="effect1_foregroundBlur_460_506"
            />
          </filter>
        </defs>
      </svg>

      <section className="h-full grow overflow-auto">
        <div className="flex w-full justify-between p-6">
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <a onClick={() => navigate("/produtos")}>PRODUTOS</a>
              </li>
              <li>
                <a>
                  <u>CADASTRAR</u>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full flex-wrap justify-between p-6">
          <h1 className="text-4xl font-bold">CADASTRAR PRODUTO</h1>
        </div>
        <div className="flex flex-wrap items-start justify-center gap-5 p-6">
          <fieldset className="fieldset rounded-box max-w-2xl grow border border-none bg-[#0A1A3D] p-6 text-[#BBC9CD]">
            <label className="label">
              <span className="text-[#BBC9CD]">NOME DO PRODUTO</span>
              <span className="label-text-alt text-[#BBC9CD]">
                {nome.length}/45 (mín. 3)
              </span>
            </label>
            <input
              type="text"
              className={`input w-full bg-[#0A1A3D] ${nome.length > 0 && nome.length < 3 ? "border-error" : ""}`}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <label className="label mt-4">
              <span className="text-[#BBC9CD]">DESCRIÇÃO</span>
              <span className="label-text-alt text-[#BBC9CD]">
                {descricao.length}/80
              </span>
            </label>
            <textarea
              className={`textarea h-24 w-full bg-[#0A1A3D] ${descricao.length > 80 ? "border-error" : ""}`}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />

            <div className="mt-4 mb-2 flex justify-between gap-4">
              <div className="flex-1">
                <label className="label text-[#BBC9CD]">POSSUI VALIDADE?</label>
                <select
                  className="select w-full bg-[#0A1A3D]"
                  value={possuiValidade}
                  onChange={(e) => setPossuiValidade(e.target.value === "true")}
                >
                  <option value="false">Não</option>
                  <option value="true">Sim</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="label text-[#BBC9CD]">
                  QUANTIDADE MÍNIMA
                </label>
                <input
                  type="number"
                  className="input w-full bg-[#0A1A3D]"
                  value={qtdMinAlerta}
                  onChange={(e) => setQtdMinAlerta(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <label className="label mt-4">
                <span className="text-[#BBC9CD]">CATEGORIA</span>
              </label>
              <form className="flex gap-3">
                <input
                  className="btn btn-square rounded-lg border-[#bbc9cd70] bg-transparent"
                  type="reset"
                  value="x"
                  onClick={() => setTipo("")}
                />
                <button
                  type="button"
                  onClick={() => setTipo("Tintas")}
                  className={`btn rounded-lg transition-all ${
                    tipo === "Tintas"
                      ? "border-cyan-400 bg-cyan-400 text-[#003640]"
                      : "border-[#bbc9cd70] bg-transparent text-white"
                  }`}
                >
                  Tintas
                </button>

                <button
                  type="button"
                  onClick={() => setTipo("Luvas")}
                  className={`btn rounded-lg transition-all ${
                    tipo === "Luvas"
                      ? "border-cyan-400 bg-cyan-400 text-[#003640]"
                      : "border-[#bbc9cd70] bg-transparent text-white"
                  }`}
                >
                  Luvas
                </button>

                <button
                  type="button"
                  onClick={() => setTipo("Agulhas")}
                  className={`btn rounded-lg transition-all ${
                    tipo === "Agulhas"
                      ? "border-cyan-400 bg-cyan-400 text-[#003640]"
                      : "border-[#bbc9cd70] bg-transparent text-white"
                  }`}
                >
                  Agulhas
                </button>
              </form>
            </div>
          </fieldset>
          <fieldset className="fieldset rounded-box max-w-50 grow border border-none bg-[#0A1A3D] p-6">
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-2 block text-xs font-bold tracking-widest text-[#BBC9CD] uppercase">
                  Referência Visual
                </label>

                <div
                  className={`rounded-2xl border p-4 transition-all duration-200 ${imageShaking ? "shake" : ""} ${imageError ? "border-red-500/50 bg-red-500/5" : "border-[#3C494D]/10 bg-[#263457]/20"}`}
                >
                  <div className="flex flex-wrap gap-3">
                    {/* Listagem das Imagens */}
                    {images.map((img) => (
                      <div
                        key={img.id}
                        className="group relative h-24 w-24 overflow-hidden rounded-lg border border-gray-700/50"
                      >
                        <img
                          src={img.url}
                          alt="Referência"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X size={18} className="text-white" />
                        </button>
                      </div>
                    ))}

                    {/* Botão de Adicionar */}
                    <button
                      type="button"
                      onClick={handleClickAdd}
                      className="flex h-48 w-48 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-[#3C494D]/20 bg-[#0A1A3D] hover:bg-[#0f2352]"
                    >
                      <Plus size={20} className="text-gray-500" />
                      <span className="text-[10px] text-gray-600">
                        Adicionar
                      </span>
                    </button>
                  </div>
                </div>

                {/* O Input Real (Escondido) */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <button
                onClick={cadastrar}
                className="flex min-w-55 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#48DCFC] to-[#0CC0DF] px-10 py-4 text-lg font-bold text-[#003640] shadow-xl shadow-cyan-500/30 transition-transform hover:scale-105 active:scale-95"
              >
                + Registrar
              </button>

              <button
                onClick={() => navigate("/produtos")}
                className="flex min-w-55 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-600 bg-transparent px-10 py-4 text-lg font-bold text-gray-400 transition-all hover:bg-gray-800"
              >
                Cancelar
              </button>
            </div>
          </fieldset>
        </div>
      </section>
    </main>
  );
}
