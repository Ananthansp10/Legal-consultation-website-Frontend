import { axiosInstance as axios } from "../config/axiox"
import { COMMON_API } from "../constants/commonApi"

export const isValidUser=async(role:string)=>{
    try {
        let valid
        if(role=='user'){
            valid=await axios.post(COMMON_API.VERIFY_USER_AUTH)
        }else if(role=='lawyer'){
            valid=await axios.post(COMMON_API.VERIFY_LAWYER_AUTH)
        }else{
            valid=await axios.post(COMMON_API.VERIFY_ADMIN_AUTH)
        }
        return valid;
    } catch (error) {
        throw error;
    }
}