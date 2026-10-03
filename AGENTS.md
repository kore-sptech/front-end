# AGENTS.md - Frontend (Kore)

Este arquivo é um guia técnico para agentes de IA (OpenCode, GitHub Copilot) trabalhando no frontend do projeto **Kore**. Ele resume aspectos arquiteturais, contratos, padrões e comandos exatos para evitar erros comuns e acelerar o onboarding.

> Preferir fontes executáveis (config, scripts, código) sobre documentação. Se houver conflito, confiar no código.

## 1. Visão Geral

- **Projeto**: Frontend React + Vite para gestão de estúdios/salões (autenticação, agendamentos, produtos/estoque, transações, notificações, dashboards).
- **Stack**: React 19, Vite 8, JavaScript (sem TypeScript), Tailwind CSS 4 + DaisyUI, React Router DOM 7, Axios, Recharts, lucide-react, sonner, react-day-picker, date-fns, jwt-decode, react-imask.
- **Ambiente**: Node.js 20+, npm. API base padrão: `http://localhost:8080`.
- **Estado**: Migração concluída para **Atomic Design + domínio (features)**. Não há testes automatizados.

## 2. Arquitetura e Estrutura

A aplicação segue **Atomic Design** com separação por domínio. Regra fundamental: **componentes de UI não importam `src/services`**. Exceção deliberada: `src/pages/dev/TestValidationPage.jsx` (precisa do erro bruto do Axios).

```text
src/
├── app/                # Bootstrap e roteamento
│   ├── App.jsx          # Providers globais + RouterProvider
│   ├── PrivateRoute.jsx # Guarda de rotas (JWT válido)
│   └── router.jsx       # Tabela de rotas (createBrowserRouter)
├── assets/             # Imagens/recursos estáticos
├── config/env.js       # Leitura de variáveis Vite (VITE_API_URL, VITE_SSE_URL)
├── constants/          # Constantes de domínio (produtos/agendamentos)
├── features/           # Regras de negócio por domínio (hooks, validação, dados)
├── hooks/              # Hooks genéricos reutilizáveis
├── pages/              # Páginas por rota (1 arquivo por rota/ação)
├── providers/          # Contextos React + hooks próprios (evitam Fast Refresh issues)
├── services/           # ÚNICA camada de acesso HTTP (Axios). Sem lógica de UI
├── ui/                 # Atomic Design
│   ├── atoms/           # Sem estado, sem domínio
│   ├── molecules/       # Átomos compostos, estado local pequeno
│   ├── organisms/       # Blocos com comportamento/integracão a features
│   └── templates/       # Layouts de página
├── utils/              # Helpers (formatters, auth, errorHandler, api helpers)
├── index.css           # Estilos globais + utilitários (.no-scrollbar)
└── main.jsx            # Entrada da aplicação
```

### 2.1 Camadas (dependências permitidas)

```text
pages -> ui (templates/organisms/molecules/atoms)
     -> features -> services -> utils/api
providers -> features | utils | services (conforme necessário)
ui/organisms -> features | utils (nunca services, exceto TestValidationPage)
ui/atoms/molecules -> utils | constantes (sem services/domínio de dados)
```

### 2.2 Atomic Design (uso prático)

- **Atoms** (`ui/atoms`): `Button`, `Control`, `Field`, `Badge`, `Spinner`, `Logo`, `IconButton`, `MoneyInput`, `OdometerNumber`, etc. Elementos puros, sem estado de domínio.
- **Molecules** (`ui/molecules`): `Modal`, `PageHeader`, `Panel`, `SearchInput`, `ConfirmDialog`, `AuthCard`, `Pagination`, `ImageUploader`, `AmbientGlow`, `Breadcrumbs`, `ProductCard`, `StockItemCard`, `FinanceCard`, etc. Combinam átomos, com pequeno estado local.
- **Organisms** (`ui/organisms`): `SessionModal`, `ProductForm`, `TransactionFormModal`, `StockEntryModal`, `WeekCalendar`, `AgendaSidebar`, `TransactionsTable`, `FinanceMetrics`, `CategorySelector`, `MaterialPicker`, etc. Integram com `features` e possuem lógica de formulário/fluxo.
- **Templates** (`ui/templates`): `AuthLayout`, `AuthenticatedLayout`. Estruturas de layout (público/privado).

