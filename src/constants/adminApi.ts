import { PlanData } from "../services/admin/adminService";


export const ADMIN_API={
    GET_USERS: "/admin/getusers",
    UPDATE_USER_STATUS: (userId: string, status: string) => `/admin/user/${userId}/${status}`,
    UNVERIFIED_LAWYERS: "/admin/unverifiedLawyers",
    VERIFY_LAWYER: (lawyerId: string, status: string, reason: string | null) => `/admin/verification/${lawyerId}/${status}/${reason ?? "null"}`,
    GET_LAWYERS: "/admin/getlawyers",
    UPDATE_LAWYER_STATUS: (lawyerId: string, status: string) => `/admin/lawyer/${lawyerId}/${status}`,
    ADD_SPECIALIZATION: "/admin/add-specialization",
    GET_SPECIALIZATION: "/admin/get-specialization",
    EDIT_SPECIALIZATION: "/admin/edit-specialization",
    DELETE_SPECIALIZATION: (specId:string)=> `/admin/delete-specialization/${specId}`,
    GET_APPOINTMENTS: (appointmentStatus:string)=> `/admin/get-appointments/${appointmentStatus}`,
    GET_REPORTED_ACCOUNTS: (userType:string)=> `/admin/reported-accounts/${userType}`,
    UPDATE_REPORTED_ACCOUNT_STATUS: (reportedAccountId:string)=> `/admin/update-reportedAccount-status/${reportedAccountId}`,
    ADD_SUBSCRIPTION_PLAN: `/admin/add-plan`,
    GET_SUBSCRIPTION_PLANS: '/admin/plans',
    MANAGE_PLAN_STATUS: (planId:string,status:string)=> `/admin/manage-plan-status/${planId}/${status}`,
    DELETE_PLAN: (planId:string)=> `/admin/delete-plan/${planId}`,
    EDIT_PLAN: (planId:string)=> `/admin/edit-plan/${planId}`,
    SEARCH_USER: (name:string)=> `/admin/search-user/${name}`,
    SEARCH_LAWYER: (name:string)=> `/admin/search-lawyer/${name}`,
    FILTER_USER: (status:string)=> `/admin/filter-user/${status}`,
    FILTER_LAWYER: (status:string)=> `/admin/filter-lawyer/${status}`
}