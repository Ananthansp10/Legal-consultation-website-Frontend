import { axiosInstance as axios} from "../../config/axiox"
import { ADMIN_API } from "../../constants/adminApi";

export const unverifiedLawyersListing=async()=>{
    try {
        let result=await axios.get(ADMIN_API.UNVERIFIED_LAWYERS,{params:{role:'admin'}})
        return result;
    } catch (error) {
        throw error;
    }
}

export const verifyLawyer=async(lawyerId:string,status:string,reason:string | null)=>{
    try {
        let result=await axios.patch(ADMIN_API.VERIFY_LAWYER(lawyerId,status,reason),{role:'admin'})
        return result;
    } catch (error) {
        throw error;
    }
}

export const getLawyers=async(startIndex:number,limit:number)=>{
    try {
       let result=await axios.get(ADMIN_API.GET_LAWYERS(startIndex,limit),{params:{role:'admin'}})
       return result;
    } catch (error) {
        throw error;
    }
}

export const updateLawyerStatus=async(lawyerId:string,status:string)=>{
    try {
        let result=await axios.patch(ADMIN_API.UPDATE_LAWYER_STATUS(lawyerId,status))
        return result;
    } catch (error) {
        throw error;
    }
}

export const searchLawyer=async(name:string)=>{
    try {
       return await axios.get(ADMIN_API.SEARCH_LAWYER(name)) 
    } catch (error) {
        throw error
    }
}

export const filterLawyer=async(status:string)=>{
    try {
        return await axios.get(ADMIN_API.FILTER_LAWYER(status))
    } catch (error) {
        throw error
    }
}