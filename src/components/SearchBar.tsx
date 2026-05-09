import { useEffect, useRef, useState } from "react";
import { MapPin, Search, X } from "lucide-react";
import { useCitySearch } from "../hooks/useGeocoding";
import type { Location } from "../types";

interface Props {
  onSelect: (loc: Location) => void;
}

export function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { results, loading } = useCitySearch(query);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSelect = (loc: Location) => {
    onSelect(loc);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md">
      <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white">
        <Search className="w-4 h-4 text-white/70 shrink-0" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search city..."
          className="bg-transparent flex-1 outline-none placeholder:text-white/60 text-sm"
        />
        {query ? (
          <button
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="text-white/70 hover:text-white"
            aria-label="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {open && query.length >= 2 ? (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl text-white overflow-hidden z-30">
          {loading && results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-white/70">Searching...</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-white/70">No matches</div>
          ) : (
            results.map((r) => (
              <button
                key={r.id}
                onClick={() => handleSelect(r)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors"
              >
                <MapPin className="w-4 h-4 text-white/70 shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{r.name}</div>
                  <div className="text-xs text-white/60 truncate">
                    {[r.state, r.country].filter(Boolean).join(", ")}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
