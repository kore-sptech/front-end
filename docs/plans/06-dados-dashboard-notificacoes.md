# Etapa 5 — Dashboards simulados e notificações

## Diagnóstico Atual

`src/pages/DashboardPage.jsx:17-102`, `src/pages/DashboardFinanceiraPage.jsx` e `src/components/GraficoBarra.jsx:13-19` usam dados simulados de propósito porque ainda não estão integrados à API. Eles são protótipos de apresentação e não representam uma falha de integração.

`src/pages/NotificationsPage.jsx:9-148` também possui uma lista fixa, enquanto `src/providers/NotificationProvider.jsx` mantém eventos em memória, mas não expõe claramente um hook de consumo integrado à página. A refatoração deve preservar os dashboards simulados e separar claramente o que é protótipo do que consome dados reais.

## Objetivo da Refatoração

Manter os dashboards e o gráfico como dados simulados intencionais, sem criar chamadas de API ou serviço de métricas neste momento. Organizar apenas a estrutura dos dados simulados, a nomenclatura e a apresentação dos protótipos. Migrar a página de notificações para a fonte real somente se essa integração já estiver disponível e aprovada pelo backend.

## Passo a Passo de Execução

1. Documentar no próprio código e no README que dashboards, métricas financeiras e gráfico de barras usam dados simulados de propósito.
2. Não criar um serviço de métricas, adaptadores de métricas ou chamadas de API para substituir os dados simulados.
3. Separar os dados simulados dos componentes visuais, mantendo-os em uma estrutura identificável, por exemplo `dadosSimuladosDashboard`.
4. Preservar o layout, os cartões, os gráficos e os valores apresentados no protótipo.
5. Expor `useNotificacoes` a partir do provedor, separando provedor, contexto e hook em arquivos e exportações compatíveis com o Fast Refresh.
6. Definir um modelo canônico de notificação: identificador, tipo, título, mensagem, data, status de leitura e origem SSE.
7. Deduplicar eventos, limitar o buffer em memória e definir reconexão com atraso progressivo e descarte de ouvintes.
8. Migrar `NotificationsPage` para o hook de notificações somente se a fonte de dados estiver confirmada; caso contrário, manter a lista atual como protótipo explicitamente separado.
9. Não apresentar dados simulados como dados reais: a interface deve deixar claro, quando apropriado, que o painel é um protótipo.

## Arquivos Afetados

- `src/pages/DashboardPage.jsx`
- `src/pages/DashboardFinanceiraPage.jsx`
- `src/pages/NotificationsPage.jsx`
- `src/components/GraficoBarra.jsx`
- `src/components/Barra.jsx`
- `src/components/Notificacao.jsx`
- `src/components/CardNotificacoes.jsx`
- `src/providers/NotificationProvider.jsx`
- `src/hooks/useNotificacoes.js` (criar, se a integração for confirmada)
- `src/servicos/notificacoes.js` (criar, se necessário)
- `src/utils/notificacoes.js` (criar, se necessário)
- `src/utils/dadosDashboardSimulados.js` (criar, se a separação for necessária)
- `README.md`

## Critérios de Aceite

- Os dashboards e o gráfico continuam usando dados simulados e não passam a fazer chamadas de API nesta etapa.
- A documentação deixa explícito que esses dados são simulados de propósito e ainda não estão integrados.
- Os dados simulados ficam identificados visualmente ou por nomenclatura clara.
- A página de notificações não mistura protótipos com eventos reais sem indicar a origem de cada conjunto.
- Eventos duplicados não geram entradas duplicadas; reconexão não cria ouvintes acumulados.
- A paginação e os filtros continuam com a mesma semântica visual.
- Lint e build passam e os fluxos são validados manualmente com dados simulados e, quando aplicável, com respostas reais.
