import { axiosClient } from "./auth.service";

const OPERATION = "POST";
const PARAMS = {};

const submitForm = async (formData: any) => {
  return axiosClient("case/create/", OPERATION, formData, PARAMS);
};

const predictCases = async () => {
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
  return axiosClient("predict", OPERATION, futureWeather, PARAMS);
};

const postService = { submitForm, predictCases };

export default postService;
