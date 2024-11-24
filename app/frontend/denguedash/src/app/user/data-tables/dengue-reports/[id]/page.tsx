"use client";

import {
  CaseView,
  PatientView,
} from "@/interfaces/dengue-reports/dengue-reports.interface";
import fetchService from "@/services/fetch.service";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shadcn/components/ui/card";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";

export default function ReportView({ params }: any) {
  const [caseDetails, setCaseDetails] = useState<CaseView>();
  useEffect(() => {
    const fetchData = async () => {
      const { id } = await params;
      const apiResult: CaseView = await fetchService.getCaseViewDetails(id);
      console.log(id);
      setCaseDetails(apiResult);
    };
    fetchData();
  }, [params]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | null;
  }) => (
    <div className="border-b pb-2">
      <div className="text-sm text-gray-600 mb-2">{label}</div>
      <div className="font-medium">{value || "None"}</div>
    </div>
  );

  const SectionHeader = ({ icon, title }: { icon: string; title: string }) => (
    <CardHeader>
      <CardTitle>
        <div className="flex flex-row gap-2">
          <Icon icon={icon} />
          <p>{title}</p>
        </div>
      </CardTitle>
    </CardHeader>
  );

  const PersonalInfoCard = ({
    patientDetails,
  }: {
    patientDetails: PatientView;
  }) => (
    <Card className="w-full">
      {/* Background */}
      <div className="h-20 bg-gradient-to-r from-blue-200 via-blue-400 to-orange-300 rounded-t-lg"></div>

      {/* Personal Information Section */}
      <SectionHeader
        icon="fluent:person-28-filled"
        title="Personal Information"
      />
      <CardContent className="flex-col">
        {patientDetails && (
          <div className="mx-auto grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <InfoRow label="Full Name" value={patientDetails.full_name} />
              <InfoRow label="Sex" value={patientDetails.sex_display} />
              <InfoRow
                label="Full Address"
                value={patientDetails.full_address}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <InfoRow
                label="Date of Birth"
                value={formatDate(patientDetails.date_of_birth)}
              />
              <InfoRow
                label="Civil Status"
                value={patientDetails.civil_status_display}
              />
            </div>
          </div>
        )}
      </CardContent>

      {/* Vaccination Status Section */}
      <SectionHeader icon="tabler:vaccine" title="Vaccination Status" />
      <CardContent>
        {patientDetails && (
          <div className="mx-auto grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <InfoRow
                label="First Dose"
                value={
                  patientDetails.date_first_vax
                    ? formatDate(patientDetails.date_first_vax)
                    : null
                }
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <InfoRow
                label="Last Dose"
                value={
                  patientDetails.date_last_vax
                    ? formatDate(patientDetails.date_last_vax)
                    : null
                }
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const CaseInfoCard = ({ caseDetails }: { caseDetails: CaseView }) => (
    <Card className="w-full">
      {/* Personal Information Section */}
      <SectionHeader
        icon="solar:file-bold-duotone"
        title={`Case Record #${caseDetails.case_id}`}
      />
      <CardContent className="flex-col">
        {caseDetails && (
          <div className="mx-auto grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <InfoRow
                label="Date of Consultation"
                value={formatDate(caseDetails.date_con)}
              />
              <InfoRow
                label="Date Onset of Illness"
                value={formatDate(caseDetails.date_onset)}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <InfoRow
                label="Patient Admitted?"
                value={caseDetails.is_admt ? "Yes" : "No"}
              />
              <InfoRow
                label="Clinical Classification"
                value={caseDetails.clncl_class_display}
              />
            </div>
          </div>
        )}
      </CardContent>

      {/* Vaccination Status Section */}
      <SectionHeader icon="icomoon-free:lab" title="Laboratory Results" />
      <CardContent>
        <div className="mx-auto grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <InfoRow label="NS1" value={caseDetails.ns1_result_display} />
            <InfoRow label="IgG Elisa" value={caseDetails.igg_elisa_display} />
            <InfoRow label="IgM Elisa" value={caseDetails.igm_elisa_display} />
            <InfoRow label="PCR" value={caseDetails.pcr_display} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <InfoRow
              label="Date Done"
              value={
                caseDetails.date_ns1 ? formatDate(caseDetails.date_ns1) : "N/A"
              }
            />
            <InfoRow
              label="Date Done"
              value={
                caseDetails.date_igg_elisa
                  ? formatDate(caseDetails.date_igg_elisa)
                  : "N/A"
              }
            />
            <InfoRow
              label="Date Done"
              value={
                caseDetails.date_igm_elisa
                  ? formatDate(caseDetails.date_igm_elisa)
                  : "N/A"
              }
            />
            <InfoRow
              label="Date Done"
              value={
                caseDetails.date_pcr ? formatDate(caseDetails.date_pcr) : "N/A"
              }
            />
          </div>
        </div>
      </CardContent>

      {/* Outcome Status Section */}
      <SectionHeader icon="carbon:result" title="Outcome" />
      <CardContent>
        <div className="mx-auto grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <InfoRow
              label="Case Classification"
              value={caseDetails.case_class_display}
            />
            {caseDetails.date_death && (
              <InfoRow
                label="Date of Death"
                value={formatDate(caseDetails.date_death)}
              />
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <InfoRow label="Outcome" value={caseDetails.outcome_display} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col gap-5">
      {caseDetails ? (
        <>
          <PersonalInfoCard patientDetails={caseDetails.patient} />
          <CaseInfoCard caseDetails={caseDetails} />
        </>
      ) : null}
    </div>
  );
}
