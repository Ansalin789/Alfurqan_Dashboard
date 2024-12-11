import React from 'react'
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('your_stripe_public_key'); // Replace with your Stripe public key

const page = () => {
  const handlePayment = async () => {
    const stripe = await stripePromise;
    // Create a payment link (this should be done on your server)
    const response = await fetch('/api/create-payment-link', { method: 'POST' });
    const { url } = await response.json();
    
    // Redirect to the payment link
    window.location.href = url;
  };

  const sendInvoice = async () => {
    // Logic to send invoice via email with the payment link
    const response = await fetch('/api/send-invoice', { method: 'POST', body: JSON.stringify({ /* invoice data */ }) });
    // Handle response
  };

  return (
    <div>
      <h1>Invoice Page</h1>
      <button onClick={handlePayment}>Pay Now</button>
      <button onClick={sendInvoice}>Send Invoice</button>
    </div>
  );
}

export default page