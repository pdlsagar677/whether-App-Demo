import type { HourlyEntry } from "../types";
import { getWeatherInfo } from "../lib/weatherCodes";
import { getHourLabel } from "../lib/format";
import { GlassCard } from "./GlassCard";
import { Droplets } from "lucide-react";

interface Props {
  hours: HourlyEntry[];
  tempUnit: string;
}

export function HourlyStrip({ hours, tempUnit }: Props) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 px-2 pb-2 text-xs font-medium text-white/60 uppercase tracking-wider">
        <span>Hourly forecast</span>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {hours.map((h, i) => {
          const { Icon } = getWeatherInfo(h.weatherCode, h.isDay);
          return (
            <div
              key={h.time}
              className="flex flex-col items-center gap-2 min-w-[64px] py-2 px-1"
            >
              <span className="text-sm font-medium text-white/90">
                {getHourLabel(h.time, i === 0)}
              </span>
              <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
              {h.precipitationProbability > 0 ? (
                <span className="flex items-center gap-0.5 text-[11px] text-sky-200">
                  <Droplets className="w-3 h-3" />
                  {h.precipitationProbability}%
                </span>
              ) : (
                <span className="text-[11px] text-transparent">.</span>
              )}
              <span className="text-base font-semibold">
                {Math.round(h.temperature)}
                {tempUnit}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
