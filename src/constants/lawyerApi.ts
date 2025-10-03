export const LAWYER_API = {
  ADD_PROFILE: "/lawyer/add-profile",
  GET_PROFILE: (lawyerId: string) => `/lawyer/get-profile/${lawyerId}`,
  EDIT_PROFILE: "/lawyer/edit-profile",
  ADD_SLOT: (lawyerId: string) => `/lawyer/add-slot/${lawyerId}`,
  GET_SLOT: (lawyerId: string, type: string) =>
    `/lawyer/get-slots/${lawyerId}/${type}`,
  UPDATE_RULE_STATUS: (ruleId: string, ruleStatus: boolean) =>
    `/lawyer/update-rule-status/${ruleId}/${ruleStatus}`,
  GET_APPOINTMENTS: (
    lawyerId: string,
    appointmentStatus: string,
    startIndex: number,
    limit: number
  ) =>
    `/lawyer/get-appointments/${lawyerId}/${appointmentStatus}/${startIndex}/${limit}`,
  UPDATE_APPOINTMENT_STATUS: (id: string, status: string, lawyerId: string) =>
    `/lawyer/appointment/${id}/${status}/${lawyerId}`,
  GET_PROFILE_IMAGE: (lawyerId: string) =>
    `/lawyer/get-profile-image/${lawyerId}`,
  GET_SUBSCRIPTION_PLANS: `/lawyer/subscription-plans`,
  CREATE_RAZORPAY_ORDER: "/lawyer/create-razorpay-order",
  VERIFY_RAZORPAY_PAYMENT: "/lawyer/verify-payment",
  ADD_PLAN: (lawyerId: string, planId: string, price: number) =>
    `/lawyer/add-plan/${lawyerId}/${planId}/${price}`,
  GET_ALL_CHATS: (lawyerId: string) => `/lawyer/get-all-chats/${lawyerId}`,
  GET_CHAT: (lawyerId: string, userId: string) =>
    `/lawyer/get-chat/${lawyerId}/${userId}`,
  GET_USER_CHAT_PROFILE: (userId: string) =>
    `/lawyer/get-user-chat-profile/${userId}`,
  UPDATE_CHAT_READ_STATUS: (lawyerId: string, userId: string) =>
    `/lawyer/update-chat-read-status/${lawyerId}/${userId}`,
  ADD_BANK_ACCOUNT: "/lawyer/add-bank-account",
  GET_SUMMARY: (lawyerId: string) => `/lawyer/get-summary/${lawyerId}`,
  CHECK_BANK_DETAILS: (lawyerId: string) =>
    `/lawyer/check-bank-details/${lawyerId}`,
  GET_CONSULTATION_HISTORY: (caseId: string) =>
    `/lawyer/get-consultation-history/${caseId}`,
  START_MEETING: (appointmentId: string) =>
    `/lawyer/start-meeting/${appointmentId}`,
  ADD_FINAL_NOTE : (appointmentId: string) => `/lawyer/add-notes/${appointmentId}`,
  ADD_FEEDBACK : (appointmentId: string) => `/lawyer/add-feedback/${appointmentId}`
};
