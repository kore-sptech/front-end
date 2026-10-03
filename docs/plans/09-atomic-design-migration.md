# Plano de migração para Atomic Design

## Diagnóstico Atual

A base de frontend já possui muitos componentes reutilizáveis, mas eles ainda não estão organizados por camada de responsabilidade. Hoje a árvore mistura primitives visuais, composições simples, blocos de domínio, layouts e páginas no mesmo conjunto de pastas, o que dificulta identificar o que pode ser reutilizado com segurança e o que ainda depende de regras de negócio.

Inventário resumido dos componentes e do nível atual de acoplamento:

- Atoms ou quase-átoms: `src/componentes/base/EntradaValor.jsx`, `src/components/SearchBar.jsx`, `src/components/Logo.jsx`, `src/components/Barra.jsx`.
- Molecules: `src/components/CardProduto.jsx`, `src/components/CardItemEstoque.jsx`, `src/components/CardNotificacoes.jsx`, `src/components/ItemCritico.jsx`, `src/components/Notificacao.jsx`, `src/components/Kpi.jsx`, `src/components/KpiTransacoes.jsx`, `src/components/CategoriaSelector.jsx`.
- Blocos de integração e composição de domínio: `src/components/IntegracaoEstoqueAgendamento/CardProdutoIntegracao.jsx`, `src/components/IntegracaoEstoqueAgendamento/CardItemComCheckbox.jsx`, `src/components/IntegracaoEstoqueAgendamento/GridMateriaisAdicionados.jsx`.
- Organisms e layout: `src/components/Sidebar.jsx`, `src/components/SidePainel.jsx`, `src/components/WeeklyCalendar.jsx`, `src/components/TableTransacoes.jsx`, `src/components/SessionToast.jsx`, `src/estruturas/EstruturaAutenticada.jsx`.
- Fluxos compostos e modais críticos: `src/components/ModalNovoAgendamento.jsx`, `src/components/ModalNovaTransacao.jsx`, `src/components/ModalAtualizaTransacao.jsx`, `src/components/ModalLista.jsx`, `src/components/IntegracaoEstoqueAgendamento/ModalItensDosProdutos.jsx`.
- Páginas que concentram composição, negócio e layout: `src/pages/DashboardPage.jsx`, `src/pages/DashboardFinanceiraPage.jsx`, `src/pages/AgendamentosPage.jsx`, `src/pages/TransacoesPage.jsx`, `src/pages/NotificationsPage.jsx`, `src/pages/Produto/ProdutosPage.jsx`, `src/pages/Produto/CadastroProdutoPage.jsx`, `src/pages/Produto/EditarProdutoPage.jsx`, `src/pages/Estoque/EstoquePage.jsx`, `src/pages/Estoque/AdicionarEstoquePage.jsx`.

Dependências e sinais de desorganização mais relevantes:

- Há mistura de apresentação, regra de negócio e chamadas HTTP no mesmo arquivo, com destaque para `ModalNovoAgendamento.jsx`.
- A composição de páginas e modais é duplicada em alguns pontos, como a montagem de modal de agendamento tanto em provider quanto em página.
- `document.getElementById`, `localStorage` e controle imperativo de modal aparecem em componentes de UI, o que reduz previsibilidade.
- Existem múltiplos mecanismos de feedback e notificação convivendo ao mesmo tempo, sem uma camada única de adaptação.
- Há divergência de organização entre `src/components/` e `src/componentes/base/`, além de hooks e serviços cobrindo responsabilidades parecidas sem fronteira estável.
- Os dashboards e o gráfico de barras usam dados simulados de propósito e devem continuar explícitos como protótipos.

## Nova Estrutura de Diretórios

A estrutura proposta segue Atomic Design com separação clara entre primitives, composições e containers de rota:

```text
src/
  ui/
    atoms/
    molecules/
    organisms/
    templates/
  pages/
  features/
  shared/
  hooks/
  services/
  context/
  structures/
```

Diretriz de uso por camada:

- `ui/atoms`: botões, inputs, selects, badges, labels, loaders, skeletons, avatar, ícones e entrada monetária.
- `ui/molecules`: SearchBar, CategorySelector, KPI, cards simples, itens de lista e cabeçalhos de formulário.
- `ui/organisms`: Sidebar, SidePainel, WeeklyCalendar, TableTransacoes, centers de notificações e blocos maiores de interface.
- `ui/templates`: shell autenticado, layout de página, layout de dashboard e estruturas de formulário.
- `pages`: rotas e containers de tela, consumindo templates e organisms em vez de repetir marcação.
- `features` ou `shared`: regras de negócio reutilizáveis, contratos, adaptadores e utilitários transversais.

