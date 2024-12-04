'use client'

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('your_publishable_key_here');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Send paymentMethod.id to your backend
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: 1000, // amount in cents
        }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error);
      } else {
        // Payment successful
        console.log('Payment successful!');
      }
    } catch (err) {
      setError('An error occurred while processing your payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
          hidePostalCode: true,
        }}
      />
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <button type="submit" disabled={!stripe || loading} className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
        {loading ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
};

const PaymentForm = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default PaymentForm;