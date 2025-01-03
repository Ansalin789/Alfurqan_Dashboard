'use client';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { useRouter } from 'next/router';

const stripePromise = loadStripe('pk_test_51LilJwCsMeuBsi2YvvK4gor68JPLEOcF2KIt1GuO8qplGSzCSjKTI2BYZ7Z7XLKD1VA8riExXLOT73YHQIA8wbUJ000VrpQkNE');

const HomePage = () => {

  const [clientSecret, setClientSecret] = useState('');
  const createPaymentIntent = async () => {
    const auth=localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:5001/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' ,
      'Authorization': `Bearer ${auth}`,
      },
      body: JSON.stringify({ amount: 5000, currency: 'usd' }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetch response:', data); // Log the response here
    console.log("Received clientSecret:", data.clientSecret);
    setClientSecret(data.clientSecret);
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
    <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
      Stripe Payment
    </h1>
    <button
      onClick={createPaymentIntent}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      Start Payment
    </button>
    {clientSecret && (
      <div className="mt-6">
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      </div>
    )}
  </div>
</div>

  );
};

export default HomePage;