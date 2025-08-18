import { axiosInstance as axios } from "../../config/axiox"
import { ADMIN_AUTH_API } from "../../constants/adminAuthApi";

interface SigninData{
    email:string;
    password:string;
}

export const signin=async(data:SigninData)=>{
    try {
        let result=await axios.post( ADMIN_AUTH_API.SIGNIN,data)
        return result;
    } catch (error) {
        throw error;
    }
}

export const logout=async()=>{
    try {
       let result=await axios.post( ADMIN_AUTH_API.LOGOUT)
       return result;
    } catch (error) {
        throw error;
    }
}