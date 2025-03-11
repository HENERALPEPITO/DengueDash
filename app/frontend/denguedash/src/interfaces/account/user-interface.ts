import { PaginationInterface } from "../common/pagination-interface";

export interface UserBriefDetail {
  id: number;
  full_name: string;
  email: string;
  role: string;
  sex_display: string;
}

export interface UserListPagination extends PaginationInterface {
  results: UserBriefDetail[];
}

export interface UnverifiedUserBriefDetail {
  id: number;
  full_name: string;
  email: string;
  created_at: string;
  sex_display: string;
}

export interface UnverifiedUserListPagination extends PaginationInterface {
  results: UnverifiedUserBriefDetail[];
}
