'use client';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';

const stripePromise = loadStripe('pk_test_51LilJwCsMeuBsi2YvvK4gor68JPLEOcF2KIt1GuO8qplGSzCSjKTI2BYZ7Z7XLKD1VA8riExXLOT73YHQIA8wbUJ000VrpQkNE');

const HomePage = () => {
  const [clientSecret, setClientSecret] = useState('');

  const createPaymentIntent = async () => {
    const response = await fetch(`http://localhost:5001/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 5000, currency: 'usd' }),
    });
    const data = await response.json();
    console.log("Received clientSecret:", data.clientSecret);
    setClientSecret(data.clientSecret);
  };
  
  return (
    <div>
      <h1>Stripe Payment</h1>
      <button onClick={createPaymentIntent}>Start Payment</button>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
<CheckoutForm  clientSecret={clientSecret} />
        </Elements>
      )}
    </div>
  );
};

export default HomePage;