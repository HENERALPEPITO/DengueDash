import { SignUpUserInterface } from "@/interfaces/account/sign-up.interface";
import { axiosClient, axiosClientUpload } from "./auth.service";
import { RegisterDRUInterface } from "@/interfaces/dru/dru.interface";
import { TrainingConfig } from "@/interfaces/forecasting/training.interface";

const OPERATION = "POST";
const DEFAULT_PARAMS = {};

// todo: be more specific with the type
// todo: do not use any
const submitForm = async (formData: any) => {
  return axiosClient("cases/create/", OPERATION, formData, DEFAULT_PARAMS);
};

const submitBulkForm = async (formData: any) => {
  // return axiosClient("cases/create/bulk/", OPERATION, formData, DEFAULT_PARAMS);
  return axiosClientUpload("cases/create/bulk/", formData);
};

const signUpUser = async (formData: SignUpUserInterface) => {
  return axiosClient("user/register/", OPERATION, formData, DEFAULT_PARAMS);
};

const registerDRU = async (formData: RegisterDRUInterface) => {
  return axiosClient("dru/register/", OPERATION, formData, DEFAULT_PARAMS);
};

const predictCases = async () => {
  // todo: use data from openweatherapi
  const futureWeather = {
    future_weather: [
      {
        rainfall: 2.032,
        max_temperature: 31.11111111,
        humidity: 84.21428571,
      },
      {
        rainfall: 0.762,
        max_temperature: 31.66666667,
        humidity: 81.28571429,
      },
    ],
  };
  return axiosClient(
    "forecasting/predict/",
    OPERATION,
    futureWeather,
    DEFAULT_PARAMS
  );
};

const retrainModel = async (formData: TrainingConfig) => {
  return axiosClient("forecasting/train/", OPERATION, formData, DEFAULT_PARAMS);
};

const postService = {
  submitForm,
  submitBulkForm,
  predictCases,
  retrainModel,
  signUpUser,
  registerDRU,
};

export default postService;
