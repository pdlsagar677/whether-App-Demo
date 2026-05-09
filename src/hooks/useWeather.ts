import { useEffect, useState } from "react";
import type { Location, WeatherData } from "../types";

const REFRESH_MS = 15 * 60 * 1000;

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
    is_day: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    uv_index: number;
  };
  current_units: {
    temperature_2m: string;
    wind_speed_10m: string;
    relative_humidity_2m: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    is_day: number[];
    precipitation_probability: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    precipitation_probability_max: number[];
  };
}

function buildUrl(loc: Location): string {
  const params = new URLSearchParams({
    latitude: String(loc.lat),
    longitude: String(loc.lon),
    current:
      "temperature_2m,apparent_temperature,weather_code,is_day,relative_humidity_2m,wind_speed_10m,uv_index",
    hourly: "temperature_2m,weather_code,is_day,precipitation_probability",
    daily:
      "temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset,uv_index_max,precipitation_probability_max",
    timezone: "auto",
    forecast_days: "7",
  });
  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
}

function shape(raw: OpenMeteoResponse): WeatherData {
  const nowMs = Date.now();
  const startIdx = Math.max(
    0,
    raw.hourly.time.findIndex((t) => new Date(t).getTime() >= nowMs - 30 * 60 * 1000),
  );
  const slice = (start: number, end: number) => ({ start, end });
  const { start, end } = slice(startIdx, startIdx + 24);

  return {
    current: {
      temperature: raw.current.temperature_2m,
      apparentTemperature: raw.current.apparent_temperature,
      weatherCode: raw.current.weather_code,
      isDay: raw.current.is_day === 1,
      humidity: raw.current.relative_humidity_2m,
      windSpeed: raw.current.wind_speed_10m,
      uvIndex: raw.current.uv_index,
      units: {
        temperature: raw.current_units.temperature_2m,
        windSpeed: raw.current_units.wind_speed_10m,
        humidity: raw.current_units.relative_humidity_2m,
      },
    },
    hourly: raw.hourly.time.slice(start, end).map((time, i) => ({
      time,
      temperature: raw.hourly.temperature_2m[start + i],
      weatherCode: raw.hourly.weather_code[start + i],
      isDay: raw.hourly.is_day[start + i] === 1,
      precipitationProbability: raw.hourly.precipitation_probability[start + i] ?? 0,
    })),
    daily: raw.daily.time.map((date, i) => ({
      date,
      tempMax: raw.daily.temperature_2m_max[i],
      tempMin: raw.daily.temperature_2m_min[i],
      weatherCode: raw.daily.weather_code[i],
      sunrise: raw.daily.sunrise[i],
      sunset: raw.daily.sunset[i],
      uvIndexMax: raw.daily.uv_index_max[i],
      precipitationProbability: raw.daily.precipitation_probability_max[i] ?? 0,
    })),
    units: {
      temperature: raw.current_units.temperature_2m,
      windSpeed: raw.current_units.wind_speed_10m,
    },
  };
}

export function useWeather(location: Location | null) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) return;
    let cancelled = false;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(buildUrl(location));
        if (!res.ok) throw new Error(`Weather request failed: ${res.status}`);
        const raw = (await res.json()) as OpenMeteoResponse;
        if (!cancelled) setData(shape(raw));
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to fetch weather");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchWeather();
    const id = setInterval(fetchWeather, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [location]);

  return { data, loading, error };
}
