import ChoroplethMapWrapper from "@components/map/ChoroplethMapWrapper";
import DengueCountDeaths from "../charts/DengueCountDeaths";

export default function StatDashboard() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Choropleth Map */}
      <div className="border border-grey rounded-lg flex-1">
        <div className="p-4">
          <h1 className="text-2xl font-bold">
            Number of Dengue Cases in Iloilo City
          </h1>
          <p className="text-sm text-gray-600">As of October 19, 2024</p>
        </div>
        <ChoroplethMapWrapper />
      </div>
      {/* Right Side */}
      <div className="flex flex-col flex-1 gap-3">
        <div className="border border-grey rounded-lg">
          <div className="p-4">
            <DengueCountDeaths />
          </div>
        </div>
        <div className="border border-grey rounded-lg">
          <div className="p-4">
            <DengueCountDeaths />
          </div>
        </div>
      </div>
    </div>
  );
}
