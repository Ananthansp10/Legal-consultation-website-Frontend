import { axiosInstance as axios } from "../../config/axiox"

export const signin=async(data:any)=>{
    try {
        let result=await axios.post('/admin/signin',data)
        return result;
    } catch (error) {
        throw error;
    }
}

export const logout=async()=>{
    try {
       let result=await axios.post('/admin/logout')
       return result;
    } catch (error) {
        throw error;
    }
}