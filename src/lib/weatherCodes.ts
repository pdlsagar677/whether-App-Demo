import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudLightning,
  Snowflake,
  type LucideIcon,
} from "lucide-react";

export type WeatherGroup =
  | "clear"
  | "partly"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "thunder";

interface WeatherInfo {
  label: string;
  group: WeatherGroup;
  dayIcon: LucideIcon;
  nightIcon: LucideIcon;
}

const CODE_MAP: Record<number, WeatherInfo> = {
  0: { label: "Clear sky", group: "clear", dayIcon: Sun, nightIcon: Moon },
  1: { label: "Mainly clear", group: "clear", dayIcon: CloudSun, nightIcon: CloudMoon },
  2: { label: "Partly cloudy", group: "partly", dayIcon: CloudSun, nightIcon: CloudMoon },
  3: { label: "Overcast", group: "cloudy", dayIcon: Cloud, nightIcon: Cloud },
  45: { label: "Fog", group: "fog", dayIcon: CloudFog, nightIcon: CloudFog },
  48: { label: "Rime fog", group: "fog", dayIcon: CloudFog, nightIcon: CloudFog },
  51: { label: "Light drizzle", group: "drizzle", dayIcon: CloudDrizzle, nightIcon: CloudDrizzle },
  53: { label: "Drizzle", group: "drizzle", dayIcon: CloudDrizzle, nightIcon: CloudDrizzle },
  55: { label: "Heavy drizzle", group: "drizzle", dayIcon: CloudDrizzle, nightIcon: CloudDrizzle },
  56: { label: "Freezing drizzle", group: "drizzle", dayIcon: CloudDrizzle, nightIcon: CloudDrizzle },
  57: { label: "Heavy freezing drizzle", group: "drizzle", dayIcon: CloudDrizzle, nightIcon: CloudDrizzle },
  61: { label: "Light rain", group: "rain", dayIcon: CloudRain, nightIcon: CloudRain },
  63: { label: "Rain", group: "rain", dayIcon: CloudRain, nightIcon: CloudRain },
  65: { label: "Heavy rain", group: "rain", dayIcon: CloudRainWind, nightIcon: CloudRainWind },
  66: { label: "Freezing rain", group: "rain", dayIcon: CloudRainWind, nightIcon: CloudRainWind },
  67: { label: "Heavy freezing rain", group: "rain", dayIcon: CloudRainWind, nightIcon: CloudRainWind },
  71: { label: "Light snow", group: "snow", dayIcon: CloudSnow, nightIcon: CloudSnow },
  73: { label: "Snow", group: "snow", dayIcon: CloudSnow, nightIcon: CloudSnow },
  75: { label: "Heavy snow", group: "snow", dayIcon: CloudSnow, nightIcon: CloudSnow },
  77: { label: "Snow grains", group: "snow", dayIcon: Snowflake, nightIcon: Snowflake },
  80: { label: "Rain showers", group: "rain", dayIcon: CloudRain, nightIcon: CloudRain },
  81: { label: "Rain showers", group: "rain", dayIcon: CloudRain, nightIcon: CloudRain },
  82: { label: "Heavy rain showers", group: "rain", dayIcon: CloudRainWind, nightIcon: CloudRainWind },
  85: { label: "Snow showers", group: "snow", dayIcon: CloudSnow, nightIcon: CloudSnow },
  86: { label: "Heavy snow showers", group: "snow", dayIcon: CloudSnow, nightIcon: CloudSnow },
  95: { label: "Thunderstorm", group: "thunder", dayIcon: CloudLightning, nightIcon: CloudLightning },
  96: { label: "Thunderstorm w/ hail", group: "thunder", dayIcon: CloudLightning, nightIcon: CloudLightning },
  99: { label: "Heavy thunderstorm", group: "thunder", dayIcon: CloudLightning, nightIcon: CloudLightning },
};

const FALLBACK: WeatherInfo = {
  label: "Unknown",
  group: "cloudy",
  dayIcon: Cloud,
  nightIcon: Cloud,
};

export function getWeatherInfo(code: number, isDay: boolean) {
  const info = CODE_MAP[code] ?? FALLBACK;
  return {
    label: info.label,
    group: info.group,
    Icon: isDay ? info.dayIcon : info.nightIcon,
  };
}
