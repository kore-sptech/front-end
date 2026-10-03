import {
  buildProductTrail,
  productStockRoute,
} from "../../features/products/productTrail";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Breadcrumbs from "../../ui/molecules/Breadcrumbs";
import Button from "../../ui/atoms/Button";
import Control from "../../ui/atoms/Control";
import Field from "../../ui/atoms/Field";
import Panel from "../../ui/molecules/Panel";
import { useProductName } from "../../features/products/useProductName";
import { useStockEntry } from "../../features/inventory/useStockEntry";

/**
 * Page: entrada de estoque (novo lote) para um produto.
 *
 * @returns {React.ReactElement}
 */
export default function StockEntryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const productName = useProductName(id, {
    initialName: location.state?.nome ?? "",
  });

  const { values, change, errors, isSaving, submit } = useStockEntry({
    productId: id,
    onSaved: () => navigate(productStockRoute(id)),
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await submit();
  };

  return (
    <main className="h-full w-full overflow-y-auto bg-[#000C24] text-[#DAE2FF]">
      <div className="flex flex-col gap-2 p-6">
        <h1 className="text-4xl font-bold">ADICIONAR ESTOQUE</h1>
        <span className="block h-1 w-12 rounded-3xl bg-[#48DCFC]" />

        <Breadcrumbs
          items={buildProductTrail({
            level: "stockEntry",
            productId: id,
            productName,
          })}
        />
      </div>

      <div className="flex justify-center px-6 pb-6">
        <form onSubmit={onSubmit}>
          <Panel
            className="max-w-2xl grow text-[#BBC9CD]"
            bodyClassName="flex flex-col"
          >
            <Field label="Quantidade" error={errors.quantity}>
              <Control
                type="number"
                min="1"
                step="1"
                placeholder="0"
                value={values.quantity}
                invalid={Boolean(errors.quantity)}
                onChange={(event) => change("quantity", event.target.value)}
              />
            </Field>

            <Field
              className="mt-4"
              label="Data de validade"
              error={errors.expiryDate}
            >
              <Control
                type="date"
                value={values.expiryDate}
                onChange={(event) => change("expiryDate", event.target.value)}
              />
            </Field>

            <Field className="mt-4" label="Valor (R$)" error={errors.unitPrice}>
              <Control
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={values.unitPrice}
                invalid={Boolean(errors.unitPrice)}
                onChange={(event) => change("unitPrice", event.target.value)}
              />
            </Field>

            <div className="mt-8 flex flex-col justify-between gap-12 md:flex-row">
              <Button
                type="submit"
                size="lg"
                loading={isSaving}
                loadingLabel="Registrando..."
              >
                Alterar
              </Button>

              <Button
                type="button"
                variant="neutral"
                size="lg"
                onClick={() => navigate(productStockRoute(id))}
              >
                Cancelar
              </Button>
            </div>
          </Panel>
        </form>
      </div>
    </main>
  );
}
