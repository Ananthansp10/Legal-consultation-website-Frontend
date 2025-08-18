

export const LAWYER_API={
  ADD_PROFILE: "/lawyer/add-profile",
  GET_PROFILE: (lawyerId: string) => `/lawyer/get-profile/${lawyerId}`,
  EDIT_PROFILE: "/lawyer/edit-profile",
  ADD_SLOT: (lawyerId:string) => `/lawyer/add-slot/${lawyerId}`,
  GET_SLOT: (lawyerId:string,type:string) => `/lawyer/get-slots/${lawyerId}/${type}`,
  UPDATE_RULE_STATUS: (ruleId:string,ruleStatus:boolean) => `/lawyer/update-rule-status/${ruleId}/${ruleStatus}`,
  GET_APPOINTMENTS: (lawyerId:string,appointmentStatus:string) => `/lawyer/get-appointments/${lawyerId}/${appointmentStatus}`,
  UPDATE_APPOINTMENT_STATUS: (id:string,status:string) => `/lawyer/appointment/${id}/${status}`,
}