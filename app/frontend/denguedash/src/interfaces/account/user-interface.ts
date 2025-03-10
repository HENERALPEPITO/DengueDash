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
