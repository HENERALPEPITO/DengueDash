import { axiosClient } from "./auth.service";

const OPERATION = "GET";
const DEFAULT_DATA = null;
const DEFAULT_PARAMS = {};

// Requests that does not need authentication
const getQuickStat = async (year: number | null = null) => {
  return axiosClient(
    "quick-stat",
    OPERATION,
    DEFAULT_DATA,
    year ? { year } : {},
    false
  );
};

const getDengueCountPerBarangay = async (year: number | null = null) => {
  return axiosClient(
    "cases-per-barangay",
    OPERATION,
    DEFAULT_DATA,
    year ? { year } : {},
    false
  );
};

const getCasesDeaths = async (year: number | null = null) => {
  return axiosClient(
    "cases-deaths",
    OPERATION,
    DEFAULT_DATA,
    year ? { year } : {},
    false
  );
};

// Requests that must need authentication
const getDengueReports = async (page: number, itemsPerPage: number = 10) => {
  return axiosClient("dengue-case-reports", OPERATION, DEFAULT_DATA, {
    page,
    itemsPerPage,
  });
};

const getCaseViewDetails = async (caseId: number) => {
  return axiosClient(
    `dengue-case-reports/${caseId}`,
    OPERATION,
    DEFAULT_DATA,
    DEFAULT_PARAMS
  );
};

const fetchService = {
  getQuickStat,
  getDengueCountPerBarangay,
  getCasesDeaths,
  getDengueReports,
  getCaseViewDetails,
};

export default fetchService;
