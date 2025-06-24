import { axiosInstance as axios } from "../config/axiox"

export const isValidUser=async(data:any)=>{
    try {
        let valid=await axios.post('/user/checkAuth',data)
        return valid;
    } catch (error) {
        throw error;
    }
}