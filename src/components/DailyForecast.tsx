import type { DailyEntry } from "../types";
import { getWeatherInfo } from "../lib/weatherCodes";
import { getShortDay } from "../lib/format";
import { GlassCard } from "./GlassCard";
import { Droplets } from "lucide-react";

interface Props {
  days: DailyEntry[];
  tempUnit: string;
}

export function DailyForecast({ days, tempUnit }: Props) {
  const allMin = Math.min(...days.map((d) => d.tempMin));
  const allMax = Math.max(...days.map((d) => d.tempMax));
  const range = Math.max(1, allMax - allMin);

  return (
    <GlassCard className="p-4">
      <div className="px-2 pb-2 text-xs font-medium text-white/60 uppercase tracking-wider">
        7-day forecast
      </div>
      <div className="flex flex-col divide-y divide-white/10">
        {days.map((d, i) => {
          const { Icon } = getWeatherInfo(d.weatherCode, true);
          const startPct = ((d.tempMin - allMin) / range) * 100;
          const widthPct = ((d.tempMax - d.tempMin) / range) * 100;

          return (
            <div key={d.date} className="flex items-center gap-3 py-3 px-2">
              <span className="w-14 text-base font-semibold">{getShortDay(d.date, i === 0)}</span>

              <div className="flex items-center gap-1 w-12">
                <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                {d.precipitationProbability > 20 ? (
                  <span className="flex items-center text-[10px] text-sky-200">
                    <Droplets className="w-3 h-3" />
                    {d.precipitationProbability}%
                  </span>
                ) : null}
              </div>

              <span className="w-10 text-right text-sm text-white/70">
                {Math.round(d.tempMin)}°
              </span>

              <div className="flex-1 h-1.5 bg-white/15 rounded-full relative">
                <div
                  className="absolute h-full bg-gradient-to-r from-cyan-300 via-yellow-300 to-orange-400 rounded-full"
                  style={{ left: `${startPct}%`, width: `${widthPct}%` }}
                />
              </div>

              <span className="w-10 text-sm font-semibold">
                {Math.round(d.tempMax)}
                {tempUnit}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
