'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import BaseLayout2 from "@/components/BaseLayout2";
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51LilJwCsMeuBsi2YvvK4gor68JPLEOcF2KIt1GuO8qplGSzCSjKTI2BYZ7Z7XLKD1VA8riExXLOT73YHQIA8wbUJ000VrpQkNE');

type StripePaymentFormProps = {
  onPaymentSuccess: (token: any) => void;
};
interface Student {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: number;
}

interface Invoice {
  _id: string;
  courseName: string;
  amount: number;
  status: string;
  createdDate: string;
  createdBy: string;
  lastUpdatedDate: string;
  lastUpdatedBy: string;
  invoiceStatus: string;
  student: Student;
}

interface InvoiceResponse {
  totalCount: number;
  invoice: Invoice[];
}


interface CheckoutFormProps {
  clientSecret: string;
  invoiceId: string;
  amount:number;
  currency: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret, invoiceId,amount,currency }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setMessage("Card details are required.");
      setLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      setMessage(error.message ?? 'Payment failed.');
    } else if (paymentIntent?.status === 'succeeded') {
      await axios.post('http://localhost:5001/student/create-payment-intent', {
        amount,
        currency,
        invoiceId,
        paymentIntentResponse: paymentIntent,
      });

      setMessage('Payment successful!');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white flex flex-col gap-4">
      <div className="p-3 border border-gray-300 rounded focus-within:border-blue-500 bg-gray-50 transition-colors">
        <CardElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-2 px-4 rounded text-white font-bold transition-colors ${
          !stripe || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
        }`}
      >
        {loading ? 'Processing...' : 'Pay'}
      </button>

      {message && <p className="text-center text-sm text-gray-700">{message}</p>}
    </form>
  );
};

const Invoice = () => {
  const [showModal, setShowModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const studentIdToFilter=localStorage.getItem('StudentPortalId');
        const response = await axios.get<InvoiceResponse>('http://localhost:5001/studentinvoice');
        const filteredInvoices = response.data.invoice.filter(invoice => invoice.student.studentId === studentIdToFilter);
        setInvoices(filteredInvoices);
      } catch (error) {
        console.log('Failed to fetch invoices. Please try again.');
        console.error('Error fetching invoices:', error);
      }
    };

    fetchInvoices();
  }, []);

  const handleInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };
  const handleClick = async () => {
    if (!selectedInvoice) {
      alert("Please select an invoice first.");
      return;
    }
  
    setShowModal(true);
    const evaluationid = selectedInvoice._id;
    const totalprice = selectedInvoice.amount;
  
    try {
      const response = await axios.post('http://localhost:5001/student/create-payment-intent', {
        amount: totalprice * 100,
        currency: 'usd',
        invoiceId: evaluationid,
        paymentIntentResponse: '',
      });
  
      console.log("Stripe Response:", response.data); // Debugging
      const clientSecret = response?.data?.clientSecret;
      console.log("Stripe Response:", response?.data);

      if (clientSecret?.includes('_secret_')) {
        setClientSecret(clientSecret);
      } else {
        console.error("Invalid clientSecret received:", response.data);
        alert("Error: Invalid payment session. Please try again.");
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error fetching payment intent:", error);
      alert("Payment initialization failed. Please try again later.");
      setShowModal(false);
    }
  };
  
  const downloadInvoice = () => {
    if (typeof window === 'undefined') return; // Ensure this runs only in the browser

    setIsGeneratingPDF(true);
    const invoiceElement = document.getElementById('invoic');
    const options = {
      filename: 'invoice.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
    };

    const html2pdf = require('html2pdf.js'); // Dynamically load html2pdf.js
    html2pdf()
      .set(options)
      .from(invoiceElement)
      .save()
      .then(() => {
        setIsGeneratingPDF(false);
      });
  };

  return (
    <BaseLayout2>
      <div id="invoic" className="px-8 py-8 flex justify-center w-full h-full">
        <div className="w-full bg-white py-4 px-4 rounded-lg shadow">
          {/* Header Section */}
          <div className="p-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div className="flex items-center mb-2 md:mb-0">
                <img
                  src="/assets/images/alf.png"
                  alt="Al Furqan Academy"
                  className="w-36 md:w-20 h-10"
                />
              </div>
              <div className="text-left md:text-right text-xs -mb-2">
                <h1 className="text-sm font-bold">Invoice</h1>
                <p>REG: 1234567890</p>
                <p>contact@alfurqan.academy</p>
                <p>+44 20 4577 1227</p>
                <br />
                <p>
                  Invoice Number: <span className="">{selectedInvoice?._id}</span>
                </p>
                <p>
                  Invoice Date: <span className="">{selectedInvoice?.createdDate}</span>
                </p>
                <p>
                  Due: <span className="">20 Nov 2024</span>
                </p>
              </div>
            </div>

            {!isGeneratingPDF && (
              <button
                onClick={downloadInvoice}
                className="bg-[#223857] text-white px-3 py-1 rounded-2xl mb-2 shadow text-xs hover:bg-blue-600"
              >
                Download Invoice
              </button>
            )}

            {/* Invoice Table */}
            <div className="overflow-x-auto mb-4 bg-[#efefef] rounded-lg border border-[#223857]">
              <table className="table-auto w-full h-full border-collapse border border-gray-200 text-xs">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2">Description</th>
                    <th className="border border-gray-300 p-2">QTY</th>
                    <th className="border border-gray-300 p-2">Price</th>
                    <th className="border border-gray-300 p-2">GST</th>
                    <th className="border border-gray-300 p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="border border-gray-300 text-center">{selectedInvoice?.courseName}</td>
                    <td className="border border-gray-300 p-1 text-center">1</td>
                    <td className="border border-gray-300 p-1 text-center">{selectedInvoice?.amount}</td>
                    <td className="border border-gray-300 p-1 text-center">$0.00</td>
                    <td className="border border-gray-300 p-1 text-center">{selectedInvoice?.amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment Summary */}
            <div className="w-[100%] p-2 text-right rounded-lg text-xs bg-[#efefef] border border-[#223857] justify-end">
              <p>
                Sub total (Excl. GST): <span className="font-bold">{selectedInvoice?.amount}</span>
              </p>
              <p>
                Total GST: <span className="font-bold">$0.00</span>
              </p>
              <p className="whitespace-nowrap">
                Amount due on 20 Nov 2024: <span className="font-bold">{selectedInvoice?.amount}</span>
              </p>
            </div>
            <div className='flex justify-between p-1'>
              <div className="mb-2">
                <h3 className="text-xs font-bold mb-1 text-[#223857]">Payment Instructions:</h3>
                <p className="text-[11px]"><strong>AL FURQAN ACADEMY</strong></p>
                <p className="text-[10px]">BANK NAME: ABC BANK LIMITED</p>
                <p className="text-[10px]">SWIFT/IBAN: GB0021030012</p>
                <p className="text-[10px]">ACCOUNT NUMBER: 12-1234-123456-12</p>
                <p className="text-[10px]"><strong>PLEASE USE INV-0205 AS A REFERENCE NUMBER</strong></p>
                <p className="text-[9px]">For any questions, please contact us at <span className="font-bold">contact@alfurqan.academy</span>.</p>
              </div>

              <div className='mt-2 justify-end'>
                {!isGeneratingPDF && (
                    <button
                      onClick={() => {
                        handleClick()
                      }}
                      className="bg-[#223857] text-white text-end py-1 rounded-lg px-3 text-xs hover:bg-blue-600 transform hover:-translate-y-1 transition duration-300"
                    >
                      Pay Online
                    </button>
                  )}
              </div>
            </div> 
          </div>
          {!isGeneratingPDF && (
            <div className="w-full px-10 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-800">Latest Transactions</h3>
                <a href="/transactions" className="text-xs text-blue-500 hover:underline">View all</a>
              </div>
              <div className='bg-white rounded-lg border-2 border-[#1C3557] h-auto'>
                <div className="overflow-y-auto max-h-24 scrollbar-none">
                  <table className="table-auto w-full">
                    <thead className='border-b-[1px] border-[#1C3557] text-[12px] font-semibold'>
                      <tr>
                        <th className="px-6 py-3 text-center">Invoice Date</th>
                        <th className="px-6 py-3 text-center">Invoice Number</th>
                        <th className="px-6 py-3 text-center">Course Name</th>
                        <th className="px-6 py-3 text-center">Payment Date</th>
                        <th className="px-6 py-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                    {invoices.map((invoice) => (
  <tr
    key={invoice._id}
    onClick={() => {
      if (invoice.invoiceStatus === 'Pending') {
        handleInvoiceClick(invoice); // Only call handleInvoiceClick when status is "Pending"
      }
    }}
    className={`cursor-pointer hover:bg-gray-100 text-center text-xs ${
      invoice.invoiceStatus !== 'Pending' ? 'cursor-not-allowed' : ''
    }`} // Disable click for rows where the status is not "Pending"
  >
    <td className="border border-gray-300 p-2">{invoice._id}</td>
    <td className="border border-gray-300 p-2">{invoice.student.studentName}</td>
    <td className="border border-gray-300 p-2">{invoice.courseName}</td>
    <td className="border border-gray-300 p-2">${invoice.amount}</td>
    <td className="border border-gray-300 p-2">
      <span className="bg-green-100 text-green-600 border-[1px] border-green-600 py-0.5 px-2 rounded-lg text-[10px]">
        {invoice.invoiceStatus}
      </span>
    </td>
  </tr>
))}
                    </tbody>
                  </table>
                </div>
              </div>  
            </div>
          )}
          {/* Modal for Payment Form */}
          {showModal && clientSecret && clientSecret.includes('_secret_') && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-4 rounded-lg shadow-lg w-96">
      <h2 className="text-lg font-bold mb-4">Complete Your Payment</h2>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm 
          clientSecret={clientSecret} 
          invoiceId={selectedInvoice?._id ?? ""} 
          amount={selectedInvoice?.amount ? selectedInvoice.amount * 100 : 0} 
          currency="usd" 
        />
      </Elements>
      <button onClick={() => setShowModal(false)} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg">
        Close
      </button>
    </div>
  </div>
)}

        </div>
      </div>
    </BaseLayout2>
  );
};

export default Invoice;
