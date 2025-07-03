'use client';

import {
  CardNumberElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import type { StripeCardNumberElementChangeEvent } from '@stripe/stripe-js';
import { useState } from 'react';
import { CreditCard } from 'lucide-react';

interface CheckoutFormProps {
  clientSecret: string;
  evaluationId?: string;
}

type LocalCardBrand =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'discover'
  | 'diners'
  | 'jcb'
  | 'unionpay'
  | 'rupay'
  | 'unknown';

const getCardLogo = (brand: LocalCardBrand): string => {
  const logos: Record<LocalCardBrand, string> = {
    visa: 'https://img.icons8.com/color/48/visa.png',
    mastercard: 'https://img.icons8.com/color/48/mastercard-logo.png',
    amex: 'https://img.icons8.com/color/48/amex.png',
    discover: 'https://img.icons8.com/color/48/discover.png',
    diners: 'https://img.icons8.com/color/48/diners-club.png',
    jcb: 'https://img.icons8.com/color/48/jcb.png',
    unionpay: 'https://img.icons8.com/color/48/unionpay.png',
    rupay: '/assets/images/icons8-rupay-48.png', // <-- local logo
    unknown: '',
  };
  return logos[brand] || '';
};

const detectBrandWithRupayOverride = (
  event: StripeCardNumberElementChangeEvent
): LocalCardBrand => {
  const value = (event as any)?.value || '';
  const bin = value.replace(/\D/g, '').slice(0, 6);
  const stripeBrand = event.brand;

  if (
    stripeBrand === 'unionpay' ||
    stripeBrand === 'unknown' ||
    /^(508|60|65|6521|6522|81|82)/.test(bin)
  ) {
    return 'rupay';
  }

  return stripeBrand as LocalCardBrand;
};

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [cardBrand, setCardBrand] = useState<LocalCardBrand>('unknown');

  const handleCardChange = (event: StripeCardNumberElementChangeEvent) => {
    const detected = detectBrandWithRupayOverride(event);
    setCardBrand(detected);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage('');

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      setMessage(error.message || 'Payment failed');
    } else if (paymentIntent?.status === 'succeeded') {
      setMessage('Payment successful!');
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200"
    >
      <h3 className="flex items-center text-lg font-semibold text-[#223857] mb-4">
        <CreditCard className="w-5 h-5 mr-2 text-[#223857]" />
        Card
      </h3>

      <label className="block text-sm font-medium text-gray-800 mb-1">Card Number</label>
      <div className="relative border rounded-md px-3 py-2 mb-4 flex items-center bg-white">
        <CardNumberElement
          options={{
            style: {
              base: {
                fontSize: '14px',
                color: '#2d3748',
                '::placeholder': { color: '#a0aec0' },
              },
              invalid: { color: '#e53e3e' },
            },
          }}
          onChange={handleCardChange}
          className="w-full"
        />
        {cardBrand && cardBrand !== 'unknown' && getCardLogo(cardBrand) && (
          <img
            src={getCardLogo(cardBrand)}
            alt={cardBrand}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-auto max-w-[40px]"
          />
        )}
      </div>

      {/* Expiry + CVC */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Expiration Date</label>
          <input
            type="text"
            placeholder="MM/YY"
            maxLength={5}
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, '');
              if (val.length > 4) val = val.slice(0, 4);
              if (val.length >= 3) val = `${val.slice(0, 2)}/${val.slice(2)}`;
              e.target.value = val;
            }}
            className="w-full border rounded-md px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Security Code</label>
          <input
            type="text"
            placeholder="CVC"
            maxLength={4}
            className="w-full border rounded-md px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <hr className="my-6" />

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-2 px-4 rounded text-white font-bold transition-colors ${
          !stripe || loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#5A6ACF] hover:bg-[#4a5ac0]'
        }`}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>

      {message && (
        <p
          className={`mt-4 text-center text-sm ${
            message.includes('success') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default CheckoutForm;
