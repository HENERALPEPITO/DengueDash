"use client";

import DengueCountDeaths from "../charts/DengueCountDeaths";
import ChartHeader from "./ChartHeader";
import { BarangayData } from "@/interfaces/map/map.interface";
import fetchService from "@/services/fetch.service";
import { useEffect, useMemo, useState } from "react";
import ChoroplethMap from "../map/ChoroplethMap";
import TopBarangayCount from "../charts/TopBarangayCount";

export default function StatDashboard() {
  const [barangayData, setBarangayData] = useState<BarangayData[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const topBarangays = useMemo(() => {
    const TOP_BARANGAYS_COUNT = 5;
    return [...barangayData]
      .sort((a, b) => b.case_count - a.case_count)
      .slice(0, TOP_BARANGAYS_COUNT);
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
            <div className="border border-grey rounded-lg">
              <ChartHeader
                title={"Number of Dengue Cases in Iloilo City"}
                date={"As of October 19, 2024"}
              />
              <DengueCountDeaths height={"328px"} />
            </div>
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
                  title={"Number of Dengue Cases in Iloilo City"}
                  date={"As of October 19, 2024"}
                />
                {/* <DengueCountDeaths height={"328px"} /> */}
                <TopBarangayCount height={"328px"} dengueData={topBarangays} />
              </div>
              <div className="border border-grey rounded-lg">
                <ChartHeader
                  title={"Number of Dengue Cases in Iloilo City"}
                  date={"As of October 19, 2024"}
                />
                <DengueCountDeaths height={"328px"} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
