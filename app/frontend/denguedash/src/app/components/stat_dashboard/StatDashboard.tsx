import ChoroplethMapWrapper from "@components/map/ChoroplethMapWrapper";

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
      <div className="border border-grey rounded-lg flex-1">
        <div className="p-6">
          <h2 className="text-2xl font-bold">
            322,343 <span className="text-red-500">+63,728</span>
          </h2>
          <p className="text-gray-600">Reported COVI</p>
        </div>
      </div>
    </div>
  );
}
