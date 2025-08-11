import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle } from 'lucide-react';
import { RAZORPAY_CONFIG, convertToAmount } from '../utils/razorpayConfig';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: {
    id: string;
    name: string;
    price: string;
    period: string;
    features: string[];
  };
  onPaymentSuccess: (planName: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, selectedPlan, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'manual'>('razorpay');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    upiId: '',
    bank: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Convert price string to amount in paise (Razorpay expects amount in smallest currency unit)
  const getAmountInPaise = (priceString: string): number => {
    return convertToAmount(priceString);
  };

  const handleRazorpayPayment = () => {
    setIsProcessing(true);
    
    const amount = getAmountInPaise(selectedPlan.price);
    
    const options = {
      key: RAZORPAY_CONFIG.keyId,
      amount: amount,
      currency: RAZORPAY_CONFIG.currency,
      name: RAZORPAY_CONFIG.companyName,
      description: `Upgrade to ${selectedPlan.name} Plan`,
      image: RAZORPAY_CONFIG.companyLogo,
      handler: function (response: any) {
        console.log('Payment successful:', response);
        setIsProcessing(false);
        setPaymentComplete(true);
        
        // Wait for success animation, then call success callback
        setTimeout(() => {
          onPaymentSuccess(selectedPlan.id);
          onClose();
          setPaymentComplete(false);
        }, 2000);
      },
      prefill: {
        name: RAZORPAY_CONFIG.defaultCustomer.name,
        email: RAZORPAY_CONFIG.defaultCustomer.email,
        contact: RAZORPAY_CONFIG.defaultCustomer.contact
      },
      notes: {
        plan: selectedPlan.name,
        plan_id: selectedPlan.id,
        upgrade_from: 'free'
      },
      theme: {
        color: RAZORPAY_CONFIG.themeColor
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleManualPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate manual payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setPaymentComplete(true);

    // Wait for success animation, then call success callback
    setTimeout(() => {
      onPaymentSuccess(selectedPlan.id);
      onClose();
      setPaymentComplete(false);
    }, 2000);
  };

  if (paymentComplete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Welcome to {selectedPlan.name} plan. Your subscription is now active.
          </p>
          <div className="animate-pulse text-blue-600 dark:text-blue-400">
            Redirecting...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg p-2">
              <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upgrade to {selectedPlan.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Complete your payment to upgrade
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            disabled={isProcessing}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Plan Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">{selectedPlan.name} Plan</h4>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-800 dark:text-blue-200">
                  {selectedPlan.price}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">{selectedPlan.period}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {selectedPlan.features.slice(0, 4).map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-blue-700 dark:text-blue-300">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Method</h4>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-4 rounded-lg border-2 text-center transition-colors ${
                  paymentMethod === 'razorpay'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="w-6 h-6 mx-auto mb-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded text-white text-xs flex items-center justify-center font-bold">R</div>
                <div className="text-sm font-medium">Razorpay</div>
                <div className="text-xs text-gray-500 mt-1">Secure & Fast</div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('manual')}
                className={`p-4 rounded-lg border-2 text-center transition-colors ${
                  paymentMethod === 'manual'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <CreditCard className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Manual Entry</div>
                <div className="text-xs text-gray-500 mt-1">Test Mode</div>
              </button>
            </div>
          </div>

          {/* Payment Form */}
          {paymentMethod === 'razorpay' ? (
            <div className="space-y-4">
              {/* Razorpay Payment Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white text-sm flex items-center justify-center font-bold">R</div>
                  <div>
                    <h5 className="font-medium text-blue-800 dark:text-blue-200">Razorpay Secure Checkout</h5>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Multiple payment options available</p>
                  </div>
                </div>
                {RAZORPAY_CONFIG.keyId === 'rzp_test_1234567890' && (
                  <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded p-2 mb-3">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      <strong>Developer Note:</strong> Update RAZORPAY_CONFIG.keyId in utils/razorpayConfig.ts with your actual Razorpay Key ID
                    </p>
                  </div>
                )}
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Credit/Debit Cards (Visa, MasterCard, RuPay)</li>
                  <li>• UPI (GPay, PhonePe, Paytm, etc.)</li>
                  <li>• Net Banking (All major banks)</li>
                  <li>• Wallets (Paytm, FreeCharge, etc.)</li>
                </ul>
              </div>

              {/* Security Note */}
              <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Lock className="w-4 h-4" />
                  <span>Your payment is secured with 256-bit SSL encryption by Razorpay</span>
                </div>
              </div>

              {/* Razorpay Payment Button */}
              <button
                type="button"
                onClick={handleRazorpayPayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Opening Razorpay...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay {selectedPlan.price} with Razorpay</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <form onSubmit={handleManualPayment} className="space-y-4">
              {/* Manual Payment Form */}
              <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Test Mode - Manual Entry</h5>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  This is for testing purposes. In production, use Razorpay for secure payments.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name on Card
                </label>
                <input
                  type="text"
                  name="nameOnCard"
                  value={formData.nameOnCard}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Security Note */}
              <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Lock className="w-4 h-4" />
                  <span>Test mode - No actual payment will be processed</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay {selectedPlan.price} (Test)</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
