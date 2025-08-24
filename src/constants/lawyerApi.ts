

export const LAWYER_API={
  ADD_PROFILE: "/lawyer/add-profile",
  GET_PROFILE: (lawyerId: string) => `/lawyer/get-profile/${lawyerId}`,
  EDIT_PROFILE: "/lawyer/edit-profile",
  ADD_SLOT: (lawyerId:string) => `/lawyer/add-slot/${lawyerId}`,
  GET_SLOT: (lawyerId:string,type:string) => `/lawyer/get-slots/${lawyerId}/${type}`,
  UPDATE_RULE_STATUS: (ruleId:string,ruleStatus:boolean) => `/lawyer/update-rule-status/${ruleId}/${ruleStatus}`,
  GET_APPOINTMENTS: (lawyerId:string,appointmentStatus:string) => `/lawyer/get-appointments/${lawyerId}/${appointmentStatus}`,
  UPDATE_APPOINTMENT_STATUS: (id:string,status:string,lawyerId:string) => `/lawyer/appointment/${id}/${status}/${lawyerId}`,
  GET_PROFILE_IMAGE: (lawyerId:string)=> `/lawyer/get-profile-image/${lawyerId}`,
  GET_SUBSCRIPTION_PLANS: `/lawyer/subscription-plans`,
  CREATE_RAZORPAY_ORDER:  '/lawyer/create-razorpay-order',
  VERIFY_RAZORPAY_PAYMENT: '/lawyer/verify-payment',
  ADD_PLAN: (lawyerId:string,planId:string)=> `/lawyer/add-plan/${lawyerId}/${planId}`
}