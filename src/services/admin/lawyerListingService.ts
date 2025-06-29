import { axiosInstance as axios} from "../../config/axiox"

export const unverifiedLawyersListing=async()=>{
    try {
        let result=await axios.get('/admin/unverifiedLawyers',{params:{role:'admin'}})
        return result;
    } catch (error) {
        throw error;
    }
}

export const verifyLawyer=async(lawyerId:any,status:string,reason:string | null)=>{
    try {
        let result=await axios.patch(`/admin/verification/${lawyerId}/${status}/${reason}`,{role:'admin'})
        return result;
    } catch (error) {
        throw error;
    }
}

export const getLawyers=async()=>{
    try {
       let result=await axios.get('/admin/getlawyers',{params:{role:'admin'}})
       return result;
    } catch (error) {
        throw error;
    }
}

export const updateLawyerStatus=async(lawyerId:any,status:string)=>{
    try {
        let result=await axios.patch(`/admin/lawyer/${lawyerId}/${status}`)
        return result;
    } catch (error) {
        throw error;
    }
}