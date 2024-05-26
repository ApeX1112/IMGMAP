// src/pages/PaymentPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function PaymentPage() {
  const navigate = useNavigate();

  const handlePaymentSuccess = () => {
    localStorage.setItem('isPaid', true); // Mark the user as having paid
    navigate('/program'); // Navigate to the program page after payment
  };

  return (
    <div>
      <h1>Payment Page</h1>
      <button onClick={handlePaymentSuccess}>Pay Now</button>
    </div>
  );
}

export default PaymentPage;
