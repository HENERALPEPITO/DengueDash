"use client";

import fetchService from "@/services/fetch.service";
import { useEffect, useState, useRef } from "react";
import Chart, { ChartOptions, ChartData } from "chart.js/auto";
import { ByDateInterface } from "@/interfaces/stat/stat.interfaces";

type DengueCountDeathsProps = {
  height: string;
};

export default function DengueCountDeaths({ height }: DengueCountDeathsProps) {
  const [data, setData] = useState<ByDateInterface[]>([]);

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    const fetchDengueCountDeaths = async () => {
      try {
        const response: ByDateInterface[] =
          await fetchService.getYearlyDengueCount();
        setData(response);
      } catch (error) {
        console.error("Failed to fetch dengue count deaths:", error);
      }
    };

    fetchDengueCountDeaths();
  }, []);

  useEffect(() => {
    if (data.length === 0) return; // Only proceed if data is available

    // Extract data after it's fetched
    const years = data.map((item) => item.year);
    const cases = data.map((item) => item.case_count);
    const deaths = data.map((item) => item.death_count);

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Data for the chart
    const chartData: ChartData<"bar" | "line"> = {
      labels: years,
      datasets: [
        {
          type: "bar" as const,
          label: "Cases",
          data: cases,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          yAxisID: "y",
        },
        {
          type: "line" as const,
          label: "Deaths",
          data: deaths,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          yAxisID: "y1",
        },
      ],
    };

    // Configuration options for the chart
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
        y1: {
          type: "linear",
          position: "right",
          title: {
            display: true,
            text: "Deaths",
          },
          grid: {
            drawOnChartArea: false, // Only want the grid lines for one axis
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    };

    // Initialize the chart
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

    // Cleanup chart on component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]); // Re-run when 'data' changes

  return (
    <div className="p-2" style={{ height: height }}>
      <canvas ref={chartRef} />
    </div>
  );
}
