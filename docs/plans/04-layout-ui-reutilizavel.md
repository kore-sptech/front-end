# Etapa 3 — Estrutura visual, componentes genéricos e retornos

## Diagnóstico Atual

As páginas repetem a composição com `Sidebar`, fundo, contêiner, cabeçalhos e espaçamento. Componentes genéricos como `SearchBar`, `Kpi`, `Barra` e `CardNotificacoes`, campos de modais e retornos de operações não possuem uma API consistente.

O sistema mistura `sonner`, `react-hot-toast`, alertas, mensagens locais e `console.log`. Além disso, há uma imagem externa fixa em `src/components/IntegracaoEstoqueAgendamento/CardProdutoIntegracao.jsx:15` e imagens de reserva externas nos cards, gerando dependência visual desnecessária.

## Objetivo da Refatoração

Separar a estrutura das páginas, os componentes de regras de negócio e os componentes visuais reutilizáveis. Criar abstrações pequenas e parametrizadas, com contratos explícitos para estado visual, acessibilidade, carregamento, erro e composição, sem alterar a experiência funcional.

## Passo a Passo de Execução

1. Criar `src/estruturas/estruturaAutenticada.jsx` com Sidebar, área de conteúdo, Outlet e responsividade.
2. Migrar as rotas privadas em `src/router.jsx` para a estrutura protegida, mantendo os caminhos atuais.
3. Separar `Sidebar` em composição de navegação, ações de usuário e itens de menu, usando o contexto apenas para estado visual.
4. Criar `src/componentes/base/` para `Botao`, `Campo`, `Selecao`, `CampoMonetario`, `EstadoCarregando`, `EstadoVazio`, `EstadoErro`, `DialogoConfirmacao` e `EtiquetaStatus`, somente quando houver reutilização real.
5. Padronizar `SearchBar` com `value`, `onChange`, `placeholder`, `disabled` e `aria-label`, tratando entrada vazia.
6. Extrair componentes de retorno das operações para garantir carregamento, sucesso, erro e prevenção de envio duplicado.
7. Substituir notificações conflitantes por uma camada de adaptadores que permita migração gradual, sem remover o provedor de uma vez.
8. Criar imagens de reserva locais ou um tratamento controlado para imagens, removendo dependência de domínio externo.
9. Extrair uma estrutura base de página e padronizar títulos, cabeçalhos e contêineres.

## Arquivos Afetados

- `src/estruturas/estruturaAutenticada.jsx` (criar)
- `src/estruturas/estruturaPagina.jsx` (criar, se necessário)
- `src/componentes/base/` (criar)
- `src/components/SearchBar.jsx`
- `src/components/Sidebar.jsx`
- `src/components/Kpi.jsx`
- `src/components/KpiTransacoes.jsx`
- `src/components/Barra.jsx`
- `src/components/ItemCritico.jsx`
- `src/components/CardNotificacoes.jsx`
- `src/components/Notificacao.jsx`
- `src/components/ModalLista.jsx`
- `src/components/SessionToast.jsx`
- `src/components/CardProduto.jsx`
- `src/components/CardItemEstoque.jsx`
- `src/components/IntegracaoEstoqueAgendamento/CardProdutoIntegracao.jsx`
- `src/context/SidebarContext.jsx`
- `src/main.jsx`
- `src/router.jsx`
- Todas as páginas em `src/pages/` para migração de layout

## Critérios de Aceite

- Todas as páginas autenticadas usam a estrutura compartilhada e continuam acessíveis pelos mesmos caminhos.
- A navegação lateral, o conteúdo principal e a área de conteúdo não replicam marcação desnecessária.
- `SearchBar`, campos e botões funcionam com teclado, estados desabilitado/carregando e valores vazios.
- Feedback de erro e sucesso é exibido uma única vez por operação.
- Nenhum componente genérico acessa regra de negócio ou importa serviço de API.
- A aplicação mantém aparência e comportamento nos principais tamanhos de tela.
- Lint e build passam.
