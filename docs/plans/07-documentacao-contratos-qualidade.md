# Etapa 6 — Documentação, contratos e validação manual

## Diagnóstico Atual

Não há `tsconfig.json` nem comando de verificação de tipos. A aplicação depende de contratos implícitos de API e propriedades como `nome`, `produtoNome`, `referencias`, `quantidade` e `qtdMinAlerta`, que são interpretadas em vários arquivos. A documentação atual também não diferencia claramente funcionalidades integradas, fluxos simulados e decisões de arquitetura.

A validação desta etapa será feita por lint, build e por um roteiro manual dos fluxos críticos.

## Objetivo da Refatoração

Melhorar a documentação dos contratos, organizar a tipagem gradual quando necessária e estabelecer um roteiro manual de validação. O foco é reduzir a dependência de conhecimento implícito sem adicionar dependências desnecessárias.

## Passo a Passo de Execução

1. Documentar os contratos dos serviços: rota, método, parâmetros, corpo da requisição, resposta e erros esperados.
2. Adicionar comentários de documentação ou JSDoc, quando útil, para explicar a finalidade das funções públicas e os formatos de dados.
3. Se TypeScript for aprovado futuramente, planejar a migração gradual de `config`, `servicos`, `utils` e `hooks`, mantendo `allowJs` durante a transição.
4. Atualizar o README com a arquitetura, os scripts, as variáveis de ambiente, a distinção entre dados reais e dados simulados e as limitações conhecidas.
5. Criar um roteiro manual para validar login, cadastro, produtos, estoque, transações, agendamentos, envio de imagens e notificações.
6. Registrar no roteiro as respostas esperadas da API, estados de carregamento, erros, cancelamentos e sessões expiradas.
7. Revisar nomenclatura de entidades, status e propriedades, evitando nomes ambíguos entre quantidade atual e quantidade mínima de alerta.
8. Criar ou atualizar scripts de lint e build, mantendo a lista de dependências sob controle.
9. Fazer a revisão de acessibilidade e dos retornos visuais durante a validação manual.

## Arquivos Afetados

- `package.json`, somente se for necessário ajustar scripts de lint/build
- `vite.config.js`, somente se necessário para a validação
- `src/config/`
- `src/servicos/`
- `src/utils/`
- `src/hooks/`
- `eslint.config.js`
- `README.md`
- Documentação de contratos em `docs/` ou no próprio módulo, conforme o padrão adotado

## Critérios de Aceite

- `npm run lint` e `npm run build` passam.
- Os contratos de API estão documentados e podem ser conferidos contra o backend.
- O roteiro manual cobre os fluxos críticos e registra os resultados esperados.
- A documentação diferencia dados reais, dados simulados e protótipos.
- A migração de tipos, se realizada futuramente, não altera os corpos de requisição enviados ao backend.
- O código novo e a documentação são escritos em português.
