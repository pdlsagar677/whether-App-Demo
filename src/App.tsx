import { useEffect, useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Menu } from "lucide-react";
import "./App.css";
import { SearchBar } from "./components/SearchBar";
import { WeatherCard } from "./components/WeatherCard";
import { HourlyStrip } from "./components/HourlyStrip";
import { DailyForecast } from "./components/DailyForecast";
import { SunTimes } from "./components/SunTimes";
import { DetailGrid } from "./components/DetailGrid";
import { CitiesDrawer } from "./components/CitiesDrawer";
import { useWeather } from "./hooks/useWeather";
import { useSavedCities } from "./hooks/useSavedCities";
import { useInitialLocation } from "./hooks/useGeolocation";
import { getWeatherInfo } from "./lib/weatherCodes";
import { getGradient } from "./lib/gradients";
import type { Location } from "./types";

function App() {
  const { saved, active, setActive, isSaved, toggleSaved, removeCity } = useSavedCities();
  const { location: initial } = useInitialLocation(active);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!active && initial) setActive(initial);
  }, [active, initial, setActive]);

  const currentLocation: Location | null = active ?? initial;
  const { data, loading, error } = useWeather(currentLocation);

  const gradient = useMemo(() => {
    if (!data) return "from-slate-700 via-slate-800 to-slate-900";
    const today = data.daily[0];
    const { group } = getWeatherInfo(data.current.weatherCode, data.current.isDay);
    return getGradient(group, data.current.isDay, new Date(), today.sunrise, today.sunset);
  }, [data]);

  const handleSelect = (loc: Location) => {
    setActive(loc);
  };

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-b ${gradient} transition-colors duration-700 text-white`}
    >
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 flex flex-col gap-4">
        <header className="flex items-center gap-3">
          <SearchBar onSelect={handleSelect} />
          {currentLocation ? (
            <button
              onClick={() => toggleSaved(currentLocation)}
              aria-label="Toggle saved"
              className="p-2.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/25 transition-colors"
            >
              {isSaved(currentLocation.id) ? (
                <BookmarkCheck className="w-5 h-5 text-white" />
              ) : (
                <Bookmark className="w-5 h-5 text-white" />
              )}
            </button>
          ) : null}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open saved cities"
            className="p-2.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/25 transition-colors"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        </header>

        {error ? (
          <div className="bg-red-500/20 border border-red-300/30 rounded-2xl p-4 text-sm">
            {error}
          </div>
        ) : null}

        {!data || !currentLocation ? (
          <div className="flex flex-col items-center justify-center py-32 text-white/80">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4" />
            <span className="text-sm">{loading ? "Loading weather..." : "Locating..."}</span>
          </div>
        ) : (
          <>
            <WeatherCard
              location={currentLocation}
              current={data.current}
              today={data.daily[0]}
            />
            <HourlyStrip hours={data.hourly} tempUnit={data.units.temperature} />
            <SunTimes sunrise={data.daily[0].sunrise} sunset={data.daily[0].sunset} />
            <DailyForecast days={data.daily} tempUnit={data.units.temperature} />
            <DetailGrid current={data.current} today={data.daily[0]} />
            <footer className="text-center text-xs text-white/50 py-4">
              Weather by Open-Meteo · Geocoding by Geoapify
            </footer>
          </>
        )}
      </div>

      <CitiesDrawer
        open={drawerOpen}
        saved={saved}
        activeId={currentLocation?.id}
        onClose={() => setDrawerOpen(false)}
        onSelect={handleSelect}
        onRemove={removeCity}
      />
    </div>
  );
}

export default App;
