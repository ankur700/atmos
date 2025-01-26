import { fetchWeatherApi } from 'openmeteo';
export class WeatherService {
    city;
    constructor(city) {
        this.city = city;
    }
    async getCoordinates() {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${this.city}&count=5&language=en&format=json`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch coordinates');
        }
        const { results } = await response.json();
        return results;
    }
    getWeatherIcon(code) {
        const weatherCodes = {
            0: `
 \\   /
  .-.
 ― (   ) ―
  '-'
    •
  `,
            1: `
 \\   /
  .-.
 ― (   ) ―
  '-'
   ☁
  `,
            2: `
  \\  /  _   _
 _ \\/ _ | | | |
| '__/ _\` | | |
| | | (_| | | |
|_|  \\__,_|_|_|
  `,
            3: `
   .--.
 .-(    ).
(_ (__.__)
  `,
            45: `
 _ .--.
(   ).
 (_(__).
  `,
            48: `
 _ .--.
(   ).
 (_(__).
  `,
            51: `
    .-.
   (   ).
  (___(__)
  `,
            53: `
    .-.
   (   ).
  (___(__)
  `,
            55: `
    .-.
   (   ).
  (___(__)
  `,
            61: `
     .-.
    (   ).
   (___(__)
  `,
            63: `
     .-.
    (   ).
   (___(__)
  `,
            65: `
     .-.
    (   ).
   (___(__)
  `,
            71: `
      *  *  *
   *  *  *  *
    *  *  *
  `,
            73: `
      *  *  *
   *  *  *  *
    *  *  *
  `,
            75: `
      *  *  *
   *  *  *  *
    *  *  *
  `,
            77: `
     * * *
    * * * *
  `,
            80: `
     .-.
    (   ).
   (___(__)
  `,
            81: `
     .-.
    (   ).
   (___(__)
  `,
            82: `
     .-.
    (   ).
   (___(__)
  `,
            85: `
      *  *  *
   *  *  *  *
  `,
            86: `
      *  *  *
   *  *  *  *
  `,
            95: `
      /\\
     /  \\
    /____\\
  `,
            96: `
      /\\
     /  \\
    /____\\
  `,
            99: `
      /\\
     /  \\
    /____\\
  `
        };
        return weatherCodes[code] || '❓';
    }
    getWeatherDescription(code) {
        const weatherCodes = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            56: 'Light freezing drizzle',
            57: 'Dense freezing drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            66: 'Light freezing rain',
            67: 'Heavy freezing rain',
            71: 'Slight snow fall',
            73: 'Moderate snow fall',
            75: 'Heavy snow fall',
            77: 'Snow grains',
            80: 'Slight rain showers',
            81: 'Moderate rain showers',
            82: 'Violent rain showers',
            85: 'Slight snow showers',
            86: 'Heavy snow showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with light hail',
            99: 'Thunderstorm with heavy hail'
        };
        return weatherCodes[code] || '❓ Unknown weather condition';
    }
    async fetchWeatherData() {
        const coordinates = await this.getCoordinates();
        const params = {
            "latitude": coordinates[0].latitude,
            "longitude": coordinates[0].longitude,
            "current": ["temperature_2m", "apparent_temperature", "is_day", "precipitation", "rain", "weather_code", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m"],
            "hourly": ["temperature_2m", "apparent_temperature", "precipitation", "weather_code", "wind_speed_10m"],
            "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min", "apparent_temperature_max", "apparent_temperature_min", "sunrise", "sunset", "wind_speed_10m_max"],
            "timezone": "auto"
        };
        const url = "https://api.open-meteo.com/v1/forecast";
        try {
            const responses = await fetchWeatherApi(url, params);
            return responses[0];
        }
        catch (error) {
            throw new Error('Failed to fetch weather data');
        }
    }
    range(start, stop, step) {
        return Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
    }
    async getCurrentForecast() {
        const response = await this.fetchWeatherData();
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const current = response.current();
        return {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature: current.variables(0).value(),
            apparentTemperature: current.variables(1).value(),
            isDay: current.variables(2).value(),
            precipitation: current.variables(3).value(),
            weatherCode: current.variables(5).value(),
            windSpeed: current.variables(6).value(),
            windDirection: current.variables(7).value(),
            windGusts: current.variables(8).value(),
        };
    }
    async getHourlyForecast() {
        const response = await this.fetchWeatherData();
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const hourly = response.hourly();
        return {
            time: this.range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
            temperatures: hourly.variables(0).valuesArray(),
            apparentTemperatures: hourly.variables(1).valuesArray(),
            precipitations: hourly.variables(2).valuesArray(),
            weatherCodes: hourly.variables(3).valuesArray(),
            windSpeeds: hourly.variables(4).valuesArray(),
        };
    }
    async get7DayForecast() {
        const response = await this.fetchWeatherData();
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const daily = response.daily();
        return {
            time: this.range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
            weatherCodes: daily.variables(0).valuesArray(),
            temperatureMax: daily.variables(1).valuesArray(),
            temperatureMin: daily.variables(2).valuesArray(),
            apparentTemperatureMax: daily.variables(3).valuesArray(),
            apparentTemperatureMin: daily.variables(4).valuesArray(),
            sunrise: daily.variables(5).valuesArray(),
            sunset: daily.variables(6).valuesArray(),
            windSpeedMax: daily.variables(7).valuesArray(),
        };
    }
}
