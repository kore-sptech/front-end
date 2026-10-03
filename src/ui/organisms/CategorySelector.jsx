import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import Button from "../atoms/Button";
import Control from "../atoms/Control";
import Field from "../atoms/Field";
import IconButton from "../atoms/IconButton";
import Modal from "../molecules/Modal";
import { useCategories } from "../../features/products/useCategories";

const MIN_NAME = 3;
const MAX_NAME = 45;
const MAX_DESCRIPTION = 150;

/**
 * Organism: seleção de categoria com criação inline.
 *
 * @param {object} props
 * @param {number|string|null} props.value Categoria selecionada.
 * @param {(id: number|string|null) => void} props.onChange
 * @param {string} props.usuarioId Dono da lista de categorias.
 */
export default function CategorySelector({ value, onChange, usuarioId }) {
  const { categories, isSaving, create } = useCategories(usuarioId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", descricao: "" });
  const [errors, setErrors] = useState({});

  const change = (name, next) => {
    setForm((prev) => ({ ...prev, [name]: next }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const submit = async () => {
    const nextErrors = {};

    if (form.nome.trim().length < MIN_NAME) {
      nextErrors.nome = "O nome deve ter no mínimo 3 caracteres.";
    }

    if (form.nome.length > MAX_NAME) {
      nextErrors.nome = "O nome deve ter no máximo 45 caracteres.";
    }

    if (form.descricao.length > MAX_DESCRIPTION) {
      nextErrors.descricao = "A descrição não pode ultrapassar 150 caracteres.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    try {
      const data = await create(form);

      onChange(data.id);

      toast.success("Categoria criada com sucesso!");

      setForm({ nome: "", descricao: "" });
      setIsModalOpen(false);
    } catch {
      return;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <IconButton
          onClick={() => onChange(null)}
          title="Limpar seleção"
          className="border-[#bbc9cd70] hover:border-red-400/40 hover:text-red-400"
        >
          <X size={18} />
        </IconButton>

        {categories.map((category) => {
          const isSelected = String(value) === String(category.id);

          return (
            <Button
              key={category.id}
              variant={isSelected ? "accent" : "subtle"}
              size="sm"
              onClick={() => onChange(category.id)}
            >
              {category.nome}
            </Button>
          );
        })}

        <IconButton
          variant="dashed"
          size="auto"
          title="Nova categoria"
          label="Nova Categoria"
          onClick={() => setIsModalOpen(true)}
          className="gap-1.5 px-4 py-2 text-sm font-bold"
        >
          <Plus size={18} />
        </IconButton>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Categoria"
        footer={
          <>
            <Button variant="neutral" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button loading={isSaving} onClick={submit}>
              Criar
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field
            label="Nome"
            hint={`${form.nome.length}/${MAX_NAME}`}
            error={errors.nome}
          >
            <Control
              type="text"
              placeholder="Ex: Tintas, Agulhas, Luvas..."
              value={form.nome}
              invalid={Boolean(errors.nome)}
              onChange={(event) => change("nome", event.target.value)}
            />
          </Field>

          <Field
            label="Descrição (opcional)"
            hint={`${form.descricao.length}/${MAX_DESCRIPTION}`}
            error={errors.descricao}
          >
            <Control
              as="textarea"
              placeholder="Descrição da categoria..."
              value={form.descricao}
              invalid={Boolean(errors.descricao)}
              onChange={(event) => change("descricao", event.target.value)}
            />
          </Field>
        </div>
      </Modal>
    </div>
  );
}