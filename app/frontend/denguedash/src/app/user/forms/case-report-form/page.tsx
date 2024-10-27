import MultiStepForm from "@components/case-report-form/MultiStepForm";

export default function CaseReportForm() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-5 pt-2">
      <div className="border border-grey rounded-lg p-5">
        {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
        <MultiStepForm />
      </div>
    </div>
  );
}
