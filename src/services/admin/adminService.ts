import { axiosInstance as axios } from "../../config/axiox";
import { ADMIN_API } from "../../constants/adminApi";

interface SpecializationData{
    specId ? :string
    name:string;
    description:string;
    isDeleted:boolean
}

export const addSpecialization=async(data:SpecializationData)=>{
    try {
        let result=await axios.post(ADMIN_API.ADD_SPECIALIZATION,data)
        return result;
    } catch (error) {
        throw error
    }
}

export const getSpecialization=async()=>{
    try {
        let result=await axios.get(ADMIN_API.GET_SPECIALIZATION)
        return result;
    } catch (error) {
        throw error;
    }
}

export const editSpecialization=async(data:SpecializationData)=>{
    try {
        return await axios.post(ADMIN_API.EDIT_SPECIALIZATION,data)
    } catch (error) {
        throw error
    }
}

export const deleteSpecialization=async(specId:string)=>{
    try {
        return await axios.post(ADMIN_API.DELETE_SPECIALIZATION(specId))
    } catch (error) {
        throw error
    }
}