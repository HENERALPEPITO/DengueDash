import { axiosInstance } from "./auth.service";

const submitForm = async (formData: any) => {
  try {
    const response = await axiosInstance.post("case/create/", formData);
    return response.data;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};

const postService = { submitForm };

export default postService;
