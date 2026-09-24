# Etapa 1 — Configuração, cliente HTTP e sessão

## Diagnóstico Atual

`src/utils/api.js:1-43` centraliza Axios, mas usa `http://localhost:8080` fixo, injeta token e redireciona com `window.location.href` em respostas 401. O login usa `fetch` diretamente em `src/pages/LoginPage.jsx:59-65`, a exclusão de produto também usa `fetch` em `src/pages/Produto/EditarProdutoPage.jsx:151-173`, e vários componentes repetem cabeçalhos `Authorization` mesmo com o interceptor.

O logout remove somente o token no interceptor, enquanto `src/components/Sidebar.jsx:37-40` usa `localStorage.clear()`. O SSE de `src/providers/NotificationProvider.jsx:105-106` usa `EventSource` e não participa da camada Axios. Isso cria inconsistências de sessão, ambiente e tratamento de erro.

## Objetivo da Refatoração

Criar uma infraestrutura única para configuração de ambientes, cliente HTTP, sessão, autorização e erros, sem mudar as rotas existentes. A nova camada deve permitir trocar URLs por ambiente, centralizar o comportamento de 401 e tornar explícito como o SSE é autenticado.

## Passo a Passo de Execução

1. Mapear todas as rotas, métodos, cabeçalhos, parâmetros de consulta e formatos de resposta em uma matriz de contrato.
2. Criar `src/config/env.js` com `VITE_API_URL` e `VITE_SSE_URL`, mantendo um valor padrão local somente para desenvolvimento.
3. Alterar `src/utils/api.js` para usar a configuração centralizada e evitar URL absoluta nos serviços.
4. Mover o login e as operações que usam `fetch` para o cliente HTTP padrão, verificando `response.ok` e o contrato de erro.
5. Criar `src/servicos/autenticacao.js` e uma sessão central com operações `obterSessao`, `salvarSessao`, `limparSessao`, `estaAutenticado` e `obterToken`.
6. Substituir gradualmente `localStorage.clear()`, remoção manual de `token` e `window.location.href` por uma única rotina de encerramento de sessão.
7. Definir o comportamento de 401: limpar a sessão, emitir um evento controlado para a aplicação e redirecionar pelo roteador quando possível.
8. Remover cabeçalhos manuais de componentes, mantendo-os apenas onde o cliente HTTP realmente não for utilizado.
9. Validar com o backend como autenticar o SSE. Se `EventSource` não aceitar cabeçalhos, usar o mecanismo já suportado pelo backend ou discutir uma solução de proxy antes de implementar.
10. Centralizar mensagens de erro e evitar `console.log` de corpos de requisição sensíveis.

## Arquivos Afetados

- `src/config/env.js` (criar)
- `src/servicos/autenticacao.js` (criar)
- `src/utils/api.js`
- `src/utils/auth.js`
- `src/utils/errorHandler.js`
- `src/context/ContextoAutenticacao.jsx` (criar, se necessário)
- `src/main.jsx`
- `src/router.jsx`
- `src/pages/LoginPage.jsx`
- `src/pages/SignUpPage.jsx`
- `src/pages/Produto/EditarProdutoPage.jsx`
- `src/providers/NotificationProvider.jsx`
- `src/components/Sidebar.jsx`
- Arquivos `.env.example` e configuração de ambiente, se já houver padrão no projeto

## Critérios de Aceite

- Nenhum arquivo de UI contém URL absoluta do backend.
- Login, cadastro, produtos, estoque, transações e agendamentos chegam às mesmas rotas com os mesmos corpos de requisição.
- Token expirado produz logout consistente e redirecionamento para `/login` sem deixar sessão parcial.
- Login com resposta HTTP de erro não é tratado como sucesso.
- Os cabeçalhos de autorização são injetados uma única vez pela infraestrutura.
- O comportamento do SSE é validado com autenticação, reconexão e evento de cancelamento.
- Build e lint continuam passando.
