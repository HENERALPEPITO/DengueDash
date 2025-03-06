import { axiosClient } from "./auth.service";

const OPERATION = "GET";
const DATA = null;

// Requests that does not need authentication
const getQuickStat = async (year: number | null = null) => {
  // try {
  //   const yearQuery = year ? `?year=${year}` : "";
  //   const response = await axiosOpen.get(`quick-stat`.concat(yearQuery));
  //   return response.data;
  // } catch (error) {
  //   console.error("Error fetching current case count:", error);
  //   throw error;
  // }
  return axiosClient(
    "quick-stat",
    OPERATION,
    DATA,
    year ? { year } : {},
    false
  );
};

const getDengueCountPerBarangay = async (year: number | null = null) => {
  // try {
  //   const yearQuery = year ? `?year=${year}` : "";
  //   const response = await axiosOpen.get(
  //     `cases-per-barangay`.concat(yearQuery)
  //   );
  //   return response.data;
  // } catch (error) {
  //   console.error("Error fetching dengue count per barangay:", error);
  //   throw error;
  // }
  return axiosClient(
    "cases-per-barangay",
    OPERATION,
    DATA,
    year ? { year } : {},
    false
  );
};

const getCasesDeaths = async (year: number | null = null) => {
  // try {
  //   const yearQuery = year ? `?year=${year}` : "";
  //   const response = await axiosOpen.get(`cases-deaths`.concat(yearQuery));
  //   return response.data;
  // } catch (error) {
  //   console.error("Error fetching dengue cases and deaths count:", error);
  //   throw error;
  // }
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
  // try {
  // const response = await axiosInstance.get(
  //   `dengue-case-reports?page=${page}&page_size=${itemsPerPage}`
  // );
  //   return response.data;
  // } catch (error) {
  //   console.error("Error fetching dengue reports:", error);
  //   throw error;
  // }
  // return axiosInterceptor("dengue-case-reports", {
  //   page,
  //   page_size: itemsPerPage,
  // });
  return axiosClient("dengue-case-reports", OPERATION, DATA, {
    page,
    itemsPerPage,
  });
};

const getCaseViewDetails = async (caseId: number) => {
  // try {
  //   const response = await axiosInstance.get(`dengue-case-reports/${caseId}`);
  //   return response.data;
  // } catch (error) {
  //   console.error("Error fetching case details", error);
  //   throw error;
  // }
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
