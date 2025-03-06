import { axiosClient } from "./auth.service";

const OPERATION = "GET";
const DATA = null;

// Requests that does not need authentication
const getQuickStat = async (year: number | null = null) => {
  return axiosClient(
    "quick-stat",
    OPERATION,
    DATA,
    year ? { year } : {},
    false
  );
};

const getDengueCountPerBarangay = async (year: number | null = null) => {
  return axiosClient(
    "cases-per-barangay",
    OPERATION,
    DATA,
    year ? { year } : {},
    false
  );
};

const getCasesDeaths = async (year: number | null = null) => {
  return axiosClient(
    "cases-deaths",
    OPERATION,
    DATA,
    year ? { year } : {},
    false
  );
};

// Requests that must need authentication
const getDengueReports = async (page: number, itemsPerPage: number = 10) => {
  return axiosClient("dengue-case-reports", OPERATION, DATA, {
    page,
    itemsPerPage,
  });
};

const getCaseViewDetails = async (caseId: number) => {
  return axiosClient("dengue-case-reports", OPERATION, DATA, { caseId });
};

const fetchService = {
  getQuickStat,
  getDengueCountPerBarangay,
  getCasesDeaths,
  getDengueReports,
  getCaseViewDetails,
};

export default fetchService;
