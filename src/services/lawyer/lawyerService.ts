import { axiosInstance as axios } from "../../config/axiox"
import { LAWYER_API } from "../../constants/lawyerApi";


interface BreakTime {
  startTime: string;
  endTime: string;
}

interface BookingRule {
  ruleName: string;
  description: string;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  priority: number;
  breakTimes: BreakTime[];
  bufferTime: number;
}

export const addSlot=async(lawyerId:string,data:BookingRule)=>{
    try {
      return await axios.post(LAWYER_API.ADD_SLOT(lawyerId),data)
    } catch (error) {
        throw error;
    }
}

export const getSlot=async(lawyerId:string,type:string)=>{
  try {
    let result= await axios.get(LAWYER_API.GET_SLOT(lawyerId,type))
    return result
  } catch (error) {
    throw error;
  }
}

export const updateRuleStatus=async(ruleId:string,ruleStatus:boolean)=>{
  try {
    return await axios.patch(LAWYER_API.UPDATE_RULE_STATUS(ruleId,ruleStatus))
  } catch (error) {
    throw error
  }
}

export const getAppointments=async(lawyerId:string,appointmentStatus:string)=>{
  try {
    return axios.get(LAWYER_API.GET_APPOINTMENTS(lawyerId,appointmentStatus))
  } catch (error) {
    throw error
  }
}

export const updateAppointmentStatus=async(id:string,status:string)=>{
  try {
    return axios.patch(LAWYER_API.UPDATE_APPOINTMENT_STATUS(id,status))
  } catch (error) {
    throw error
  }
}