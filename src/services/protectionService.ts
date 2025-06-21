import { axiosInstance as axios } from "../config/axiox"

export const isValidUser=async()=>{
    try {
        let valid=await axios.get('/user/checkAuth')
        return valid;
    } catch (error) {
        
    }
}