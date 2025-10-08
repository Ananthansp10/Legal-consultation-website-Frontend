import { toast } from "react-toastify";
import { verifyRazorpayPayment } from "../services/lawyer/lawyerService";
import { AxiosResponse } from "axios";
import { ApiResponse } from "../interface/userInterface/axiosResponseInterface";
import {
  RazorpayPaymentFailedResponse,
  RazorpayPaymentResponse,
} from "./razorpay";

export interface RazorpayOrder {
  id: string;
  entity: "order";
  amount: number;
  amount_paid: number;
  currency: string;
  receipt: string;
  status: "created" | "attempted" | "paid";
  attempts: number;
  notes: Record<string, string>;
  created_at?: number;
}

export function openRazorpayCheckout(
  order: RazorpayOrder,
): Promise<AxiosResponse<ApiResponse>> {
  return new Promise((resolve, reject) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: order.amount,
      currency: order.currency,
      name: "Legal Consultation",
      description: "Subscription Payment",
      order_id: order.id,
      handler: async function (paymentResponse: RazorpayPaymentResponse) {
        try {
          const response = await verifyRazorpayPayment({
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
          });
          resolve(response);
        } catch (error) {
          reject(error);
        }
      },
      prefill: {
        name: "John Doe",
        email: "john@example.com",
        contact: "9876543210",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();

    rzp.on(
      "payment.failed",
      function (response: RazorpayPaymentFailedResponse) {
        toast.error("Payment Failed");
        reject(response.error);
      },
    );

    // rzp.on("payment.success", (response) => {
    //   console.log("Success:", response.razorpay_payment_id);
    // });

    // rzp.on("payment.failed", (response:RazorpayPaymentFailedResponse) => {
    //   console.error("Failed:", response.error.reason);
    // });
  });
}
