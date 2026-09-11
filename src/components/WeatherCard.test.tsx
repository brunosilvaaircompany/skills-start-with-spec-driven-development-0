import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { WeatherData } from "../types/weather";
import { WeatherCard } from "./WeatherCard";

const weather: WeatherData = {
  location: {
    id: 1,
    name: "São Paulo",
    latitude: -23.55,
    longitude: -46.63,
    country: "Brasil",
    country_code: "BR",
    admin1: "São Paulo",
  },
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
    temperature_2m_max: [24, 25, 26, 22, 21, 23, 27],
    temperature_2m_min: [14, 15, 16, 13, 12, 14, 17],
    weather_code: [1, 2, 3, 45, 61, 80, 95],
  },
};

describe("WeatherCard", () => {
  it("CA2.1-CA2.4: apresenta os dados observáveis do clima atual", () => {
    render(<WeatherCard data={weather} />);

    const card = screen.getByLabelText("Clima atual para São Paulo");
    expect(card).toHaveTextContent("24°C");
    expect(card).toHaveTextContent("Sensação: 25°C");
    expect(card).toHaveTextContent("Principalmente limpo");
    expect(card).toHaveTextContent("Vento: 10 km/h");
    expect(card).toHaveTextContent("Umidade: 62%");
  });

  it("CA5.1-CA5.3: apresenta sete dias com data, temperaturas e condição WMO", () => {
    render(<WeatherCard data={weather} />);

    const forecast = screen.getByLabelText("Previsão de 7 dias para São Paulo");
    const entries = within(forecast).getAllByRole("listitem");

    expect(entries).toHaveLength(7);
    expect(entries[0]).toHaveTextContent("11/09/2026");
    expect(entries[0]).toHaveTextContent("Máx. 24°C");
    expect(entries[0]).toHaveTextContent("Mín. 14°C");
    expect(entries[0]).toHaveTextContent("Principalmente limpo");
    expect(entries[0]).toHaveTextContent("🌤️");
    expect(entries[4]).toHaveTextContent("15/09/2026");
    expect(entries[4]).toHaveTextContent("Máx. 21°C");
    expect(entries[4]).toHaveTextContent("Mín. 12°C");
    expect(entries[4]).toHaveTextContent("Chuva fraca");
    expect(entries[6]).toHaveTextContent("17/09/2026");
    expect(entries[6]).toHaveTextContent("Tempestade");
    expect(
      within(entries[6]).getByRole("img", { name: "Tempestade" }),
    ).toBeInTheDocument();
  });
});
