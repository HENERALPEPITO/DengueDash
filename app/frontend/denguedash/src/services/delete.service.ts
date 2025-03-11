import { axiosClient } from "./auth.service";

const OPERATION = "DELETE";
const DEFAULT_DATA = null;
const DEFAULT_PARAMS = {};

const deleteCase = async (caseId: number) => {
  return axiosClient(
    `case/delete/${caseId}/`,
    OPERATION,
    DEFAULT_DATA,
    DEFAULT_PARAMS
  );
};

const deleteUnverifiedUser = async (userId: number) => {
  return axiosClient(
    `user/delete/${userId}/`,
    OPERATION,
    DEFAULT_DATA,
    DEFAULT_PARAMS
  );
};

const deleteService = {
  deleteCase,
  deleteUnverifiedUser,
};

export default deleteService;