## 3. Autenticação, Sessão e Rotas

### 3.1 Sessão (localStorage)

Chaves persistidas via `src/utils/auth.js`:
- `auth` (JSON completo da sessão retornada pelo backend)
- `nome`
- `token`
- `usuarioId` (convertido para `String`)

Funções: `getToken()`, `getSession()`, `saveSession(session)`, `isTokenValido(token)`, `isAutenticado()`, `logout()`.

Validação de token usa `jwt-decode` (verifica `exp * 1000 > Date.now()`).

### 3.2 Login/Cadastro (Contratos obrigatórios)

- **Login**: `POST /auth/login` → payload `{ email, senha }`. Chamado via `services/autenticacao.entrar(email, senha)`, orquestrado por `features/auth/login.js` (chama `saveSession(data)`).
- **Cadastro**: `POST /usuarios` → payload `{ email, nome, senha }`. Via `services/autenticacao.cadastrarUsuario(dados)`, orquestrado por `features/auth/signUp.js`.

**Importante**: `LoginPage` mapeia `password` → `senha` na chamada (`login({ email, senha: password })`). `SignUpPage` envia `{ email, nome, senha }`.

### 3.3 Rotas e Proteção

- `app/router.jsx` usa `createBrowserRouter`.
- Rotas privadas aninhadas: `PrivateRoute` → `AuthenticatedLayout` → páginas internas.
- Redirecionamentos: `/` → `/login` (replace). Rota não encontrada (`*`) → `/login` (replace).
- Rotas públicas: `/login`, `/signup`, `/test-validation` (dev).
- Rotas privadas principais: `/dashboard`, `/dashboard-financeiro`, `/transacoes`, `/agendamentos`, `/notificacoes`, `/produtos`, `/produtos/cadastro`, `/produtos/editar/:id`, `/estoque/:id`, `/estoque/:id/adicionar`.

`PrivateRoute` (`src/app/PrivateRoute.jsx`): verifica `getToken()` + `isAutenticado()`. Se inválido/ausente: faz `logout()` (quando token existe mas expirado), mostra toast e redireciona para `/login` com `state.from`.

`App.jsx`: envolve aplicação com `NotificationProvider` (com `onSessionChanged={() => window.location.reload()}`), `SidebarProvider`, `SchedulingModalProvider`, `Toaster` (sonner, 4000ms).

## 4. Camada HTTP (API)

`src/utils/api.js`:
- `axios.create({ baseURL: API_URL })`
- **Request interceptor**: anexa `Authorization: Bearer ${token}` (localStorage) se existir.
- **Response interceptor**: em erro 401 **não é** para requisição de login (`url.includes('/auth/login')`), faz `logout()`, toast "Sua sessão expirou. Faça login novamente." e `window.location.href = '/login'`. Outros erros rejeitados (tratados via `handleApiError` nas features).

`src/config/env.js`:
```js
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
export const SSE_URL  = import.meta.env.VITE_SSE_URL  || API_URL;
```

Variáveis Vite necessárias (dev): `.env.local` com `VITE_API_URL` e opcional `VITE_SSE_URL`.

## 5. Serviços (contratos HTTP)

`src/services/` contém apenas chamadas HTTP. Principais:

