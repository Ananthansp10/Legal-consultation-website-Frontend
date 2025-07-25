import { axiosInstance as axios } from "../config/axiox"

export const isValidUser=async(role:string)=>{
    try {
        let valid
        if(role=='user'){
            valid=await axios.post('/common/verify-auth')
        }else if(role=='lawyer'){
            valid=await axios.post('/common/verify-lawyer-auth')
        }else{
            valid=await axios.post('/common/verify-admin-auth')
        }
        return valid;
    } catch (error) {
        console.log(error)
        throw error;
    }
}