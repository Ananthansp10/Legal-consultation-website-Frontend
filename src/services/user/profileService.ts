import { axiosInstance as axios } from "../../config/axiox";
import { USER_API } from "../../constants/userApi";

export const getProfile = async (userId: string) => {
  try {
    const data = await axios.get(USER_API.GET_PROFILE(userId));
    return data;
  } catch (error) {
    throw error;
  }
};

export const addProfile = async (data: FormData) => {
  try {
    const result = await axios.post(USER_API.ADD_PROFILE, data, {
      headers: { "Content-Type": "multipart/formData" },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const editProfile = async (data: FormData) => {
  try {
    const result = await axios.put(USER_API.EDIT_PROFILE, data, {
      headers: { "Content-Type": "multipart/formData" },
    });
    return result;
  } catch (error) {
    throw error;
  }
};
