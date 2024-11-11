"use client";

import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { ComboCountDeaths } from "@interfaces/dashboard/dashboard.interface";

type ComboChartProps = {
  data: ComboCountDeaths[];
};

export default function ComboChart({ data }: ComboChartProps) {
  return (
    <div className="w-full h-96 mx-2">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
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
            padding={{ left: 30, right: 30 }}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            label={{
              value: "No. of Cases",
              angle: -90,
              dx: -20,
              style: { fontSize: 12, fill: "#64748b" },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            label={{
              value: "Deaths",
              angle: 90,
              position: "insideRight",
              offset: 5,
              style: { fontSize: 12, fill: "#64748b" },
            }}
          />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          <Bar
            yAxisId="left"
            dataKey="case_count"
            fill="#93e1d8"
            name="Cases"
            radius={[4, 4, 0, 0]}
            barSize={50}
          />
          <Line
            yAxisId="right"
            type="linear"
            dataKey="death_count"
            stroke="#ff6384"
            name="Deaths"
            strokeWidth={3}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
