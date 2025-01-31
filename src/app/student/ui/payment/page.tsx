"use client";

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import BaseLayout2 from "@/components/BaseLayout2";

const stripePromise = loadStripe('pk_test_51LilJwCsMeuBsi2YvvK4gor68JPLEOcF2KIt1GuO8qplGSzCSjKTI2BYZ7Z7XLKD1VA8riExXLOT73YHQIA8wbUJ000VrpQkNE');

type StripePaymentFormProps = {
  onPaymentSuccess: (token: any) => void;
  amount12:number;
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

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ onPaymentSuccess,amount12 }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [invoiceData, setInvoiceData] = useState<Invoice[]>([]); // Initialize with an empty array

  console.log("InvoiceData>>", invoiceData);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.error('Card element not found');
      alert('Payment element is not available. Please try again.');
      return;
    }

    try {
      const { token, error } = await stripe.createToken(cardElement);

      if (error) {
        console.error(error);
        alert(error.message);
      } else {
        onPaymentSuccess(token);
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      alert('Something went wrong while processing the payment.');
    }
  };
  const handlePaymentClick = async () => {
    try {
      const auth =localStorage.getItem('StudentAuthToken');
      const response = await fetch("http://localhost:5001/student/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth}`
        },
        body: JSON.stringify({ amount: amount12, currency: "usd" })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payment data");
      } 
    } catch (error) {
      console.error("Error fetching payment data:", error);
    }
  };


  useEffect(() => {
    const fetchInvoiceData = async () => {
      const response = await fetch('http://localhost:5001/studentinvoice');
      const data: InvoiceResponse = await response.json();
      setInvoiceData(data.invoice); // Set the fetched invoice data here
    };

    fetchInvoiceData();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <CardElement />
      </div>
      <button
        type="submit"
        onClick={handlePaymentClick}
        disabled={!stripe}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Pay Now
      </button>
    </form>
  );
};

const Invoice = () => {
  const [showModal, setShowModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [invoiceData, setInvoiceData] = useState<Invoice[]>([]); 
  const [amountset, setAmountSet] = useState<number | undefined>(undefined);
  const handlePaymentSuccess = async (token: any) => {
    console.log('Payment successful! Token:', token);
    alert('Payment was successful!');
    setShowModal(false);
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

  useEffect(() => {
    const fetchInvoiceData = async () => {
      const response = await fetch('http://localhost:5001/studentinvoice');
      const data: InvoiceResponse = await response.json();
      setInvoiceData(data.invoice);
      if (data.invoice && data.invoice.length > 0) {
        setAmountSet(data.invoice[2].amount);  // Set amount from the first invoice
      }
       // Set invoiceData after fetching
    };

    fetchInvoiceData();
  }, []);
  const handleshow=()=>{
  setShowModal(true);
  };

  return (
    <BaseLayout2>
      <div id="invoic" className="p-3 flex justify-center ml-10 h-[570px]">
        <div className="w-[1900px] max-w-5xl bg-white p-4 rounded-lg shadow ml-5">
          {/* Header Section */}
          <div className="p-3">
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
                  Invoice Number: <span className="">INV-0205</span>
                </p>
                <p>
                  Invoice Date: <span className="">02 Nov 2024</span>
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
            <div className="overflow-x-auto mb-4 bg-[#e6e6e6]">
            <table className="table-auto w-full border-collapse border border-gray-200 rounded-sm text-xs">
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
                {invoiceData.map((invoice) => (
                  <tr key={invoice._id}> {/* Assuming invoice.id is a unique identifier */}
                    <td className="border border-gray-300 text-center">{invoice.courseName}</td>
                    <td className="border border-gray-300 p-1 text-center">1</td> {/* Assuming QTY is 1 */}
                    <td className="border border-gray-300 p-1 text-center">${invoice.amount}</td>
                    <td className="border border-gray-300 p-1 text-center">$0.00</td> {/* Assuming GST is $0.00 */}
                    <td className="border border-gray-300 p-1 text-center">${invoice.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>



            {/* Payment Summary */}
            <div className="w-[23%] p-2 text-right ml-[730px] rounded-lg text-xs bg-[#efefef] border border-[#223857] justify-end">
              <p>
                Sub total (Excl. GST): <span className="font-bold">$125</span>
              </p>
              <p>
                Total GST: <span className="font-bold">$0.00</span>
              </p>
              <p className="whitespace-nowrap">
                Amount due on 20 Nov 2024: <span className="font-bold">$125</span>
              </p>

            </div>

            <div className='flex mt-2'>
            {!isGeneratingPDF && (
                <button
               onClick={handleshow}
                className="bg-[#223857] text-white py-1 rounded-2xl px-3 text-xs ml-[850px] hover:bg-blue-600 transform hover:-translate-y-1 transition duration-300"
              >
                Pay Online
              </button>
              )}
             </div>

            <div className="mb-4">
              <h3 className="text-xs font-bold mb-1">Payment Instructions:</h3>
              <p className="text-[11px]"><strong>AL FURQAN ACADEMY</strong></p>
              <p className="text-[10px]">BANK NAME: ABC BANK LIMITED</p>
              <p className="text-[10px]">SWIFT/IBAN: GB0021030012</p>
              <p className="text-[10px]">ACCOUNT NUMBER: 12-1234-123456-12</p>
              <p className="text-[10px]"><strong>PLEASE USE INV-0205 AS A REFERENCE NUMBER</strong></p>
              <p className="text-[9px]">For any questions, please contact us at <span className="font-bold">contact@alfurqan.academy</span>.</p>

            {/* Toggle Payment Form */}
              
            
            </div>
          </div>


          {!isGeneratingPDF && (
            <div className="w-[1030px] bg-white p-2 rounded-lg shadow mt-10 -ml-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-gray-800">Latest Transactions</h3>
                <a href="/transactions" className="text-xs text-blue-500 hover:underline">View all</a>
              </div>
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600">
                      <th className="text-left px-3 py-1">Invoice Date</th>
                      <th className="text-left px-3 py-1">Invoice Number</th>
                      <th className="text-left px-3 py-1">Course Name</th>
                      <th className="text-left px-3 py-1">Payment Date</th>
                      <th className="text-left px-3 py-1">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.map((invoice) => {
                      const invoiceDate = new Date(invoice.createdDate).toLocaleDateString();
                      const paymentDate = new Date(invoice.lastUpdatedDate).toLocaleDateString();
                      const invoiceStatus =
                        invoice.invoiceStatus === 'Completed' ? (
                          <span className="bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-[10px]">Completed</span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-600 py-0.5 px-2 rounded-full text-[10px]">Pending</span>
                        );

                      return (
                        <tr key={invoice._id} className="hover:bg-gray-50">
                          <td className="px-3 py-1 text-gray-700">{invoiceDate}</td>
                          <td className="px-3 py-1 text-gray-700">{invoice._id}</td>
                          <td className="px-3 py-1 text-gray-700">{invoice.courseName}</td>
                          <td className="px-3 py-1 text-gray-700">{paymentDate}</td>
                          <td className="px-3 py-1">{invoiceStatus}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* Modal for Payment Form */}
          {showModal && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">Complete Your Payment</h2>
                <Elements stripe={stripePromise}>
                  <StripePaymentForm onPaymentSuccess={handlePaymentSuccess} amount12={amountset ?? 0} />
                </Elements>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg"
                >
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

export default Invoice;
