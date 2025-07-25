import { axiosInstance as axios } from "../../config/axiox"

export const addLawyerProfile=async(data:any)=>{
    try {
        let result=await axios.post('/lawyer/add-profile',data,{headers:{'Content-Type':'multipart/formData'}})
        return result;
    } catch (error) {
        throw error;
    }
}

export const getLawyerProfile=async(lawyerId:any)=>{
    try {
        let result=await axios.get(`/lawyer/get-profile/${lawyerId}`)
        return result;
    } catch (error) {
        throw error;
    }
}

export const editLawyerProfile=async(data:any)=>{
    try {
        let result=await axios.patch('/lawyer/edit-profile',data,{headers:{'Content-Type':'multipart-formData'}})
        return result;
    } catch (error) {
        throw error;
    }
}