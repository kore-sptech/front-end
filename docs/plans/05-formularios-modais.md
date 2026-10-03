# Etapa 4 — Formulários, modais e fluxos críticos

## Diagnóstico Atual

`src/components/ModalNovoAgendamento.jsx` possui 953 linhas e concentra validação, campos auxiliares, datas, envio de imagens, materiais, estoque, pagamento, criação/atualização e renderização. `src/components/ModalNovaTransacao.jsx` e `src/components/ModalAtualizaTransacao.jsx` duplicam análise e formatação monetária. Páginas de produto duplicam validação e envio de imagens, enquanto algumas regras são inconsistentes entre cadastro e edição.

Há ainda funções de retorno assíncronas que não retornam a Promise, notificações emitidas antes da conclusão do fluxo de materiais e diferença entre `nome` e `produtoNome` na seleção de materiais. Esses pontos devem ser tratados com especial cuidado porque alteram corpos de requisição ou operações de estoque.

## Objetivo da Refatoração

Dividir formulários extensos em componentes e hooks de regras de negócio com responsabilidade única, mantendo os mesmos campos, validações, corpos de requisição e sequências de requisição. A extração deve tornar o fluxo observável e fácil de validar manualmente, sem criar abstrações prematuras para casos sem reuso.

**Regra de compatibilidade:** a divisão dos modais não pode alterar nenhum contrato de API já funcional. Devem ser preservados o método e caminho de cada operação, os campos e tipos aceitos, o formato monetário, os parâmetros de rota, a ordem das requisições, o tratamento de envio de imagens e o momento exato em que a notificação de sucesso é exibida. Nenhuma correção deve transformar um dado recebido em outro campo sem validar a resposta real do backend.

## Passo a Passo de Execução

1. Documentar o corpo atual das requisições de criação e atualização de agendamento, transação, produto, foto e associação de estoque.
2. Extrair `useFormularioAgendamento` para estado, inicialização, validação e conversão de datas; manter o envio no hook ou em um serviço explícito.
3. Extrair `CamposFormularioAgendamento`, `MateriaisAgendamento`, `ImagensAgendamento`, `AcoesPagamentoAgendamento` e `ResumoEstoqueAgendamento` do modal de agendamento.
4. Migrar seleção e edição de materiais para um modelo canônico, resolvendo a divergência `nome`/`produtoNome` e o cálculo do total.
5. Garantir que o fluxo novo permita adicionar materiais, se essa é a funcionalidade esperada, sem alterar a ordem das operações de estoque já existente.
6. Fazer `onConfirm` e `onCancel` retornarem as Promises das operações, evitando encerramento prematuro da notificação.
7. Remover a notificação de materiais antes de a operação estar concluída e exibir sucesso somente após o `PUT` e as associações de estoque.
8. Extrair `EntradaValor`, `useEntradaValor` e validadores compartilhados para os modais de transação.
9. Dividir formulários de produto em campos, validação, pré-visualização e envio de imagens; preservar a criação do produto antes do envio ou implementar compensação somente após confirmação do contrato.
10. Dividir inclusão de estoque e corrigir validação de quantidade, carregamento e duplo envio.
11. Validar manualmente cada extração com criação, edição, cancelamento, fechamento, reabertura, carregamento, erro e envio repetido.

## Arquivos Afetados

- `src/components/ModalNovoAgendamento.jsx`
- `src/modulos/agendamentos/FormularioAgendamento.jsx` (criar)
- `src/modulos/agendamentos/MateriaisAgendamento.jsx` (criar)
- `src/modulos/agendamentos/ImagensAgendamento.jsx` (criar)
- `src/modulos/agendamentos/AcoesPagamentoAgendamento.jsx` (criar)
- `src/modulos/agendamentos/useFormularioAgendamento.js` (criar)
- `src/components/ModalNovaTransacao.jsx`
- `src/components/ModalAtualizaTransacao.jsx`
- `src/modulos/transacoes/FormularioTransacao.jsx` (criar)
- `src/modulos/transacoes/EntradaValor.jsx` (criar)
- `src/modulos/transacoes/useEntradaValor.js` (criar)
- `src/pages/Produto/CadastroProdutoPage.jsx`
- `src/pages/Produto/EditarProdutoPage.jsx`
- `src/pages/Estoque/AdicionarEstoquePage.jsx`
- `src/components/IntegracaoEstoqueAgendamento/ModalItensDosProdutos.jsx`
- `src/components/IntegracaoEstoqueAgendamento/GridMateriaisAdicionados.jsx`
- `src/servicos/agendamentos.js`
- `src/servicos/estoque.js`
- `src/servicos/transacoes.js`
- `src/servicos/produtos.js`

## Critérios de Aceite

- Nenhum modal mantém a totalidade das regras de negócio, efeitos de API e marcação na mesma função/componente sem justificativa.
- O corpo enviado em cada operação permanece igual ao contrato registrado, salvo mudança formal do backend.
- Campos monetários continuam exibindo e enviando os mesmos valores nos formatos atuais.
- Materiais são exibidos com nome e total corretos tanto na criação quanto na edição.
- A notificação de sucesso só aparece após todas as operações assíncronas da ação.
- Fechar/reabrir modais sincroniza os dados corretamente.
- Lint, build e validação manual de regressão dos fluxos passam.
- A divisão dos modais preserva todos os contratos de API, inclusive ordem das operações, envio de imagens, autenticação e notificações.
