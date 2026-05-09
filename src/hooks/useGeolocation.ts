import { useEffect, useState } from "react";
import type { Location } from "../types";
import { reverseGeocode } from "./useGeocoding";

const DEFAULT_FALLBACK: Location = {
  id: "default-pokhara",
  name: "Pokhara",
  country: "Nepal",
  lat: 28.2096,
  lon: 83.9856,
  timezone: "Asia/Kathmandu",
};

interface Result {
  location: Location | null;
  status: "idle" | "locating" | "ready" | "error";
}

export function useInitialLocation(activeFromStorage: Location | null) {
  const [result, setResult] = useState<Result>({
    location: activeFromStorage,
    status: activeFromStorage ? "ready" : "idle",
  });

  useEffect(() => {
    if (activeFromStorage) return;
    if (!navigator.geolocation) {
      setResult({ location: DEFAULT_FALLBACK, status: "ready" });
      return;
    }

    setResult((r) => ({ ...r, status: "locating" }));
    let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        if (cancelled) return;
        setResult({ location: loc ?? DEFAULT_FALLBACK, status: "ready" });
      },
      () => {
        if (cancelled) return;
        setResult({ location: DEFAULT_FALLBACK, status: "ready" });
      },
      { timeout: 8000, maximumAge: 5 * 60 * 1000 },
    );

    return () => {
      cancelled = true;
    };
  }, [activeFromStorage]);

  return result;
}

export { DEFAULT_FALLBACK };
