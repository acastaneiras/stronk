import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ExerciseSet } from "@/models/ExerciseSet";
import { Dayjs } from "dayjs";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

interface ExerciseHistoryProps {
  history: { set: ExerciseSet; date: Dayjs }[];
}

const ExerciseHistoryChart = ({ history }: ExerciseHistoryProps) => {

  const chartData = history.map((entry) => ({
    date: entry.date.format("MMM D"),
    weightLifted: entry.set.weight.value,
  })).reverse(); //Reverse the array to show the most recent data first

  const chartConfig = {
    weightLifted: {
      label: "Weight lifted",
      color: "hsl(var(--chart-1))",
    },
    date: {
      label: "Date",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <div className='flex flex-row text-center justify-center items-center border-2 rounded p-4'>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 40,
            left: 20,
            right: 20,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Line
            dataKey="weightLifted"
            type="natural"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={{
              fill: "hsl(var(--chart-2))",
            }}
            activeDot={{
              r: 6,
            }}
          >
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Line>
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default ExerciseHistoryChart;
