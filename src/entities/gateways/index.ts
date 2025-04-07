import axios from 'axios';
import type { Weather, WeatherAPIResponse, CacheRecord } from '../types';

const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
const CACHE_KEY = 'weather_cache';
const CACHE_DURATION = 5 * 60 * 1000;

const getCachedWeather = (city: string): Weather | null => {
  const raw = localStorage.getItem(CACHE_KEY);
  if (!raw) return null;

  const cache: CacheRecord = JSON.parse(raw);
  const record = cache[city.toLowerCase()];

  if (record && Date.now() - record.timestamp < CACHE_DURATION) {
    return record.data;
  }
  return null;
};

const cacheWeather = (city: string, data: Weather): void => {
  const raw = localStorage.getItem(CACHE_KEY);
  const cache: CacheRecord = raw ? JSON.parse(raw) : {};

  cache[city.toLowerCase()] = {
    data,
    timestamp: Date.now(),
  };

  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};

const fetchWeatherFromAPI = async (
  city: string
): Promise<WeatherAPIResponse> => {
  const response = await axios.get<WeatherAPIResponse>(
    'https://api.openweathermap.org/data/2.5/weather',
    {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      },
    }
  );

  return response.data;
};

export const fetchWeather = async (city: string): Promise<Weather> => {
  const cached = getCachedWeather(city);
  if (cached) {
    return cached;
  }

  const apiData = await fetchWeatherFromAPI(city);
  const data: Weather = {
    name: apiData.name,
    temp: apiData.main.temp,
    description: apiData.weather[0].description,
    icon: apiData.weather[0].icon,
    lastUpdated: new Date(apiData.dt * 1000).toLocaleTimeString(),
  };

  cacheWeather(city, data);
  return data;
};
