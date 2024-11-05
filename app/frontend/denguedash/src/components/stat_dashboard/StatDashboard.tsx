"use client";

import DengueCountDeaths from "../charts/DengueCountDeaths";
import ChartHeader from "./ChartHeader";
import { BarangayData } from "@/interfaces/map/map.interface";
import fetchService from "@/services/fetch.service";
import { useEffect, useMemo, useState } from "react";
import ChoroplethMap from "../map/ChoroplethMap";
import SimpleBarChart from "../charts/SimpleBarChart";

const transformData = (data: any, labelKey: string, valueKey: string) => {
  return data.map((item: { [key: string]: any }) => ({
    label: item[labelKey] as string,
    value: item[valueKey] as number,
  }));
};

export default function StatDashboard() {
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
    fetchBarangayData();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {dataLoaded && (
        <>
          <div className="border border-grey rounded-lg ">
            <ChartHeader
              title={"Number of Dengue Cases in Iloilo City"}
              date={"As of October 19, 2024"}
            />
            <DengueCountDeaths height={"328px"} />
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Choropleth Map */}
            <div className="border border-grey rounded-lg flex-1">
              <ChartHeader
                title={"Number of Dengue Cases in Iloilo City"}
                date={"As of October 19, 2024"}
              />
              <ChoroplethMap dengueData={barangayData} />
            </div>
            {/* Right Side */}
            <div className="flex flex-col flex-1 gap-3">
              <div className="border border-grey rounded-lg">
                <ChartHeader
                  title={"Top Barangays with most Dengue Cases"}
                  date={"As of October 19, 2024"}
                />
                <SimpleBarChart
                  height="328px"
                  data={topBarangays}
                  yLabel="Cases"
                  backgroundColor="#3182CE"
                  displayLegend={false}
                />
              </div>
              <div className="border border-grey rounded-lg">
                <ChartHeader
                  title={"Top Barangays with most Mortality Cases"}
                  date={"As of October 19, 2024"}
                />
                <SimpleBarChart
                  height="328px"
                  data={topBarangaysDeaths}
                  yLabel="Death Cases"
                  backgroundColor="#ee2d60"
                  displayLegend={false}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
