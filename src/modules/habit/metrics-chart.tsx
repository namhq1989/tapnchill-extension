import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart.tsx'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts'
import { IHabitDailyStats } from '@/modules/habit/types.ts'
import { format } from 'date-fns'

const chartConfig = {
  completed: {
    label: 'Completed',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig

interface IHabitMetricsChartProps {
  stats: IHabitDailyStats[]
}

const HabitMetricsChart = (props: IHabitMetricsChartProps) => {
  const { stats } = props

  const processedData = stats
    .map((item) => ({
      date: format(item.date, 'dd/MM'),
      completed: item.completedIds.length || 0,
    }))
    .reverse()

  return (
    <div className='flex flex-col w-full my-4'>
      <h2 className='text-base font-bold tracking-wide'>Completion Overview</h2>
      <h2 className='text-sm text-muted-foreground tracking-wide'>
        See how consistent you’ve been
      </h2>
      <ChartContainer config={chartConfig} className='h-[150px] w-full mt-4'>
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
          <Bar dataKey='completed' fill='var(--color-completed)' radius={8}>
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

export default HabitMetricsChart
