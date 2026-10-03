import { useMemo } from "react";

import AmbientGlow from "../../ui/molecules/AmbientGlow";
import Breadcrumbs from "../../ui/molecules/Breadcrumbs";
import ProductForm from "../../ui/organisms/ProductForm";
import { getSession } from "../../utils/auth";
import { useLocation, useNavigate, useParams } from "react-router-dom";

/**
 * Traduz o `state` da navegação (payload enviado pela listagem) no objeto
 * de produto esperado pelo formulário.
 *
 * @param {object} state
 * @returns {object} Produto para edição.
 */
function toEditableProduct(state, id) {
  return {
    id,
    nome: state.nome,
    descricao: state.descricao,
    possuiValidade: state.possuiValidade,
    qtdMinAlerta: state.qtdMinAlerta,
    tipo: state.tipo,
    imagemKey: state.imagem,
    categoriaId: state.categoriaId,
  };
}

/**
 * Page: edição de produto.
 *
 * @returns {React.ReactElement}
 */
export default function ProductEditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { usuarioId } = getSession();

  const product = useMemo(
    () => toEditableProduct(location.state ?? {}, id),
    [id, location.state],
  );

  return (
    <main className="relative h-full w-full overflow-y-auto bg-[#000C24]">
      <AmbientGlow topRight bottomLeft />

      <div className="relative flex flex-col gap-6 p-6">
        <Breadcrumbs
          items={[
            { label: "PRODUTOS", onClick: () => navigate("/produtos") },
            { label: "EDITAR PRODUTO" },
          ]}
        />

        <h1 className="text-4xl font-bold text-[#DAE2FF]">EDITAR PRODUTO</h1>
      </div>

      <div className="relative flex flex-1 justify-center px-6 pb-6">
        <ProductForm
          key={id}
          produto={product}
          usuarioId={usuarioId}
          onSaved={() =>
            navigate("/produtos", {
              state: { successMessage3: "Produto alterado com sucesso!" },
            })
          }
          onRemoved={() =>
            navigate("/produtos", {
              state: { successMessage2: "Produto excluído!" },
            })
          }
          onCancel={() => navigate("/produtos")}
        />
      </div>
    </main>
  );
}