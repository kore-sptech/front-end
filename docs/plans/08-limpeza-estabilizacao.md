# Etapa 7 — Limpeza, padronização e estabilização final

## Diagnóstico Atual

Após as migrações incrementais, podem permanecer importações antigas, serviços duplicados, componentes legados, `console.log`, nomes ambíguos e documentação divergente. A existência de `react-hook-form`, resolvers e `react-hot-toast` no `package.json` sem uso efetivo também precisa ser revisada. O README descreve funcionalidades que não correspondem totalmente ao código atual.

## Objetivo da Refatoração

Remover legado com segurança, consolidar o padrão arquitetural e entregar uma base sustentável e mantível, sem alterar as integrações ou o comportamento aprovado nas etapas anteriores.

## Passo a Passo de Execução

1. Executar busca por importações de `api`, `fetch`, URLs absolutas, cabeçalhos manuais, `localStorage.clear`, `window.location.reload` e `console.log`.
2. Remover serviços, hooks, componentes e constantes que não tenham mais consumidores.
3. Consolidar nomes de entidades, status, propriedades e mensagens de erro.
4. Revisar dependências do `package.json` e remover apenas pacotes comprovadamente não utilizados, atualizando o arquivo de bloqueio das dependências.
5. Atualizar o README com arquitetura, scripts, variáveis de ambiente, validação manual e limitações conhecidas.
6. Corrigir acessibilidade básica de componentes compartilhados: labels, foco de modal, teclado, contraste e estados anunciados.
7. Executar revisão de todos os corpos de requisição contra o backend e registrar diferenças que não puderem ser corrigidas.
8. Fazer build de produção, verificações manuais e validação dos fluxos críticos em ambiente configurado.
9. Criar uma lista de reversão por etapa e confirmar que cada mudança pode ser desfeita sem afetar mudanças posteriores.
10. Revisar a dívida remanescente e criar planos separados para itens fora do escopo.

## Arquivos Afetados

- Todos os arquivos alterados nos sprints anteriores
- `src/utils/`
- `src/servicos/`
- `src/hooks/`
- `src/componentes/`
- `src/estruturas/`
- `src/providers/`
- `src/main.jsx`
- `src/router.jsx`
- `package.json`
- `package-lock.json`
- `README.md`
- `.env.example` e arquivos de configuração, se aplicável

## Critérios de Aceite

- Não existem URLs absolutas de API na aplicação, exceto valores padrão controlados de configuração.
- Não existem cabeçalhos de autorização duplicados nem chamadas de API em componentes de apresentação.
- Dependências não utilizadas foram removidas ou justificadas.
- README, scripts e estrutura real do projeto estão alinhados.
- Lint, validações manuais e build de produção passam.
- Login, produtos, estoque, transações, agendamentos, envio de imagens e notificações foram validados em ambiente integrado.
- A estratégia de reversão de cada etapa está documentada e não exige alteração do backend.
- A dívida restante possui responsável, impacto e plano futuro, sem misturar escopo de manutenção com funcionalidades novas.
