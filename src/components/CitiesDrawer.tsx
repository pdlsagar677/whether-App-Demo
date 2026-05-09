import { X, MapPin, Trash2 } from "lucide-react";
import type { Location } from "../types";

interface Props {
  open: boolean;
  saved: Location[];
  activeId: string | undefined;
  onClose: () => void;
  onSelect: (loc: Location) => void;
  onRemove: (id: string) => void;
}

export function CitiesDrawer({ open, saved, activeId, onClose, onSelect, onRemove }: Props) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white/15 backdrop-blur-xl border-l border-white/20 z-50 text-white transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/15">
          <h2 className="text-lg font-semibold">Saved cities</h2>
          <button onClick={onClose} aria-label="Close" className="p-2 hover:bg-white/10 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {saved.length === 0 ? (
            <div className="p-6 text-center text-sm text-white/70">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-white/40" />
              No saved cities yet.
              <br />
              Tap the bookmark icon to save the current city.
            </div>
          ) : (
            <ul className="p-3 space-y-2">
              {saved.map((c) => (
                <li
                  key={c.id}
                  className={`flex items-center gap-2 rounded-2xl border transition-colors ${
                    activeId === c.id
                      ? "bg-white/20 border-white/30"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelect(c);
                      onClose();
                    }}
                    className="flex-1 flex items-center gap-3 p-3 text-left min-w-0"
                  >
                    <MapPin className="w-4 h-4 shrink-0 text-white/70" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{c.name}</div>
                      <div className="text-xs text-white/60 truncate">
                        {[c.state, c.country].filter(Boolean).join(", ")}
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => onRemove(c.id)}
                    aria-label={`Remove ${c.name}`}
                    className="p-3 text-white/60 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
