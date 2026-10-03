import {
  ArrowRight,
  BanknoteArrowUp,
  CalendarArrowUp,
  CalendarCheck2,
  CalendarPlus,
  ImageOff,
  MessageCircle,
  Phone,
  Plus,
} from "lucide-react";
import { useState } from "react";

import Button from "../atoms/Button";
import Control from "../atoms/Control";
import Field from "../atoms/Field";
import IconButton from "../atoms/IconButton";
import MoneyInput from "../atoms/MoneyInput";
import ImageUploader from "../molecules/ImageUploader";
import Modal from "../molecules/Modal";
import SummaryRow from "../molecules/SummaryRow";
import MaterialPicker from "./MaterialPicker";
import { buildWhatsAppLink } from "../../features/scheduling/sessionValidation";
import { formatCurrency } from "../../utils/formatters";
import { sumMaterialValue } from "../../features/scheduling/materials";
import { useSessionForm } from "../../features/scheduling/useSessionForm";
import { useSessionStatusActions } from "../../features/scheduling/useSessionStatusActions";
import { IMaskInput } from "react-imask";

const PAYMENT_METHODS = ["PIX", "DINHEIRO"];

const STATUS_PERMITEM_PAGAMENTO = ["PENDENTE", "AGUARDANDO", "CONFIRMADO"];
const STATUS_PERMITEM_CONFIRMACAO = ["PENDENTE", "AGUARDANDO"];

const centsToAmount = (text) => {
  const digits = text.replace(/\D/g, "");

  return digits ? (Number(digits) / 100).toFixed(2) : "";
};

/**
 * Organism: formulário de agendamento (criar, editar, confirmar e cancelar).
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {object|null} props.session Agendamento em edição (null = novo).
 * @param {() => void} props.onClose
 * @param {() => void} [props.onSaved] Chamado após salvar ou mudar status.
 */
