# Etapa 0 — Base, estabilidade e problemas críticos

## Diagnóstico Atual

O lint aponta 25 erros e 7 avisos. O build de produção também falha na minificação de CSS por propriedades legadas de compatibilidade (`*vertical-align` e `*zoom`). Existem hooks condicionais em `src/components/ModalAtualizaTransacao.jsx:20-46` e `src/components/IntegracaoEstoqueAgendamento/ModalItensDosProdutos.jsx:16-29`, podendo alterar a quantidade de hooks entre renderizações. Há também importações e estados não utilizados, dependências incompletas e código morto.

Além disso, já foram identificados riscos funcionais em `src/pages/Estoque/EstoquePage.jsx:83` (`SearchBar` sem `onChange`), `src/components/CardItemEstoque.jsx:26-42` (navegação com ID possivelmente incorreto), `src/components/ModalAtualizaTransacao.jsx:32-44` (estado não sincronizado) e `src/pages/Produto/ProdutosPage.jsx:284-297` com `src/pages/Produto/EditarProdutoPage.jsx:31-51` (semântica de `qtdMinAlerta` confusa).

## Objetivo da Refatoração

Criar uma base confiável antes de mover responsabilidades. O objetivo imediato não é reescrever a aplicação, mas impedir falhas em tempo de execução, garantir que o build e o lint sejam verificações reproduzíveis e corrigir inconsistências que podem gerar dados errados ou perda de integração.

## Passo a Passo de Execução

1. Registrar o estado inicial: executar `npm run lint`, `npm run build` e os fluxos manuais de login, produtos, estoque, transações e agendamentos.
2. Mover os hooks de estado e efeitos para antes de qualquer retorno antecipado nos dois modais identificados.
3. Corrigir funções usadas antes da declaração e dependências de `useEffect` sem alterar a ordem das requisições.
4. Remover importações, estados, parâmetros e gerenciadores não utilizados, incluindo registros de depuração desnecessários.
5. Corrigir o `SearchBar` da tela de estoque, fornecendo callback e estado de filtro.
6. Confirmar no contrato de estoque se a rota `/estoque/:id` representa produto ou item; corrigir a navegação usando o identificador correto.
7. Sincronizar o formulário de edição de transação quando `transacao` mudar, preservando os valores e o formato monetário atuais.
8. Separar explicitamente quantidade atual e `qtdMinAlerta` na navegação e no formulário de produto; validar a intenção com os dados da API antes de alterar a origem do valor.
9. Validar a montagem e desmontagem dos modais, incluindo troca de uma transação por outra sem recarregar a página.
10. Rodar novamente lint e build. O lint deve terminar sem erros; avisos remanescentes devem ser registrados ou eliminados.

## Arquivos Afetados

- `src/components/ModalAtualizaTransacao.jsx`
- `src/components/IntegracaoEstoqueAgendamento/ModalItensDosProdutos.jsx`
- `src/pages/Estoque/EstoquePage.jsx`
- `src/components/SearchBar.jsx`
- `src/components/CardItemEstoque.jsx`
- `src/pages/TransacoesPage.jsx`
- `src/pages/Produto/ProdutosPage.jsx`
- `src/pages/Produto/EditarProdutoPage.jsx`
- `src/components/PrivateRoute.jsx`
- `src/pages/AgendamentosPage.jsx`
- `src/components/ModalNovoAgendamento.jsx`
- `src/providers/NotificationProvider.jsx`
- `src/pages/LoginPage.jsx`
- `src/pages/Estoque/AdicionarEstoquePage.jsx`
- `src/components/WeeklyCalendar.jsx`

## Critérios de Aceite

- `npm run lint` retorna zero erros.
- `npm run build` conclui sem falhas.
- Abrir e fechar repetidamente os modais de transação e itens não gera erro de hooks.
- A busca da tela de estoque aceita digitação sem `TypeError` e mantém o filtro esperado.
- A navegação a partir de um item de estoque abre o produto/estoque correto.
- Editar transações sucessivamente carrega os dados da transação selecionada.
- O valor `qtdMinAlerta` não é sobrescrito silenciosamente pela quantidade atual.
- Login, cadastro, produto, estoque, transação e agendamento continuam usando as mesmas rotas.
