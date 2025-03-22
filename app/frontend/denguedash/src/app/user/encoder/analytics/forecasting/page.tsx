"use client";

import postService from "@/services/post.service";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ModelPredictionResponse,
  ModelPredictions,
  PredictionMetadata,
} from "@/interfaces/forecasting/predictions.interface";
import BarChart from "@/components/charts/BarChart";
import { Separator } from "@/shadcn/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shadcn/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@shadcn/components/ui/tabs";
import { Button } from "@shadcn/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@shadcn/components/ui/alert";
import { Badge } from "@shadcn/components/ui/badge";
import { ScrollArea } from "@shadcn/components/ui/scroll-area";
import {
  Calendar,
  Droplets,
  Info,
  MapPin,
  Shield,
  Thermometer,
  Umbrella,
  BarChartHorizontal,
} from "lucide-react";
import { Skeleton } from "@shadcn/components/ui/skeleton";
import { transformData } from "@/lib/utils/data-transormation.util";
import { formatDateTime } from "@/lib/utils/format-datetime.util";
import fetchService from "@/services/fetch.service";
import { LocationData } from "@/interfaces/map/map.interface";
import { WeatherInterface } from "@/interfaces/common/weather.interface";

// todo: use weather data from openweatherapi
const futureWeather = {
  future_weather: [
    {
      rainfall: 45.5,
      max_temperature: 32.1,
      humidity: 85.0,
    },
    {
      rainfall: 43.2,
      max_temperature: 31.8,
      humidity: 83.5,
    },
    {
      rainfall: 41.8,
      max_temperature: 32.3,
      humidity: 82.0,
    },
    {
      rainfall: 44.5,
      max_temperature: 31.9,
      humidity: 84.5,
    },
    {
      rainfall: 42.7,
      max_temperature: 32.5,
      humidity: 83.0,
    },
  ],
};

