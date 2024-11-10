import { useEffect } from 'react'
import useWeatherStore from '@/modules/weather/store.ts'
import { Droplets, Thermometer, Waves, Wind } from 'lucide-react'

const WeatherPreview = () => {
  const { city, weather, getWeather } = useWeatherStore()

  useEffect(() => {
    const fetchData = async () => {
      await getWeather()
    }
    fetchData().then()
  }, [getWeather])

  if (!weather) return null

  return (
    <div
      className='flex flex-row relative gap-4 w-full rounded-xl bg-cover text-white'
      style={{
        backgroundImage: `url('${import.meta.env.VITE_CDN_ENDPOINT}/${weather.icon}.jpg')`,
      }}
    >
      <div className='overlay rounded-xl'></div>
      <div className='relative grid grid-cols-3 items-center justify-center p-4 gap-4 w-full'>
        <div className='flex flex-col col-span-2 flex-grow justify-between items-center gap-2'>
          <div className='text-xl font-bold text-center'>{city}</div>
          <div className='text-6xl'>{weather?.temp || 0}°</div>
        </div>
        <div className='grid grid-cols-2 col-span-1 gap-2'>
          <div
            className='flex flex-col col-span-1 gap-2 p-2 items-center'
            title='Wind speed'
          >
            <Wind strokeWidth={1} />
            <div className='text-sm'>{weather?.windSpeed || 0}kph</div>
          </div>
          <div
            className='flex flex-col col-span-1 gap-2 p-2 items-center'
            title='Humidity'
          >
            <Droplets strokeWidth={1} />
            <div className='text-sm'>{weather?.humidity || 0}%</div>
          </div>
          <div
            className='flex flex-col col-span-1 gap-2 p-2 items-center'
            title='Real feel'
          >
            <Thermometer strokeWidth={1} />
            <div className='text-sm'>
              {weather?.feelsLike || weather?.temp || 0}°
            </div>
          </div>
          <div
            className='flex flex-col col-span-1 gap-2 p-2 items-center'
            title='Rain probability'
          >
            <Waves strokeWidth={1} />
            <div className='text-sm'>{weather?.precipProb || 0}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherPreview
