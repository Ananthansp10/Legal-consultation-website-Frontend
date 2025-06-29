import { axiosInstance as axios } from "../../config/axiox"


export const getUsers=async()=>{
    try {
        let result=await axios.get('/admin/getusers',{params:{role:'admin'}})
        return result;
    } catch (error) {
        throw error;
    }
}

export const updateUserStatus=async(userId:any,status:string)=>{
    try {
        let result=await axios.patch(`/admin/user/${userId}/${status}`)
        return result;
    } catch (error) {
        return error;
    }
}