- **autenticacao.js**: `entrar(email,senha)`, `cadastrarUsuario(dados)`
- **produtos.js**: `listarTodosProdutos()`, `listarProdutos(usuarioId)`, `listarCategorias(usuarioId)`, `criarCategoria(usuarioId,dados)`, `criarProduto(usuarioId,dados)`, `atualizarProduto(usuarioId,id,dados)`, `excluirProduto(usuarioId,id)`, `enviarImagemProduto(id,arquivo)` (FormData com campo `imagem`)
- **estoque.js**: `listarEstoque(produtoId)`, `adicionarEstoque(produtoId,quantidade,dados)`, `excluirItemEstoque(itemId)` (DELETE `/estoque/${itemId}`), `listarEstoqueDoAgendamento(agendamentoId)`, `associarItemEstoque(itemId,agendamentoId)`
- **transacoes.js**: `listarTransacoes(usuarioId)`, `criarTransacao(usuarioId,dados)`, `atualizarTransacao(id,dados)`, `excluirTransacao(id)`
- **agendamentos.js**: `listarAgendamentos(usuarioId)`, `criarAgendamento(usuarioId,dados)`, `atualizarAgendamento(id,dados)`, `cancelarAgendamento(id)`, `confirmarAgendamento(id)`, `atualizarStatusAgendamento(id,status)`
- **categorias.js**: `listarCategorias(usuarioId)`, `criarCategoria(usuarioId,dados)`
- **notificacoes.js**: `listarNotificacoes(usuarioId)`, `marcarLida(id)`, `marcarTodasLidas(usuarioId)`, `deletarNotificacao(id)`
- **uploads.js**: `enviarImagem(formData)` (campo `imagem`)

**Nota estoque (soft delete)**: `excluirItemEstoque` é `DELETE /estoque/${itemId}` (sem `usuarioId`). O backend marca o item como **inativo** (altera status). O frontend **não deve exibir** itens inativos: `useStockItems` filtra `item?.ativo !== false`.

## 6. Features, Providers e Hooks

### 6.1 Providers (contexto + hook próprio)

Cada provider expõe seu próprio hook para evitar violar regras de Fast Refresh:

- `NotificationProvider.jsx` + `providers/useNotifications.js` (`useNotifications()`)
- `SidebarProvider.jsx` + `providers/useSidebar.js` (`useSidebar()`)
- `SchedulingModalProvider.jsx` + `providers/useSchedulingModal.js` (`useSchedulingModal()`)

`NotificationProvider`: gerencia SSE/notificações; ações de confirmação/cancelamento disparam `onSessionChanged` (via `App.jsx`) que **recarrega a página**. Callbacks são atualizados com `useEffect` + ref.

### 6.2 Features (domínio)

Exemplos relevantes: `features/auth/*`, `features/products/*` (`useProductForm`, `productValidation`, `productTrail`), `features/inventory/*` (`useStockItems`, `useStockEntry`), `features/transactions/*` (`useTransactions`, `transactionForm`, `useTransactionActions`), `features/scheduling/*` (`useWeekSchedule`, `useSessionForm`, `sessionValidation`, `materials.js` — em `materials.js` o campo é **`produtoId`**), `features/notifications/*`, `features/dashboard/*` (dados simulados em `dashboardData.js`).

**Padrões em hooks**: efeitos com cleanup (`let ativo = true`), tratamento de 204 (lista vazia), uso de `useDebouncedValue` quando aplicável (evitar sincronização de estado desnecessária em efeitos), evitar ressincronização redundante em formulários.

### 6.3 Hooks genéricos

`src/hooks/`: `useDebouncedValue`, `usePagination`, `useImageUpload`, `useMoneyInput`, `useLocalStorage`, etc.

## 7. Componentes UI (padrões críticos)

### 7.1 Button (átomo) — CRÍTICO

`src/ui/atoms/Button.jsx`:
- Aceita `as` apenas como `"button"` ou `"a"`. **Nunca** renderiza tag `<submit>` (inexistente no HTML).
- Propriedade correta para submit é **`type="submit"`** (não `as="submit"`).
- Suporta `variant`, `size`, `fullWidth`, `loading`, `loadingLabel`, `disabled`.
- `size="block"` aplica `w-full` + estilos de bloco.

**Regra inviolável**: em formulários, usar **`type="submit"`**. Todos os usos antigos com `as="submit"` foram substituídos.

### 7.2 Control + Field

`Control` (`ui/atoms/Control.jsx`): controla `input/select/textarea`, com `tone` (`neutral|auth|invalid|invalidAuth|transparent`) e `width` (`default|compact`). `tone="auth"` usado em telas públicas (Login/Signup).

`Field` (`ui/atoms/Field.jsx`): rótulo, ícone à esquerda, hint à direita, mensagem de erro com animação "shake" quando o erro muda.

