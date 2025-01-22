import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Token } from '@stripe/stripe-js';

interface StripePaymentFormProps {
  onPaymentSuccess: (token: Token) => void; // Define the type for the onPaymentSuccess prop
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
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
      // Process the payment with the token
      onPaymentSuccess(token);
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
