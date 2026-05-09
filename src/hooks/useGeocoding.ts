import { useEffect, useState } from "react";
import type { GeoapifyFeature, Location } from "../types";
import { useDebounce } from "./useDebounce";

const KEY = import.meta.env.VITE_GEOAPIFY_KEY;

function featureToLocation(feature: GeoapifyFeature): Location | null {
  const p = feature.properties;
  if (!p.timezone?.name) return null;
  const name = p.city ?? p.name ?? "Unknown";
  return {
    id: p.place_id,
    name,
    state: p.state,
    country: p.country,
    lat: p.lat,
    lon: p.lon,
    timezone: p.timezone.name,
  };
}

export function useCitySearch(query: string) {
  const debounced = useDebounce(query.trim(), 300);
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (debounced.length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);

    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
      debounced,
    )}&type=city&limit=6&apiKey=${KEY}`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const features: GeoapifyFeature[] = data.features ?? [];
        setResults(features.map(featureToLocation).filter((l): l is Location => l !== null));
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debounced]);

  return { results, loading };
}

export async function reverseGeocode(lat: number, lon: number): Promise<Location | null> {
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const feature: GeoapifyFeature | undefined = data.features?.[0];
    if (!feature) return null;
    return featureToLocation(feature);
  } catch {
    return null;
  }
}
