# Tasks: Weather App

## Baseline concluída

| ID | Entrega | Critério de feito | Rastreia | Estado |
|---|---|---|---|---|
| T1 | Tipos do domínio | `Location`, `WeatherData` e `AsyncState` compilam em strict mode | Plano: modelo de dados | Concluída |
| T2 | Funções de temperatura | Conversão e formatação possuem testes unitários | CA3.1–CA3.4 | Concluída |
| T3 | Mapeamento WMO | Descrição, emoji e fallback possuem testes unitários | CA4.1–CA4.3 | Concluída |
| T4 | Serviço Open-Meteo | Busca e clima atual tratam sucesso e erro HTTP | CA1.2, CA1.4, CA2.1–CA2.6 | Concluída |
| T5 | Estado assíncrono | Hook expõe busca, seleção, loading, sucesso e erro | CA1.3, CA2.5, CA2.6 | Concluída |
| T6 | Busca acessível | Campo, botão e resultados seguem o contrato observável | CA1.1–CA1.4 | Concluída |
| T7 | Card de clima atual | Card apresenta todos os dados da F2 | CA2.1–CA2.4 | Concluída |
| T8 | Fluxo integrado | Busca, seleção e clima atual passam no E2E determinístico | CA1.1–CA2.6 | Concluída |

## Regra para incrementos

Novas tasks são adicionadas sem reescrever as concluídas. Cada task nova precisa
de ID único, dependências, superfícies afetadas, critério de feito e CA rastreado.

## Incremento F5: previsão diária de 7 dias

| ID | Entrega | Depende de | Superfícies afetadas | Critério de feito | Rastreia | Estado |
|---|---|---|---|---|---|---|
| T9 | Contrato e serviço diário | T4, delta F5 do planejamento | `src/types/weather.ts`, `src/services/weather.ts`, `src/services/weather.test.ts` | Teste focado prova parâmetros da Open-Meteo, sete dias e o retorno diário sem regredir `current` | CA5.1, CA5.2, CA5.3 | Concluída |
| T10 | Apresentação da previsão | T9 | `src/components/WeatherCard.tsx`, `src/components/WeatherCard.test.tsx` | Teste de componente prova sete entradas acessíveis, cada uma com máxima, mínima e condição WMO; F2 permanece verde | CA5.1, CA5.2, CA5.3 | Concluída |
| T11 | Jornada e validação completa | T10 | `e2e/search.spec.ts`, suíte e build | E2E interceptado prova F5 após busca e seleção; lint, build e todas as suítes ficam verdes | CA5.1, CA5.2, CA5.3 | Concluída |