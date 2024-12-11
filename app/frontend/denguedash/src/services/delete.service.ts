import { axiosInstance } from "./auth.service";

const deleteCase = async (caseId: number) => {
  try {
    await axiosInstance.delete(`case/delete/${caseId}`);
    return true;
  } catch (error) {
    console.error("Error deleting case", error);
    return false;
  }
};

const deleteService = {
  deleteCase,
};

export default deleteService;