Recomendação de migração estrutural:

- Manter nomes atuais durante a transição para evitar renomeação em massa.
- Promover componentes para a nova estrutura apenas quando o contrato estiver claro e o reuso estiver comprovado.
- Usar `src/componentes/base/EntradaValor.jsx` como referência inicial para o primeiro átomo formal.

## Estratégia de Migração Gradual

A migração deve acontecer de baixo para cima, quebrando o mínimo possível de funcionalidades.

Ordem recomendada:

1. Átomos: extrair elementos sem regra de negócio e sem chamadas de API.
2. Moléculas: composições pequenas e reutilizáveis, formadas por átomos e dados simples.
3. Organisms: blocos grandes de interface que coordenam moléculas, estado local e callbacks.
4. Templates: molduras de tela que concentram navegação, espaçamento e slots.
5. Pages: substituir a marcação antiga pela composição com templates e organisms.

Sequência sugerida por risco:

- Primeiro estabilizar os átomos mais usados: campos, botões, selects, loading states, empty states e feedback básico.
- Depois migrar moléculas com alto reuso e baixo risco: SearchBar, KPI, cards e itens de lista.
- Em seguida decompor organisms como Sidebar, SidePainel, WeeklyCalendar e TableTransacoes.
- Só então dividir os fluxos compostos: agendamento, transações, produto e estoque.
- Por fim consolidar templates e limpar páginas para remover duplicação de layout.

Regras de compatibilidade durante a migração:

- Não alterar rota, método HTTP, headers, payload, parâmetros, ordem das requisições ou autenticação.
- Não conectar dashboards simulados à API nesta migração.
- Não promover um componente para Atomic Design sem reuso ou sem contrato estável.

## Critérios de Aceite e Boas Práticas

Padrões de nomenclatura:

- Componentes em PascalCase.
- Pastas alinhadas com Atomic Design, preferencialmente em inglês para manter consistência com a literatura do padrão.
- Nomes de arquivos devem refletir a responsabilidade do componente, sem siglas opacas.
- Componentes de domínio devem ficar separados de primitives visuais.

Padrões de tipagem:

- Como o projeto está em JavaScript, documentar contratos de props com JSDoc enquanto não houver migração formal para TypeScript.
- Declarar explicitamente shape de props, estados aceitos e callbacks esperados em componentes reutilizáveis.
- Evitar que átomos e moléculas dependam de serviços, contexto de sessão ou fetch direto.

Padrões de teste:

- Criar cobertura para componentes críticos com Vitest e React Testing Library, caso o time aceite adicionar o harness de testes nesta etapa.
- Priorizar testes de renderização, acessibilidade, interação por teclado, estados vazios, loading e callbacks.
- Em fluxos de domínio, testar a composição e a passagem correta de callbacks; regra de negócio deve ficar em serviço ou hook testável.
- Se testes automatizados não entrarem agora, manter validação obrigatória por lint, build e checklist manual por fluxo.

Boas práticas adicionais:

- Não usar `document.getElementById` para controlar componentes novos.
- Não acessar `localStorage` diretamente em átomo ou molécula.
- Não misturar fetch ou serviço com renderização em componentes novos.
- Evitar duplicação de estilos globais dentro de componentes reutilizáveis.
- Manter os fluxos simulados visíveis como simulados, especialmente dashboard e gráfico de barras.

## Plano de Ação

Fase 1 — Inventário e fundação

- Mapear todos os componentes existentes por camada e domínio.
- Classificar o que é átomo, molécula, organismo, template ou página.
- Definir o namespace final da nova estrutura.
- Estabelecer checklist dos contratos que não podem mudar.

Fase 2 — Átomos

- Extrair primitives visuais compartilhadas.
- Normalizar aparência, acessibilidade e API de props.
- Consolidar botões, campos, badges, loaders, empty states e feedbacks básicos.
- Garantir que os átomos não importem serviços, contextos de negócio ou dados de sessão.

Fase 3 — Moléculas

- Reescrever SearchBar, KPIs, cards simples e itens de lista.
- Ajustar contratos para aceitar apenas dados e callbacks necessários.
- Remover variações duplicadas e converter padrões de estilo em API explícita.
- Adicionar testes unitários de renderização para os casos mais reutilizados.

Fase 4 — Organisms

- Quebrar Sidebar, SidePainel, WeeklyCalendar e TableTransacoes em partes menores.
- Separar estado visual, ações e composição de conteúdo.
- Mover lógica de domínio para hooks ou serviços específicos.
- Garantir que os organisms recebam dados prontos e não façam orquestração excessiva.

Fase 5 — Templates

