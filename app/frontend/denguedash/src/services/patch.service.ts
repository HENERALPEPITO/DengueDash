import { axiosClient } from "./auth.service";

const OPERATION = "PATCH";
const DEFAULT_DATA = null;
const DEFAULT_PARAMS = {};

const approveUserVerification = async (userId: number) => {
  return axiosClient(
    `user/verify/${userId}/`,
    OPERATION,
    DEFAULT_DATA,
    DEFAULT_PARAMS
  );
};

const toggleUserRole = async (userId: number) => {
  return axiosClient(
    `user/toggle-role/${userId}/`,
    OPERATION,
    DEFAULT_DATA,
    DEFAULT_PARAMS
  );
};

const patchService = { approveUserVerification, toggleUserRole };

export default patchService;
