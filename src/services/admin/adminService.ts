import { axiosInstance as axios } from "../../config/axiox";
import { ADMIN_API } from "../../constants/adminApi";

interface SpecializationData {
  specId?: string;
  name: string;
  description: string;
  isDeleted: boolean;
}

export interface PlanData {
  name: string;
  price: number;
  duration: number;
  planType: string;
  features: string[];
}

export const addSpecialization = async (data: SpecializationData) => {
  try {
    const result = await axios.post(ADMIN_API.ADD_SPECIALIZATION, data);
    return result;
  } catch (error) {
    throw error;
  }
};

export const getSpecialization = async (startIndex: number, limit: number) => {
  try {
    const result = await axios.get(
      ADMIN_API.GET_SPECIALIZATION(startIndex, limit),
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const editSpecialization = async (data: SpecializationData) => {
  try {
    return await axios.post(ADMIN_API.EDIT_SPECIALIZATION, data);
  } catch (error) {
    throw error;
  }
};

export const deleteSpecialization = async (specId: string) => {
  try {
    return await axios.post(ADMIN_API.DELETE_SPECIALIZATION(specId));
  } catch (error) {
    throw error;
  }
};

export const getAppointments = async (
  appointmentStatus: string,
  startIndex: number,
  limit: number,
) => {
  try {
    return await axios.get(
      ADMIN_API.GET_APPOINTMENTS(appointmentStatus, startIndex, limit),
    );
  } catch (error) {
    throw error;
  }
};

export const getReportedAccounts = async (
  userType: string,
  startIndex: number,
  limit: number,
) => {
  try {
    return await axios.get(
      ADMIN_API.GET_REPORTED_ACCOUNTS(userType, startIndex, limit),
    );
  } catch (error) {
    throw error;
  }
};

export const updateReportedAccountStatus = async (
  reportedAccountId: string,
) => {
  try {
    await axios.post(
      ADMIN_API.UPDATE_REPORTED_ACCOUNT_STATUS(reportedAccountId),
    );
  } catch (error) {
    throw error;
  }
};

export const addSubscriptionPlans = async (data: PlanData) => {
  try {
    return await axios.post(ADMIN_API.ADD_SUBSCRIPTION_PLAN, data);
  } catch (error) {
    throw error;
  }
};

export const getSubscriptionPlans = async () => {
  try {
    return await axios.get(ADMIN_API.GET_SUBSCRIPTION_PLANS);
  } catch (error) {
    throw error;
  }
};

export const changePlanStatus = async (planId: string, status: string) => {
  try {
    return await axios.post(ADMIN_API.MANAGE_PLAN_STATUS(planId, status));
  } catch (error) {
    throw error;
  }
};

export const planDelete = async (planId: string) => {
  try {
    return await axios.post(ADMIN_API.DELETE_PLAN(planId));
  } catch (error) {
    throw error;
  }
};

export const planEdit = async (planId: string, data: PlanData) => {
  try {
    return await axios.put(ADMIN_API.EDIT_PLAN(planId), data);
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    return await axios.get(ADMIN_API.GET_USER_PROFILE(userId));
  } catch (error) {
    throw error;
  }
};

export const getLawyerProfile = async (lawyerId: string) => {
  try {
    return await axios.get(ADMIN_API.GET_LAWYER_PROFILE(lawyerId));
  } catch (error) {
    throw error;
  }
};

export const getSummaryReport = async () => {
  try {
    return await axios.get(ADMIN_API.GET_SUMMARY_REPORT);
  } catch (error) {
    throw error;
  }
};

export const getReports = async (
  revenueDateRange: string,
  specializationType: string,
) => {
  try {
    return await axios.get(
      ADMIN_API.GET_REPORTS(revenueDateRange, specializationType),
    );
  } catch (error) {
    throw error;
  }
};

export const searchAppointment = async (name: string) => {
  try {
    return await axios.get(ADMIN_API.SEARCH_APPOINTMENT(name));
  } catch (error) {
    throw error;
  }
};

export const getPlanSummaryReport = async () => {
  try {
    return await axios.get(ADMIN_API.GET_PLAN_SUMMARY_REPORT);
  } catch (error) {
    throw error;
  }
};

export const searchPlan = async (planName: string) => {
  try {
    return await axios.get(ADMIN_API.SEARCH_PLAN(planName));
  } catch (error) {
    throw error;
  }
};
