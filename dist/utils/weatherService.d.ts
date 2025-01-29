export default class WeatherService {
    private city;
    constructor(city: string);
    getCoordinates(): Promise<any>;
    getWeatherDescription(code: number): string;
    private fetchWeatherData;
    private range;
    getCurrentForecast(): Promise<{
        time: Date;
        temperature: number;
        apparentTemperature: number;
        isDay: number;
        precipitation: number;
        weatherCode: number;
        windSpeed: number;
        windDirection: number;
        windGusts: number;
    }>;
    getHourlyForecast(): Promise<{
        time: Date[];
        temperatures: Float32Array<ArrayBufferLike>;
        apparentTemperatures: Float32Array<ArrayBufferLike>;
        precipitations: Float32Array<ArrayBufferLike>;
        weatherCodes: Float32Array<ArrayBufferLike>;
        windSpeeds: Float32Array<ArrayBufferLike>;
    }>;
    get7DayForecast(): Promise<{
        time: Date[];
        weatherCodes: Float32Array<ArrayBufferLike>;
        temperatureMax: Float32Array<ArrayBufferLike>;
        temperatureMin: Float32Array<ArrayBufferLike>;
        apparentTemperatureMax: Float32Array<ArrayBufferLike>;
        apparentTemperatureMin: Float32Array<ArrayBufferLike>;
        sunrise: Float32Array<ArrayBufferLike>;
        sunset: Float32Array<ArrayBufferLike>;
        windSpeedMax: Float32Array<ArrayBufferLike>;
    }>;
}
//# sourceMappingURL=weatherService.d.ts.map