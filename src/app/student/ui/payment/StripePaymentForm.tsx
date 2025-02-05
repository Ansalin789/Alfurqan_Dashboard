'use client';

import React from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

type StripePaymentFormProps = {
  onPaymentSuccess: (token: any) => void;
};

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.error('Card element not found');
      alert('Payment element is not available. Please try again.');
      return;
    }

    try {
      const { token, error } = await stripe.createToken(cardElement);

      if (error) {
        console.error(error);
        alert(error.message);
      } else {
        onPaymentSuccess(token);
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      alert('Something went wrong while processing the payment.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <CardElement />
      </div>
      <button
        type="submit"
        disabled={!stripe}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Pay Now
      </button>
    </form>
  );
};

export default StripePaymentForm;
