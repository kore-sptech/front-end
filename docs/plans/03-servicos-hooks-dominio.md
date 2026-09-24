# Etapa 2 — Serviços, hooks e regras compartilhadas

## Diagnóstico Atual

Não existe uma camada de serviços; chamadas de API estão distribuídas entre páginas e componentes. Produtos, categorias, estoque, transações, agendamentos, fotos e autenticação têm chamadas em arquivos diferentes, com repetição de cabeçalhos, estados de carregamento, tratamento de erro e normalização de respostas.

O estado remoto está concentrado em `useState` dentro das páginas. Isso repete padrões de carregamento, erro, atualização e descarte de respostas, além de acoplar contratos do backend à apresentação.

## Objetivo da Refatoração

Criar fronteiras estáveis entre interface e backend. Os serviços devem concentrar rota, corpo de requisição e normalização de resposta; os hooks devem concentrar estado remoto, carregamento, erro, recarga e cancelamento; os componentes que consomem esses hooks não devem conhecer Axios nem cabeçalhos de autorização.

**Regra de compatibilidade:** a extração para serviços e hooks é apenas uma mudança de organização. Cada função deve preservar exatamente o método, caminho, parâmetros, cabeçalhos, corpo de requisição, tratamento de resposta e efeitos colaterais da chamada original. A normalização deve ocorrer depois da resposta e nunca alterar o formato enviado ao backend. A única exceção de integração é a ausência deliberada de API nos dashboards simulados.

## Passo a Passo de Execução

1. Definir entidades e contratos mínimos de cada área com base nas respostas reais da API: autenticação, produto, categoria, estoque, transação, agendamento, foto e notificação.
2. Criar serviços por área em `src/servicos/`, começando por produtos e categorias, que possuem chamadas simples e baixo risco.
3. Migrar as chamadas de `ProdutosPage`, `CategoriaSelector`, `CadastroProdutoPage` e `EditarProdutoPage` para os serviços, mantendo a mesma URL, método e corpo de requisição.
4. Criar `useProdutos`, `useCategoriasProduto` e `useProduto` com estados `dados`, `carregando`, `erro` e `recarregar`.
5. Migrar estoque e agendamentos, incluindo seleção de itens, associação ao agendamento, confirmação, pagamento e cancelamento.
6. Migrar transações e métricas, encapsulando a conversão entre índice de página do backend e índice exibido na tabela.
7. Criar funções de normalização para respostas paginadas e nomes de campos diferentes entre seleção de materiais e edição de agendamento.
8. Extrair regras puras para `src/utils/`, como validação, cálculo de datas, status, formatação monetária e mapeamento de materiais.
9. Remover gradualmente importações de `api`, `fetch`, cabeçalhos e URLs dos componentes.
10. Aplicar descarte de resposta obsoleta ou cancelamento de requisições em buscas sensíveis a filtros e digitação.

## Arquivos Afetados

- `src/servicos/autenticacao.js`
- `src/servicos/produtos.js` (criar)
- `src/servicos/categorias.js` (criar)
- `src/servicos/estoque.js` (criar)
- `src/servicos/agendamentos.js` (criar)
- `src/servicos/transacoes.js` (criar)
- `src/servicos/fotos.js` (criar)
- `src/servicos/notificacoes.js` (criar)
- `src/hooks/useProdutos.js` (criar)
- `src/hooks/useCategoriasProduto.js` (criar)
- `src/hooks/useEstoque.js` (criar)
- `src/hooks/useAgendamentos.js` (criar)
- `src/hooks/useTransacoes.js` (criar)
- `src/utils/` (criar ou ampliar)
- `src/utils/api.js`
- `src/pages/Produto/ProdutosPage.jsx`
- `src/pages/Produto/CadastroProdutoPage.jsx`
- `src/pages/Produto/EditarProdutoPage.jsx`
- `src/components/CategoriaSelector.jsx`
- `src/pages/Estoque/EstoquePage.jsx`
- `src/pages/Estoque/AdicionarEstoquePage.jsx`
- `src/pages/TransacoesPage.jsx`
- `src/pages/AgendamentosPage.jsx`
- `src/components/ModalNovoAgendamento.jsx`
- `src/components/ModalNovaTransacao.jsx`
- `src/components/ModalAtualizaTransacao.jsx`
- `src/components/TableTransacoes.jsx`

## Critérios de Aceite

- Componentes de interface não chamam `api`, `axios` ou `fetch` diretamente, exceto adaptadores temporários explicitamente documentados.
- Cada rota continua sendo chamada com o mesmo método, caminho, parâmetros de consulta e corpo de requisição.
- Respostas paginadas, materiais e métricas possuem uma representação interna única.
- Trocar uma página ou filtro não apresenta dados obsoletos da requisição anterior.
- Carregamento, erro, vazio e sucesso possuem comportamento previsível nos formulários e listas.
- Lint e build passam após cada área migrada sem alteração do contrato de API.
