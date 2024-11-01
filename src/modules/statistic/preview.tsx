import useStatisticStore from '@/modules/statistic/store.ts'
import { useEffect } from 'react'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart.tsx'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts'

const chartConfig = {
  date: {
    label: 'Minutes',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig

const StatisticPreview = () => {
  const { fetchListeningTrackingTime, listeningTrackingTime } =
    useStatisticStore()

  useEffect(() => {
    fetchListeningTrackingTime()
  }, [fetchListeningTrackingTime])

  if (!listeningTrackingTime.length) return null

  return (
    <div className='flex flex-col w-full'>
      <h2 className='text-base font-bold tracking-wide'>Tuning In</h2>
      <h2 className='text-sm text-muted-foreground tracking-wide'>
        Your Last 7 Days of Listening
      </h2>
      <ChartContainer config={chartConfig} className='h-[160px] w-full mt-4'>
        <BarChart
          accessibilityLayer
          data={listeningTrackingTime}
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
          <Bar dataKey='minutes' fill='var(--color-date)' radius={2}>
            <LabelList
              position='top'
              offset={12}
              className='fill-foreground'
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      {/*<ChartContainer config={chartConfig} className='min-h-[200px] w-full'>*/}
      {/*  <BarChart accessibilityLayer data={listeningTrackingTime}>*/}
      {/*    <CartesianGrid vertical={false} />*/}
      {/*    <XAxis*/}
      {/*      dataKey='seconds'*/}
      {/*      tickLine={false}*/}
      {/*      tickMargin={10}*/}
      {/*      axisLine={false}*/}
      {/*      // tickFormatter={(value) => value.slice(0, 3)}*/}
      {/*    />*/}
      {/*    <ChartTooltip*/}
      {/*      cursor={false}*/}
      {/*      content={<ChartTooltipContent hideLabel />}*/}
      {/*    />*/}
      {/*    <Bar dataKey='desktop' fill='var(--color-date)' radius={8} />*/}
      {/*  </BarChart>*/}
      {/*</ChartContainer>*/}
    </div>
  )
}

export default StatisticPreview
