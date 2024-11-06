import { axiosInstance, axiosOpen } from "./auth.service";

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

const getCurrentCaseCount = async () => {
  try {
    const response = await axiosOpen.get(`current-case-count`);
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

const getYearlyDengueCount = async () => {
  try {
    const response = await axiosOpen.get(`cases-per-year`);
    return response.data;
  } catch (error) {
    console.error("Error fetching yearly dengue count:", error);
    throw error;
  }
};

const fetchService = {
  getDengueReports,
  getCurrentCaseCount,
  getDengueCountPerBarangay,
  getYearlyDengueCount,
};

export default fetchService;
