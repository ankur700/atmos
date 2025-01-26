"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
var openmeteo_1 = require("openmeteo");
var WeatherService = /** @class */ (function () {
    function WeatherService(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    WeatherService.prototype.fetchWeatherData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, url, responses;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            "latitude": this.latitude,
                            "longitude": this.longitude,
                            "current": ["temperature_2m", "apparent_temperature", "is_day", "precipitation", "rain", "weather_code", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m"],
                            "hourly": ["temperature_2m", "apparent_temperature", "weather_code", "wind_speed_10m"],
                            "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min", "apparent_temperature_max", "apparent_temperature_min", "sunrise", "sunset", "wind_speed_10m_max"],
                            "timezone": "auto"
                        };
                        url = "https://api.open-meteo.com/v1/forecast";
                        return [4 /*yield*/, (0, openmeteo_1.fetchWeatherApi)(url, params)];
                    case 1:
                        responses = _a.sent();
                        return [2 /*return*/, responses[0]];
                }
            });
        });
    };
    WeatherService.prototype.range = function (start, stop, step) {
        return Array.from({ length: (stop - start) / step }, function (_, i) { return start + i * step; });
    };
    WeatherService.prototype.getCurrentForecast = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, utcOffsetSeconds, current;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchWeatherData()];
                    case 1:
                        response = _a.sent();
                        utcOffsetSeconds = response.utcOffsetSeconds();
                        current = response.current();
                        return [2 /*return*/, {
                                time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                                temperature: current.variables(0).value(),
                                apparentTemperature: current.variables(1).value(),
                                isDay: current.variables(2).value(),
                                precipitation: current.variables(3).value(),
                                weatherCode: current.variables(5).value(),
                                windSpeed: current.variables(6).value(),
                                windDirection: current.variables(7).value(),
                                windGusts: current.variables(8).value(),
                            }];
                }
            });
        });
    };
    WeatherService.prototype.getHourlyForecast = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, utcOffsetSeconds, hourly;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchWeatherData()];
                    case 1:
                        response = _a.sent();
                        utcOffsetSeconds = response.utcOffsetSeconds();
                        hourly = response.hourly();
                        return [2 /*return*/, {
                                time: this.range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(function (t) { return new Date((t + utcOffsetSeconds) * 1000); }),
                                temperatures: hourly.variables(0).valuesArray(),
                                apparentTemperatures: hourly.variables(1).valuesArray(),
                                weatherCodes: hourly.variables(2).valuesArray(),
                                windSpeeds: hourly.variables(3).valuesArray(),
                            }];
                }
            });
        });
    };
    WeatherService.prototype.get7DayForecast = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, utcOffsetSeconds, daily;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchWeatherData()];
                    case 1:
                        response = _a.sent();
                        utcOffsetSeconds = response.utcOffsetSeconds();
                        daily = response.daily();
                        return [2 /*return*/, {
                                time: this.range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(function (t) { return new Date((t + utcOffsetSeconds) * 1000); }),
                                weatherCodes: daily.variables(0).valuesArray(),
                                temperatureMax: daily.variables(1).valuesArray(),
                                temperatureMin: daily.variables(2).valuesArray(),
                                apparentTemperatureMax: daily.variables(3).valuesArray(),
                                apparentTemperatureMin: daily.variables(4).valuesArray(),
                                sunrise: daily.variables(5).valuesArray(),
                                sunset: daily.variables(6).valuesArray(),
                                windSpeedMax: daily.variables(7).valuesArray(),
                            }];
                }
            });
        });
    };
    return WeatherService;
}());
exports.WeatherService = WeatherService;
