"use client";

import { BarangayData } from "@/interfaces/map/map.interface";
import { useEffect, useRef } from "react";
import Chart, { ChartOptions, ChartData } from "chart.js/auto";

type TopBarangayCountProps = {
  height: string;
  dengueData: BarangayData[];
};

export default function TopBarangayCount({
  height,
  dengueData,
}: TopBarangayCountProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (dengueData.length === 0) return;

    const barangay = dengueData.map((item) => item.barangay);
    const cases = dengueData.map((item) => item.case_count);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const chartData: ChartData<"bar"> = {
      labels: barangay,
      datasets: [
        {
          type: "bar" as const,
          label: "Cases",
          data: cases,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
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
            text: "No. of Cases",
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    if (chartRef.current) {
      chartInstance.current = new Chart(chartRef.current, {
        type: "bar",
        data: chartData as ChartData<
          "bar",
          (number | [number, number] | null)[],
          unknown
        >,
        options,
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [dengueData]);

  return (
    <div className="p-2" style={{ height: height }}>
      <canvas ref={chartRef} />
    </div>
  );
}
