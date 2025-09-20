import { axiosInstance as axios } from "../../config/axiox"
import { LAWYER_AUTH_API } from "../../constants/lawyerAuthApi";

interface SaveNewPasswordData {
    email: string;
    password: string;
    token: string;
}

interface ResetPasswordData {
    email: string;
    oldPassword: string;
    newPassword: string;
}

export const register = async (data: FormData) => {
    try {
        let result = await axios.post(LAWYER_AUTH_API.SIGNUP, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        },)
        return result;
    } catch (error) {
        throw error;
    }
}

export const signin = async (data: { email: string, password: string }) => {
    try {
        let result = await axios.post(LAWYER_AUTH_API.SIGNIN, data)
        return result;
    } catch (error) {
        throw error;
    }
}

export const logout = async () => {
    try {
        let result = await axios.post(LAWYER_AUTH_API.LOGOUT)
        return result;
    } catch (error) {
        throw error;
    }
}

export const sendMail = async (data: { email: string }) => {
    try {
        return await axios.post(LAWYER_AUTH_API.FORGOT_PASSWORD_EMAIL, data)
    } catch (error) {
        throw error;
    }
}

export const saveNewPassword = async (data: SaveNewPasswordData) => {
    try {
        return await axios.post(LAWYER_AUTH_API.SAVE_NEW_PASSWORD, data)
    } catch (error) {
        throw error;
    }
}

export const resetPassword = async (data: ResetPasswordData) => {
    try {
        return await axios.post(LAWYER_AUTH_API.RESET_PASSWORD, data)
    } catch (error) {
        throw error;
    }
}