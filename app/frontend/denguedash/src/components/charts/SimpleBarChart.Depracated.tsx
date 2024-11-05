"use client";

import { useEffect, useRef } from "react";
import Chart, { ChartOptions, ChartData } from "chart.js/auto";

type CustomChartProps = {
  height: string;
  data: { label: string; value: number }[];
  backgroundColor: string;
  yLabel: string;
  displayLegend: boolean;
};

export default function SimpleBarChart({
  height,
  data,
  backgroundColor,
  yLabel,
  displayLegend,
}: CustomChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (data.length === 0) return;

    const labels = data.map((item) => item.label);
    const values = data.map((item) => item.value);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const chartData: ChartData<"bar"> = {
      labels,
      datasets: [
        {
          type: "bar" as const,
          data: values,
          backgroundColor: backgroundColor,
          yAxisID: "y",
        },
      ],
    };

    const options: ChartOptions<"bar"> = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          type: "linear",
          position: "left",
          title: {
            display: true,
            text: `No of ${yLabel}`,
          },
        },
      },
      plugins: {
        legend: {
          display: displayLegend,
        },
      },
    };

    if (chartRef.current) {
      chartInstance.current = new Chart(chartRef.current, {
        type: "bar",
        data: chartData,
        options,
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, backgroundColor, yLabel, displayLegend]);

  return (
    <div className="p-2" style={{ height: height }}>
      <canvas ref={chartRef} />
    </div>
  );
}
