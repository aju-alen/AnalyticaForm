import React, { useEffect, useState } from 'react';
import { Check, ArrowLeft, Download, Mail, Clock, CreditCard, Package, Share2, Printer, ChevronDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { axiosWithAuth } from '../utils/customAxios';
import { backendUrl } from '../utils/backendUrl'

const SuccessPaymentPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");

  console.log(sessionId, 'return query from stripe');

  const [isTimelineOpen, setIsTimelineOpen] = useState(true);
  const [getPurchaseDetails, setPurchaseDetails] = useState({});
  console.log(getPurchaseDetails, 'getPurchaseDetails');


  const fetchPurchaseDetails = async () => {
    try {
      const response = await axiosWithAuth.get(`${backendUrl}/api/survey-count/get-purchase-details/${sessionId}`);
      console.log(response.data);
      setPurchaseDetails(response.data.data);
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchPurchaseDetails();
  }, []);

  const orderDetails = {
    orderId: "ORD-2025-48596",
    date: "February 7, 2025",
    amount: "$249.99",
    paymentMethod: "Visa ending in 4242",
    items: [
      {
        name: "Premium Annual Subscription",
        price: "$199.99",
        details: "Includes unlimited access to all premium features"
      },
      {
        name: "Setup Fee",
        price: "$50.00",
        details: "One-time setup and configuration fee"
      }
    ],
    customer: {
      name: "John Smith",
      email: "john.smith@example.com",
      address: "123 Main St, New York, NY 10001"
    },
    timeline: [
      { time: "10:30 AM", status: "Order Placed", date: "Feb 7, 2025" },
      { time: "10:31 AM", status: "Payment Confirmed", date: "Feb 7, 2025" },
      { time: "10:32 AM", status: "Account Activated", date: "Feb 7, 2025" }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Message with Animation */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-green-100 mb-4 animate-bounce-small">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
          <p className="text-lg text-gray-600 mb-4">Thank you for your purchase. You can view the purchase details here.</p>
          <div className="inline-flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm">
            <Clock className="h-4 w-4 mr-2" />
            Transaction completed at {getPurchaseDetails?.updatedAt}
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
            <div className="flex justify-between items-center text-white">
              <div>
                <p className="text-sm opacity-80">Order Total</p>
                <p className="text-3xl font-bold">{getPurchaseDetails?.amountCurrency?.toUpperCase()} {(getPurchaseDetails?.amountPaid) / 100}</p>
              </div>
              <CreditCard className="h-8 w-8 opacity-80" />
            </div>
          </div>

          <div className="p-6">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">

                </span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
                <div className="space-y-1">
                  <p className="text-gray-800 font-medium">{getPurchaseDetails?.user?.firstName} {getPurchaseDetails?.user?.lastName}</p>
                  <p className="text-gray-600">{getPurchaseDetails?.user?.email}</p>
                  <p className="text-gray-600">{getPurchaseDetails?.stripeAddressLineOne}, {getPurchaseDetails?.stripeAddressLineTwo}</p>

                </div>
              </div>

              {/* Items */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Purchased Description</h3>

                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-800">Response Quantity</span>

                </div>
                <p className="text-sm text-gray-600">{getPurchaseDetails?.responseQuantity}</p>
                <br />

                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-800">Selected Regions</span>
                </div>
                <p className="text-sm text-gray-600">{getPurchaseDetails?.selectedRegions}</p>
                <br />

                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-800">Selected Industries</span>
                </div>
                <p className="text-sm text-gray-600">{getPurchaseDetails?.selectedIndustries}</p>
                <br />

                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-800">Selected Education Levels</span>
                </div>
                <p className="text-sm text-gray-600">{getPurchaseDetails?.selectedEducationLevels}</p>
                <br />

                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-800">Selected Work Experience</span>
                </div>
                <p className="text-sm text-gray-600">{getPurchaseDetails?.selectedExperience}</p>
                <br />

                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-800">Selected Position</span>
                </div>
                <p className="text-sm text-gray-600">{getPurchaseDetails?.selectedPositions}</p>
                <br />

              </div>

              {/* Payment Method */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Method</h3>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="text-gray-800">{getPurchaseDetails?.stripeCardBrand?.toUpperCase()} ending with {getPurchaseDetails?.stripeCardLastFourDigit}</p>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <a href={getPurchaseDetails?.stripeRecieptUrl} target="_blank" rel="noopener noreferrer">
  <button className="inline-flex items-center justify-center px-4 py-3 rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-200">
    <Download className="h-4 w-4 mr-2" />
    Download Receipt
  </button>
</a>
        
          <button
  className="inline-flex items-center justify-center px-4 py-3 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 transition-colors duration-200"
  onClick={() => window.print()}
>
  <Printer className="h-4 w-4 mr-2" />
  Print
</button>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPaymentPage;

// Add these styles to your CSS for the animations
const styles = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounce-small {
  0%, 100% { transform: translateY(-5%); }
  50% { transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-bounce-small {
  animation: bounce-small 2s infinite;
}
`;