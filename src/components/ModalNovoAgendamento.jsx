import {
  AlertCircle,
  ArrowRight,
  ImageOff,
  Phone,
  Plus,
  X,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useContext, useEffect, useRef, useState } from "react";

import { AgendamentoContext } from "../context/ModalAgendamentoContext";
import { IMaskInput } from "react-imask";
import { api } from "../utils/api";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

const schema = z
  .object({
    cliente: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(3, "Mínimo 3 caracteres"),

    preco: z
      .string()
      .min(1, "Preço é obrigatório")
      .refine(
        (v) => {
          const num = parseFloat(v);
          return !isNaN(num) && num > 0;
        },
        { message: "Informe um valor maior que zero" },
      ),

    telefone: z
      .string()
      .min(1, "Telefone é obrigatório")
      .refine((v) => v.replace(/\D/g, "").length === 11, {
        message: "Telefone incompleto — use (99) 99999-9999",
      }),

    pagamento: z.string().min(1, "Selecione a forma de pagamento"),

    de: z.string().min(1, "Informe o horário de início"),
    ate: z.string().min(1, "Informe o horário de término"),
  })
  .refine((d) => !d.de || !d.ate || d.ate > d.de, {
    message: "Horário de término deve ser após o início",
    path: ["ate"],
  });

// ─── Garante string vazia se valor for null/undefined ─────────────────────────
const str = (v) => (v != null ? String(v) : "");

const baseInput =
  "w-full bg-[#000C24] border rounded-lg py-3 px-4 text-sm text-white " +
  "placeholder:text-gray-600 focus:outline-none transition-all duration-200";

const inputCls = (hasError) =>
  `${baseInput} ${
    hasError
      ? "border-red-500 focus:border-red-400 shadow-[0_0_0_1px_rgba(239,68,68,0.3)]"
      : "border-gray-800 focus:border-cyan-400"
  }`;

function ErrorMsg({ message }) {
  if (!message) return null;
  return (
    <div className="mt-1.5 flex items-center gap-1.5">
      <AlertCircle size={12} className="shrink-0 text-red-500" />
      <p className="text-[11px] text-red-400">{message}</p>
    </div>
  );
}

function Field({ label, icon, error, children }) {
  const [shaking, setShaking] = useState(false);
  const prevMsg = useRef(undefined);

  useEffect(() => {
    if (error?.message && error.message !== prevMsg.current) {
      setShaking(true);
    }
    prevMsg.current = error?.message;
  }, [error?.message]);

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
      <ErrorMsg message={error?.message} />
    </div>
  );
}