### 7.3 Modal

`src/ui/molecules/Modal.jsx` usa portal (`createPortal` para `document.body`), overlay clicável para fechar (quando `dismissible=true`), ESC fecha. Tamanhos: `sm|max-w-md`, `md|max-w-lg`, `lg|max-w-2xl`, `xl|max-w-[720px]`, `xxl|max-w-[960px]`. SessionModal usa `size="xl"`.

### 7.4 PageHeader

`src/ui/molecules/PageHeader.jsx`: título, traço azul (`h-1 w-12 rounded-3xl bg-[#48DCFC]`) logo abaixo do título, slot `subtitle` (pode receber Breadcrumbs), `actions` à direita, responsivo (flex-col → lg:flex-row).

### 7.5 AuthLayout/AuthCard

`AuthLayout` (`ui/templates/AuthLayout.jsx`): layout público original com **imagem de fundo** (`/back-ground-login.png`), gradiente sobreposto, header fixo com `Logo`, coluna esquerda com `title`, `highlight`, `subtitle`, coluna direita com formulário, rodapé com ano atual.
`AuthCard` (`ui/molecules/AuthCard.jsx`): cartão central com título (`h2`), conteúdo e `footer` (link para outra tela).

## 8. Páginas com detalhes específicos

- **LoginPage** (`pages/auth/LoginPage.jsx`): usa AuthLayout com props, campos com `tone="auth"`, mapeia `senha: password`. Valida obrigatoriedade localmente.
- **SignUpPage** (`pages/auth/SignUpPage.jsx`): valida nome/email/senha/confirmação (toast no primeiro erro), chama `signUp({ email,nome,senha })`, redireciona para `/login` com sucesso.
- **TransactionsPage** (`pages/transactions/TransactionsPage.jsx`): filtros em linha única (`flex-nowrap items-center gap-4 overflow-x-auto no-scrollbar`), busca com `min-w-[280px] flex-1`, selects compactos (`w-20/w-32` conforme necessário), botões com `shrink-0`. Não extrapola viewport.
- **SchedulePage** (`pages/scheduling/SchedulePage.jsx`): padding padrão `p-4 sm:p-6`, grid com `AgendaSidebar` + `WeekCalendar`. Botão "Agendar" abre modal novo. `SessionModal`: botão submit sempre **"Agendar"** (ícone `CalendarPlus`), **desabilitado** enquanto `form.canSubmit` for falso, legenda `Preencha todos os campos` aparece abaixo quando inválido.
- **ProductsPage** (`pages/products/ProductsPage.jsx`): botão "Registrar" (sem `+` duplicado), ícone `Plus` + texto "Registrar".
- **ProductCreatePage** (`pages/products/ProductCreatePage.jsx`): título + traço azul + Breadcrumbs. Formulário em linha (`flex-nowrap`) com dois Panels lado a lado.
- **ProductEditPage** (`pages/products/ProductEditPage.jsx`): usa `key={id}` no formulário (remontagem) para resetar estado ao trocar produto.
- **StockEntryPage** (`pages/inventory/StockEntryPage.jsx`): título + traço azul, formulário com `Panel`.
- **InventoryPage** (`pages/inventory/InventoryPage.jsx`): lista de itens de estoque por produto; exclusão é **soft delete** (backend inativa). Itens com `ativo === false` são filtrados e **não exibidos** no front.

## 9. Comandos de Desenvolvimento

Todos executados na raiz `front-end/`:

```bash
# Desenvolvimento (dev server Vite)
npm run dev

# Build de produção
npm run build

# Lint (ESLint)
npm run lint

# Preview build local
npm run preview
```

**Verificação obrigatória após alterações**: rodar **`npm run lint`** e **`npm run build`**. Caso existam comandos de typecheck no futuro (não há atualmente), devem ser executados antes do build quando presentes.

**Ordem recomendada** (quando aplicável): `lint -> build`. Não há testes automatizados neste projeto.

## 10. Convenções e Regras Críticas

