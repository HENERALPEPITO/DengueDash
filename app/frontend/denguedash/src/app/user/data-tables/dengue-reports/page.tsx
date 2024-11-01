import DengueReportTable from "@/components/dengue-reports/DengueReportTable";

export default function DengueReports() {
  return (
    <div className="flex justify-center gap-4 px-5 pt-2 pb-5">
      <div className="w-5/6">
        <DengueReportTable />
      </div>
    </div>
  );
}
