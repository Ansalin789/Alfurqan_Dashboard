'use client'

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('your-stripe-publishable-key');

const CheckoutForm = ({ clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: 'John Doe',
                },
            },
        });

        if (error) {
            console.error(error);
        } else if (paymentIntent.status === 'succeeded') {
            console.log('Payment successful!');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe} className='mt-6 w-1/2 bg-gradient-to-r from-[#32517E] to-[#5691E0] text-white py-3 rounded-md hover:from-blue-600 hover:to-blue-400 transition-all duration-300 font-semibold shadow-lg text-[20px]'>Pay</button>
        </form>
    );
};

const Invoice = () => {
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        axios.post('/api/create-payment-intent', { amount: 12100 })
            .then(response => setClientSecret(response.data.clientSecret))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="min-h-screen max-w-4xl bg-gradient-to-br from-[#32517E] via-[#4572B1] to-[#5691E0] p-12 mx-auto flex items-center justify-center">
            <div className="bg-white w-full rounded-lg shadow-lg p-10 relative">
                {/* Logo and Header */}
                <div className="mb-5 justify-center items-center align-middle">
                    <div className="items-center justify-center">
                        <Image src='/assets/images/alf.png' alt='Invoice' width={150} height={150} quality={100} className='justify-center align-middle ml-64 items-center w-[150px]'/>
                    </div>
                </div>

                {/* Client Info Section */}
                <div className="flex justify-between mb-12">
                    <div className="space-y-2">
                        <p>Student Name: <span className="font-semibold">John Doe</span></p>
                        <p className="text-sm text-gray-700">Address: 123 Street Name, City</p>
                        <p className="text-sm text-gray-700">Contact: +123456789</p>
                        <p className="text-sm text-gray-700">Email: johndoe@example.com</p>
                    </div>
                    <div className="text-right space-y-2">
                        <p className="text-sm text-gray-700">Invoice Number: #12345</p>
                        <p className="text-sm text-gray-700">Invoice Date: 12/10/2024</p>
                        <p className="text-sm text-gray-700">Due Date: 12/20/2024</p>
                    </div>
                </div>

                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 -z-10">
                    <div className="relative">
                        <div className="absolute -top-4 -right-4 w-32 h-32 bg-[#32517E] rounded-full opacity-50"></div>
                        <div className="absolute top-8 -right-8 w-20 h-20 bg-gray-400 rounded-full opacity-50"></div>
                        <div className="absolute -top-8 right-20 w-16 h-16 bg-blue-800 rounded-full opacity-50"></div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto mb-10">
                    <table className="w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-[#32517E] text-white">
                                <th className="text-left py-3 px-4 border border-gray-300">Course Name</th>
                                <th className="py-3 px-4 border border-gray-300">Quantity</th>
                                <th className="py-3 px-4 border border-gray-300">Rate</th>
                                <th className="py-3 px-4 border border-gray-300">Amount</th>
                                <th className="py-3 px-4 border border-gray-300">Discount</th>
                                <th className="py-3 px-4 border border-gray-300">Adjust</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-300">
                                <td className="py-3 px-4">Item 1</td>
                                <td className="py-3 px-4 text-center">1</td>
                                <td className="py-3 px-4 text-center">$50.00</td>
                                <td className="py-3 px-4 text-center">$50.00</td>
                                <td className="py-3 px-4 text-center">10%</td>
                                <td className="py-3 px-4 text-center text-orange-500">$45.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Payment and Totals Section */}
                <div className="flex justify-between items-start gap-8">
                    <div className="flex-1">
                        <p className="text-sm mb-2">Notes: For suggestions or issues, please contact us.</p>
                        <p className="text-sm text-gray-600">Powered by AL Furqan</p>
                    </div>
                    <div className="w-80">
                        <div className="bg-gray-50 text-black rounded-md p-6 shadow-md">
                            <div className="flex justify-between font-bold pb-4">
                                <span>Total Due:</span>
                                <span>$121.00</span>
                            </div>
                        </div>
                        {clientSecret && (
                            <Elements stripe={stripePromise}>
                                <CheckoutForm clientSecret={clientSecret} />
                            </Elements>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
