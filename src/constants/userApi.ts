import { User } from "lucide-react";


export const USER_API = {
  GET_PROFILE: (userId: string) => `/user/get-profile/${userId}`,
  ADD_PROFILE: "/user/add-profile",
  EDIT_PROFILE: "/user/edit-profile",
  GET_LAWYERS: "/user/get-lawyers",
  GET_LAWYER_DETAILS: (lawyerId: string) => `/user/get-lawyer-details/${lawyerId}`,
  GET_LAWYER_SLOTS: (lawyerId: string, date: string) => `/user/get-slot-details/${lawyerId}/${date}`,
  FILTER_BY_SPECIALIZATION: (specialization: string) => `/user/filter-lawyer/${specialization}`,
  SEARCH_LAWYER: (name: string) => `/user/search-lawyer/${name}`,
  BOOK_APPOINTMENT: (caseId: string | undefined)=> `/user/book-appointment/${caseId}`,
  GET_APPOINTMENTS: (userId: string, appointmentStatus: string, startIndex: number, limit: number) => `/user/get-appointments/${userId}/${appointmentStatus}/${startIndex}/${limit}`,
  CANCEL_APPOINTMENT: (appointmentId: string) => `/user/cancel-appointment/${appointmentId}`,
  GET_TODAYS_APPOINTMENTS: (userId: string) => `/user/get-todays-appointments/${userId}`,
  RESHEDULE_APPOINTMENT: (appointmentId: string) => `/user/reshedule-appointment/${appointmentId}`,
  REPORT_LAWYER: `/user/report-lawyer`,
  GET_USER_CHAT: (userId: string, lawyerId: string) => `/user/get-user-chat/${userId}/${lawyerId}`,
  GET_USER_ALL_CHATS: (userId: string) => `/user/get-user-all-chats/${userId}`,
  GET_LAWYER_CHAT_PROFILE: (lawyerId: string) => `/user/get-lawyer-chat-profile/${lawyerId}`,
  ADD_REVIEW: (lawyerId: string) => `/user/add-review/${lawyerId}`,
  GET_REVIEW: (lawyerId: string) => `/user/get-review/${lawyerId}`
}