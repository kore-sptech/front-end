/**
 * Domínio: rotas e trilha de navegação do módulo de produtos.
 *
 * A hierarquia adotada é:
 *
 *   PRODUTOS
 *   ├── CADASTRAR PRODUTO
 *   └── {nome do produto}
 *       ├── EDITAR PRODUTO
 *       └── ADICIONAR ITEM
 *
 * Regra de composição: apenas o último elo não navega (é a página atual) e
 * todo elo anterior aponta para um nível real da hierarquia. Por isso a tela
 * de itens do produto não repete "ITENS DO PRODUTO" como elo — ali o produto
 * já é a página atual, e a seção aparece no título da tela.
 */

export const productsRoute = "/produtos";
export const productCreateRoute = `${productsRoute}/cadastro`;
export const productEditRoute = (productId) =>
  `${productsRoute}/editar/${productId}`;
export const productStockRoute = (productId) => `/estoque/${productId}`;
export const stockEntryRoute = (productId) =>
  `${productStockRoute(productId)}/adicionar`;

const ROOT = { label: "PRODUTOS", to: productsRoute };

const UNKNOWN_PRODUCT_LABEL = "PRODUTO";

/**
 * Seção de cada tela do módulo.
 *
 * `list` e `stock` não viram elo extra: a listagem já é a própria raiz e a tela
 * de itens já é o próprio produto.
 *
 * @type {Record<string, string>}
 */
const SECTIONS = {
  list: "PRODUTOS",
  create: "CADASTRAR PRODUTO",
  edit: "EDITAR PRODUTO",
  stock: "ITENS DO PRODUTO",
  stockEntry: "ADICIONAR ITEM",
};

/**
 * Rótulo do elo de contexto com o produto.
 *
 * O nome é normalizado em caixa alta para combinar com os rótulos fixos da trilha.
 *
 * @param {string} [productName]
 * @returns {string}
 */
function productLabel(productName) {
  return productName?.trim().toUpperCase() || UNKNOWN_PRODUCT_LABEL;
}

/**
 * Constrói a trilha de navegação de uma tela do módulo de produtos.
 *
 * O último item é a própria página atual, portanto não recebe `to`: a molecule
 * `Breadcrumbs` o renderiza como texto com `aria-current="page"`.
 *
 * @param {object} [options]
 * @param {"list"|"create"|"edit"|"stock"|"stockEntry"} [options.level]
 * @param {string|number} [options.productId] Obrigatório fora de `list`/`create`.
 * @param {string} [options.productName] Nome do produto, quando já conhecido.
 * @returns {Array<{label: string, to?: string}>}
 */
export function buildProductTrail({
  level = "list",
  productId,
  productName,
} = {}) {
  if (!(level in SECTIONS)) {
    throw new Error(`Nível de trilha desconhecido: "${level}".`);
  }

  if (level === "list") {
    return [{ label: SECTIONS.list }];
  }

  if (level === "create") {
    return [{ ...ROOT }, { label: SECTIONS.create }];
  }

  if (!productId) {
    throw new Error(`O nível "${level}" exige productId.`);
  }

  const product = { label: productLabel(productName) };

  if (level === "stock") {
    return [{ ...ROOT }, product];
  }

  return [
    { ...ROOT },
    { ...product, to: productStockRoute(productId) },
    { label: SECTIONS[level] },
  ];
}
