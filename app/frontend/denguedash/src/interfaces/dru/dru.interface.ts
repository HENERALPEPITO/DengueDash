export interface BriefDRUDetails {
  id: number;
  dru_name: string;
  email: string;
}

export interface DRUListPagination {
  results: BriefDRUDetails[];
}

export interface DRUProfileInterface {
  id: number;
  dru_name: string;
  email: string;
  contact_number: string;
  address: string;
  region: string;
  created_at: string;
  updated_at: string;
  dru_type: string;
  surveillance_unit: string;
}

interface DRUType {
  id: number;
  dru_classification: string;
}

export interface DRUTypeResponse {
  data: DRUType[];
}

export interface RegisterDRUInterface {
  dru_name: string;
  email: string;
  contact_number: string;
  address: string;
  dru_type: number;
}
