"use client";

import ChartHeader from "./ChartHeader";
import { BarangayData } from "@/interfaces/map/map.interface";
import fetchService from "@/services/fetch.service";
import { useEffect, useMemo, useState } from "react";
import ChoroplethMap from "@components/map/ChoroplethMap";
import ComboChart from "@components/charts/ComboChart";
import BarChart from "@components/charts/BarChart";
import StatCard from "./StatCard";
import { CurrentCaseCount } from "@/interfaces/dashboard/dashboard.interface";

const transformData = (data: any, labelKey: string, valueKey: string) => {
  return data.map((item: { [key: string]: any }) => ({
    label: item[labelKey] as string,
    value: item[valueKey] as number,
  }));
};

export default function StatDashboard() {
  const [caseData, setCaseData] = useState<CurrentCaseCount | null>(null);
  const [barangayData, setBarangayData] = useState<BarangayData[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const topBarangays = useMemo(() => {
    const TOP_BARANGAYS_COUNT = 5;
    const LABEL_KEY = "barangay";
    const VALUE_KEY = "case_count";
    const sortedTopData = [...barangayData]
      .sort((a, b) => b.case_count - a.case_count)
      .slice(0, TOP_BARANGAYS_COUNT);

    return transformData(sortedTopData, LABEL_KEY, VALUE_KEY);
  }, [barangayData]);

  const topBarangaysDeaths = useMemo(() => {
    const TOP_BARANGAYS_COUNT = 5;
    const LABEL_KEY = "barangay";
    const VALUE_KEY = "death_count";
    const sortedTopData = [...barangayData]
      .sort((a, b) => b.death_count - a.death_count)
      .slice(0, TOP_BARANGAYS_COUNT);

    return transformData(sortedTopData, LABEL_KEY, VALUE_KEY);
  }, [barangayData]);

  const fetchCurrentCaseCount = async () => {
    try {
      const response: CurrentCaseCount =
        await fetchService.getCurrentCaseCount();
      setCaseData(response);
    } catch (error) {
      console.error("Failed to fetch current case count:", error);
    }
  };

  const fetchBarangayData = async () => {
    try {
      const response: BarangayData[] =
        await fetchService.getDengueCountPerBarangay();
      setBarangayData(response);
      setDataLoaded(true);
    } catch (error) {
      console.error("Failed to fetch barangay data:", error);
    }
  };

  useEffect(() => {
    fetchCurrentCaseCount();
    fetchBarangayData();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {dataLoaded && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-2">
            <StatCard
              title={"Weekly Case"}
              value={caseData?.weekly_cases.toString() || "0"}
              icon={"fluent-emoji-high-contrast:mosquito"}
            />
            <StatCard
              title={"Weekly Death"}
              value={caseData?.weekly_deaths.toString() || "0"}
              icon={"healthicons:death"}
            />
            <StatCard
              title={"Cumulative Case"}
              value={caseData?.total_cases.toString() || "0"}
              icon={"healthicons:malaria-outbreak-outline"}
            />
            <StatCard
              title={"Cumulative Death"}
              value={caseData?.total_deaths.toString() || "0"}
              icon={"healthicons:chart-death-rate-decreasing-outline"}
            />
          </div>
          <div className="border border-grey rounded-lg ">
            <ChartHeader
              title={"Number of Dengue Cases in Iloilo City"}
              date={"October 19, 2024"}
            />
            <ComboChart />
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Choropleth Map */}
            <div className="border border-grey rounded-lg flex-1">
              <ChartHeader
                title={"Number of Dengue Cases in Iloilo City"}
                date={"October 19, 2024"}
              />
              <ChoroplethMap dengueData={barangayData} />
            </div>
            {/* Right Side */}
            <div className="flex flex-col flex-1 gap-3">
              <div className="border border-grey rounded-lg">
                <ChartHeader
                  title={"Top Barangays with most Dengue Cases"}
                  date={"October 19, 2024"}
                />
                {/* <SimpleBarChart
                  height="328px"
                  data={topBarangays}
                  yLabel="Cases"
                  backgroundColor="#3182CE"
                  displayLegend={false}
                /> */}
                <BarChart
                  cardHeight="328px"
                  data={topBarangays}
                  yLabel="Cases"
                  barColor="#3182CE"
                />
              </div>
              <div className="border border-grey rounded-lg">
                <ChartHeader
                  title={"Top Barangays with most Mortality Cases"}
                  date={"October 19, 2024"}
                />
                {/* <SimpleBarChart
                  height="328px"
                  data={topBarangaysDeaths}
                  yLabel="Death Cases"
                  backgroundColor="#ee2d60"
                  displayLegend={false}
                /> */}
                <BarChart
                  cardHeight="328px"
                  data={topBarangaysDeaths}
                  yLabel="Death Cases"
                  barColor="#ee2d60"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
