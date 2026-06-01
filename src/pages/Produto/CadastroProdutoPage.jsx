import { useEffect, useState, useRef } from "react";
import { data, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Sidebar from "../../components/Sidebar";
import CardProduto from "../../components/CardProduto";
import SearchBar from "../../components/SearchBar";
import { useLocation } from "react-router-dom";
import {
    AlertCircle,
    ArrowRight,
    ImageOff,
    Phone,
    Plus,
    X,
} from "lucide-react";


export default function CadastroProdutoPage() {

    const navigate = useNavigate();
    const location = useLocation();

    const pesquisa = location.state?.pesquisa || "";

    // imagem
    const [images, setImages] = useState([]); // Armazena as imagens {id, url}
    const [imageError, setImageError] = useState(false); // Controle de validação
    const [imageShaking, setImageShaking] = useState(false); // Efeito visual de erro
    const fileInputRef = useRef();

    const [nome, setNome] = useState("");

    useEffect(() => {
        setNome(pesquisa);
    }, [pesquisa]);

    const [descricao, setDescricao] = useState("");
    const [possuiValidade, setPossuiValidade] = useState(false);
    const [qtdMinAlerta, setQtdMinAlerta] = useState(0);
    // Abre a janela de seleção de arquivos do sistema
    const handleClickAdd = () => fileInputRef.current.click();

    // Processa os arquivos selecionados
    const handleFileChange = async (e) => {
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
        const produto = {
            nome,
            descricao,
            possuiValidade,
            qtdMinAlerta: parseInt(qtdMinAlerta)
        };
        await fetch("http://localhost:8080/produtos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(produto)
        })
            .then((response) => {
                if (response.status === 201) {
                    document.getElementById('modal_sucesso').showModal();
                } else {
                    console.log(response.status)
                }
            })
    }

    return (
        <main className="h-screen w-full flex bg-[#000C24] overflow-hidden">
            <Sidebar />

            <svg className="right-0 top-0 absolute pointer-events-none" width="745" height="721" viewBox="0 0 745 721" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_f_460_506)">
                    <rect x="120" y="68" width="532" height="533" rx="266" fill="#48DCFC" fill-opacity="0.05" />
                </g>
                <defs>
                    <filter id="filter0_f_460_506" x="0" y="-52" width="772" height="773" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="60" result="effect1_foregroundBlur_460_506" />
                    </filter>
                </defs>
            </svg>

            <svg className="bottom-5 left-0 absolute pointer-events-none" width="745" height="721" viewBox="0 0 745 721" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_f_460_506)">
                    <rect x="120" y="68" width="532" height="533" rx="266" fill="#48DCFC" fill-opacity="0.05" />
                </g>
                <defs>
                    <filter id="filter0_f_460_506" x="0" y="-52" width="772" height="773" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="60" result="effect1_foregroundBlur_460_506" />
                    </filter>
                </defs>
            </svg>

            <section className="grow h-full overflow-auto">
                <div className="p-6 flex w-full justify-between">
                    <div className="breadcrumbs text-sm">
                        <ul>
                            <li><a onClick={() => navigate("/produtos")}>PRODUTOS</a></li>
                            <li><a><u>CADASTRAR</u></a></li>
                        </ul>
                    </div>
                </div>
                <div className="p-6 flex-wrap w-full justify-between">
                    <h1 className="text-4xl font-bold">CADASTRAR PRODUTO</h1>
                </div>
                <div className="p-6 flex justify-center items-start gap-5 flex-wrap">

                    <fieldset className="fieldset bg-[#0A1A3D] border-none rounded-box grow max-w-2xl border p-6 text-[#BBC9CD]">
                        <label className="label">
                            <span className="text-[#BBC9CD]">NOME DO PRODUTO</span>
                            <span className="label-text-alt text-[#BBC9CD]">{nome.length}/45 (mín. 3)</span>
                        </label>
                        <input
                            type="text"
                            className={`input bg-[#0A1A3D] w-full ${nome.length > 0 && nome.length < 3 ? 'border-error' : ''}`}
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />

                        <label className="label mt-4">
                            <span className="text-[#BBC9CD]">DESCRIÇÃO</span>
                            <span className="label-text-alt text-[#BBC9CD]">{descricao.length}/80</span>
                        </label>
                        <textarea
                            className={`textarea h-24 bg-[#0A1A3D] w-full ${descricao.length > 80 ? 'border-error' : ''}`}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />

                        <div className="flex justify-between gap-4 mt-4 mb-2">
                            <div className="flex-1">
                                <label className="label text-[#BBC9CD]">POSSUI VALIDADE?</label>
                                <select
                                    className="select bg-[#0A1A3D] w-full"
                                    value={possuiValidade}
                                    onChange={(e) => setPossuiValidade(e.target.value === "true")}
                                >
                                    <option value="false">Não</option>
                                    <option value="true">Sim</option>
                                </select>
                            </div>

                            <div className="flex-1 ">
                                <label className="label text-[#BBC9CD]">QUANTIDADE MÍNIMA</label>
                                <input
                                    type="number"
                                    className="input bg-[#0A1A3D] w-full"
                                    value={qtdMinAlerta}
                                    onChange={(e) => setQtdMinAlerta(e.target.value)}
                                />
                            </div>
                        </div>


                    </fieldset>
                    <fieldset className="fieldset bg-[#0A1A3D] border-none rounded-box grow max-w-50 border p-6">
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="mb-2 block text-xs font-bold tracking-widest text-[#BBC9CD] uppercase">
                                    Referência Visual
                                </label>

                                <div className={`rounded-2xl border p-4 transition-all duration-200 ${imageShaking ? "shake" : ""} ${imageError ? "border-red-500/50 bg-red-500/5" : "border-[#3C494D]/10 bg-[#263457]/20"}`}>
                                    <div className="flex flex-wrap gap-3">
                                        {/* Listagem das Imagens */}
                                        {images.map((img) => (
                                            <div key={img.id} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-gray-700/50">
                                                <img src={img.url} alt="Referência" className="h-full w-full object-cover" />
                                                <button type="button" onClick={() => handleRemoveImage(img.id)} className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <X size={18} className="text-white" />
                                                </button>
                                            </div>
                                        ))}

                                        {/* Botão de Adicionar */}
                                        <button type="button" onClick={handleClickAdd} className="flex h-48 w-48 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-[#3C494D]/20 bg-[#0A1A3D] hover:bg-[#0f2352]">
                                            <Plus size={20} className="text-gray-500" />
                                            <span className="text-[10px] text-gray-600">Adicionar</span>
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
                                className="flex justify-center items-center gap-2 px-10 py-4 text-lg font-bold bg-linear-to-r from-[#48DCFC] to-[#0CC0DF] text-[#003640] rounded-xl shadow-xl shadow-cyan-500/30 cursor-pointer transition-transform hover:scale-105 active:scale-95 min-w-55"
                            >
                                + Registrar
                            </button>

                            <button
                                onClick={() => navigate("/produtos")}
                                className="flex justify-center items-center gap-2 px-10 py-4 text-lg font-bold bg-transparent text-gray-400 border border-gray-600 rounded-xl cursor-pointer hover:bg-gray-800 transition-all min-w-55"
                            >
                                Cancelar
                            </button>
                        </div>
                    </fieldset>



                </div>
            </section>
        </main>
    )
}