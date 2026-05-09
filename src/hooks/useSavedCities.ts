import { useCallback, useEffect, useState } from "react";
import type { Location } from "../types";

const SAVED_KEY = "weather_app_saved_cities";
const ACTIVE_KEY = "weather_app_active_city";

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

export function useSavedCities() {
  const [saved, setSaved] = useState<Location[]>(() => read<Location[]>(SAVED_KEY) ?? []);
  const [active, setActiveState] = useState<Location | null>(() => read<Location>(ACTIVE_KEY));

  useEffect(() => {
    write(SAVED_KEY, saved);
  }, [saved]);

  useEffect(() => {
    if (active) write(ACTIVE_KEY, active);
  }, [active]);

  const addCity = useCallback((loc: Location) => {
    setSaved((prev) => (prev.some((c) => c.id === loc.id) ? prev : [...prev, loc]));
  }, []);

  const removeCity = useCallback((id: string) => {
    setSaved((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const setActive = useCallback((loc: Location) => {
    setActiveState(loc);
  }, []);

  const isSaved = useCallback((id: string) => saved.some((c) => c.id === id), [saved]);

  const toggleSaved = useCallback(
    (loc: Location) => {
      setSaved((prev) =>
        prev.some((c) => c.id === loc.id)
          ? prev.filter((c) => c.id !== loc.id)
          : [...prev, loc],
      );
    },
    [],
  );

  return { saved, active, setActive, addCity, removeCity, isSaved, toggleSaved };
}