export default function Dashboard() {
  const [currentWeekDengueData, setCurrentWeekDengueData] = useState<
    LocationData[]
  >([]);
  const [currentWeekWeatherData, setCurrentWeekWeatherData] = useState<
    WeatherInterface[]
  >([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionMetaData, setPredictionMetaData] =
    useState<PredictionMetadata | null>(null);
  const [predictions, setPredictions] = useState<ModelPredictions | null>(null);

  // todo: use this in the future to fetch real data
  // const getWeekNumber = (date: Date): number => {
  //   const startOfYear = new Date(date.getFullYear(), 0, 1);
  //   const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
  //   return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  // };

  const thisWeekCases: number = useMemo(() => {
    return (
      currentWeekDengueData?.reduce(
        (total: number, curr: LocationData) => total + curr.case_count,
        0
      ) ?? 0
    );
  }, [currentWeekDengueData]);

  const getRiskLevel = (cases: number) => {
    if (cases < 10)
      return { level: "low", color: "bg-green-100 text-green-800" };
    if (cases < 20)
      return { level: "medium", color: "bg-yellow-100 text-yellow-800" };
    return { level: "high", color: "bg-red-100 text-red-800" };
  };

  const handlePredict = async () => {
    setIsPredicting(true);
    const predictions: ModelPredictionResponse =
      await postService.predictCases();
    setPredictions(predictions.predictions);
    setPredictionMetaData(predictions.metadata);
    setIsPredicting(false);
  };

  const fetchCurrentWeekDengueData = async () => {
    const response: LocationData[] =
      await fetchService.getDengueAuthLocationStats(
        // todo: when deployed use the current data
        // todo: for now let's get the last fetched data
        //   {
        //   year: new Date().getFullYear(),
        //   week: getWeekNumber(new Date()),
        //   city: encodeURIComponent("ILOILO CITY (Capital)"),
        //   group_by: "barangay",
        // }
        {
          year: 2024,
          week: 44,
          city: encodeURIComponent("ILOILO CITY (Capital)"),
          group_by: "barangay",
        }
      );
    console.log("Location", response);
    setCurrentWeekDengueData(response);
  };

  const fetchCurrentWeekWeatherData = async () => {
    const response: WeatherInterface[] = await fetchService.getWeatherData(
      // todo: same with this
      // {
      //   year: new Date().getFullYear(),
      //   week: getWeekNumber(new Date()),
      // }
      {
        year: 2024,
        week: 44,
      }
    );
    console.log("Weather", response);
    setCurrentWeekWeatherData(response);
  };

  const fetchAllData = useCallback(() => {
    fetchCurrentWeekDengueData();
    fetchCurrentWeekWeatherData();
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between gap-1">
        <div>
          <p className="text-2xl lg:text-4xl font-bold">
            Dengue Prediction Dashboard
          </p>
          <p className="mt-1 lg:mt-2 text-sm lg:text-md text-gray-500">
            Forecasting dengue cases based on weather variables
          </p>
        </div>
      </div>
      <Separator className="mt-2" />

      <div className="container mx-auto py-2">
        <div className="text-md text-muted-foreground mb-4 text-right">
          Last updated :{" "}
          {formatDateTime(predictionMetaData?.prediction_generated_at ?? "")}
        </div>

        {/* Prediction Button */}
        {!predictions && !isPredicting && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center p-6">
                <BarChartHorizontal className="h-16 w-16 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  Generate Dengue Predictions
                </h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Click the button below to predict dengue cases for the next 2
                  weeks based on current weather data and historical patterns.
                </p>
                <Button size="lg" onClick={handlePredict}>
                  Generate Predictions
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading state */}
        {isPredicting && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center p-6">
                <div className="animate-pulse flex flex-col items-center">
                  <BarChartHorizontal className="h-16 w-16 text-primary/70 mb-4" />
                  <h3 className="text-xl font-medium mb-2">
                    Generating Predictions...
                  </h3>
                  <p className="text-muted-foreground text-center mb-6 max-w-md">
                    Analyzing weather patterns and historical data to predict
                    dengue cases.
                  </p>
                  <div className="w-64 h-2 bg-primary/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary animate-[progress_2s_ease-in-out_infinite]"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main prediction cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Current Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-5xl font-bold mb-2">{thisWeekCases}</div>
                <div className="text-sm text-muted-foreground">
                  Reported Cases
                </div>
                <Badge className={`mt-4 ${getRiskLevel(thisWeekCases).color}`}>
                  {getRiskLevel(thisWeekCases).level.toUpperCase()} RISK
                </Badge>
              </div>
            </CardContent>
          </Card>

          {predictions ? (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Next Week Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold mb-2">
                      {predictions[0].confidence_interval.lower} -
                      {predictions[0].confidence_interval.upper}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Predicted Cases
                    </div>
                    <Badge
                      className={`mt-4 ${getRiskLevel(predictions[0].predicited_cases).color}`}
                    >
                      {getRiskLevel(
                        predictions[0].predicited_cases
                      ).level.toUpperCase()}{" "}
                      RISK
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Two Weeks Ahead
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold mb-2">
                      {predictions[1].confidence_interval.lower} -
                      {predictions[1].confidence_interval.upper}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Predicted Cases
                    </div>
                    <Badge
                      className={`mt-4 ${getRiskLevel(predictions[1].predicited_cases).color}`}
                    >
                      {getRiskLevel(
                        predictions[1].predicited_cases
                      ).level.toUpperCase()}{" "}
                      RISK
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="bg-muted/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-muted-foreground">
                    Next Week Prediction
                  </CardTitle>
                  <CardDescription>
                    Generate predictions to see forecast
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <Skeleton className="h-16 w-16 rounded-full mb-2" />
                    <Skeleton className="h-4 w-24 rounded-full mb-4" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-muted-foreground">
                    Two Weeks Ahead
                  </CardTitle>
                  <CardDescription>
                    Generate predictions to see forecast
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <Skeleton className="h-16 w-16 rounded-full mb-2" />
                    <Skeleton className="h-4 w-24 rounded-full mb-4" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Trend chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Dengue Cases Trend & Prediction</CardTitle>
            <CardDescription>
              Historical data {predictions ? "and 2-week forecast" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[450px] relative">
            {/* This would be a real chart in a production app */}
            <div className="absolute inset-0 flex items-center justify-center">
              {predictions ? (
                <BarChart
                  cardHeight="400px"
                  data={transformData(predictions, "date", "predicted_cases")}
                  yLabel="Cases"
                  barColor="#3182CE"
                />
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* Weather variables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Weather Variables</CardTitle>
              <CardDescription>
                Factors influencing dengue transmission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 bg-muted/20 rounded-lg">
                  <Thermometer className="h-8 w-8 text-orange-500 mb-2" />
                  <div className="text-2xl font-bold">
                    {currentWeekWeatherData.length === 0 ? (
                      <Skeleton className="h-16 w-16 rounded-full mb-2" />
                    ) : (
                      currentWeekWeatherData[0].weekly_temperature.toFixed(2)
                    )}
                    °C
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Max Temperature
                  </div>
                </div>
                <div className="flex flex-col items-center p-4 bg-muted/20 rounded-lg">
                  <Droplets className="h-8 w-8 text-blue-500 mb-2" />
                  <div className="text-2xl font-bold">
                    {currentWeekWeatherData.length === 0 ? (
                      <Skeleton className="h-16 w-16 rounded-full mb-2" />
                    ) : (
                      currentWeekWeatherData[0].weekly_humidity.toFixed(2)
                    )}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground">Humidity</div>
                </div>
                <div className="flex flex-col items-center p-4 bg-muted/20 rounded-lg">
                  <Umbrella className="h-8 w-8 text-cyan-500 mb-2" />
                  <div className="text-2xl font-bold">
                    {currentWeekWeatherData.length === 0 ? (
                      <Skeleton className="h-16 w-16 rounded-full mb-2" />
                    ) : (
                      currentWeekWeatherData[0].weekly_rainfall.toFixed(2)
                    )}
                    mm
                  </div>
                  <div className="text-sm text-muted-foreground">Rainfall</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {predictions ? (
            <Card>
              <CardHeader>
                <CardTitle>Forecasted Weather Variables</CardTitle>
                <CardDescription>
                  Weekly averages for the next 2 weeks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="week1">
                  <TabsList className="mb-4">
                    <TabsTrigger value="week1">Next Week</TabsTrigger>
                    <TabsTrigger value="week2">Two Weeks Ahead</TabsTrigger>
                  </TabsList>
                  <TabsContent value="week1">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center p-4 bg-muted/20 rounded-lg">
                        <Thermometer className="h-8 w-8 text-orange-500 mb-2" />
                        <div className="text-2xl font-bold">
                          {futureWeather.future_weather[0].max_temperature}°C
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Max Temperature
                        </div>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-muted/20 rounded-lg">
                        <Droplets className="h-8 w-8 text-blue-500 mb-2" />
                        <div className="text-2xl font-bold">
                          {futureWeather.future_weather[0].humidity}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Humidity
                        </div>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-muted/20 rounded-lg">
                        <Umbrella className="h-8 w-8 text-cyan-500 mb-2" />
                        <div className="text-2xl font-bold">
                          {futureWeather.future_weather[0].rainfall}mm
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Rainfall
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="week2">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center p-4 bg-muted/20 rounded-lg">
                        <Thermometer className="h-8 w-8 text-orange-500 mb-2" />
                        <div className="text-2xl font-bold">
                          {futureWeather.future_weather[1].max_temperature}°C
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Max Temperature
                        </div>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-muted/20 rounded-lg">
                        <Droplets className="h-8 w-8 text-blue-500 mb-2" />
                        <div className="text-2xl font-bold">
                          {futureWeather.future_weather[1].humidity}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Humidity
                        </div>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-muted/20 rounded-lg">
                        <Umbrella className="h-8 w-8 text-cyan-500 mb-2" />
                        <div className="text-2xl font-bold">
                          {futureWeather.future_weather[1].rainfall}mm
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Rainfall
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-muted-foreground">
                  Forecasted Weather Variables
                </CardTitle>
                <CardDescription>
                  Generate predictions to see weather forecast
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-[180px]">
                  <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground text-center">
                    Weather forecasts will appear here after generating
                    predictions
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Additional helpful components */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Location Risk Assessment</CardTitle>
              <CardDescription>Dengue risk by location</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2 pr-4">
                  {currentWeekDengueData.map((location) => (
                    <div
                      key={location.location}
                      className="grid grid-cols-[1fr_auto] gap-4 py-2 border-b border-muted last:border-0"
                    >
                      <div className="flex items-start min-w-0">
                        <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-muted-foreground" />
                        <span className="break-words">{location.location}</span>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-sm whitespace-nowrap">
                          {location.case_count} cases
                        </span>
                        <Badge
                          className={`whitespace-nowrap ${
                            getRiskLevel(location.case_count).level === "high"
                              ? "bg-red-100 text-red-800"
                              : getRiskLevel(location.case_count).level ===
                                  "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {getRiskLevel(
                            location.case_count
                          ).level.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weather Impact Analysis</CardTitle>
              <CardDescription>
                How weather affects dengue transmission
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[220px] relative">
              {/* This would be a real chart in a production app */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-md">
                  {/* <BarChart className="h-16 w-16 text-muted-foreground" /> */}
                  <span className="ml-2 text-muted-foreground">
                    Correlation chart would render here
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prevention Measures</CardTitle>
              <CardDescription>
                Recommended actions based on risk level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Eliminate breeding sites</p>
                    <p className="text-sm text-muted-foreground">
                      Remove standing water from containers around homes
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Use mosquito repellent</p>
                    <p className="text-sm text-muted-foreground">
                      Apply EPA-registered insect repellent
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Wear protective clothing</p>
                    <p className="text-sm text-muted-foreground">
                      Long sleeves and pants, especially during peak mosquito
                      activity
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert and model information */}
        <div className="grid grid-cols-1 gap-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>About this prediction model</AlertTitle>
            <AlertDescription>
              This dashboard uses a machine learning model trained on historical
              dengue cases and weather data. Predictions are based on the
              correlation between weather variables (temperature, humidity,
              rainfall) and dengue incidence. The model is updated weekly with
              new data to improve accuracy.
            </AlertDescription>
          </Alert>
        </div>

        {/* Floating prediction button when scrolled down */}
        {!predictions && !isPredicting && (
          <div className="fixed bottom-6 right-6">
            <Button size="lg" onClick={handlePredict} className="shadow-lg">
              Generate Predictions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
