import useHttpStore from '@/modules/http/store.ts'
import { create } from 'zustand'
import {
  IGetWeatherApiResponse,
  IWeather,
  IWeatherStore,
} from '@/modules/weather/types.ts'

const FETCH_WEATHER_INTERVAL = 3600000 // 1 hour

const useWeatherStore = create<IWeatherStore>((set) => ({
  city: '',
  weather: null,
  getWeather: async () => {
    chrome.storage.local.get(async (result) => {
      const now = new Date()
      const city: string = result.city || ''
      const weatherStr: string = result.weather || ''
      const weatherLastFetchTs: number = result.weatherLastFetchTs || 0

      if (weatherStr && weatherLastFetchTs > 0) {
        const diff = now.getTime() - weatherLastFetchTs
        if (diff < FETCH_WEATHER_INTERVAL) {
          const weather = JSON.parse(weatherStr) as IWeather
          set({ city, weather })
          return
        }
      }

      const { get: httpGet } = useHttpStore.getState()
      const response = await httpGet<IGetWeatherApiResponse>(
        'api/weather/fetch',
        {},
      )
      if (response && response.weather) {
        set({
          city: response.city,
          weather: response.weather.current,
        })
        chrome.storage.local
          .set({
            city: response.city,
            weather: JSON.stringify(response.weather.current),
            weatherLastFetchTs: now.getTime(),
          })
          .then()
      }
    })
  },
}))

export default useWeatherStore
