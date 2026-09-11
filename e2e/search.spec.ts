import { type Page, expect, test } from "@playwright/test";

const location = {
  id: 1,
  name: "São Paulo",
  latitude: -23.55,
  longitude: -46.63,
  country: "Brasil",
  country_code: "BR",
  admin1: "São Paulo",
};

const forecast = {
  current: {
    temperature_2m: 24,
    apparent_temperature: 25,
    weather_code: 1,
    wind_speed_10m: 10,
    relative_humidity_2m: 62,
  },
  daily: {
    time: [
      "2026-09-11",
      "2026-09-12",
      "2026-09-13",
      "2026-09-14",
      "2026-09-15",
      "2026-09-16",
      "2026-09-17",
    ],
    temperature_2m_max: [24, 25, 26, 27, 28, 29, 30],
    temperature_2m_min: [14, 15, 16, 17, 18, 19, 20],
    weather_code: [0, 1, 2, 3, 45, 61, 95],
  },
};

test.beforeEach(async ({ page }) => {
  await page.route("**/v1/search?**", (route) =>
    route.fulfill({ json: { results: [location] } }),
  );
  await page.route("**/v1/forecast?**", (route) =>
    route.fulfill({ json: forecast }),
  );
  await page.goto("/");
});

async function searchAndSelectCity(page: Page) {
  await page
    .getByRole("searchbox", { name: "Nome da cidade" })
    .fill("São Paulo");
  await page.getByRole("button", { name: "Buscar" }).click();
  await page
    .getByRole("button", { name: "Selecionar São Paulo, Brasil" })
    .click();
}

test("baseline: busca uma cidade e apresenta o clima atual", async ({
  page,
}) => {
  await searchAndSelectCity(page);

  const card = page.getByLabel("Clima atual para São Paulo");
  await expect(card).toBeVisible();
  await expect(card).toContainText("24°C");
  await expect(card).toContainText("Principalmente limpo");
  await expect(card).toContainText("Vento: 10 km/h");
  await expect(card).toContainText("Umidade: 62%");
});

test("CA5.1, CA5.2 e CA5.3: apresenta a previsão após buscar e selecionar", async ({
  page,
}) => {
  await searchAndSelectCity(page);

  const forecastRegion = page.getByLabel("Previsão de 7 dias para São Paulo");
  const days = forecastRegion.getByRole("listitem");
  const descriptions = [
    "Céu limpo",
    "Principalmente limpo",
    "Parcialmente nublado",
    "Encoberto",
    "Névoa",
    "Chuva fraca",
    "Tempestade",
  ];

  await expect(forecastRegion).toBeVisible();
  await expect(days).toHaveCount(7);

  for (let index = 0; index < 7; index += 1) {
    await expect(days.nth(index)).toContainText(
      `${String(forecast.daily.time[index]).slice(8, 10)}/${String(
        forecast.daily.time[index],
      ).slice(5, 7)}/2026`,
    );
    await expect(days.nth(index)).toContainText(
      `Máx. ${forecast.daily.temperature_2m_max[index]}°C`,
    );
    await expect(days.nth(index)).toContainText(
      `Mín. ${forecast.daily.temperature_2m_min[index]}°C`,
    );
    await expect(days.nth(index).getByRole("img")).toHaveAccessibleName(
      descriptions[index],
    );
    await expect(days.nth(index)).toContainText(descriptions[index]);
  }
});

test("CA1.4: apresenta erro quando a busca de cidades falha", async ({
  page,
}) => {
  await page.unroute("**/v1/search?**");
  await page.route("**/v1/search?**", (route) =>
    route.fulfill({ status: 500 }),
  );

  await page
    .getByRole("searchbox", { name: "Nome da cidade" })
    .fill("São Paulo");
  await page.getByRole("button", { name: "Buscar" }).click();

  await expect(page.getByRole("alert")).toHaveText(
    "Erro ao buscar localização: 500",
  );
});

test("CA2.5: apresenta loading enquanto consulta o clima", async ({ page }) => {
  await page.unroute("**/v1/forecast?**");
  let releaseForecast: () => void = () => {};
  const forecastRelease = new Promise<void>((resolve) => {
    releaseForecast = resolve;
  });
  await page.route("**/v1/forecast?**", async (route) => {
    await forecastRelease;
    await route.fulfill({ json: forecast });
  });

  const selection = searchAndSelectCity(page);
  await expect(page.getByText("Carregando clima...")).toBeVisible();
  releaseForecast();
  await selection;
  await expect(page.getByLabel("Clima atual para São Paulo")).toBeVisible();
});

test("CA2.6: apresenta erro quando a consulta do clima falha", async ({
  page,
}) => {
  await page.unroute("**/v1/forecast?**");
  await page.route("**/v1/forecast?**", (route) =>
    route.fulfill({ status: 503 }),
  );

  await searchAndSelectCity(page);

  await expect(page.getByRole("alert")).toHaveText("Erro ao buscar clima: 503");
});
