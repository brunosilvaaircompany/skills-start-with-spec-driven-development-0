# Loop de feedback: previsão de 7 dias

## Comandos e estados

| Comando | Estado |
|---|---|
| `pnpm lint` | verde |
| `pnpm build` | verde |
| `pnpm test` | verde |
| `pnpm test:e2e` | verde |

## Evidências

- `pnpm lint`: Biome verificou 28 arquivos sem aplicar correções.
- `pnpm build`: TypeScript compilou e o bundle Vite foi produzido com sucesso.
- `pnpm test`: 6 arquivos e 23 testes Vitest passaram.
- `pnpm test:e2e`: 3 de 5 cenários passaram. O cenário F5 esperava `Nublado` para o código WMO 3, mas a aplicação apresentou `Encoberto`. O cenário CA2.5 não encontrou o card de clima atual depois de liberar o forecast.
- `pnpm validate:sdd feedback`: passou.
- `pnpm validate:sdd full`: vermelho porque `e2e/search.spec.ts` não possui referências textuais explícitas a `CA5.1`, `CA5.2` e `CA5.3`.
- Revalidação: `pnpm test:e2e` passou com 5 de 5 cenários; `pnpm lint`, `pnpm build`, `pnpm test`, `pnpm validate:sdd feedback` e `pnpm validate:sdd full` também passaram. A suíte Vitest terminou com 6 arquivos e 23 testes aprovados.

## Critérios afetados

CA5.3 é afetado pelo primeiro sintoma: a expectativa do teste não corresponde à descrição WMO já definida para o código 3. CA2.5 é afetado pelo segundo sintoma: o fixture específico do cenário de loading ainda não contém `daily`, embora o card integrado agora dependa desse contrato. CA5.1 e CA5.2 não chegaram a falhar nas asserções do cenário F5.

## Decisão de planejamento

O contrato da Spec permanece adequado e não exige alteração. O Plan deve orientar dois ajustes mínimos antes da implementação: alinhar a expectativa do teste ao vocabulário WMO existente (`Encoberto`) e reutilizar no fixture de loading uma resposta diária válida com sete entradas. Depois disso, repetir o E2E e executar novamente a validação completa.

A validação da rastreabilidade acrescenta um terceiro ajuste mínimo: nomear o
cenário com as âncoras `CA5.1`, `CA5.2` e `CA5.3`, deixando explícita a relação
entre as asserções e os critérios sem alterar o comportamento observado.

## Artefatos alterados

- `e2e/search.spec.ts`: fixture diário e cenário E2E de F5, ainda com os sintomas registrados acima.
- `plans/weather-app-plan.md`: seção de iteração por feedback adicionada.
- `plans/weather-app-plan.md`: retorno adicional da validação full registrado.
- `tasks/weather-app-tasks.md`: T9 e T10 marcadas como concluídas antes desta iteração; T11 permanece pendente.
- `feedback/7-day-forecast-loop.md`: este registro.

## Resultado da revalidação

O loop terminou verde após os ajustes planejados. E2E, lint, build, Vitest,
`validate:sdd feedback` e `validate:sdd full` passaram; T11 pode ser concluída.
