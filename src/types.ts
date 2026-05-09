export interface Location {
  id: string;
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
  timezone: string;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  isDay: boolean;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  units: {
    temperature: string;
    windSpeed: string;
    humidity: string;
  };
}

export interface HourlyEntry {
  time: string;
  temperature: number;
  weatherCode: number;
  isDay: boolean;
  precipitationProbability: number;
}

export interface DailyEntry {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationProbability: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyEntry[];
  daily: DailyEntry[];
  units: {
    temperature: string;
    windSpeed: string;
  };
}

export interface GeoapifyFeature {
  properties: {
    place_id: string;
    city?: string;
    name?: string;
    state?: string;
    country: string;
    lat: number;
    lon: number;
    timezone?: { name: string };
  };
}
