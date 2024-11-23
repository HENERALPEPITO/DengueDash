import { axiosInstance, axiosOpen } from "./auth.service";

// Requests that does not need authentication

const getQuickStat = async (year: number | null = null) => {
  try {
    const yearQuery = year ? `?year=${year}` : "";
    const response = await axiosOpen.get(`quick-stat`.concat(yearQuery));
    return response.data;
  } catch (error) {
    console.error("Error fetching current case count:", error);
    throw error;
  }
};

const getDengueCountPerBarangay = async (year: number | null = null) => {
  try {
    const yearQuery = year ? `?year=${year}` : "";
    const response = await axiosOpen.get(
      `cases-per-barangay`.concat(yearQuery)
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching dengue count per barangay:", error);
    throw error;
  }
};

const getCasesDeaths = async (year: number | null = null) => {
  try {
    const yearQuery = year ? `?year=${year}` : "";
    const response = await axiosOpen.get(`cases-deaths`.concat(yearQuery));
    return response.data;
  } catch (error) {
    console.error("Error fetching dengue cases and deaths count:", error);
    throw error;
  }
};

// Requests that must need authentication
const getDengueReports = async (page: number, itemsPerPage: number = 10) => {
  try {
    const response = await axiosInstance.get(
      `dengue-case-reports?page=${page}&page_size=${itemsPerPage}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching dengue reports:", error);
    throw error;
  }
};

const getCaseViewDetails = async (caseId: number) => {
  try {
    const response = await axiosInstance.get(`dengue-case-reports/${caseId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching case details", error);
    throw error;
  }
};

const fetchService = {
  getQuickStat,
  getDengueCountPerBarangay,
  getCasesDeaths,
  getDengueReports,
  getCaseViewDetails,
};

export default fetchService;
