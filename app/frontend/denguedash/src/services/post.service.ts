import { SignUpUserInterface } from "@/interfaces/account/sign-up.interface";
import { axiosClient } from "./auth.service";

const OPERATION = "POST";
const DEFAULT_PARAMS = {};

const submitForm = async (formData: any) => {
  return axiosClient("case/create/", OPERATION, formData, DEFAULT_PARAMS);
};

const signUpUser = async (formData: SignUpUserInterface) => {
  return axiosClient("register/user/", OPERATION, formData, DEFAULT_PARAMS);
};

const predictCases = async () => {
  // todo: use data from openweatherapi
  const futureWeather = {
    future_weather: [
      {
        rainfall: 45.5,
        max_temperature: 32.1,
        humidity: 85.0,
      },
      {
        rainfall: 43.2,
        max_temperature: 31.8,
        humidity: 83.5,
      },
      {
        rainfall: 41.8,
        max_temperature: 32.3,
        humidity: 82.0,
      },
      {
        rainfall: 44.5,
        max_temperature: 31.9,
        humidity: 84.5,
      },
      {
        rainfall: 42.7,
        max_temperature: 32.5,
        humidity: 83.0,
      },
    ],
  };
  return axiosClient("predict/", OPERATION, futureWeather, DEFAULT_PARAMS);
};

const postService = { submitForm, predictCases, signUpUser };

export default postService;
