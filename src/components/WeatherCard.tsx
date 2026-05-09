import type { CurrentWeather, DailyEntry, Location } from "../types";
import { getWeatherInfo } from "../lib/weatherCodes";
import { GlassCard } from "./GlassCard";

interface Props {
  location: Location;
  current: CurrentWeather;
  today: DailyEntry;
}

export function WeatherCard({ location, current, today }: Props) {
  const { label, Icon } = getWeatherInfo(current.weatherCode, current.isDay);
  const tempUnit = current.units.temperature;

  return (
    <GlassCard className="p-8 flex flex-col items-center text-center">
      <div className="text-lg font-medium text-white/80 tracking-wide">
        {location.name}
        {location.country ? `, ${location.country}` : ""}
      </div>

      <Icon className="w-24 h-24 my-3 text-white drop-shadow-lg" strokeWidth={1.5} />

      <div className="text-7xl sm:text-8xl font-thin leading-none tracking-tight">
        {Math.round(current.temperature)}
        <span className="text-4xl align-top font-light">°</span>
      </div>

      <div className="text-xl font-medium text-white/90 mt-2">{label}</div>

      <div className="text-sm text-white/70 mt-1">
        Feels like {Math.round(current.apparentTemperature)}
        {tempUnit}
      </div>

      <div className="flex gap-4 mt-3 text-sm text-white/80">
        <span>H: {Math.round(today.tempMax)}{tempUnit}</span>
        <span>L: {Math.round(today.tempMin)}{tempUnit}</span>
      </div>
    </GlassCard>
  );
}
