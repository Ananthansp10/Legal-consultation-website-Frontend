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

interface RazorpayPaymentData{
    razorpay_order_id:string;
    razorpay_payment_id:string;
    razorpay_signature:string;
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

export const updateAppointmentStatus=async(id:string,status:string,lawyerId:string)=>{
  try {
    return axios.patch(LAWYER_API.UPDATE_APPOINTMENT_STATUS(id,status,lawyerId))
  } catch (error) {
    throw error
  }
}

export const getSubscriptionPlans=async()=>{
  try {
    return axios.get(LAWYER_API.GET_SUBSCRIPTION_PLANS)
  } catch (error) {
    throw error
  }
}

export const createRazorpayOrder=async(planId:string,price:number)=>{
  try {
    return await axios.post(LAWYER_API.CREATE_RAZORPAY_ORDER,{planId:planId,price:price})
  } catch (error) {
    throw error
  }
}

export const verifyRazorpayPayment=async(data:RazorpayPaymentData)=>{
  try {
    return await axios.post(LAWYER_API.VERIFY_RAZORPAY_PAYMENT,data)
  } catch (error) {
    throw error
  }
}

export const addPlan=async(lawyerId:string,planId:string)=>{
  try {
    return await axios.post(LAWYER_API.ADD_PLAN(lawyerId,planId))
  } catch (error) {
    throw error
  }
}