import { axiosInstance } from "./auth.service";

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

const getService = { getDengueReports };

export default getService;
