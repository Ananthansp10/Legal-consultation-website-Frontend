interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name?: string;
  description?: string;
  image?: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
}

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}






declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: "payment.success" | "payment.failed", callback: (response: RazorpayPaymentResponse) => void) => void;
      close: () => void;
    };
  }
}

export {};

