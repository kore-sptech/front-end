import { useLocation, useNavigate } from "react-router-dom";

import AmbientGlow from "../../ui/molecules/AmbientGlow";
import Breadcrumbs from "../../ui/molecules/Breadcrumbs";
import ProductForm from "../../ui/organisms/ProductForm";
import { getSession } from "../../utils/auth";

/**
 * Page: cadastro de produto.
 *
 * @returns {React.ReactElement}
 */
export default function ProductCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuarioId } = getSession();

  const initialName = location.state?.pesquisa ?? "";

  return (
    <main className="relative h-full w-full overflow-y-auto bg-[#000C24]">
      <AmbientGlow topRight bottomLeft />

      <div className="relative flex flex-col gap-6 p-6">
        <Breadcrumbs
          items={[
            { label: "PRODUTOS", onClick: () => navigate("/produtos") },
            { label: "CADASTRAR PRODUTO" },
          ]}
        />

        <h1 className="text-4xl font-bold text-[#DAE2FF]">CADASTRAR PRODUTO</h1>
      </div>

      <div className="relative flex flex-1 justify-center px-6 pb-6">
        <ProductForm
          usuarioId={usuarioId}
          initialName={initialName}
          onSaved={() =>
            navigate("/produtos", {
              state: { successMessage: "Produto cadastrado com sucesso!" },
            })
          }
          onCancel={() => navigate("/produtos")}
        />
      </div>
    </main>
  );
}
