import axios, { AxiosError } from 'axios';
import { getPublicIP } from './ipService';
import { getLocationByIP } from './locationService';

export type WeatherResponse = {
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  isDay: boolean;
};

const isDayTime = (currentUnix: number, sunriseUnix: number, sunsetUnix: number) => {
    return currentUnix >= sunriseUnix && currentUnix < sunsetUnix;
};

const getWeather = async (lat: number, lon: number): Promise<WeatherResponse> => {
  const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
    params: {
      latitude: lat,
      longitude: lon,
      current: 'weather_code',
      daily: 'temperature_2m_max,temperature_2m_min,sunrise,sunset',
      forecast_days: 1,
      format: 'json',
      timeformat: 'unixtime',
    },
  });

  const data = response.data;


  if (!data.current || !data.daily) {
    throw new Error('Unable to retrieve weather data.');
  }

  const weatherCode = data.current.weather_code;
  const tempMax = data.daily.temperature_2m_max[0];
  const tempMin = data.daily.temperature_2m_min[0];
  const currentTime = data.current.time;
  const sunrise = data.daily.sunrise[0];
  const sunset = data.daily.sunset[0];

  const isDay = isDayTime(currentTime, sunrise, sunset);

  return { weatherCode, tempMax, tempMin, isDay };
};

export const getWeatherByCurrentIP = async (): Promise<WeatherResponse> => {
  const ip = await getPublicIP();
  const location = await getLocationByIP(ip);

  return await getWeather(location.lat, location.lon);
};