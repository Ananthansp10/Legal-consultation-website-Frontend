import { axiosInstance as axios } from "../../config/axiox";

export const getProfile=async(userId:any)=>{
    try {
        let data:any=await axios.get(`/user/get-profile/${userId}`)
        return data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const addProfile=async(data:any)=>{
    try {
        let result=await axios.post('/user/add-profile',data,{headers:{"Content-Type":'multipart/formData'}})
        return result;
    } catch (error) {
        throw error;
    }
}

export const editProfile=async(data:any)=>{
    try {
        let result=await axios.put('/user/edit-profile',data,{headers:{'Content-Type':'multipart/formData'}})
        return result;
    } catch (error) {
       throw error; 
    }
}