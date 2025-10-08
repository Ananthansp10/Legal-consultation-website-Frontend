export const ADMIN_API = {
  GET_USERS: (startIndex: number, limit: number) =>
    `/admin/getusers/${startIndex}/${limit}`,
  UPDATE_USER_STATUS: (userId: string, status: string) =>
    `/admin/user/${userId}/${status}`,
  UNVERIFIED_LAWYERS: "/admin/unverifiedLawyers",
  VERIFY_LAWYER: (lawyerId: string, status: string, reason: string | null) =>
    `/admin/verification/${lawyerId}/${status}/${reason ?? "null"}`,
  GET_LAWYERS: (startIndex: number, limit: number) =>
    `/admin/getlawyers?page=${startIndex}&limit=${limit}`,
  UPDATE_LAWYER_STATUS: (lawyerId: string, status: string) =>
    `/admin/lawyer/${lawyerId}/${status}`,
  ADD_SPECIALIZATION: "/admin/add-specialization",
  GET_SPECIALIZATION: (startIndex: number, limit: number) =>
    `/admin/get-specialization/${startIndex}/${limit}`,
  EDIT_SPECIALIZATION: "/admin/edit-specialization",
  DELETE_SPECIALIZATION: (specId: string) =>
    `/admin/delete-specialization/${specId}`,
  GET_APPOINTMENTS: (
    appointmentStatus: string,
    startIndex: number,
    limit: number,
  ) => `/admin/get-appointments/${appointmentStatus}/${startIndex}/${limit}`,
  GET_REPORTED_ACCOUNTS: (
    userType: string,
    startIndex: number,
    limit: number,
  ) => `/admin/reported-accounts/${userType}/${startIndex}/${limit}`,
  UPDATE_REPORTED_ACCOUNT_STATUS: (reportedAccountId: string) =>
    `/admin/update-reportedAccount-status/${reportedAccountId}`,
  ADD_SUBSCRIPTION_PLAN: `/admin/add-plan`,
  GET_SUBSCRIPTION_PLANS: "/admin/plans",
  MANAGE_PLAN_STATUS: (planId: string, status: string) =>
    `/admin/manage-plan-status/${planId}/${status}`,
  DELETE_PLAN: (planId: string) => `/admin/delete-plan/${planId}`,
  EDIT_PLAN: (planId: string) => `/admin/edit-plan/${planId}`,
  SEARCH_USER: (name: string) => `/admin/search-user/${name}`,
  SEARCH_LAWYER: (name: string) => `/admin/search-lawyer/${name}`,
  FILTER_USER: (status: string) => `/admin/filter-user/${status}`,
  FILTER_LAWYER: (status: string) => `/admin/filter-lawyer/${status}`,
  GET_USER_PROFILE: (userId: string) => `/admin/get-user-profile/${userId}`,
  GET_LAWYER_PROFILE: (lawyerId: string) =>
    `/admin/get-lawyer-profile/${lawyerId}`,
  GET_SUMMARY_REPORT: `/admin/get-summary-report`,
  GET_REPORTS: (revenueDateRange: string, specializationType: string) =>
    `/admin/get-reports/${revenueDateRange}/${specializationType}`,
  SEARCH_APPOINTMENT: (name: string) => `/admin/search-appointment/${name}`,
  GET_PLAN_SUMMARY_REPORT: "/admin/get-plan-summary-report",
  SEARCH_PLAN: (planName: string) => `/admin/search-plan/${planName}`,
};
