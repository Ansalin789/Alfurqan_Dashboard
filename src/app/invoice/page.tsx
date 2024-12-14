'use client';

// import { useState, useEffect } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import Image from 'next/image';

// const stripePromise = loadStripe('pk_test_51LilJwCsMeuBsi2YvvK4gor68JPLEOcF2KIt1GuO8qplGSzCSjKTI2BYZ7Z7XLKD1VA8riExXLOT73YHQIA8wbUJ000VrpQkNE');

// interface CheckoutFormProps {
//     clientSecret: string;
// }

// const CheckoutForm = ({ clientSecret }: CheckoutFormProps) => {
//     const stripe = useStripe();
//     const elements = useElements();
//     const [paymentMessage, setPaymentMessage] = useState('');
//     const [isProcessing, setIsProcessing] = useState(false);

//     const handleSubmit = async (event: React.FormEvent) => {
//         event.preventDefault();
//         setIsProcessing(true);
//         setPaymentMessage('');

//         if (!stripe || !elements) {
//             return;
//         }
//         const cardElement = elements.getElement(CardElement);

//         if (!cardElement) {
//             setPaymentMessage('Card element not found.');
//             setIsProcessing(false);
//             return;
//         }

//         const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//             payment_method: {
//                 card: cardElement,
//                 billing_details: {
//                     name: 'John Doe',
//                 },
//             },
//         });

//         if (error) {
//             console.error(error);
//             setPaymentMessage(`Payment failed: ${error.message}`);
//         } else if (paymentIntent.status === 'succeeded') {
//             setPaymentMessage('Payment successful!');
//         }
//         setIsProcessing(false);
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <CardElement />
//             <button type="submit" disabled={!stripe || isProcessing} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
//                 {isProcessing ? 'Processing...' : 'Pay'}
//             </button>
//             {paymentMessage && <div className="mt-4 text-green-500">{paymentMessage}</div>}
//         </form>
//     );
// };

// const Invoice = () => {
//     const [clientSecret, setClientSecret] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchClientSecret = async () => {
//             try {
//                 const response = await fetch('http://localhost:5001/api/payment-intent', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         amount: 12100, // Amount in cents (e.g., $121.00)
//                         currency: 'usd',
//                     }),
//                 });

//                 if (!response.ok) {
//                     throw new Error('Failed to fetch client secret');
//                 }

//                 const data = await response.json();
//                 setClientSecret(data.clientSecret);
//             } catch (error) {
//                 console.error('Error fetching client secret:', error);
//             }
//         };

//         fetchClientSecret();
//     }, []);

//     return (
//         <div className="min-h-screen max-w-4xl bg-gradient-to-br from-[#32517E] via-[#4572B1] to-[#5691E0] p-12 mx-auto flex items-center justify-center">
//             <div className="bg-white w-full rounded-lg shadow-lg p-10 relative">
//                 {/* Logo and Header */}
//                 <div className="mb-5 justify-center items-center align-middle">
//                     <div className="items-center justify-center">
//                         <Image src='/assets/images/alf.png' alt='Invoice' width={150} height={150} quality={100} className="justify-center align-middle ml-64 items-center w-[150px]" />
//                     </div>
//                 </div>

//                 {/* Client Info Section */}
//                 <div className="flex justify-between mb-12">
//                     <div className="space-y-2">
//                         <p>Student Name: <span className="font-semibold">John Doe</span></p>
//                         <p className="text-sm text-gray-700">Address: 123 Street Name, City</p>
//                         <p className="text-sm text-gray-700">Contact: +123456789</p>
//                         <p className="text-sm text-gray-700">Email: johndoe@example.com</p>
//                     </div>
//                     <div className="text-right">
//                         <p>Invoice Date: <span className="font-semibold">01/01/2024</span></p>
//                         <p>Due Date: <span className="font-semibold">15/01/2024</span></p>
//                         <p>Total Amount: <span className="font-semibold">$121.00</span></p>
//                     </div>
//                 </div>

//                 {/* Payment Section */}
//                 {clientSecret ? (
//                     <Elements stripe={stripePromise} options={{ clientSecret }}>
//                         <CheckoutForm clientSecret={clientSecret} />
//                     </Elements>
//                 ) : (
//                     <div>Loading...</div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Invoice;
import Invoice from "@/components/Invoice";
import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

const Form = () => {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h1>Invoice Generator</h1>
        <p>Click a link below to generate the invoice:</p>

        {/* Dynamic Links */}
        <ul>
          <li>
            <Link to="/invoice?name=Joe+Selvaraj&plan=Elite&due=16">
              /invoice?name=Joe+Selvaraj&plan=Elite&due=16
            </Link>
          </li>
          <li>
            <Link to="/invoice?name=Alice+Smith&plan=Standard&due=50">
              Generate Invoice for Alice Smith
            </Link>
          </li>
        </ul>

        {/* Routes */}
        <Routes>
          <Route path="/invoice" element={<Invoice />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Form;
