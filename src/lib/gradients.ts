import type { WeatherGroup } from "./weatherCodes";

const SUNRISE_SUNSET = "from-orange-300 via-pink-400 to-purple-600";

const DAY: Record<WeatherGroup, string> = {
  clear: "from-sky-400 via-sky-500 to-blue-600",
  partly: "from-sky-400 via-sky-500 to-blue-600",
  cloudy: "from-slate-400 via-slate-500 to-slate-700",
  fog: "from-slate-300 via-slate-400 to-slate-600",
  drizzle: "from-slate-500 via-slate-600 to-slate-800",
  rain: "from-slate-600 via-slate-700 to-slate-900",
  snow: "from-slate-200 via-slate-300 to-slate-500",
  thunder: "from-slate-800 via-purple-900 to-slate-900",
};

const NIGHT: Record<WeatherGroup, string> = {
  clear: "from-slate-900 via-indigo-900 to-blue-950",
  partly: "from-slate-900 via-indigo-900 to-blue-950",
  cloudy: "from-slate-700 via-slate-800 to-slate-900",
  fog: "from-slate-700 via-slate-800 to-slate-900",
  drizzle: "from-slate-700 via-slate-800 to-slate-950",
  rain: "from-slate-700 via-slate-800 to-slate-950",
  snow: "from-slate-500 via-slate-600 to-slate-800",
  thunder: "from-slate-800 via-purple-900 to-slate-900",
};

function minutesBetween(a: Date, b: Date): number {
  return Math.abs((a.getTime() - b.getTime()) / 60000);
}

export function getGradient(
  group: WeatherGroup,
  isDay: boolean,
  now: Date,
  sunriseISO: string,
  sunsetISO: string,
): string {
  const sunrise = new Date(sunriseISO);
  const sunset = new Date(sunsetISO);
  const window = 45;
  if (minutesBetween(now, sunrise) <= window || minutesBetween(now, sunset) <= window) {
    return SUNRISE_SUNSET;
  }
  return isDay ? DAY[group] : NIGHT[group];
}
