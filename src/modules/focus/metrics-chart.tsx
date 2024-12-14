import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart.tsx'
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts'
import useFocusMetricsStore from '@/modules/focus/metrics-store.ts'
import { IFocusDailyMetrics } from '@/modules/focus/types.ts'

const chartConfig = {
  focusTime: {
    label: 'Focus',
    color: 'hsl(var(--chart-1))',
  },
  restTime: {
    label: 'Rest',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

const FocusMetricsChart = () => {
  const { fetchLastNDaysMetrics } = useFocusMetricsStore()
  const [data, setData] = useState<IFocusDailyMetrics[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchLastNDaysMetrics(5)
      setData(fetchedData)
    }
    fetchData().then()
  }, [fetchLastNDaysMetrics])

  if (!data.length) return null

  const processedData = data.map((item) => ({
    ...item,
    focusTime: Math.round(item.focusTime / 60),
    restTime: Math.round(item.restTime / 60),
  }))

  return (
    <div className='flex flex-col w-full my-4'>
      <h2 className='text-base font-bold tracking-wide'>Daily Insights</h2>
      <ChartContainer config={chartConfig} className='h-[200px] w-full mt-4'>
        <BarChart
          accessibilityLayer
          data={processedData}
          margin={{
            top: 20,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='date'
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey='focusTime' fill='var(--color-focusTime)' radius={8}>
            <LabelList
              position='top'
              offset={12}
              className='fill-foreground'
              fontSize={12}
            />
          </Bar>
          <Bar dataKey='restTime' fill='var(--color-restTime)' radius={8}>
            <LabelList
              position='top'
              offset={12}
              className='fill-foreground'
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export default FocusMetricsChart
