"use client";

import ForecastingMain from "@/components/forecasting/ForecastingMain";
import RetrainingMain from "@/components/retraining/retraining-main";
import { Separator } from "@/shadcn/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shadcn/components/ui/tabs";

export default function AdminForecastingDashboard() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between gap-1">
        <div>
          <p className="text-2xl lg:text-4xl font-bold">
            Dengue Forecasting and Retraining Dashboard
          </p>
          <p className="mt-1 lg:mt-2 text-sm lg:text-md text-gray-500">
            Train the model with the latest data and forecast dengue cases
          </p>
        </div>
      </div>
      <Separator className="mt-2" />

      <div className="container mx-auto py-4">
        <Tabs defaultValue="forecasting" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="forecasting" className="px-6">
              Forecasting
            </TabsTrigger>
            <TabsTrigger value="retraining" className="px-6">
              Retraining
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forecasting">
            <ForecastingMain />
          </TabsContent>

          <TabsContent value="retraining">
            <RetrainingMain />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
