import { formatTemperature } from "../lib/temperature";
import { getWmoDescription, getWmoEmoji } from "../lib/wmo";
import type { WeatherData } from "../types/weather";

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  const { location, current } = data;
  const description = getWmoDescription(current.weather_code);
  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${date}T00:00:00Z`));

  return (
    <section
      className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
      aria-label={`Clima atual para ${location.name}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{location.name}</h2>
          <p className="text-sm text-gray-500">
            {location.admin1 ? `${location.admin1}, ` : ""}
            {location.country}
          </p>
        </div>
        <span className="text-5xl" role="img" aria-label={description}>
          {getWmoEmoji(current.weather_code)}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-6xl font-light text-gray-800">
          {formatTemperature(current.temperature_2m, "C")}
        </p>
        <p className="mt-1 text-gray-500">
          Sensação: {formatTemperature(current.apparent_temperature, "C")}
        </p>
        <p className="mt-1 text-gray-600">{description}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
        <p>
          <span className="font-medium">Vento:</span>{" "}
          {Math.round(current.wind_speed_10m)} km/h
        </p>
        <p>
          <span className="font-medium">Umidade:</span>{" "}
          {current.relative_humidity_2m}%
        </p>
      </div>

      <section
        className="mt-6 border-t border-gray-100 pt-4"
        aria-label={`Previsão de 7 dias para ${location.name}`}
      >
        <h3 className="text-lg font-semibold text-gray-800">Próximos 7 dias</h3>
        <ul className="mt-3 space-y-3">
          {data.daily.time.map((date, index) => {
            const dailyDescription = getWmoDescription(
              data.daily.weather_code[index],
            );

            return (
              <li
                className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-sm text-gray-600"
                key={date}
              >
                <time dateTime={date}>{formatDate(date)}</time>
                <span>
                  Máx.{" "}
                  {formatTemperature(data.daily.temperature_2m_max[index], "C")}
                </span>
                <span>
                  Mín.{" "}
                  {formatTemperature(data.daily.temperature_2m_min[index], "C")}
                </span>
                <span className="col-span-3 flex items-center gap-2">
                  <span role="img" aria-label={dailyDescription}>
                    {getWmoEmoji(data.daily.weather_code[index])}
                  </span>
                  {dailyDescription}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </section>
  );
}
