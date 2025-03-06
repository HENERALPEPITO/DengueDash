const submitForm = async (formData: any) => {
  try {
    const response = await axiosInstance.post("case/create/", formData);
    return response.data;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};

const predictCases = async () => {
  try {
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
    const response = await axiosInstance.post("predict", futureWeather);
    return response.data;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};

const postService = { submitForm, predictCases };

export default postService;