- **Comentários**: **NUNCA** adicionar comentários ao código, a menos que explicitamente solicitado pelo usuário.
- **Componentização**: Login/Cadastro devem permanecer componentizados (`AuthLayout`, `AuthCard`, `Field`, `Control`, `Button`). Não reintroduzir markup monolítico antigo.
- **Submit de formulários**: **SEMPRE** `type="submit"`. **Nunca** `as="submit"`.
- **Imports**: `src/ui` **não** importa `src/services`. Única exceção: `src/pages/dev/TestValidationPage.jsx`.
- **Fast Refresh**: Providers expõem **hook próprio** (ex.: `useNotifications`, `useSidebar`, `useSchedulingModal`), nunca exportar apenas contexto cru de forma que quebre HMR.
- **Commits**: **NUNCA** commitar alterações sem pedido explícito do usuário. Inspecionar `git status/diff/log` antes de qualquer commit solicitado.
- **Segurança**: Nunca expor/logar secrets/keys. Nunca commitar segredos.
- **Bibliotecas**: Nunca assumir biblioteca disponível — verificar no codebase (package.json, arquivos vizinhos) antes de usar.
- **Imitação de estilo**: Seguir convenções existentes (indentação, padrões, imports) ao editar código.
- **Respostas concisas**: Respostas ao usuário < 4 linhas (fora tool use/código), diretas, sem preâmbulo/postâmbulo desnecessário.
- **Ícones/Emojis**: Só usar se explicitamente solicitado.
- **Tratamento 204**: Em listas (estoque, produtos), resposta 204 → tratar como lista vazia (sem erro).
- **Soft delete estoque**: Itens inativados (`ativo === false`) **não são exibidos** no frontend.

## 11. Pontos de Atenção (Gotchas)

1. **Botões submit inválidos**: `as="submit"` gera `<submit>` inválido → onSubmit não dispara. Sempre usar `type="submit"`.
2. **Exclusão de estoque**: Rota `DELETE /estoque/${itemId}` (sem usuário). Backend faz soft delete (status inativo). Front filtra `ativo !== false`.
3. **Filtros de Transações**: Usar `flex-nowrap overflow-x-auto no-scrollbar` + `shrink-0` em controles + `flex-1 min-w-[...]` no SearchInput para evitar quebra/estouro horizontal.
4. **SessionModal**: Label fixo "Agendar", `disabled={!form.canSubmit}`, legenda "Preencha todos os campos" abaixo quando inválido.
5. **ProductForm**: Em cadastro/edição lado a lado, formulário usa `flex-nowrap` (não `flex-wrap`).
6. **ProductEditPage**: Formulário remontado com `key={id}` para evitar ressincronização com estado anterior.
7. **useTransactions**: Evita sincronização redundante de busca com efeito (usa `useDebouncedValue`).
8. **NotificationProvider**: Reload via `onSessionChanged` (página inteira) em ações de confirmação/cancelamento — comportamento intencional.
9. **Dashboard**: Dados simulados em `features/dashboard/dashboardData.js` (protótipos).
10. **Traço azul de títulos**: Páginas com título customizado (fora de PageHeader) devem incluir `<span className="block h-1 w-12 rounded-3xl bg-[#48DCFC]" />` logo abaixo do H1.

## 12. Referências Rápidas

- **Rotas**: `src/app/router.jsx`
- **Bootstrap**: `src/app/App.jsx`, `src/main.jsx`
- **API/Auth**: `src/utils/api.js`, `src/utils/auth.js`, `src/config/env.js`
- **Padrão UI**: `src/ui/atoms/Button.jsx`, `src/ui/atoms/Control.jsx`, `src/ui/atoms/Field.jsx`, `src/ui/molecules/Modal.jsx`, `src/ui/molecules/PageHeader.jsx`
- **Telas públicas**: `src/pages/auth/LoginPage.jsx`, `src/pages/auth/SignUpPage.jsx`, `src/ui/templates/AuthLayout.jsx`, `src/ui/molecules/AuthCard.jsx`
- **Contratos**: Login `{email,senha}`, Cadastro `{email,nome,senha}`, API `http://localhost:8080`
- **Exceção UI→Services**: `src/pages/dev/TestValidationPage.jsx`