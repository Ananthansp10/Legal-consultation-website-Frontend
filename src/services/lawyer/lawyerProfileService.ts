import { axiosInstance as axios } from "../../config/axiox";
import { LAWYER_API } from "../../constants/lawyerApi";

export const addLawyerProfile = async (data: FormData) => {
  try {
    const result = await axios.post(LAWYER_API.ADD_PROFILE, data, {
      headers: { "Content-Type": "multipart/formData" },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const getLawyerProfile = async (lawyerId: string) => {
  try {
    const result = await axios.get(LAWYER_API.GET_PROFILE(lawyerId));
    return result;
  } catch (error) {
    throw error;
  }
};

export const editLawyerProfile = async (data: FormData) => {
  try {
    const result = await axios.patch(LAWYER_API.EDIT_PROFILE, data, {
      headers: { "Content-Type": "multipart-formData" },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const getProfileImage = async (lawyerId: string) => {
  try {
    return axios.get(LAWYER_API.GET_PROFILE_IMAGE(lawyerId));
  } catch (error) {
    throw error;
  }
};
