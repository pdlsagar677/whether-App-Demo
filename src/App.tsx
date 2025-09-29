import { useEffect, useState } from "react";
import "./App.css";
// import { fetchWeatherApi } from "openmeteo";
import { WiHumidity } from "react-icons/wi";
import { LuWind } from "react-icons/lu";
import { TbUvIndex } from "react-icons/tb";

function App() {
  const search_location = "Pokhara";
  const [myLocation, setMyLocation] = useState<string | null>(null);
  const [myLocationLongitude, setMyLocationLongitude] = useState<number | null>(null);
  const [myLocationLatitude, setMyLocationLatitude] = useState<number | null>(null);
  const [myLocationTimezone, setMyLocationTimezone] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sevenDaysForecast, setSevenDaysForecast] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [todaysForecast, setTodaysForecast] = useState<any>(null);
  const [currentTimeIndex, setCurrentTimeIndex] = useState<number>();

  const getMyLocationDetails = async () => {
    await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${search_location}%2C%20Nepal&format=json&apiKey=57ac1294aeb340c0bfde9e112bc97f41`
    )
      .then((response) => response.json())
      .then((result) => {
        const myLocationDetails = result.results[0];
        setMyLocation(
          `${myLocationDetails.address_line1}, ${myLocationDetails.address_line2}`
        );
        setMyLocationLatitude(myLocationDetails.lat);
        setMyLocationLongitude(myLocationDetails.lon);
        setMyLocationTimezone(myLocationDetails.timezone.name);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    getMyLocationDetails();
  }, []);

  //weather api url
  const weatherApiUrl =
    myLocationLatitude && myLocationLongitude && myLocationTimezone
      ? `https://api.open-meteo.com/v1/forecast?latitude=${myLocationLatitude}&longitude=${myLocationLongitude}&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset&timezone=${myLocationTimezone}`
      : null;

  const todayWeatherApiUrl =
    myLocationLatitude && myLocationLongitude && myLocationTimezone
      ? `https://api.open-meteo.com/v1/forecast?latitude=${myLocationLatitude}&longitude=${myLocationLongitude}&minutely_15=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,direct_radiation&timezone=${myLocationTimezone}`
      : null;

  function findIndexOfCurrentTime(timeArray: string[]) {
    const currentTime = new Date().toISOString().slice(0, 16);

    let found = false;

    // Iterate through the array
    for (let i = 0; i < timeArray.length; i++) {
      if (timeArray[i] >= currentTime && found == false) {
        setCurrentTimeIndex(i); // Return the index when a time is greater than or equal to the current time
        found = true;
      }
    }

    if (found == false) setCurrentTimeIndex(-1);
  }

  const updateIndexOfCurrentTime = () => {
    if (todaysForecast) {
      const timeArray = todaysForecast.minutely_15.time.slice(0, 96); //slice done to get the time of just today
      findIndexOfCurrentTime(timeArray);
    }
  };

  useEffect(() => {
    updateIndexOfCurrentTime();
  }, []);

  useEffect(() => {
    updateIndexOfCurrentTime();
  }, [todaysForecast]);

  const getWeatherInformation7days = async () => {
    if (weatherApiUrl) {
      try {
        const responses = await fetch(weatherApiUrl);

        if (responses) {
          const weatherData = await responses.json();
          setSevenDaysForecast(weatherData);
        }
      } catch (error) {
        console.log("Failed fetching weather information with error: ", error);
      }
    }
  };

  const getWeatherInformationToday = async () => {
    if (todayWeatherApiUrl) {
      try {
        const responses = await fetch(todayWeatherApiUrl);

        if (responses) {
          const todaysWeatherData = await responses.json();
          setTodaysForecast(todaysWeatherData);
        }
      } catch (error) {
        console.log("Failed fetching weather information with error: ", error);
      }
    }
  };

  useEffect(() => {
    getWeatherInformation7days();
  }, []);

  useEffect(() => {
    getWeatherInformation7days();
  }, [myLocationLatitude, myLocationLongitude, myLocationTimezone]);

  useEffect(() => {
    getWeatherInformationToday();

    //call every 15 minutes
    const intervalId = setInterval(getWeatherInformationToday, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    getWeatherInformationToday();

    //call every 15 minutes
    const intervalId = setInterval(getWeatherInformationToday, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [myLocationLatitude, myLocationLongitude, myLocationTimezone]);

  function getDayFromDate(dateString: string) {
    // Create a new Date object from the dateString
    const date = new Date(dateString);

    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayIndex = date.getDay();
    const dayName = daysOfWeek[dayIndex];

    return dayName;
  }

  function convertTimeToAMPM(timeString: string) {
    const date = new Date(timeString);
    let hours = date.getHours();
    let minutes: string | number = date.getMinutes();
    const ampm = hours >= 12 ? "P.M." : "A.M.";
    hours %= 12;
    hours = hours || 12; // Handle midnight (0 hours)

    // Add leading zero to minutes if necessary
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return hours + ":" + minutes + " " + ampm;
  }

  //make it dynamic in every 15minutes
  const todaysTemperature =
    todaysForecast &&
    currentTimeIndex !== undefined &&
    currentTimeIndex !== -1 &&
    `${todaysForecast.minutely_15.temperature_2m[currentTimeIndex]}${todaysForecast.minutely_15_units.temperature_2m}`;
  const todaysSunrise =
    sevenDaysForecast && convertTimeToAMPM(sevenDaysForecast.daily.sunrise[0]);
  const todaysSunset =
    sevenDaysForecast && convertTimeToAMPM(sevenDaysForecast.daily.sunset[0]);

  //make it dynamic in every 15minutes
  const todaysWeatherCondition =
    todaysForecast &&
    currentTimeIndex !== undefined &&
    currentTimeIndex !== -1 &&
    (todaysForecast.minutely_15.weather_code[currentTimeIndex] == 0
      ? "Clear Sky"
      : todaysForecast.minutely_15.weather_code[currentTimeIndex] >= 1 &&
        todaysForecast.minutely_15.weather_code[currentTimeIndex] <= 3
      ? "Mostly Cloudy"
      : "Rain or Precipitation");
      
  //make it dynamic in every 15minutes
  const weatherImgUrl =
    todaysForecast &&
    currentTimeIndex !== undefined &&
    currentTimeIndex !== -1 &&
    (todaysForecast.minutely_15.weather_code[currentTimeIndex] == 0
      ? "/images/contrast.png" // Assume contrast.png is a sun icon
      : todaysForecast.minutely_15.weather_code[currentTimeIndex] >= 1 &&
        todaysForecast.minutely_15.weather_code[currentTimeIndex] <= 3
      ? "/images/cloudy.png"
      : "/images/rain.png"); // Placeholder for rain/other

  const humidity =
    todaysForecast &&
    currentTimeIndex !== undefined &&
    currentTimeIndex !== -1 &&
    `${todaysForecast.minutely_15.relative_humidity_2m[currentTimeIndex]}${todaysForecast.minutely_15_units.relative_humidity_2m}`;
  const wind_speed =
    todaysForecast &&
    currentTimeIndex !== undefined &&
    currentTimeIndex !== -1 &&
    `${todaysForecast.minutely_15.wind_speed_10m[currentTimeIndex]}${todaysForecast.minutely_15_units.wind_speed_10m}`;
  const uv =
    todaysForecast &&
    currentTimeIndex !== undefined &&
    currentTimeIndex !== -1 &&
    `${todaysForecast.minutely_15.direct_radiation[currentTimeIndex]}`;

  interface weatherDataType {
    temperature: string;
    day: string;
    imgUrl: string;
  }

  const [sevenDaysForecastExtractedData, setSevenDaysForecastExtractedData] =
    useState<weatherDataType[] | null>(null);

  const updateSevenDaysForecastExtractedData = () => {
    if (sevenDaysForecast) {
      const duplicateArray: weatherDataType[] = [];
      for (let i = 0; i < 7; i++) {
        duplicateArray.push({
          temperature: `${sevenDaysForecast.daily.temperature_2m_max[i]} ${sevenDaysForecast.daily_units.temperature_2m_max} / ${sevenDaysForecast.daily.temperature_2m_min[i]} ${sevenDaysForecast.daily_units.temperature_2m_min}`,
          imgUrl:
            sevenDaysForecast.daily.weather_code[i] == 0
              ? "/images/contrast.png"
              : sevenDaysForecast.daily.weather_code[i] >= 1 &&
                sevenDaysForecast.daily.weather_code[i] <= 3
              ? "/images/cloudy.png"
              : "/images/rain.png",
          day: getDayFromDate(sevenDaysForecast.daily.time[i]),
        });
      }
      setSevenDaysForecastExtractedData(duplicateArray);
    }
  };

  useEffect(() => {
    updateSevenDaysForecastExtractedData();
  }, []);

  useEffect(() => {
    updateSevenDaysForecastExtractedData();
  }, [sevenDaysForecast]);

  return (
    // Main container with dark background and vibrant text
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-8">
      <main className="max-w-6xl mx-auto py-8 sm:py-12 flex flex-col items-center gap-10 md:gap-16">
        {/* Location Header */}
        <h2 className="text-xl sm:text-2xl text-gray-300">
          Your Location:{" "}
          <span className="font-bold text-orange-400">
            {myLocation ? myLocation : "Tracking location..."}
          </span>
        </h2>

        {/* Todays Weather Forecast Card */}
        {todaysForecast && sevenDaysForecast && currentTimeIndex !== undefined && currentTimeIndex !== -1 ? (
          <div className="relative p-6 sm:p-10 md:p-12 w-full max-w-4xl bg-gray-800 rounded-3xl shadow-2xl border border-gray-700/50 backdrop-blur-md flex flex-col items-center md:flex-row md:justify-around lg:justify-between gap-8">
            
            {/* Left Section: Temperature and Sun Times */}
            <div className="flex flex-col gap-6 shrink-0 order-2 md:order-1 items-center md:items-start">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-white">
                {todaysTemperature}
              </h1>

              <div className="font-semibold text-lg flex gap-8 text-gray-400">
                <div className="flex flex-col items-start">
                  <span className="text-sm text-gray-500">Sunrise</span>
                  <span className="text-orange-400">{todaysSunrise}</span>
                </div>

                <div className="flex flex-col items-start">
                  <span className="text-sm text-gray-500">Sunset</span>
                  <span className="text-orange-400">{todaysSunset}</span>
                </div>
              </div>
            </div>

            {/* Middle Section: Weather Icon and Condition */}
            <div className="shrink-0 flex flex-col gap-4 items-center order-1 md:order-2">
              <img
                src={weatherImgUrl}
                alt="weather-img"
                className="h-28 w-28 sm:h-36 sm:w-36 object-cover object-center bg-gray-700/50 p-3 rounded-full shadow-lg"
              />
              <span className="font-medium text-xl sm:text-2xl text-orange-400">
                {todaysWeatherCondition}
              </span>
            </div>

            {/* Right Section: Extra Details */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 order-3 md:order-3 max-w-xs md:max-w-none">
              
              {/* Humidity */}
              <div className="flex flex-col gap-1 items-center w-24 p-3 bg-gray-700 rounded-lg shadow-inner">
                <WiHumidity className="text-4xl text-orange-400" />
                <span className="text-xl font-bold">{humidity}</span>
                <span className="text-xs text-gray-400">Humidity</span>
              </div>

              {/* Wind Speed */}
              <div className="flex flex-col gap-1 items-center w-24 p-3 bg-gray-700 rounded-lg shadow-inner">
                <LuWind className="text-3xl text-orange-400" />
                <span className="text-xl font-bold">{wind_speed}</span>
                <span className="text-xs text-gray-400">Wind Speed</span>
              </div>

              {/* UV Index (Direct Radiation) */}
              <div className="flex flex-col gap-1 items-center w-24 p-3 bg-gray-700 rounded-lg shadow-inner">
                <TbUvIndex className="text-3xl text-orange-400" />
                <span className="text-xl font-bold">{uv}</span>
                <span className="text-xs text-gray-400">UV Index</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 bg-gray-800 rounded-xl shadow-lg">
            <span className="text-lg text-orange-400">
              Loading today's weather forecast...
            </span>
          </div>
        )}

        {/* 7 Days Forecast Section */}
        <div className="flex flex-col gap-6 w-full max-w-4xl items-center mt-8">
          <h2 className="text-3xl font-bold text-gray-200 border-b-2 border-orange-500 pb-1">
            7-Day Forecast
          </h2>

          {sevenDaysForecastExtractedData &&
            sevenDaysForecastExtractedData.length === 7 && (
              <div className="w-full bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl overflow-x-auto">
                <div className="flex gap-4 sm:gap-6 justify-between min-w-max">
                  {/* Start from slice(1) to skip today's entry, as it's shown above */}
                  {sevenDaysForecastExtractedData.slice(1).map((weatherData, i) => {
                    const { temperature, day, imgUrl } = weatherData;

                    return (
                      <div
                        key={i}
                        className="flex flex-col gap-3 items-center shrink-0 p-4 bg-gray-700 rounded-xl hover:bg-orange-600 transition duration-300 ease-in-out cursor-pointer group"
                      >
                        <span className="uppercase font-bold text-lg text-orange-400 group-hover:text-white">
                          {i === 0 ? "Tomorrow" : day.slice(0, 3)}
                        </span>

                        <img
                          src={imgUrl}
                          alt="weather-img"
                          className="h-10 w-10 object-cover object-center filter group-hover:brightness-110"
                        />

                        <div className="flex flex-col items-center text-sm font-medium text-gray-300 group-hover:text-white">
                          {/* Split temperature for Max/Min display */}
                          {temperature.split(" / ").map((temp, idx) => (
                            <span key={idx} className={idx === 0 ? "font-bold" : "text-xs"}>
                              {temp}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
        </div>
      </main>
    </div>
  );
}

export default App;