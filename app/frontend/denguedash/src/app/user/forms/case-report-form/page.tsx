import MultiStepForm from "@components/case-report-form/MultiStepForm";

export default function CaseReportForm() {
  return (
    <div className="flex justify-center gap-4 px-5 pt-2 pb-5">
      <div className="w-5/6">
        <MultiStepForm />
      </div>
    </div>
  );
}
