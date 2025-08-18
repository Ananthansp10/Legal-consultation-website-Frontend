import { AxiosResponse } from "axios";
import { User } from "../interface/userInterface/userInterface";
import { verifyPayment } from "../services/user/paymentService";
import { ApiResponse } from "../interface/userInterface/axiosResponseInterface";

interface CreateOrderData {
  amount: number;
  orderId: string;
  currency: string;
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayPaymentFailedResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}


export const handlePayment = (
  data: CreateOrderData,
  user: User,
  appointmentId: string
): Promise<AxiosResponse<ApiResponse>> => {
  return new Promise((resolve, reject) => {
    try {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: data.currency,
        name: "Legal Connect",
        description: "Consultation Payment",
        order_id: data.orderId,
        handler: async function (response: RazorpayPaymentResponse) {
          try {
            const res = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              appointmentId: appointmentId,
            });
            resolve(res);
          } catch (err) {
            reject(err);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response: RazorpayPaymentFailedResponse) {
        reject(response.error);
      });
    } catch (err) {
      reject(err);
    }
  });
};
