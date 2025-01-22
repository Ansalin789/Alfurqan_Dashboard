import React from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

interface StripePaymentFormProps {
  onPaymentSuccess: (token: any) => Promise<void>;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      alert('Card element not found');
      return;
    }

    const { token, error } = await stripe.createToken(cardElement);

    if (error) {
      console.error(error);
      alert(error.message);
    } else if (token) {
      console.log('Payment successful:', token);
      // Call the onPaymentSuccess function passed as a prop
      await onPaymentSuccess(token);
    }
  };

  return (
    <div>
      <h1>Stripe Payment</h1>
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
    </div>
  );
};

export default StripePaymentForm;
