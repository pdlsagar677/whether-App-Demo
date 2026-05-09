import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className = "" }: Props) {
  return (
    <div
      className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-xl text-white ${className}`}
    >
      {children}
    </div>
  );
}
