// Razorpay TypeScript declarations
declare global {
  interface Window {
    Razorpay: typeof Razorpay;
  }
}

declare class Razorpay {
  constructor(options: RazorpayOptions);
  open(): void;
  on(event: string, handler: Function): void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: { [key: string]: string };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export { Razorpay, RazorpayOptions, RazorpayResponse };
