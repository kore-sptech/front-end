import {
  AlertCircle,
  ArrowRight,
  BanknoteArrowUp,
  CalendarArrowUp,
  CalendarCheck2,
  ImageOff,
  MessageCircle,
  Phone,
  Plus,
  X,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";

import { AgendamentoContext } from "../context/ModalAgendamentoContext";
import GridMateriaisAdicionados from "./IntegracaoEstoqueAgendamento/GridMateriaisAdicionados";
import { IMaskInput } from "react-imask";
import ModalLista from "./ModalLista";
import { api } from "../utils/api";
import { toast } from "sonner";

// ─── Shake animation ──────────────────────────────────────────────────────────
const shakeStyle = `
  @keyframes shake {
    0%   { transform: translateX(0); }
    15%  { transform: translateX(-6px); }
    30%  { transform: translateX(6px); }
    45%  { transform: translateX(-4px); }
    60%  { transform: translateX(4px); }
    75%  { transform: translateX(-2px); }
    90%  { transform: translateX(2px); }
    100% { transform: translateX(0); }
  }
  .shake { animation: shake 0.45s ease; }
`;

// ─── Garante string vazia se valor for null/undefined ─────────────────────────
const str = (v) => (v != null ? String(v) : "");

// ─── Validação pura (substitui o schema Zod) ─────────────────────────────────
function validate(fields, durationMinutes) {
  const errors = {};

  if (!fields.cliente || fields.cliente.trim().length === 0) {
    errors.cliente = "Nome é obrigatório";
  } else if (fields.cliente.trim().length < 3) {
    errors.cliente = "Mínimo 3 caracteres";
  }

  if (!fields.preco || fields.preco.trim().length === 0) {
    errors.preco = "Preço é obrigatório";
  } else {
    const num = parseFloat(fields.preco);
    if (isNaN(num) || num <= 0) {
      errors.preco = "Informe um valor maior que zero";
    }
  }

  if (!fields.telefone || fields.telefone.trim().length === 0) {
    errors.telefone = "Telefone é obrigatório";
  } else if (fields.telefone.replace(/\D/g, "").length !== 11) {
    errors.telefone = "Telefone incompleto — use (99) 99999-9999";
  }

  if (!fields.pagamento || fields.pagamento.trim().length === 0) {
    errors.pagamento = "Selecione a forma de pagamento";
  }

  if (!fields.de || fields.de.trim().length === 0) {
    errors.de = "Informe o horário de início";
  }

  // validar duração (em minutos) e garantir que fim > início
  if (!durationMinutes || durationMinutes <= 0) {
    errors.ate = "Informe a duração";
  } else if (fields.de && durationMinutes) {
    const start = new Date(fields.de);
    const end = new Date(start.getTime() + durationMinutes * 60000);
    if (end <= start) {
      errors.ate = "Horário de término deve ser após o início";
    }
  }

  return errors;
}

function isFormValid(fields, durationMinutes) {
  return Object.keys(validate(fields, durationMinutes)).length === 0;
}

// ─── Estilos de input ─────────────────────────────────────────────────────────
const baseInput =
  "w-full bg-[#000C24] border rounded-lg py-3 px-4 text-sm text-white " +
  "placeholder:text-gray-600 focus:outline-none transition-all duration-200";

const inputCls = (hasError) =>
  `${baseInput} ${
    hasError
      ? "border-red-500 focus:border-red-400 shadow-[0_0_0_1px_rgba(239,68,68,0.3)]"
      : "border-gray-800 focus:border-cyan-400"
  }`;

// ─── Componente de mensagem de erro ──────────────────────────────────────────
function ErrorMsg({ message }) {
  if (!message) return null;
  return (
    <div className="mt-1.5 flex items-center gap-1.5">
      <AlertCircle size={12} className="shrink-0 text-red-500" />
      <p className="text-[11px] text-red-400">{message}</p>
    </div>
  );
}

// ─── Componente de campo com shake ao receber novo erro ──────────────────────
function Field({ label, icon, error, children }) {
  const [shaking, setShaking] = useState(false);
  const prevMsg = useRef(undefined);

  useEffect(() => {
    if (error && error !== prevMsg.current) {
      setShaking(true);
    }
    prevMsg.current = error;
  }, [error]);

  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold tracking-widest text-gray-500 uppercase">
        {label}
      </label>
      <div
        className={`relative ${shaking ? "shake" : ""}`}
        onAnimationEnd={() => setShaking(false)}
      >
        {icon && (
          <span className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-gray-600">
            {icon}
          </span>
        )}
        {children}
      </div>
      <ErrorMsg message={error} />
    </div>
  );
}

