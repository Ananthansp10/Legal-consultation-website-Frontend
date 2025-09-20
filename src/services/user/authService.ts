import { AxiosResponse } from "axios";
import { axiosInstance as axios } from "../../config/axiox";
import { Signin } from "../../interface/SigninInterface";
import { SignupInterface } from "../../interface/userInterface/signupInterface";
import { ApiResponse } from "../../interface/userInterface/axiosResponseInterface";
import { User } from "../../interface/userInterface/userInterface";
import { USER_AUTH_API } from "../../constants/userAuthApi";

interface ChangePasswordData {
    email: string;
    password: string;
}

interface ResetPasswordData {
    email: string;
    oldPassword: string;
    newPassword: string;
}

export const registerUser = async (data: SignupInterface): Promise<AxiosResponse<ApiResponse<User>>> => {
    try {
        let result = await axios.post(USER_AUTH_API.SIGNUP, data)
        return result
    } catch (error) {
        throw error
    }
}

export const signinService = async (data: Signin) => {
    try {
        let result = await axios.post(USER_AUTH_API.SIGNIN, data)
        return result
    } catch (error) {
        throw error;
    }
}

export const logoutService = async () => {
    try {
        let result = await axios.post(USER_AUTH_API.LOGOUT)
        return result;
    } catch (error) {
        throw error;
    }
}

export const forgotPassword = async (email: string) => {
    try {
        let result = await axios.post(USER_AUTH_API.FORGOT_PASSWORD, { email })
        return result;
    } catch (error) {
        throw error;
    }
}

export const changePaasword = async (data: ChangePasswordData) => {
    try {
        let result = await axios.post(USER_AUTH_API.CHANGE_PASSWORD, data)
        return result;
    } catch (error) {
        throw error;
    }
}

export const resetPassword = async (data: ResetPasswordData) => {
    try {
        let result = await axios.post(USER_AUTH_API.RESET_PASSWORD, data)
        return result;
    } catch (error) {
        throw error;
    }
}

export const googleAuth = async () => {
    try {
        window.open(USER_AUTH_API.GOOGLE_AUTH, "_self")
    } catch (error) {

    }
}

export const getGoogleAuthDetails = async () => {
    try {
        let result = await axios.get(USER_AUTH_API.GOOGLE_AUTH_DETAILS)
        return result;
    } catch (error) {
        throw error;
    }

}