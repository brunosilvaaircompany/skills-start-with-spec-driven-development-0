import { afterEach, describe, expect, it, vi } from "vitest";
import type { Location } from "../types/weather";
import { fetchWeather, searchLocations } from "./weather";

afterEach(() => vi.restoreAllMocks());

const location: Location = {
  id: 1,
  name: "São Paulo",
  latitude: -23.55,
  longitude: -46.63,
  country: "Brasil",
  country_code: "BR",
  admin1: "São Paulo",
};

describe("searchLocations", () => {
  it("CA1.2: busca até cinco localizações em português", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ results: [location] }), { status: 200 }),
      );

    await expect(searchLocations(" São Paulo ")).resolves.toEqual([location]);

    const url = new URL(fetchMock.mock.calls[0][0] as string);
    expect(url.hostname).toBe("geocoding-api.open-meteo.com");
    expect(url.searchParams.get("name")).toBe("São Paulo");
    expect(url.searchParams.get("count")).toBe("5");
    expect(url.searchParams.get("language")).toBe("pt");
  });

  it("não chama a rede para uma busca vazia", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    await expect(searchLocations("   ")).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("CA1.4: informa o status quando a geocodificação falha", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("", { status: 503 }),
    );
    await expect(searchLocations("São Paulo")).rejects.toThrow(/503/);
  });
});

describe("fetchWeather", () => {
  it("CA2.1-CA2.4, CA5.1-CA5.3: solicita e retorna clima atual e sete dias", async () => {
    const current = {
      temperature_2m: 24,
      apparent_temperature: 25,
      weather_code: 1,
      wind_speed_10m: 10,
      relative_humidity_2m: 62,
    };
    const daily = {
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
      weather_code: [0, 1, 2, 3, 45, 51, 61],
    };
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ current, daily }), { status: 200 }),
      );

    await expect(fetchWeather(location)).resolves.toEqual({
      location,
      current,
      daily,
    });

    expect(daily.time).toHaveLength(7);
    expect(new Set(daily.time).size).toBe(7);
    expect(new Set(daily.temperature_2m_max).size).toBe(7);
    expect(new Set(daily.temperature_2m_min).size).toBe(7);
    expect(new Set(daily.weather_code).size).toBe(7);

    const url = new URL(fetchMock.mock.calls[0][0] as string);
    expect(url.hostname).toBe("api.open-meteo.com");
    expect(url.searchParams.get("current")).toContain("temperature_2m");
    expect(url.searchParams.get("daily")).toBe(
      "temperature_2m_max,temperature_2m_min,weather_code",
    );
    expect(url.searchParams.get("forecast_days")).toBe("7");
    expect(url.searchParams.get("timezone")).toBe("auto");
  });

  it("CA2.6: informa o status quando a consulta do clima falha", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("", { status: 500 }),
    );
    await expect(fetchWeather(location)).rejects.toThrow(/500/);
  });
});
