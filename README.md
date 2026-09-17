# Kore Front-end

Este diretório reúne a interface web do sistema Kore, desenvolvida em React com Vite e estilização em Tailwind + DaisyUI. A aplicação consume a API do backend principal, gerencia autenticação, exibe dashboards e integra notificações em tempo real via SSE.

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
- react-hook-form + zod

## Estrutura do frontend

```text
front-end/
├── public/
│   └── uploads/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── providers/
│   ├── utils/
│   ├── index.css
│   ├── main.jsx
│   └── router.jsx
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Funcionalidades da interface

- login e cadastro de usuários
- rotas públicas e privadas
- configuração de token JWT via axios
- tratamento de erros com toast
- painel financeiro e métricas
- listagem e cadastro de produtos
- controle de estoque
- agendamentos com confirmação e pagamento
- visualização de notificações em tempo real
- integração com backend em `localhost:8080`

## Requisitos

Antes de executar o frontend, verifique se você possui:

- Node.js 20+
- npm
- acesso ao backend em execução

## Configuração do ambiente

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

## Integração com backend

A aplicação se conecta ao backend principal em:

```text
http://localhost:8080
```

O arquivo de cliente HTTP fica em `src/utils/api.js` e já realiza:

- injeção automática do token JWT
- redirecionamento em caso de 401
- integração com endpoints da API

## Autenticação e rotas

A aplicação usa rotas protegidas e validações de sessão no frontend. O fluxo de autenticação é responsável por:

- armazenar o token recebido no login
- verificar validade do usuário
- controlar acesso às páginas internas
- redirecionar para login quando necessário

## Notificações em tempo real

A aplicação se conecta ao SSE do backend via `NotificationProvider`, permitindo atualização em tempo real das notificações e ações de confirmação/cancelamento.

## Observações importantes

- o frontend depende do backend principal rodando localmente
- os uploads de imagem normalmente apontam para a pasta pública do app
- o projeto usa tratamento de erro centralizado no cliente para exibir mensagens mais claras ao usuário
- os dados e ações do sistema são consumidos via API REST, com respostas padronizadas pelo backend

## Licença

Este projeto foi desenvolvido como parte de atividade acadêmica e não foi definido um modelo de licença específico até o momento.
