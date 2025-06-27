import { axiosInstance as axios } from "../../config/axiox"

export const register=async(data:any)=>{
    try {
        let result=await axios.post('/lawyer/signup',data,{headers: {
        'Content-Type': 'multipart/form-data',
      }},)
      return result;
    } catch (error) {
        throw error;
    }
}

export const signin=async(data:any)=>{
    try {
        let result=await axios.post('/lawyer/signin',data)
        return result;
    } catch (error) {
        throw error;
    }
}