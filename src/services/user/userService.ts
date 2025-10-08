import { axiosInstance as axios } from "../../config/axiox";
import { LAWYER_API } from "../../constants/lawyerApi";
import { USER_API } from "../../constants/userApi";

interface AppointmentData {
  lawyerId: string;
  userId: string;
  date: string;
  time: string;
  consultationMode: string;
  problem: string;
  fee: number;
}

interface ReportData {
  reportedId: string;
  userType: string;
  reason: string;
  description: string;
  reporterId: string;
}

interface Review {
  userName: string;
  date: string;
  feedback: string;
  rating: number;
}

export const getLawyers = async () => {
  try {
    const result = await axios.get(USER_API.GET_LAWYERS);
    return result;
  } catch (error) {
    throw error;
  }
};

export const getLawyerDetails = async (lawyerId: string) => {
  try {
    const result = await axios.get(USER_API.GET_LAWYER_DETAILS(lawyerId));
    return result;
  } catch (error) {
    throw error;
  }
};

export const getLawyerSlots = async (lawyerId: string, date: string) => {
  try {
    const result = await axios.get(USER_API.GET_LAWYER_SLOTS(lawyerId, date));
    return result;
  } catch (error) {
    throw error;
  }
};

export const filterLawyerBySpecialization = async (specialization: string) => {
  try {
    const result = await axios.get(
      USER_API.FILTER_BY_SPECIALIZATION(specialization),
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const searchLawyer = async (name: string) => {
  try {
    const result = await axios.get(USER_API.SEARCH_LAWYER(name));
    return result;
  } catch (error) {
    throw error;
  }
};

export const bookAppointment = async (
  data: AppointmentData,
  caseId: string | undefined,
) => {
  try {
    return await axios.post(USER_API.BOOK_APPOINTMENT(caseId), data);
  } catch (error) {
    throw error;
  }
};

export const getAppointments = async (
  userId: string,
  appointmentStatus: string,
  startIndex: number,
  limit: number,
) => {
  try {
    return await axios.get(
      USER_API.GET_APPOINTMENTS(userId, appointmentStatus, startIndex, limit),
    );
  } catch (error) {
    throw error;
  }
};

export const cancelAppointment = async (appointmentId: string) => {
  try {
    return await axios.post(USER_API.CANCEL_APPOINTMENT(appointmentId));
  } catch (error) {
    throw error;
  }
};

export const getTodaysAppointments = async (userId: string) => {
  try {
    return await axios.get(USER_API.GET_TODAYS_APPOINTMENTS(userId));
  } catch (error) {
    throw error;
  }
};

export const resheduleAppointment = async (appointmentId: string) => {
  try {
    return await axios.post(USER_API.RESHEDULE_APPOINTMENT(appointmentId));
  } catch (error) {
    throw error;
  }
};

export const reportAccount = async (data: ReportData) => {
  try {
    return axios.post(USER_API.REPORT_LAWYER, data);
  } catch (error) {
    throw error;
  }
};

export const getUserChat = async (userId: string, lawyerId: string) => {
  try {
    return await axios.get(USER_API.GET_USER_CHAT(userId, lawyerId));
  } catch (error) {
    throw error;
  }
};

export const getUserAllChats = async (userId: string) => {
  try {
    return await axios.get(USER_API.GET_USER_ALL_CHATS(userId));
  } catch (error) {
    throw error;
  }
};

export const getLawyerChatProfile = async (lawyerId: string) => {
  try {
    return await axios.get(USER_API.GET_LAWYER_CHAT_PROFILE(lawyerId));
  } catch (error) {
    throw error;
  }
};

export const addBankAccount = async (data: any) => {
  try {
    return await axios.post(LAWYER_API.ADD_BANK_ACCOUNT, data);
  } catch (error) {
    throw error;
  }
};

export const addReview = async (lawyerId: string, data: Review) => {
  try {
    return await axios.post(USER_API.ADD_REVIEW(lawyerId), data);
  } catch (error) {
    throw error;
  }
};

export const getReview = async (lawyerId: string) => {
  try {
    return await axios.get(USER_API.GET_REVIEW(lawyerId));
  } catch (error) {
    throw error;
  }
};

export const getTopLawyers = async () => {
  try {
    return await axios.get(USER_API.GET_TOP_LAWYERS);
  } catch (error) {
    throw error;
  }
};
