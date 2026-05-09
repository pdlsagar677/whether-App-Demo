import { Sunrise, Sunset } from "lucide-react";
import { convertTimeToAMPM } from "../lib/format";
import { GlassCard } from "./GlassCard";

interface Props {
  sunrise: string;
  sunset: string;
}

export function SunTimes({ sunrise, sunset }: Props) {
  return (
    <GlassCard className="p-4 flex justify-around items-center">
      <div className="flex flex-col items-center gap-1">
        <Sunrise className="w-7 h-7 text-orange-200" strokeWidth={1.5} />
        <span className="text-xs uppercase tracking-wider text-white/60">Sunrise</span>
        <span className="text-base font-semibold">{convertTimeToAMPM(sunrise)}</span>
      </div>

      <div className="w-px h-12 bg-white/15" />

      <div className="flex flex-col items-center gap-1">
        <Sunset className="w-7 h-7 text-orange-300" strokeWidth={1.5} />
        <span className="text-xs uppercase tracking-wider text-white/60">Sunset</span>
        <span className="text-base font-semibold">{convertTimeToAMPM(sunset)}</span>
      </div>
    </GlassCard>
  );
}
