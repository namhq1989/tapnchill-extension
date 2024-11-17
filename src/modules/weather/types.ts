export interface IWeatherStore {
  city: string
  weather: IWeather | null
  fetchWeather: () => Promise<void>
}

export interface IWeather {
  temp: number
  feelsLike: number
  humidity: number
  windSpeed: number
  precipProb: number
  icon: string
}

export interface IGetWeatherApiResponse {
  city: string
  weather: IWeather
}
