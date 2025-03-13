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
