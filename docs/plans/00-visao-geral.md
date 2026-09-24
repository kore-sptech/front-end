# Plano mestre de refatoração incremental

## Diagnóstico Atual

A aplicação React/Vite funciona e está integrada à API, mas a organização atual concentra interface, chamadas HTTP, manipulação de estado, validação e regras de negócio em componentes de página. Não há uma fronteira estável entre apresentação e integrações, há URLs e cabeçalhos repetidos, contratos implícitos e lint falhando. Refatorar tudo em uma única entrega aumenta o risco de alterar corpos de requisição, rotas, autenticação e fluxos de produção.

Os dashboards e o gráfico de barras usam dados simulados de propósito, pois ainda não representam integrações com a API. Eles devem permanecer como protótipos claramente identificados, sem serem tratados como funcionalidades concluídas.

## Objetivo da Refatoração

Estabelecer uma arquitetura incremental, baseada em responsabilidades claras, que preserve o comportamento e os contratos existentes enquanto reduz acoplamento, duplicação e risco de regressão. A estratégia será baseada em substituição gradual: introduzir novas camadas, migrar um módulo por vez e remover a implementação anterior somente após validação manual.

Todo o código novo e a documentação dos planos deverão ser escritos em português. Nomes de arquivos e símbolos já existentes podem ser preservados para evitar uma renomeação em massa que aumente o risco da refatoração.

## Passo a Passo de Execução

1. **Etapa 0 — Base e correções de estabilidade:** executar o plano `01-baseline-estabilidade.md`.
2. **Etapa 1 — Contratos e infraestrutura:** centralizar ambiente, HTTP, sessão e tratamento de erros conforme `02-configuracao-http-sessao.md`.
3. **Etapa 2 — Serviços, hooks e utilitários:** criar serviços, hooks e regras compartilhadas conforme `03-servicos-hooks-dominio.md`.
4. **Etapa 3 — Estrutura visual e componentes reutilizáveis:** consolidar estrutura de páginas, retorno de operações e componentes genéricos conforme `04-layout-ui-reutilizavel.md`.
5. **Etapa 4 — Formulários críticos:** dividir agendamentos, transações, produtos e estoque conforme `05-formularios-modais.md`.
6. **Etapa 5 — Dashboards simulados e notificações:** manter os dashboards simulados de propósito e organizar a camada de notificações conforme `06-dados-dashboard-notificacoes.md`.
7. **Etapa 6 — Documentação, contratos e validação manual:** padronizar documentação, contratos de API e verificações manuais conforme `07-documentacao-contratos-qualidade.md`.
8. **Etapa 7 — Limpeza final:** remover código legado, atualizar a documentação e executar a validação de regressão conforme `08-limpeza-estabilizacao.md`.

A ordem é obrigatória. Não iniciar a divisão de um formulário antes de seu serviço, contrato de corpo de requisição e fluxo de validação manual estarem identificados.

## Arquivos Afetados

- `docs/plans/00-visao-geral.md`
- `docs/plans/01-baseline-estabilidade.md`
- `docs/plans/02-configuracao-http-sessao.md`
- `docs/plans/03-servicos-hooks-dominio.md`
- `docs/plans/04-layout-ui-reutilizavel.md`
- `docs/plans/05-formularios-modais.md`
- `docs/plans/06-dados-dashboard-notificacoes.md`
- `docs/plans/07-documentacao-contratos-qualidade.md`
- `docs/plans/08-limpeza-estabilizacao.md`
- Futuros arquivos em `src/config/`, `src/servicos/`, `src/hooks/`, `src/componentes/base/`, `src/modulos/`, `src/estruturas/` e `src/utils/`, conforme a necessidade de cada etapa.

## Critérios de Aceite

- Cada plano pode ser executado e revisado separadamente.
- Nenhuma etapa altera rota, método HTTP, formato do corpo de requisição ou regra de negócio sem confirmação explícita do contrato do backend.
- A aplicação continua compilando e os fluxos críticos continuam sendo validados manualmente após cada etapa.
- A cada etapa existe uma revisão das alterações, validação de lint/build e registro dos riscos restantes.
- A arquitetura final mantém uma única fonte para configuração, sessão, chamadas de API, validação e componentes compartilhados.
- Os dashboards simulados permanecem identificados como dados simulados, sem sugerir integração com a API.
