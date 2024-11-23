"use client";

import { CaseView } from "@/interfaces/dengue-reports/dengue-reports.interface";

import fetchService from "@/services/fetch.service";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shadcn/components/ui/card";
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
  }, []);

  return (
    <div>
      <Card className="w-full">
        <div className="h-20 bg-gradient-to-r from-blue-200 via-blue-400 to-orange-300 rounded-t-lg"></div>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="flex-col">
          {caseDetails && (
            <>
              <p>{caseDetails.patient.full_name}</p>
              <p>Hello</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
