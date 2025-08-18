import { axiosInstance as axios } from "../../config/axiox";
import { USER_API } from "../../constants/userApi";

interface AppointmentData{
    lawyerId:string;
    userId:string;
    date:string;
    time:string;
    consultationMode:string;
    problem:string;
}

export const getLawyers=async()=>{
    try {
        let result=await axios.get(USER_API.GET_LAWYERS)
        return result;
    } catch (error) {
        throw error;
    }
}

export const getLawyerDetails=async(lawyerId:string)=>{
    try {
        let result=await axios.get(USER_API.GET_LAWYER_DETAILS(lawyerId))
        return result;
    } catch (error) {
        throw error;
    }
}

export const getLawyerSlots=async(lawyerId:string,date:string)=>{
    try {
       let result=await axios.get(USER_API.GET_LAWYER_SLOTS(lawyerId,date))
       return result
    } catch (error) {
       throw error 
    }
}

export const filterLawyerBySpecialization=async(specialization:string)=>{
    try {
       let result=await axios.get(USER_API.FILTER_BY_SPECIALIZATION(specialization))
       return result
    } catch (error) {
       throw error 
    }
}

export const searchLawyer=async(name:string)=>{
    try {
       let result=await axios.get(USER_API.SEARCH_LAWYER(name))
       return result
    } catch (error) {
        throw error
    }
}

export const bookAppointment=async(data:AppointmentData)=>{
    try {
       return await axios.post(USER_API.BOOK_APPOINTMENT,data)
    } catch (error) {
        throw error
    }
}

export const getAppointments=async(userId:string,appointmentStatus:string)=>{
    try {
       return await axios.get(USER_API.GET_APPOINTMENTS(userId,appointmentStatus))
    } catch (error) {
        throw error
    }
}

export const cancelAppointment=async(appointmentId:string)=>{
    try {
        return await axios.post(USER_API.CANCEL_APPOINTMENT(appointmentId))
    } catch (error) {
        throw error
    }
}

export const getTodaysAppointments=async(userId:string)=>{
    try {
        return await axios.get(USER_API.GET_TODAYS_APPOINTMENTS(userId))
    } catch (error) {
        throw error
    }
}

export const resheduleAppointment=async(appointmentId:string)=>{
    try {
       return await axios.post(USER_API.RESHEDULE_APPOINTMENT(appointmentId))
    } catch (error) {
        throw error
    }
}

export const reportLawyer=async(lawyerId:string)=>{
    try {
        return axios.post(USER_API.REPORT_LAWYER(lawyerId))
    } catch (error) {
        throw error
    }
}