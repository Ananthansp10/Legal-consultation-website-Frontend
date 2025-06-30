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

export const logout=async()=>{
    try {
        let result=await axios.post('/lawyer/logout')
        return result;
    } catch (error) {
        throw error;
    }
}

export const sendMail=async(data:any)=>{
    try {
       return await axios.post('/lawyer/forgot-password-email',data) 
    } catch (error) {
       throw error; 
    }
}

export const saveNewPassword=async(data:any)=>{
    try {
       return await axios.post('/lawyer/new-password',data)
    } catch (error) {
        throw error;
    }
}

export const resetPassword=async(data:any)=>{
    try {
        return await axios.post('/lawyer/reset-password',data)
    } catch (error) {
        throw error;
    }
}