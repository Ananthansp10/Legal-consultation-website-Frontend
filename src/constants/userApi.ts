

export const USER_API={
  GET_PROFILE: (userId: string) => `/user/get-profile/${userId}`,
  ADD_PROFILE: "/user/add-profile",
  EDIT_PROFILE: "/user/edit-profile",
  GET_LAWYERS: "/user/get-lawyers",
  GET_LAWYER_DETAILS: (lawyerId: string) => `/user/get-lawyer-details/${lawyerId}`,
  GET_LAWYER_SLOTS: (lawyerId: string, date: string) => `/user/get-slot-details/${lawyerId}/${date}`,
  FILTER_BY_SPECIALIZATION: (specialization: string) => `/user/filter-lawyer/${specialization}`,
  SEARCH_LAWYER: (name: string) => `/user/search-lawyer/${name}`,
  BOOK_APPOINTMENT: "/user/book-appointment",
  GET_APPOINTMENTS: (userId:string,appointmentStatus:string)=> `/user/get-appointments/${userId}/${appointmentStatus}`,
  CANCEL_APPOINTMENT: (appointmentId:string)=> `/user/cancel-appointment/${appointmentId}`,
  GET_TODAYS_APPOINTMENTS: (userId:string)=> `/user/get-todays-appointments/${userId}`,
  RESHEDULE_APPOINTMENT: (appointmentId:string)=> `/user/reshedule-appointment/${appointmentId}`,
  REPORT_LAWYER: (lawyerId:string)=> `/user/report-lawyer/${lawyerId}`,
}