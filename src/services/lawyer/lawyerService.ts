import { axiosInstance as axios } from "../../config/axiox";
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

interface RazorpayPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const addSlot = async (lawyerId: string, data: BookingRule) => {
  try {
    return await axios.post(LAWYER_API.ADD_SLOT(lawyerId), data);
  } catch (error) {
    throw error;
  }
};

export const getSlot = async (lawyerId: string, type: string) => {
  try {
    const result = await axios.get(LAWYER_API.GET_SLOT(lawyerId, type));
    return result;
  } catch (error) {
    throw error;
  }
};

export const updateRuleStatus = async (ruleId: string, ruleStatus: boolean) => {
  try {
    return await axios.patch(LAWYER_API.UPDATE_RULE_STATUS(ruleId, ruleStatus));
  } catch (error) {
    throw error;
  }
};

export const getAppointments = async (
  lawyerId: string,
  appointmentStatus: string,
  startIndex: number,
  limit: number,
) => {
  try {
    return axios.get(
      LAWYER_API.GET_APPOINTMENTS(
        lawyerId,
        appointmentStatus,
        startIndex,
        limit,
      ),
    );
  } catch (error) {
    throw error;
  }
};

export const updateAppointmentStatus = async (
  id: string,
  status: string,
  lawyerId: string,
) => {
  try {
    return axios.patch(
      LAWYER_API.UPDATE_APPOINTMENT_STATUS(id, status, lawyerId),
    );
  } catch (error) {
    throw error;
  }
};

export const getSubscriptionPlans = async () => {
  try {
    return axios.get(LAWYER_API.GET_SUBSCRIPTION_PLANS);
  } catch (error) {
    throw error;
  }
};

export const createRazorpayOrder = async (planId: string, price: number) => {
  try {
    return await axios.post(LAWYER_API.CREATE_RAZORPAY_ORDER, {
      planId: planId,
      price: price,
    });
  } catch (error) {
    throw error;
  }
};

export const verifyRazorpayPayment = async (data: RazorpayPaymentData) => {
  try {
    return await axios.post(LAWYER_API.VERIFY_RAZORPAY_PAYMENT, data);
  } catch (error) {
    throw error;
  }
};

export const addPlan = async (
  lawyerId: string,
  planId: string,
  price: number,
) => {
  try {
    return await axios.post(LAWYER_API.ADD_PLAN(lawyerId, planId, price));
  } catch (error) {
    throw error;
  }
};

export const getAllChats = async (lawyerId: string) => {
  try {
    return await axios.get(LAWYER_API.GET_ALL_CHATS(lawyerId));
  } catch (error) {
    throw error;
  }
};

export const getChat = async (lawyerId: string, userId: string) => {
  try {
    return await axios.get(LAWYER_API.GET_CHAT(lawyerId, userId));
  } catch (error) {
    throw error;
  }
};

export const getUserChatProfile = async (userId: string) => {
  try {
    return await axios.get(LAWYER_API.GET_USER_CHAT_PROFILE(userId));
  } catch (error) {
    throw error;
  }
};

export const updateChatReadStatus = async (
  lawyerId: string,
  userId: string,
) => {
  try {
    await axios.post(LAWYER_API.UPDATE_CHAT_READ_STATUS(lawyerId, userId));
  } catch (error) {
    throw error;
  }
};

export const getSummary = async (lawyerId: string) => {
  try {
    return await axios.get(LAWYER_API.GET_SUMMARY(lawyerId));
  } catch (error) {
    throw error;
  }
};

export const checkBankDetails = async (lawyerId: string) => {
  try {
    return await axios.get(LAWYER_API.CHECK_BANK_DETAILS(lawyerId));
  } catch (error) {
    throw error;
  }
};

export const getConsultationHistory = async (caseId: string) => {
  try {
    return await axios.get(LAWYER_API.GET_CONSULTATION_HISTORY(caseId));
  } catch (error) {
    throw error;
  }
};

export const startMeeting = async (appointmentId: string) => {
  try {
    return await axios.post(LAWYER_API.START_MEETING(appointmentId));
  } catch (error) {
    throw error;
  }
};

export const addFinalNote = async (appointmentId: string, note: string) => {
  try {
    return await axios.post(LAWYER_API.ADD_FINAL_NOTE(appointmentId), {
      note: note,
    });
  } catch (error) {
    throw error;
  }
};

export const addFeedback = async (
  appointmentId: string,
  data: { feedback: string; rating: number },
) => {
  try {
    return await axios.post(LAWYER_API.ADD_FEEDBACK(appointmentId), data);
  } catch (error) {
    throw error;
  }
};

export const findStarterPlan = async (lawyerId: string) => {
  try {
    return await axios.get(LAWYER_API.FIND_STARTER_PLAN(lawyerId));
  } catch (error) {
    throw error;
  }
};
