import React from 'react'

const SuccessPaymentPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div className="bg-green-100 border border-green-200 text-green-800 p-6 rounded-lg mb-6 text-center shadow-md">
      <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
      <p>Thank you for your purchase. Your transaction was successful.</p>
    </div>
    
    <button
      className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Back to Home
    </button>
  </div>
);
};



export default SuccessPaymentPage