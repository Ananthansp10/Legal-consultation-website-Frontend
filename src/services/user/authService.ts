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