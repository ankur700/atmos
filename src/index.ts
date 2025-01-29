
import WeatherService from './utils/weatherService.js';
import * as prompt from '@clack/prompts';
import color from 'picocolors';

export async function main() {
  console.clear();
  prompt.intro(`${color.bgGreen(color.black(' Weather Forecast CLI '))}`);


  const forecast = await prompt.group(
    {
      location: () =>
        prompt.text({
          message: 'Enter city name',
          placeholder: 'berlin',
          validate: (input) => {
            if (!input) return 'city name is required';
          }
        }),

      type: () => prompt.select({
        message: 'Choose a forecast type',
        options: [
          { value: 'current', label: 'Current Forecast' },
          { value: 'hourly', label: 'Today\'s Hourly Forecast' },
          { value: 'weekly', label: '7-Day Forecast' },
        ]
      })
    },
    {
      onCancel: () => {
        prompt.cancel('Operation cancelled.');
        process.exit(0);
      },
    }
  );
  if (forecast.location) {
    const s = prompt.spinner();
    const city = forecast.location;
    const weatherService = new WeatherService(city);
    let resultText = '';

    s.start("Fetching weather data...");
    switch (forecast.type) {
      case 'current':
        try {
          const currentForecast = await weatherService.getCurrentForecast();
          const weatherDescription = weatherService.getWeatherDescription(currentForecast.weatherCode);

          resultText = color.green(`Time: `) + color.yellow(`${new Date().toLocaleTimeString()}\n`) + color.green(`Condition: `) + color.yellow(`${weatherDescription}\n`) + color.green(`Temperature: `) + color.yellow(`${Math.round(currentForecast.temperature)}°C`) + "    " + color.green(`Feels Like: `) + color.yellow(`${Math.round(currentForecast.apparentTemperature)}°C\n`) + color.green(`Precipitation: `) + color.yellow(`${Math.round(currentForecast.precipitation)}mm`) + "    " + color.green(`Wind Speed: `) + color.yellow(`${Math.round(currentForecast.windSpeed)} km/h`);
        } catch (error) {
          s.stop("Failed to fetch weather data");
          prompt.log.error('Failed to fetch current forecast');
        }

        break;

      case 'hourly':
        try {
          const hourlyForecast = await weatherService.getHourlyForecast();
          const TimesGreaterThanCurrentTime = hourlyForecast.time.slice(0, 25).filter((time) => time.getHours() >= new Date().getHours());
          TimesGreaterThanCurrentTime.forEach((time: Date, index: number) => {
            const weatherDescription = weatherService.getWeatherDescription(hourlyForecast.weatherCodes[index]);
            const formattedtime = new Intl.DateTimeFormat('en-GB', { timeStyle: "short", hour12: true }).format(time);

            resultText = resultText + `${index > 0 ? "\n\n" : ""}` + color.green(`Time: `) + color.yellow(`${formattedtime}\n`) + color.green(`Condition: `) + color.yellow(`${weatherDescription}\n`) + color.green(`Temperature: `) + color.yellow(`${Math.round(hourlyForecast.temperatures[index])}°C`) + "    " + color.green(`Feels Like: `) + color.yellow(`${Math.round(hourlyForecast.apparentTemperatures[index])}°C\n`) + color.green(`Precipitation: `) + color.yellow(`${Math.round(hourlyForecast.precipitations[index])}mm`) + "    " + color.green(`Wind Speed: `) + color.yellow(`${Math.round(hourlyForecast.windSpeeds[index])} km/h`);
          });
        } catch (error) {
          s.stop("Failed to fetch weather data");
          prompt.log.error('Failed to fetch hourly forecast');
        }

        break;

      case 'weekly':
        try {
          const sevenDayForecast = await weatherService.get7DayForecast();
          for (let i = 0; i < sevenDayForecast.time.length; i++) {
            const weatherDescription = weatherService.getWeatherDescription(sevenDayForecast.weatherCodes[i]);
            resultText = resultText + `${i > 0 ? "\n" : ""}` + color.green(`Day: `) + color.yellow(`${sevenDayForecast.time[i].toLocaleDateString('en-GB', {
              weekday: 'long'
            })}\n`) + color.green(`Condition: `) + color.yellow(`${weatherDescription}\n`) + color.green(`Max: `) + color.yellow(`${Math.round(sevenDayForecast.temperatureMax[i])}°C`) + "    " + color.green(`Min: `) + color.yellow(`${Math.round(sevenDayForecast.temperatureMin[i])}°C\n`);
          }
        } catch (error) {
          s.stop("Failed to fetch weather data");
          prompt.log.error('Failed to fetch 7-day forecast');
        }
        break;
    }
    if (resultText) {
      s.stop("Weather data fetched successfully!");
      const time = new Intl.DateTimeFormat('en-GB', { dateStyle: "full" }).format(new Date());
      prompt.note(
        resultText,
        `${color.bgGreen(
          color.black(" " + forecast.type.toUpperCase() + " forecast of " + city.toUpperCase() + " " + time + " ")
        )}`
      );
      prompt.outro('Weather data provided by openmeteo.com');
    }
  }

}
// Allow direct execution if run as a script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default main;