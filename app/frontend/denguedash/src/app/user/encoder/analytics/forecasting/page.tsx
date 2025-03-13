"use client";

import { Button } from "@/shadcn/components/ui/button";
import postService from "@/services/post.service";
import { useState } from "react";
import { Separator } from "@/shadcn/components/ui/separator";
import {
  ModelPredictionResponse,
  ModelPredictions,
} from "@/interfaces/forecasting/predictions.interface";
import BarChart from "@/components/charts/BarChart";
import { transformData } from "@/lib/utils/data-transormation.util";

export default function Dashboard() {
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const [predictions, setPredictions] = useState<ModelPredictions | null>(null);
  const predictCases = async () => {
    const predictions: ModelPredictionResponse =
      await postService.predictCases();
    setPredictions(predictions.predictions);
    const test = transformData(
      predictions.predictions,
      "week",
      "predicited_cases"
    );
    console.log(test);
    setIsComponentVisible(true);
    console.log(predictions);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between gap-1">
        <div>
          <p className="text-2xl lg:text-4xl font-bold">
            Forecasting Dengue Cases
          </p>
        </div>
        <div>
          <Button variant={"outline"} onClick={predictCases}>
            Predict Cases
          </Button>
        </div>
      </div>
      <Separator className="mt-2" />
      {isComponentVisible && (
        <div>
          <BarChart
            cardHeight="400px"
            data={transformData(predictions, "date", "predicted_cases")}
            yLabel="Cases"
            barColor="#3182CE"
          />
        </div>
      )}
    </div>
  );
}
