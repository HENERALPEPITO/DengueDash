import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type BarChartProps = {
  cardHeight: string;
  data: { label: string; value: number }[];
  yLabel: string;
  barColor: string;
};

export default function BarChart({
  cardHeight,
  data,
  yLabel,
  barColor,
}: BarChartProps) {
  return (
    <div className={`w-full h-[${cardHeight}] mx-2`}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
          />
          <XAxis
            dataKey="label"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            // padding={{ left: 10, right: 10 }}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            label={{
              value: `No. of ${yLabel}`,
              angle: -90,
              //   offset: -10,
              dx: -20,
              style: { fontSize: 12, fill: "#64748b" },
            }}
          />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          <Bar
            yAxisId="left"
            dataKey="value"
            fill={barColor}
            name="Cases"
            radius={[4, 4, 0, 0]}
            barSize={50}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
