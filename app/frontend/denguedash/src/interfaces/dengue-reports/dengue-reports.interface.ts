interface Patient {
  full_name: string;
  ca_barangay: string;
  ca_city: string;
}

export interface Case {
  case_id: number;
  date_con: string;
  clncl_class_display: string;
  case_class_display: string;
  patient: Patient;
}

export interface DengueReportPagination {
  count: number;
  next: string | null;
  previous: string | null;
  results: Case[];
}
