/**
 * Agrupa itens de estoque por produto, formato usado pelo formulário de
 * agendamento (`{ produtoId, nome, itens: [...] }`).
 *
 * @param {object[]} items Itens retornados por `/estoque/agendamento/{id}`.
 * @returns {Array<{produtoId: string|number, nome: string, itens: object[]}>}
 */
export function groupStockByProduct(items = []) {
  return items.reduce((groups, item) => {
    const produtoId = item.produtoId ?? item.produto?.id;
    const productName = item.nomeProduto ?? item.produto?.nome ?? "Produto";

    const group = groups.find((candidate) => candidate.produtoId === produtoId);

    if (group) {
      group.itens.push(item);
    } else {
      groups.push({ produtoId, nome: productName, itens: [item] });
    }

    return groups;
  }, []);
}

/**
 * Soma dos valores unitários de um grupo de materiais.
 *
 * @param {{itens: Array<{valorUnitario?: number}>}} material
 * @returns {number}
 */
export function sumMaterialValue(material) {
  return material.itens.reduce(
    (total, item) => total + (item.valorUnitario ?? 0),
    0,
  );
}

/**
 * Ids de todos os itens selecionados, para association em lote.
 *
 * @param {Array<{itens: Array<{id: string|number}>}>} materials
 * @returns {Array<string|number>}
 */
export function flattenMaterialItemIds(materials) {
  return materials.flatMap((material) => material.itens.map((item) => item.id));
}