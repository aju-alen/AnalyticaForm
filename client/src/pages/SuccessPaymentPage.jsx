import React from 'react';
import { Check, ArrowLeft, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuccessPaymentPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl mx-auto w-full">
        {/* Success Message with Animation */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-green-100 mb-6 animate-bounce-small">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-600 mb-6">
            Thank you for your payment. Your transaction has been completed successfully.
          </p>
        </div>

        {/* Email Notification Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 transition-all duration-300 hover:shadow-xl">
          <div className="p-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Check Your Email
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  We've sent a confirmation email with all the details about your payment. 
                  Please check your inbox (and spam folder) for:
                </p>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Payment confirmation and receipt</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Transaction details and invoice</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Next steps and account information</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <p className="text-sm text-blue-800 text-center">
            <strong>Note:</strong> If you don't see the email within a few minutes, please check your spam or junk folder. 
            For any questions or concerns, please contact our support team.
          </p>
        </div>

        {/* Back to Home Button */}
        <div className="text-center">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
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

// Inject styles if not already in global CSS
if (typeof document !== 'undefined' && !document.getElementById('success-page-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'success-page-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}