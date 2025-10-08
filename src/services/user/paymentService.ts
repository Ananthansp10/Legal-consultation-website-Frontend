import { axiosInstance as axios } from "../../config/axiox";
import { PAYMENT_API } from "../../constants/paymentApi";

interface OrderData {
  id: string;
  fee: number;
  lawyerId: string;
}

interface PaymentData {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  appointmentId: string;
  razorpay_signature: string;
}

export const createRazorpayOrder = async (data: OrderData) => {
  try {
    return await axios.post(PAYMENT_API.CREATE_ORDER, data);
  } catch (error) {
    throw error;
  }
};

export const verifyPayment = async (data: PaymentData) => {
  try {
    return await axios.post(PAYMENT_API.VERIFY_PAYMENT, data);
  } catch (error) {
    throw error;
  }
};
