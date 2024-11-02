export interface IWeatherStore {
  city: string
  weather: IWeather | null
  getWeather: () => Promise<void>
}

export interface IWeather {
  temp: number
  feelsLike: number
  humidity: number
  windSpeed: number
  precipitationProbability: number
  conditions: string
  icon: string
}

export interface IWeatherResponse {
  current: IWeather
}

export interface IGetWeatherApiResponse {
  city: string
  weather: IWeatherResponse
}
