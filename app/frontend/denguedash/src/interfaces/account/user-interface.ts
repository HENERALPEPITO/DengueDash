import { PaginationInterface } from "../common/pagination-interface";

export interface UserBriefDetail {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

export interface UserListPagination extends PaginationInterface {
  results: UserBriefDetail[];
}

export interface UnverifiedUserBriefDetail {
  id: number;
  full_name: string;
  email: string;
  created_at: string;
}

export interface UnverifiedUserListPagination extends PaginationInterface {
  results: UnverifiedUserBriefDetail[];
}