- Criar shell autenticado e templates de página.
- Padronizar cabeçalho, conteúdo, largura, espaçamento e comportamento responsivo.
- Atualizar rotas para consumir templates sem duplicar estrutura.

Fase 6 — Páginas e fluxos críticos

- Migrar Dashboard, Transações, Produtos, Estoque, Agendamentos e Notificações para os novos blocos.
- Refatorar modais e formulários pesados apenas depois da base visual estar pronta.
- Preservar a ordem de requisições, a autenticação e a exibição de feedback já existentes.

Fase 7 — Consolidação e limpeza

- Remover componentes legados substituídos.
- Corrigir imports redundantes e caminhos mistos entre `components` e `componentes`.
- Atualizar a documentação dos planos e registrar as decisões finais da migração.
- Executar lint, build e validação manual dos fluxos principais antes de encerrar a migração.

## Arquivos de Maior Impacto

- `src/router.jsx` para encaixar templates e páginas migradas.
- `src/estruturas/EstruturaAutenticada.jsx` para evoluir o shell autenticado.
- `src/components/Sidebar.jsx`, `src/components/SidePainel.jsx`, `src/components/WeeklyCalendar.jsx`, `src/components/TableTransacoes.jsx` como candidatos imediatos a organisms.
- `src/componentes/base/EntradaValor.jsx` como referência de átomo já existente.
- `src/components/SearchBar.jsx`, `src/components/CardProduto.jsx`, `src/components/CardItemEstoque.jsx`, `src/components/CardNotificacoes.jsx`, `src/components/Kpi.jsx`, `src/components/KpiTransacoes.jsx` como moléculas candidatas.
- `src/components/ModalNovoAgendamento.jsx`, `src/components/ModalNovaTransacao.jsx`, `src/components/ModalAtualizaTransacao.jsx`, `src/components/IntegracaoEstoqueAgendamento/ModalItensDosProdutos.jsx` como fluxos a decompor depois da base visual.
- `src/pages/*` para a migração final de containers de rota.

## Escopo e Decisões

Incluído nesta proposta:

- Auditoria da UI atual.
- Estrutura alvo por Atomic Design.
- Sequência de migração incremental.
- Boas práticas de nomenclatura, tipagem e testes.
- Plano por fases/sprints com dependências claras.

Excluído nesta etapa:

- Reescrita para TypeScript.
- Mudança de contratos de API.
- Integração dos dashboards simulados com backend.
- Redesenho visual completo fora da padronização estrutural.

## Execução — Registro Final

Fases 1 a 7 concluídas. Estado final:

- `src/ui/{atoms,molecules,organisms,templates}` montado e sem nenhum componente
  importando `src/services`.
- Regras de domínio e chamadas HTTP isoladas em `src/features/*`, que é a única
  camada (junto de `src/pages/dev/TestValidationPage.jsx`) que fala com
  `src/services`.
- Tabela de rotas em `src/app/router.jsx`, com `PrivateRoute` e
  `AuthenticatedLayout` preservando os caminhos anteriores.
- Legado removido: `src/components`, `src/componentes`, `src/context`,
  `src/estruturas`, `src/pages` na raiz, `src/router.jsx`, `src/servicos` e os
  hooks antigos.

Decisões registradas durante a execução:

- Cada provider expõe o próprio hook de consumo (`useNotifications`,
  `useSidebar`, `useSchedulingModal`) e o `createContext` mora em arquivo
  separado. Isso mantém Fast Refresh funcional e satisfaz o ESLint sem
  desabilitar regras.
- Estado inicializado no mount (componente interno remontado por `key`) em vez
  de sincronizado por efeito, eliminando `setState` dentro de `useEffect` em
  modais e no seletor de materiais.
- Agendamentos: o `ModalAgendamentoProvider` original virou
  `SchedulingModalProvider`, que expõe `savedCount` para a página da agenda
  recarregar sem o antigo efeito sobre `agendamento`/`isOpen`.
- Referências de sessão continuam sendo enviadas no payload como `referencias`
  (ids do upload) e materiais como `materiais: [{ produtoId, itens }]`, com a
  mesma ordem de requisições (atualizar → associar itens em paralelo).
- Exclusão de produto continua exigindo confirmação e volta para a listagem com
  `state.successMessage2`, separada de `state.successMessage3` do salvamento.
- Logout continua sendo imediato, como antes; somente a exclusão de item de
  estoque e de transação ganhou confirmação por `ConfirmDialog`.

Validação:

- `npm run lint` sem erros.
- `npm run build` sem erros.
- Sem testes automatizados: o projeto não possui infraestrutura de testes e
  adicionar uma suíte não fazia parte do escopo desta migração.
