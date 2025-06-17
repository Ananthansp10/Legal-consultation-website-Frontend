import { axiosInstance as axios } from "../../config/axiox"


export const otpService=async(data:any)=>{
    try {
       let result= await axios.post('/user/otp-verification',data)
       return result;
    } catch (error:any) {
        throw new Error(error.response.data.message)
    }
}

export const resendOtp=async(data:any)=>{
    try {
        let result=await axios.post('/user/resend-otp',data)
        return result;
    } catch (error:any) {
        throw new Error(error.response.data.message)
    }
}