import { Droplets, Wind, Sun, CloudRain, type LucideIcon } from "lucide-react";
import type { CurrentWeather, DailyEntry } from "../types";
import { GlassCard } from "./GlassCard";

interface Props {
  current: CurrentWeather;
  today: DailyEntry;
}

interface TileProps {
  Icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
}

function Tile({ Icon, label, value, hint }: TileProps) {
  return (
    <GlassCard className="p-4 flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/60">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {hint ? <div className="text-xs text-white/60">{hint}</div> : null}
    </GlassCard>
  );
}

function uvHint(uv: number): string {
  if (uv < 3) return "Low";
  if (uv < 6) return "Moderate";
  if (uv < 8) return "High";
  if (uv < 11) return "Very high";
  return "Extreme";
}

export function DetailGrid({ current, today }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Tile
        Icon={Droplets}
        label="Humidity"
        value={`${current.humidity}${current.units.humidity}`}
      />
      <Tile
        Icon={Wind}
        label="Wind"
        value={`${Math.round(current.windSpeed)} ${current.units.windSpeed}`}
      />
      <Tile
        Icon={Sun}
        label="UV index"
        value={`${Math.round(current.uvIndex)}`}
        hint={uvHint(current.uvIndex)}
      />
      <Tile
        Icon={CloudRain}
        label="Rain chance"
        value={`${today.precipitationProbability}%`}
        hint="Today's max"
      />
    </div>
  );
}
