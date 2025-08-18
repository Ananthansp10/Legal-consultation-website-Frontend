import { AxiosError } from "axios";
import { axiosInstance as axios } from "../../config/axiox"
import { User } from "../../interface/userInterface/userInterface";
import { ErrorResponse } from "../../interface/errorInterface";
import { OTP_API } from "../../constants/otpApi";

interface OtpVerificationData{
    userDetails:User
    otp:string;
}

export const otpService=async(data:OtpVerificationData)=>{
    try {
       let result= await axios.post(OTP_API.OTP_VERIFICATION,data)
       return result;
    } catch (error) {
        const errorResponse=error as AxiosError<ErrorResponse>
        const errorData=errorResponse.response?.data
        throw new Error(errorData?.message)
    }
}

export const resendOtp=async(data:User)=>{
    try {
        let result=await axios.post(OTP_API.RESEND_OTP,data)
        return result;
    } catch (error) {
        const errorResponse=error as AxiosError<ErrorResponse>
        const errorData=errorResponse.response?.data
        throw new Error(errorData?.message)
    }
}