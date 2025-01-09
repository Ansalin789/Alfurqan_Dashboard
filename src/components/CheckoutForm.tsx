
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';

// Define the type for the props
interface CheckoutFormProps {
  clientSecret: string;
  evaluationId?: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret, evaluationId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    console.log('Card Element:', cardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement!,
      },
    });
    console.log('Payment Intent:', paymentIntent);

    if (error) {
      setMessage(error.message ?? 'An unexpected error occurred.');
    } else if (paymentIntent?.status === 'succeeded') {
      const auth = localStorage.getItem('authToken');
      await fetch(`http://localhost:5001/create-payment-intent`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`,
        },
        body: JSON.stringify({
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          evaluationId: evaluationId,
          paymentIntentResponse: paymentIntent,
        }),
      });
      setMessage('Payment successful!');
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white flex flex-col gap-4"
    >
      <div
        className="p-3 border border-gray-300 rounded focus-within:border-blue-500 bg-gray-50 transition-colors"
      >
        <CardElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-2 px-4 rounded text-white font-bold transition-colors ${
          !stripe || loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
        }`}
      >
        {loading ? 'Processing...' : 'Pay'}
      </button>

      {message && <p className="text-center text-sm text-gray-700">{message}</p>}
    </form>
  );
};

export default CheckoutForm;
