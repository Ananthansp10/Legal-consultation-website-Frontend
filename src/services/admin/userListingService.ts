import { AxiosResponse } from "axios";
import { axiosInstance as axios } from "../../config/axiox"
import { ApiResponse } from "../../interface/userInterface/axiosResponseInterface";
import { ADMIN_API } from "../../constants/adminApi";

export const getUsers=async()=>{
    try {
        let result=await axios.get(ADMIN_API.GET_USERS)
        return result;
    } catch (error) {
        throw error;
    }
}

export const updateUserStatus=async(userId:string,status:string):Promise<AxiosResponse<ApiResponse>>=>{
    try {
        let result=await axios.patch(ADMIN_API.UPDATE_USER_STATUS(userId,status))
        return result;
    } catch (error) {
        throw  error;
    }
}