export default function SessionModal({ isOpen, session, onClose, onSaved }) {
  const form = useSessionForm({ session, isOpen, onSaved });
  const status = useSessionStatusActions({ onChanged: onSaved });
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const saved = await form.submit();

    if (saved) onClose();
  };

  const openWhatsApp = () => {
    const link = buildWhatsAppLink(form.fields.cliente, form.fields.telefone);

    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        title={form.isEditing ? "Editar Agendamento" : "Agendar Sessão"}
        description="Configure os detalhes do atendimento artístico."
      >
        <form onSubmit={handleSubmit} className="custom-scrollbar max-h-[65vh] space-y-4 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Cliente" error={form.errors.cliente} controlId="session-client">
              <Control
                id="session-client"
                type="text"
                placeholder="Ex: João da Silva"
                value={form.fields.cliente}
                invalid={Boolean(form.errors.cliente)}
                onChange={(event) => form.change("cliente", event.target.value)}
                onBlur={() => form.blur("cliente")}
              />
            </Field>

            <Field label="Preço (R$)" error={form.errors.preco} controlId="session-price">
              <MoneyInput
                id="session-price"
                value={form.fields.preco ? formatCurrency(form.fields.preco) : ""}
                invalid={Boolean(form.errors.preco)}
                onChange={(event) => form.change("preco", centsToAmount(event.target.value))}
                onBlur={() => form.blur("preco")}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Telefone"
              icon={<Phone size={14} />}
              error={form.errors.telefone}
              controlId="session-phone"
            >
              <IMaskInput
                id="session-phone"
                mask="(00) 00000-0000"
                value={form.fields.telefone}
                onAccept={(value) => form.change("telefone", value)}
                onBlur={() => form.blur("telefone")}
                placeholder="(11) 99999-9999"
                className="w-full rounded-lg border border-gray-800 bg-[#000C24] py-3 pr-4 pl-9 text-sm text-white placeholder:text-gray-600 focus:border-cyan-400 focus:outline-none"
              />
            </Field>

            <Field label="Forma de pagamento" error={form.errors.pagamento} controlId="session-payment">
              <Control
                id="session-payment"
                as="select"
                value={form.fields.pagamento}
                invalid={Boolean(form.errors.pagamento)}
                onChange={(event) => form.change("pagamento", event.target.value)}
                onBlur={() => form.blur("pagamento")}
              >
                <option value="">Selecione...</option>
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method === "PIX" ? "PIX" : "Dinheiro"}
                  </option>
                ))}
              </Control>
            </Field>
          </div>

          <div>
            <span className="mb-2 block text-xs font-bold tracking-widest text-gray-500 uppercase">
              Referência Visual
            </span>

            <ImageUploader
              images={form.images}
              onAdd={form.openImagesPicker}
              onRemove={form.removeImage}
              invalid={form.hasNoImage && form.imagesShaking}
              shaking={form.imagesShaking}
              onAnimationEnd={form.stopImagesShaking}
              footer={
                form.images.length > 0
                  ? `${form.images.length} imagem${form.images.length > 1 ? "ns" : ""} adicionada${form.images.length > 1 ? "s" : ""}`
                  : null
              }
              emptyError={
                form.hasNoImage && form.imagesShaking ? (
                  <span className="flex items-center gap-1.5">
                    <ImageOff size={12} className="text-red-500" />
                    Adicione ao menos uma referência visual
                  </span>
                ) : null
              }
              inputProps={{
                ref: form.imagesInputRef,
                onChange: form.handleImageFiles,
              }}
            />
          </div>

          {form.isEditing && (
            <div>
              <span className="mb-2 block text-xs font-bold tracking-widest text-gray-500 uppercase">
                Materiais
              </span>

              <div className="rounded-2xl border border-[#3C494D]/10 bg-[#263457]/20 p-4">
                <IconButton
                  variant="solid"
                  size="tile"
                  title="Adicionar material"
                  onClick={() => setIsPickerOpen(true)}
                >
                  <Plus size={20} className="text-gray-500" />
                  <span className="text-[10px] text-gray-600">Adicionar</span>
                </IconButton>
              </div>
            </div>
          )}

          {form.materials.length > 0 && (
            <div className="space-y-3 rounded-2xl border border-gray-800 bg-[#263457]/20 p-4">
              <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase">
                Materiais Adicionados
              </h3>

              {form.materials.map((material) => (
                <SummaryRow
                  key={material.produtoId}
                  title={material.nome}
                  itemCount={material.itens.length}
                  total={formatCurrency(sumMaterialValue(material))}
                  onRemove={() => form.removeMaterial(material.produtoId)}
                />
              ))}
            </div>
          )}

          <div className="flex items-start gap-4">
            <Field label="De" error={form.errors.de} controlId="session-start" className="flex-1">
              <Control
                id="session-start"
                type="datetime-local"
                value={form.fields.de}
                invalid={Boolean(form.errors.de)}
                onChange={(event) => form.change("de", event.target.value)}
                onBlur={() => form.blur("de")}
              />
            </Field>

            <ArrowRight className="mt-9 shrink-0 text-gray-700" size={18} />

            <Field label="Duração" error={form.errors.ate} controlId="session-duration" className="flex-1">
              <Control
                id="session-duration"
                as="select"
                value={form.durationMinutes}
                invalid={Boolean(form.errors.ate)}
                onChange={(event) => form.changeDuration(Number(event.target.value))}
                onBlur={() => form.blur("ate")}
              >
                <option value={0}>Selecione a duração...</option>
                {form.durationOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Control>
            </Field>
          </div>

          {form.isEditing ? (
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 tracking-widest uppercase"
                  onClick={openWhatsApp}
                >
                  <MessageCircle size={16} />
                  Conversar
                </Button>

                <Button
                  type="submit"
                  fullWidth
                  loading={form.isSaving}
                  loadingLabel="Salvando..."
                  disabled={!form.canSubmit}
                  className="flex-1 tracking-widest uppercase"
                >
                  <CalendarArrowUp size={16} />
                  Atualizar
                </Button>
              </div>

              <div className="flex gap-3">
                {STATUS_PERMITEM_PAGAMENTO.includes(session?.status) && (
                  <Button
                    variant="outline"
                    className="flex-1 tracking-widest uppercase"
                    loading={status.pendingAction === "payment"}
                    onClick={() => status.confirmPayment(session.id)}
                  >
                    <BanknoteArrowUp size={16} />
                    Confirmar Pagamento
                  </Button>
                )}

                {STATUS_PERMITEM_CONFIRMACAO.includes(session?.status) && (
                  <Button
                    variant="outline"
                    className="flex-1 tracking-widest uppercase"
                    loading={status.pendingAction === "confirm"}
                    onClick={() => status.confirm(session.id)}
                  >
                    <CalendarCheck2 size={16} />
                    Confirmar Sessão
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <Button
                type="submit"
                fullWidth
                loading={form.isSaving}
                loadingLabel="Salvando..."
                disabled={!form.canSubmit}
                className="tracking-widest uppercase"
              >
                <CalendarPlus size={16} />
                Agendar
              </Button>

              {!form.canSubmit && (
                <p className="mt-2 text-center text-xs text-gray-500">
                  Preencha todos os campos
                </p>
              )}
            </div>
          )}
        </form>
      </Modal>

      {form.isEditing && (
        <MaterialPicker
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          onSelect={form.addMaterial}
        />
      )}
    </>
  );
}