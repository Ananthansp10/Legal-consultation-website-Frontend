import { axiosInstance as axios } from "../../config/axiox";
import { Signin } from "../../interface/SigninInterface";
import { SignupInterface } from "../../interface/userInterface/signupInterface";

export const registerUser=async(data:SignupInterface)=>{
    try {
        let result=await axios.post('/user/signup',data)
        console.log(result)
        if(result.data.success){
            return result;
        }else{
            throw new Error(result.data.message)
        }
    } catch (error:any) {
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
    }
}

export const signinService=async(data:Signin)=>{
    try {
        let result=await axios.post('/user/signin',data)
        return result
    } catch (error) {
        throw error;
    }
}

export const logoutService=async(userId:string)=>{
    try {
        let result=await axios.post(`/user/logout/:${userId}`)
        return result;
    } catch (error) {
        throw error;
    }
}

export const forgotPassword=async(email:string)=>{
    try {
        let result=await axios.post('/user/forgot-password',{email})
        return result;
    } catch (error) {
        throw error;
    }
}

export const changePaasword=async(data:any)=>{
    try {
        let result=await axios.post('/user/change-password',data)
        return result;
    } catch (error) {
        throw error;
    }
}

export const resetPassword=async(data:any)=>{
    try {
       let result=await axios.post('/user/reset-password',data)
       return result;
    } catch (error) {
        throw error;
    }
}

export const googleAuth=async()=>{
    try {
        window.open("http://localhost:5000/api/user/auth/google", "_self")
    } catch (error) {
        
    }
}

export const getGoogleAuthDetails=async()=>{
    try {
        let result=await axios.post('/user/getGoogleAuthDetails')
        return result;
    } catch (error) {
        throw error;
    }
    
}