// ─── Componente Placeholder para o ModalLista ──────────────────────────────
function ItemMaterialPlaceholder({ item }) {
  return (
    <div className="cursor-pointer rounded-xl border border-gray-800 bg-[#0A1A3D] p-4 text-white transition-all hover:border-cyan-400/50">
      <p className="text-sm font-bold">{item.nome || "Produto sem nome"}</p>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ModalNovoAgendamento({ isOpen, onClose }) {
  const { agendamento } = useContext(AgendamentoContext);

  const imagesDoAgendamento =
    agendamento?.referencias.map((foto) => ({
      ...foto,
      url: foto.imageUrl,
    })) || [];

  const [fields, setFields] = useState({
    cliente: str(agendamento?.cliente),
    preco: agendamento?.preco != null ? String(agendamento.preco) : "",
    telefone: str(agendamento?.telefone),
    pagamento: str(agendamento?.formaPagamento),
    de: agendamento?.inicio?.replace(" ", "T").slice(0, 16) ?? "",
    ate: agendamento?.fim?.replace(" ", "T").slice(0, 16) ?? "",
  });

  // --- Helpers para calcular fim a partir de inicio + duração (minutos)
  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function formatLocalInput(date) {
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes())
    );
  }

  function addMinutesToLocalInput(deStr, minutes) {
    if (!deStr) return "";
    const dt = new Date(deStr);
    if (isNaN(dt.getTime())) return "";
    const end = new Date(dt.getTime() + minutes * 60000);
    return formatLocalInput(end);
  }

  // inicializa duration (minutos) a partir do agendamento quando em edição
  const initialDe = agendamento?.inicio?.replace(" ", "T").slice(0, 16) ?? "";
  const initialAte = agendamento?.fim?.replace(" ", "T").slice(0, 16) ?? "";
  let initialDuration = 60;
  try {
    if (initialDe && initialAte) {
      const d1 = new Date(initialDe);
      const d2 = new Date(initialAte);
      const diff = Math.round((d2.getTime() - d1.getTime()) / 60000);
      if (diff > 0) initialDuration = diff;
    }
  } catch (e) {
    /* ignore */
  }

  const [durationMinutes, setDurationMinutes] = useState(initialDuration);

  // Atualiza formulário quando `agendamento` ou `isOpen` mudarem
  useEffect(() => {
    if (!isOpen) return;

    const deVal = agendamento?.inicio?.replace(" ", "T").slice(0, 16) ?? "";
    const ateVal = agendamento?.fim?.replace(" ", "T").slice(0, 16) ?? "";

    setFields({
      cliente: str(agendamento?.cliente),
      preco: agendamento?.preco != null ? String(agendamento.preco) : "",
      telefone: str(agendamento?.telefone),
      pagamento: str(agendamento?.formaPagamento),
      de: deVal,
      ate: ateVal,
    });

    // atualizar duração a partir de inicio/fim quando existir
    if (deVal && ateVal) {
      const d1 = new Date(deVal);
      const d2 = new Date(ateVal);
      const diff = Math.round((d2.getTime() - d1.getTime()) / 60000);
      if (!isNaN(diff) && diff > 0) {
        setDurationMinutes(diff);
      }
    }

    // atualizar imagens
    const imgs =
      agendamento?.referencias?.map((foto) => ({
        ...foto,
        url: foto.imageUrl,
      })) || [];
    setImages(imgs);
    setImageError(imgs.length === 0);
  }, [agendamento, isOpen]);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [images, setImages] = useState(imagesDoAgendamento);
  const [imageError, setImageError] = useState(false);
  const [imageShaking, setImageShaking] = useState(false);
  const fileInputRef = useRef();

  // -- Materiais
  const [produtosLista, setProdutosLista] = useState([]);
  const [materiaisSelecionados, setMateriaisSelecionados] = useState([]);
  const [isMateriaisModalOpen, setIsMateriaisModalOpen] = useState(false);

  const formIsValid = isFormValid(fields, durationMinutes);
  const canSubmit = formIsValid && images.length > 0;

  const handleChange = (name, value) => {
    let nextFields = { ...fields, [name]: value };
    if (name === "de") {
      // recalcula fim com a duração atual
      nextFields.ate = addMinutesToLocalInput(value, durationMinutes);
    }
    setFields(nextFields);

    if (touched[name]) {
      const nextErrors = validate(nextFields, durationMinutes);
      setErrors((prev) => ({
        ...prev,
        [name]: nextErrors[name] ?? undefined,
      }));
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const nextErrors = validate(fields, durationMinutes);
    setErrors((prev) => ({
      ...prev,
      [name]: nextErrors[name] ?? undefined,
    }));
  };

  const handleClickAdd = () => fileInputRef.current.click();

  // -- Produtos refatorado
  const handleProdutos = async () => {
    try {
      const { data } = await api.get("/produtos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProdutosLista(data);
      setIsMateriaisModalOpen(true);
    } catch (error) {
      toast.error("Erro ao buscar produtos.");
    }
  };

  // -- Adicionar materiais selecionados
  const handleAddMateriais = (novoMaterial) => {
    // Verifica se este produto já foi adicionado
    const produtoJaAdicionado = materiaisSelecionados.some(
      (m) => m.produtoId === novoMaterial.produtoId,
    );

    if (produtoJaAdicionado) {
      toast.error(
        "Este produto já foi adicionado. Remova antes de adicionar novamente.",
      );
      return;
    }

    setMateriaisSelecionados((prev) => [...prev, novoMaterial]);
    toast.success("Material adicionado com sucesso!");
  };

  // -- Remover material selecionado
  const handleRemoverMaterial = (index) => {
    setMateriaisSelecionados((prev) => prev.filter((_, i) => i !== index));
    toast.success("Material removido.");
  };
  const confirmarSessao = () => {
    api
      .patch(
        `/agendamentos/confirmar/${agendamento.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      .then(() => {
        toast.success("Sessão confirmada com sucesso!");
        onClose();
      })
      .catch(() => {
        console.log(
          `[Toast] Erro ao confirmar agendamento id=${agendamento.id}`,
        );
      });
  };

  const confirmarPagamaento = () => {
    api
      .patch(
        `/agendamentos/confirmar_pagamento/${agendamento.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      .then(() => {
        api
          .post(
            `/transacoes/${agendamento.id}`,
            {
              nome: "Tatuagem do " + fields.cliente,
              tipo: "ENTRADA",
              valor: parseFloat(fields.preco),
              categoria: "SESSAO",
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          )
          .then(() => {
            toast.success("Transação adicionada com sucesso!");
            onClose();
          })
          .catch(() => {
            toast.error("Erro ao adicionar transação.");
          });
      })
      .catch(() => {
        toast.error("Erro ao confirmar pagamento.");
      });
  };

  const handleFileChange = async (e) => {
    await Promise.all(
      Array.from(e.target.files).map(async (file) => {
        const formData = new FormData();
        formData.append("foto", file);

        const { data } = await api.postForm("/fotos", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const { id } = data;

        const reader = new FileReader();
        reader.onload = (ev) => {
          setImages((prev) => [...prev, { id, url: ev.target.result }]);
        };
        reader.readAsDataURL(file);
      }),
    );

    e.target.value = "";
    setImageError(false);
  };

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

  const onSubmit = (e) => {
    e.preventDefault();

    const allTouched = Object.keys(fields).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {},
    );
    setTouched(allTouched);

    const validationErrors = validate(fields, durationMinutes);
    setErrors(validationErrors);

    const hasFieldErrors = Object.keys(validationErrors).length > 0;
    const hasImageError = images.length === 0;

    if (hasImageError) {
      setImageError(true);
      setImageShaking(true);
    }

    if (hasFieldErrors || hasImageError) return;

    const precoNumerico = parseFloat(fields.preco);
    const fimCalculado = addMinutesToLocalInput(fields.de, durationMinutes);
    const payload = {
      cliente: fields.cliente,
      preco: precoNumerico,
      telefone: fields.telefone,
      formaPagamento: fields.pagamento,
      inicio: fields.de,
      fim: fimCalculado,
      referencias: images.map((img) => img.id),
      materiais: materiaisSelecionados.map((m) => ({
        produtoId: m.produtoId,
        itens: m.itens.map((i) => i.id),
      })),
    };

    if (agendamento?.id) {
      api
        .put(`/agendamentos/${agendamento.id}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(() => {
          const todosOsItensIds = materiaisSelecionados.flatMap((material) =>
            material.itens.map((item) => item.id),
          );

          //  mapeia os IDs para um array de requisições (Promises)
          const requisicoesEstoque = todosOsItensIds.map((itemId) => {
            return api.put(
              `/estoque/${itemId}/${agendamento.id}`,
              {}, // corpo requisição é vazio
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              },
            );
          });

          //  executa todas as requisições em paralelo e aguarda o resultado
          return Promise.all(requisicoesEstoque);
        })
        .then(() => {
          toast.success("Agendamento e estoque atualizados com sucesso!");
          onClose();
        })
        .catch(() => {
          toast.error("Erro ao atualizar agendamento.");
        });

      toast.success("Materiais salvos com sucesso!");
    } else {
      api
        .post("/agendamentos", payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(() => {
          toast.success("Agendamento adicionado com sucesso!");
          onClose();
        })
        .catch((err) => {
          console.log(err);

          if (err.status == 400 && err.response?.data?.message) {
            toast.error(err.response.data.message);
          } else {
            toast.error("Erro ao adicionar agendamento.");
          }
        });
    }
  };

  useEffect(() => {}, []);

  if (!isOpen) return null;

  return (
    <>
      <style>{shakeStyle}</style>

      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div className="relative w-full max-w-2xl rounded-2xl border border-gray-800 bg-[#061639] p-8 shadow-2xl">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 cursor-pointer text-gray-600 transition-colors hover:text-white"
          >
            <X size={22} />
          </button>

          <div className="mb-7">
            <h2 className="mb-1 text-center text-2xl font-bold text-cyan-400">
              Agendar Sessão
            </h2>
            <p className="text-sm text-[#BBC9CD]">
              Configure os detalhes do novo atendimento artístico.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Cliente" error={errors.cliente}>
                <input
                  type="text"
                  value={fields.cliente}
                  onChange={(e) => handleChange("cliente", e.target.value)}
                  onBlur={() => handleBlur("cliente")}
                  placeholder="Ex: João da Silva"
                  className={inputCls(!!errors.cliente)}
                />
              </Field>

              <Field label="Preço (R$)" error={errors.preco}>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={fields.preco}
                  onChange={(e) => handleChange("preco", e.target.value)}
                  onBlur={() => handleBlur("preco")}
                  placeholder="0,00"
                  className={inputCls(!!errors.preco)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Telefone"
                icon={<Phone size={14} />}
                error={errors.telefone}
              >
                <IMaskInput
                  mask="(00) 00000-0000"
                  value={fields.telefone}
                  onAccept={(val) => handleChange("telefone", str(val))}
                  onBlur={() => handleBlur("telefone")}
                  placeholder="(11) 99999-9999"
                  className={`${inputCls(!!errors.telefone)} pl-9`}
                />
              </Field>

              <Field label="Forma de pagamento" error={errors.pagamento}>
                <select
                  value={fields.pagamento}
                  onChange={(e) => handleChange("pagamento", e.target.value)}
                  onBlur={() => handleBlur("pagamento")}
                  className={`${inputCls(!!errors.pagamento)} cursor-pointer appearance-none`}
                >
                  <option value="">Selecione...</option>
                  <option value="PIX">PIX</option>
                  <option value="DINHEIRO">Dinheiro</option>
                </select>
              </Field>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold tracking-widest text-gray-500 uppercase">
                Referência Visual
              </label>

              <div
                className={`rounded-2xl border p-4 transition-all duration-200 ${
                  imageShaking ? "shake" : ""
                } ${
                  imageError
                    ? "border-red-500/50 bg-red-500/5 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]"
                    : "border-[#3C494D]/10 bg-[#263457]/20"
                }`}
                onAnimationEnd={() => setImageShaking(false)}
              >
                <div className="flex flex-wrap gap-3">
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
                        className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X size={18} className="text-white" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleClickAdd}
                    className={`flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border transition-all hover:border-cyan-400/30 ${
                      imageError
                        ? "border-red-500/30 bg-red-500/10 hover:bg-red-500/20"
                        : "border-[#3C494D]/20 bg-[#0A1A3D] hover:bg-[#0f2352]"
                    }`}
                  >
                    <Plus
                      size={20}
                      className={imageError ? "text-red-400" : "text-gray-500"}
                    />
                    <span
                      className={`text-[10px] ${
                        imageError ? "text-red-400" : "text-gray-600"
                      }`}
                    >
                      Adicionar
                    </span>
                  </button>
                </div>

                {images.length > 0 && (
                  <p className="mt-3 text-[11px] text-cyan-400/40">
                    {images.length} imagem{images.length > 1 ? "s" : ""}{" "}
                    adicionada
                    {images.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>

              {imageError && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <ImageOff size={12} className="shrink-0 text-red-500" />
                  <p className="text-[11px] text-red-400">
                    Adicione ao menos uma referência visual
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* ── Materiais Refatorado ───────────────────────────────────── */}
            <div>
              <label className="mb-2 block text-xs font-bold tracking-widest text-gray-500 uppercase">
                Materiais
              </label>
              <div className="rounded-2xl border border-[#3C494D]/10 bg-[#263457]/20 p-4 transition-all duration-200">
                <button
                  type="button"
                  onClick={handleProdutos}
                  className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-[#3C494D]/20 bg-[#0A1A3D] transition-all hover:border-cyan-400/30 hover:bg-[#0f2352]"
                >
                  <Plus size={20} className="text-gray-500" />
                  <span className="text-[10px] text-gray-600">Adicionar</span>
                </button>
              </div>
            </div>

            {/* ── Grid de Materiais Adicionados ────────────────────────────── */}
            <GridMateriaisAdicionados
              materiais={materiaisSelecionados}
              onRemover={handleRemoverMaterial}
            />

            <div className="flex items-start gap-4">
              <Field label="De" error={errors.de}>
                <input
                  type="datetime-local"
                  value={fields.de}
                  onChange={(e) => handleChange("de", e.target.value)}
                  onBlur={() => handleBlur("de")}
                  className={inputCls(!!errors.de)}
                />
              </Field>

              <ArrowRight className="mt-9 shrink-0 text-gray-700" size={18} />

              <Field label="Até" error={errors.ate}>
                <select
                  value={durationMinutes}
                  onChange={(e) => {
                    const mins = Number(e.target.value);
                    setDurationMinutes(mins);
                    const newAte = addMinutesToLocalInput(fields.de, mins);
                    setFields((prev) => ({ ...prev, ate: newAte }));
                    if (touched.ate) {
                      const nextErrors = validate(
                        { ...fields, ate: newAte },
                        mins,
                      );
                      setErrors((prev) => ({
                        ...prev,
                        ate: nextErrors.ate ?? undefined,
                      }));
                    }
                  }}
                  onBlur={() => handleBlur("ate")}
                  className={inputCls(!!errors.ate)}
                >
                  <option value={0}>Selecione a duração...</option>
                  {Array.from({ length: 16 }).map((_, i) => {
                    const mins = (i + 1) * 30;
                    const hours = Math.floor(mins / 60);
                    const remainder = mins % 60;
                    const label =
                      `${hours > 0 ? hours + "h" : ""}${remainder > 0 ? " " + remainder + "min" : ""}`.trim();
                    return (
                      <option key={mins} value={mins}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </Field>
            </div>

            {agendamento?.id ? (
              <>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="mt-2 w-full cursor-pointer rounded-lg border border-cyan-400/30 py-4 text-sm font-bold tracking-widest text-cyan-400 uppercase transition-all hover:bg-cyan-400/10"
                    onClick={() => {
                      let numeroLimpo = fields.telefone.replace(/\D/g, "");

                      let mensagem = "Ola, " + fields.cliente + ".";

                      let urlWhatsApp = `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;

                      window.open(urlWhatsApp, "_blank");
                    }}
                  >
                    <span className="flex w-full items-center justify-center gap-2">
                      <MessageCircle /> <span>Conversar</span>
                    </span>
                  </button>

                  {agendamento.status != "CANCELADO" && (
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className={`mt-2 w-full rounded-lg py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                        canSubmit
                          ? "cursor-pointer bg-cyan-400 text-black shadow-lg shadow-cyan-400/20 hover:bg-cyan-300"
                          : "cursor-not-allowed bg-gray-800 text-gray-600 opacity-60"
                      }`}
                    >
                      {canSubmit ? (
                        <span className="flex w-full items-center justify-center gap-2">
                          <CalendarArrowUp /> <span>Atualizar</span>
                        </span>
                      ) : (
                        "Preencha todos os campos"
                      )}
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  {(agendamento.status == "PENDENTE" ||
                    agendamento.status == "AGUARDANDO" ||
                    agendamento.status == "CONFIRMADO") && (
                    <button
                      type="button"
                      disabled={!canSubmit}
                      className="mt-2 flex w-full cursor-pointer items-center gap-0 rounded-lg border border-cyan-400/30 py-4 text-sm font-bold tracking-widest text-cyan-400 uppercase transition-all hover:bg-cyan-400/10"
                      onClick={confirmarPagamaento}
                    >
                      <span className="flex w-full items-center justify-center gap-2">
                        <BanknoteArrowUp /> <span>Confirmar Pagamento</span>
                      </span>
                    </button>
                  )}

                  {(agendamento.status == "PENDENTE" ||
                    agendamento.status == "AGUARDANDO") && (
                    <button
                      type="button"
                      onClick={confirmarSessao}
                      disabled={!canSubmit}
                      className="mt-2 w-full cursor-pointer rounded-lg border border-cyan-400/30 py-4 text-sm font-bold tracking-widest text-cyan-400 uppercase transition-all hover:bg-cyan-400/10"
                    >
                      <span className="flex w-full items-center justify-center gap-2">
                        <CalendarCheck2 /> <span> Confirmar Sessão</span>
                      </span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <button
                type="submit"
                disabled={!canSubmit}
                className={`mt-2 w-full rounded-lg py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                  canSubmit
                    ? "cursor-pointer bg-cyan-400 text-black shadow-lg shadow-cyan-400/20 hover:bg-cyan-300"
                    : "cursor-not-allowed bg-gray-800 text-gray-600 opacity-60"
                }`}
              >
                {canSubmit
                  ? "Adicionar Agendamento"
                  : "Preencha todos os campos"}
              </button>
            )}
          </form>
        </div>
      </div>

      {/* ── Chamada do Modal de Lista ───────────────────────────────────── */}
      {agendamento && (
        <ModalLista
          isOpen={isMateriaisModalOpen}
          onClose={() => setIsMateriaisModalOpen(false)}
          title="Estoque de Materiais"
          items={produtosLista}
          onMateriaisSelect={handleAddMateriais}
          agendamentoId={agendamento.id}
        />
      )}
    </>
  );
}
