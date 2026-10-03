# Kore Front-end

Este diretório reúne a interface web do sistema Kore, desenvolvida em React com Vite e estilização em Tailwind + DaisyUI. A aplicação consome a API do backend principal, gerencia autenticação, exibe telas operacionais e integra notificações em tempo real via SSE. Os dashboards são protótipos com dados simulados de propósito.

## Visão geral

A aplicação foi criada para gerenciar operações de salões e estúdios, incluindo:

- autenticação e autorização de usuários
- dashboard administrativo e financeiro
- gestão de agendamentos
- controle de produtos e estoque
- registros de transações
- notificações em tempo real
- upload e exibição de imagens

## Stack principal

- React 19
- Vite 8
- JavaScript
- Tailwind CSS 4
- DaisyUI
- Axios
- React Router DOM
- Recharts
- Lucide React
- Sonner / react-hot-toast
- react-day-picker
- date-fns

## Estrutura do frontend

A interface segue **Atomic Design** combined com uma divisão por domínio
(funcionalidades). Componentes visuais não conhecem serviços: recebem dados e
callbacks por props.

```text
front-end/
├── public/
│   └── uploads/
├── src/
│   ├── app/            # bootstrap, rotas e guarda de rota privada
│   │   ├── App.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── router.jsx
│   ├── assets/
│   ├── config/         # leitura das variáveis de ambiente
│   ├── constants/      # constantes de domínio (produtos, agendamentos)
│   ├── features/       # regras de negócio por domínio (hooks, validação, dados)
│   ├── hooks/          # hooks genéricos (debounce, paginação, imagens, dinheiro)
│   ├── pages/          # uma pasta por área, com uma página por rota
│   ├── providers/      # estado global (contexto) e consumo via hooks
│   ├── services/       # única camada que fala com a API
│   ├── ui/             # átomos, moléculas, organismos e templates
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── templates/
│   ├── utils/          # formatação, erros, autenticação, paginação
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

### Camadas e regras de dependência

```text
pages -> ui (templates/organisms/molecules/atoms)
      -> features -> services -> utils/api
```

- **atoms**: elementos sem estado e sem dependência de domínio (`Button`, `Control`, `Field`, `Badge`, `Spinner`...).
- **molecules**: átomos compostos, com estado local pequeno (`Modal`, `Pagination`, `SearchInput`, `ConfirmDialog`...).
- **organisms**: blocos com comportamento e/ou integração com `features` (`SessionModal`, `ProductForm`, `WeekCalendar`, `TransactionsTable`...).
- **templates**: layouts de página (`AuthLayout`, `AuthenticatedLayout`).
- **pages**:route uma rota por arquivo e orquestra hooks, providers e organismos.
- **features**: validação, formatação e hooks de domínio (`useWeekSchedule`, `useProductForm`, `useTransactions`...).
- **providers**: contexto React; cada provider expõe um hook próprio (`useNotifications`, `useSidebar`, `useSchedulingModal`) para manter Fast Refresh funcional.
- **services**: funções HTTP (`listarAgendamentos`, `criarTransacao`...), única camada que importa o cliente Axios.

## Funcionalidades da interface

- login e cadastro de usuários
- rotas públicas e privadas
- configuração de token JWT via axios
- tratamento de erros com toast
- telas financeiras e operacionais
- listagem e cadastro de produtos
- controle de estoque
- agendamentos com confirmação e pagamento
- visualização de notificações em tempo real
- dados simulados identificados no módulo `src/features/dashboard/dashboardData.js` para os dashboards
- integração com backend por `VITE_API_URL`

## Requisitos

Antes de executar o frontend, verifique se você possui:

- Node.js 20+
- npm
- acesso ao backend em execução

## Configuração do ambiente

Na raiz do frontend, crie um arquivo `.env.local` quando necessário:

```bash
VITE_API_URL=http://localhost:8080
VITE_SSE_URL=http://localhost:8080
```

Na raiz do frontend:

```bash
cd front-end
npm install
```

## Executando em desenvolvimento

```bash
cd front-end
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:5173
```

## Build de produção

```bash
cd front-end
npm run build
```

## Preview da build

```bash
cd front-end
npm run preview
```

## Validação e lint

```bash
cd front-end
npm run lint
```

## Validação manual

A validação é feita com lint, build e pelo roteiro manual dos fluxos de autenticação, produtos, estoque, transações, agendamentos, imagens e notificações. O projeto não utiliza testes automatizados.

## Integração com backend

A aplicação se conecta ao backend principal em:

```text
http://localhost:8080
```

A integração existente é organizada em `src/services/`, sem alterar rotas, métodos, parâmetros, cabeçalhos, corpos de requisição, respostas ou ordem das operações. Os dashboards usam dados simulados de propósito e não representam uma integração com a API.

O arquivo de cliente HTTP fica em `src/utils/api.js` e já realiza:

- injeção automática do token JWT
- redirecionamento em caso de 401
- integração com endpoints da API

## Autenticação e rotas

A tabela de rotas fica em `src/app/router.jsx`. As telas internas são filhas de
`AuthenticatedLayout` e protegidas por `PrivateRoute`.

| Rota | Página | Acesso |
| --- | --- | --- |
| `/login` | `pages/auth/LoginPage` | pública |
| `/signup` | `pages/auth/SignUpPage` | pública |
| `/test-validation` | `pages/dev/TestValidationPage` | pública |
| `/dashboard` | `pages/dashboard/DashboardPage` | privada |
| `/dashboard-financeiro` | `pages/dashboard/FinanceDashboardPage` | privada |
| `/transacoes` | `pages/transactions/TransactionsPage` | privada |
| `/agendamentos` | `pages/scheduling/SchedulePage` | privada |
| `/notificacoes` | `pages/notifications/NotificationsPage` | privada |
| `/produtos` | `pages/products/ProductsPage` | privada |
| `/produtos/cadastro` | `pages/products/ProductCreatePage` | privada |
| `/produtos/editar/:id` | `pages/products/ProductEditPage` | privada |
| `/estoque/:id` | `pages/inventory/InventoryPage` | privada |
| `/estoque/:id/adicionar` | `pages/inventory/StockEntryPage` | privada |

A sessão é mantida em `localStorage` (`auth`, `nome`, `token`, `usuarioId`) e
gerenciada por `src/utils/auth.js`, responsável por:

- armazenar o token recebido no login
- verificar a validade do JWT antes de renderizar a rota
- controlar o acesso às páginas internas
- redirecionar para `/login` quando o token expira ou some

## Notificações em tempo real

A aplicação se conecta ao SSE do backend via `NotificationProvider`, permitindo atualização em tempo real das notificações e ações de confirmação/cancelamento. O consumo do contexto acontece sempre pelo hook `useNotifications`.

## Observações importantes

- o frontend depende do backend principal rodando localmente
- os uploads de imagem normalmente apontam para a pasta pública do app
- o projeto usa tratamento de erro centralizado no cliente para exibir mensagens mais claras ao usuário
- os dados e ações do sistema são consumidos via API REST, com respostas padronizadas pelo backend
- nenhum componente de `src/ui` importa `src/services`; a integração HTTP acontece em `src/features` (exceção: `pages/dev/TestValidationPage.jsx`, tela de diagnóstico que precisa do erro bruto do Axios)

## Licença

Este projeto foi desenvolvido como parte de atividade acadêmica e não foi definido um modelo de licença específico até o momento.
