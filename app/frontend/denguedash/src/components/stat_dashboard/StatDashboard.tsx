import ChoroplethMapWrapper from "@components/map/ChoroplethMapWrapper";
import DengueCountDeaths from "../charts/DengueCountDeaths";
import ChartHeader from "./ChartHeader";

export default function StatDashboard() {
  return (
    <div className="flex flex-col gap-3">
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
          <ChoroplethMapWrapper />
        </div>
        {/* Right Side */}
        <div className="flex flex-col flex-1 gap-3">
          <div className="border border-grey rounded-lg">
            <ChartHeader
              title={"Number of Dengue Cases in Iloilo City"}
              date={"As of October 19, 2024"}
            />
            <DengueCountDeaths height={"328px"} />
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
    </div>
  );
}