export default function ModalNovoAgendamento({ isOpen, onClose }) {
  if (!isOpen) return null;

  const { agendamento } = useContext(AgendamentoContext);

  const imagesDoAgendamento =
    agendamento?.referencias.map((foto) => ({
      ...foto,
      url: foto.imageUrl,
    })) || [];

  const defaultValues = {
    cliente: str(agendamento?.cliente),
    preco: agendamento?.preco != null ? String(agendamento.preco) : "",
    telefone: str(agendamento?.telefone),
    pagamento: str(agendamento?.formaPagamento),
    de: str(agendamento?.inicio),
    ate: str(agendamento?.fim),
  };

  const [images, setImages] = useState(imagesDoAgendamento);
  const [imageError, setImageError] = useState(false);
  const [imageShaking, setImageShaking] = useState(false);
  const fileInputRef = useRef();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues,
  });

  const canSubmit = isValid && images.length > 0;

  const handleClickAdd = () => fileInputRef.current.click();

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

  const onSubmit = (data) => {
    if (images.length === 0) {
      setImageError(true);
      setImageShaking(true);
      return;
    }

    const precoNumerico = parseFloat(data.preco);

    if (agendamento?.id) {
      api
        .put(
          `/agendamentos/${agendamento.id}`,
          {
            ...data,

            preco: precoNumerico,
            formaPagamento: data.pagamento,
            inicio: data.de,
            fim: data.ate,
            referencias: images.map((img) => img.id),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        )
        .then(() => {
          toast.success("Agendamento atualizado com sucesso!");
          onClose();
        })
        .catch(() => {
          toast.error("Erro ao atualizar agendamento.");
        });
      return;
    }

    api
      .post(
        "/agendamentos",
        {
          ...data,
          preco: precoNumerico,
          formaPagamento: data.pagamento,
          inicio: data.de,
          fim: data.ate,
          referencias: images.map((img) => img.id),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      .then(() => {
        toast.success("Agendamento adicionado com sucesso!");

        onClose();
      })
      .catch(() => {
        toast.error("Erro ao adicionar agendamento.");
      });
  };

  const onInvalid = () => {
    if (images.length === 0) {
      setImageError(true);
      setImageShaking(true);
    }
  };

  return (
    <>
      <style>{shakeStyle}</style>

      <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div className="relative w-full max-w-2xl rounded-2xl border border-gray-800 bg-[#061639] p-8 shadow-2xl">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 transition-colors hover:text-white"
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

          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="space-y-4"
          >
            {/* ── Cliente + Preço ────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Cliente" error={errors.cliente}>
                <input
                  {...register("cliente")}
                  type="text"
                  placeholder="Ex: João da Silva"
                  className={inputCls(!!errors.cliente)}
                />
              </Field>

              <Field label="Preço (R$)" error={errors.preco}>
                <input
                  {...register("preco")}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  className={inputCls(!!errors.preco)}
                />
              </Field>
            </div>

            {/* ── Telefone + Pagamento ───────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Telefone"
                icon={<Phone size={14} />}
                error={errors.telefone}
              >
                <Controller
                  name="telefone"
                  control={control}
                  render={({ field }) => (
                    <IMaskInput
                      mask="(00) 00000-0000"
                      defaultValue={str(field.value)}
                      inputRef={field.ref}
                      onAccept={(val) => field.onChange(str(val))}
                      placeholder="(11) 99999-9999"
                      className={`${inputCls(!!errors.telefone)} pl-9`}
                    />
                  )}
                />
              </Field>

              <Field label="Forma de pagamento" error={errors.pagamento}>
                <select
                  {...register("pagamento")}
                  className={`${inputCls(!!errors.pagamento)} cursor-pointer appearance-none`}
                >
                  <option value="">Selecione...</option>
                  <option value="PIX">PIX</option>
                  <option value="DINHEIRO">Dinheiro</option>
                </select>
              </Field>
            </div>

            {/* ── Referência Visual ─────────────────────────────────────── */}
            <div>
              <label className="mb-2 block text-xs font-bold tracking-widest text-gray-500 uppercase">
                Referência Visual
              </label>

              <div
                className={`rounded-2xl border p-4 transition-all duration-200 ${imageShaking ? "shake" : ""} ${
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
                        className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
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
                      className={`text-[10px] ${imageError ? "text-red-400" : "text-gray-600"}`}
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

            {/* ── Horários ──────────────────────────────────────────────── */}
            <div className="flex items-start gap-4">
              <Field label="De" error={errors.de}>
                <input
                  {...register("de")}
                  type="datetime-local"
                  className={inputCls(!!errors.de)}
                />
              </Field>

              <ArrowRight className="mt-9 shrink-0 text-gray-700" size={18} />

              <Field label="Até" error={errors.ate}>
                <input
                  {...register("ate")}
                  type="datetime-local"
                  className={inputCls(!!errors.ate)}
                />
              </Field>
            </div>

            {/* ── Botões ────────────────────────────────────────────────── */}
            {agendamento?.id ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  className="mt-2 w-full cursor-pointer rounded-lg border border-cyan-400/30 py-4 text-sm font-bold tracking-widest text-cyan-400 uppercase transition-all hover:bg-cyan-400/10"
                >
                  Conversar
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`mt-2 w-full rounded-lg py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                    canSubmit
                      ? "cursor-pointer bg-cyan-400 text-black shadow-lg shadow-cyan-400/20 hover:bg-cyan-300"
                      : "cursor-not-allowed bg-gray-800 text-gray-600 opacity-60"
                  }`}
                >
                  {canSubmit ? "Atualizar" : "Preencha todos os campos"}
                </button>
              </div>
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
    </>
  );
}
