import { axiosInstance as axios } from "../../config/axiox"
import { User } from "../../interface/userInterface/userInterface";
import { OTP_API } from "../../constants/otpApi";

interface OtpVerificationData {
    userDetails: User
    otp: string;
}

export const otpService = async (data: OtpVerificationData) => {
    try {
        let result = await axios.post(OTP_API.OTP_VERIFICATION, data)
        return result;
    } catch (error) {
        throw error
    }
}

export const resendOtp = async (data: User) => {
    try {
        let result = await axios.post(OTP_API.RESEND_OTP, data)
        return result;
    } catch (error) {
        throw error
    }
}