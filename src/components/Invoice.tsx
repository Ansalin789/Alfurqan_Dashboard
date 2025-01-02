// // "use client"; // Mark this as a Client Component

// // import React from "react";
// // import { useLocation} from "react-router-dom"; // Import useLocation and useNavigate
// // import { useRouter } from 'next/navigation';


// // const Invoice = () => {
// //   // Use useLocation to get the current URL
// //   const location = useLocation();
// //   const params = new URLSearchParams(location.search);

// //   // Extract query parameters from URL, or fall back to default values if not provided
// //   const studentName = params.get('name') || "Joe Selvaraj"; // Default name if not in URL
// //   const contact = "1234567890"; // Static for this example
// //   const email = "jothikaselvaraj8787@gmail.com"; // Static for this example
// //   const invoicePlan = params.get('plan') || "Elite"; // Default plan if not in URL
// //   const invoiceDate = "12/31/2024"; // Static for this example
// //   const dueDate = "01/15/2025"; // Static for this example
// //   const courseName = "Quran"; // Static for this example
// //   const quantity = "1"; // Static for this example
// //   const rate = "16"; // Static for this example
// //   const amount = "16"; // Static for this example
// //   const discount = "0"; // Static for this example
// //   const adjust = "16"; // Static for this example
// //   const totalDue = params.get('due') || "16"; // Default due if not in URL

// //   // Use useNavigate to navigate to a new page after payment

// //   // Handle the payment button click
// //   const router = useRouter();
// //   const handleClick = () => {
// //     if (router) {
// //     router.push('Mainvoice');
// //     } else {
// //     console.error('Router is not available');
// //     }
// // };

// //   return (
// //     <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
// //       <div
// //         style={{
// //           backgroundColor: "#2c3e50",
// //           color: "#fff",
// //           padding: "10px",
// //           textAlign: "center",
// //         }}
// //       >
// //         <h1>Invoice</h1>
// //       </div>
// //       <div
// //         style={{
// //           backgroundColor: "#f9f9f9",
// //           padding: "20px",
// //           border: "1px solid #ddd",
// //         }}
// //       >
// //         <p>
// //           <strong>BILL TO:</strong>
// //         </p>
// //         <p>
// //           Student Name: {studentName}
// //           <br />
// //           Contact: {contact}
// //           <br />
// //           Email: <a href={`mailto:${email}`}>{email}</a>
// //         </p>
// //         <p>
// //           Invoice Plan: {invoicePlan}
// //           <br />
// //           Invoice Date: {invoiceDate}
// //           <br />
// //           Invoice Due Date: {dueDate}
// //         </p>

// //         <table
// //           style={{
// //             width: "100%",
// //             borderCollapse: "collapse",
// //             marginTop: "20px",
// //           }}
// //         >
// //           <thead>
// //             <tr>
// //               <th style={{ border: "1px solid #ddd", padding: "10px" }}>
// //                 Course Name
// //               </th>
// //               <th style={{ border: "1px solid #ddd", padding: "10px" }}>
// //                 Quantity
// //               </th>
// //               <th style={{ border: "1px solid #ddd", padding: "10px" }}>Rate</th>
// //               <th style={{ border: "1px solid #ddd", padding: "10px" }}>
// //                 Amount
// //               </th>
// //               <th style={{ border: "1px solid #ddd", padding: "10px" }}>
// //                 Discount
// //               </th>
// //               <th style={{ border: "1px solid #ddd", padding: "10px" }}>
// //                 Adjust
// //               </th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             <tr>
// //               <td style={{ border: "1px solid #ddd", padding: "10px" }}>
// //                 {courseName}
// //               </td>
// //               <td style={{ border: "1px solid #ddd", padding: "10px" }}>
// //                 {quantity}
// //               </td>
// //               <td style={{ border: "1px solid #ddd", padding: "10px" }}>
// //                 {rate}
// //               </td>
// //               <td style={{ border: "1px solid #ddd", padding: "10px" }}>
// //                 {amount}
// //               </td>
// //               <td style={{ border: "1px solid #ddd", padding: "10px" }}>
// //                 {discount}
// //               </td>
// //               <td style={{ border: "1px solid #ddd", padding: "10px" }}>
// //                 {adjust}
// //               </td>
// //             </tr>
// //           </tbody>
// //         </table>

// //         <p
// //           style={{
// //             fontWeight: "bold",
// //             textAlign: "right",
// //             marginTop: "20px",
// //           }}
// //         >
// //           Total Due: {totalDue}
// //         </p>

// //         {/* Payment Button */}
        
// //     <button onClick={handleClick}>
// //           PayNow
// //         </button>
// //       </div>
// //       <div style={{ textAlign: "center", marginTop: "20px", fontSize: "12px" }}>
// //         <p>Powered by AL Furqan</p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Invoice;
   

// "use client"; // Marks this as a Client Component
// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { useRouter } from "next/navigation";

// const fetchInvoiceData = async (studentId: string) => {
//   try {
//     const response = await fetch(`http://localhost:5001/evaluationlist/67629e347a3e2e252d90d753`);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return await response.json(); // Return parsed JSON data
//   } catch (err) {
//     throw new Error("Failed to load invoice data.");
//   }
// };

// const Invoice = () => {
//   const location = useLocation();
//   const router = useRouter();

//   const params = new URLSearchParams(location.search);
//   const studentId = params.get("id"); // Extract student ID from URL params

//   const [invoiceData, setInvoiceData] = useState<Record<string, any> | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (studentId) {
//       const fetchData = async () => {
//         try {
//           setLoading(true);
//           const data = await fetchInvoiceData(studentId);
//           setInvoiceData(data); // Set fetched data
//         } catch (err) {
//           console.error(err);
//           setError("Failed to load invoice data.");
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchData();
//     } else {
//       setError("Student ID not provided in the URL.");
//       setLoading(false);
//     }
//   }, [studentId]);

//   const handleClick = () => {
//     router.push("/mainvoice");
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!invoiceData) {
//     return <div>No invoice data found.</div>;
//   }

//   // Extract relevant fields
//   const {
//     student,
//     subscription,
//     hours,
//     planTotalPrice,
//   } = invoiceData;

//   const fullName = `${student.studentFirstName} ${student.studentLastName}`;
//   const courseName = student.learningInterest;
//   const packageName = subscription.subscriptionName;
//   const amountPerHour = subscription.subscriptionPricePerHr;
//   const totalAmount = planTotalPrice;
//   const feesPerDay = amountPerHour * hours;
//   const subscriptionDuration = subscription.subscriptionDays;
//   const country = student.studentCountry;
//   const email = student.studentEmail;
//   const phoneNumber = `${student.studentCountryCode} ${student.studentPhone}`;

//   return (
//     <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
//       <div
//         style={{
//           backgroundColor: "#2c3e50",
//           color: "#fff",
//           padding: "10px",
//           textAlign: "center",
//         }}
//       >
//         <h1>Invoice</h1>
//       </div>
//       <div
//         style={{
//           backgroundColor: "#f9f9f9",
//           padding: "20px",
//           border: "1px solid #ddd",
//         }}
//       >
//         <p>
//           <strong>Student Details:</strong>
//         </p>
//         <p>
//           Name: {fullName}
//           <br />
//           Email: <a href={`mailto:${email}`}>{email}</a>
//           <br />
//           Phone: {phoneNumber}
//           <br />
//           Country: {country}
//         </p>

//         <p>
//           <strong>Course:</strong> {courseName}
//         </p>

//         <table
//           style={{
//             width: "100%",
//             borderCollapse: "collapse",
//             marginTop: "20px",
//           }}
//         >
//           <thead>
//             <tr>
//               <th style={{ border: "1px solid #ddd", padding: "10px" }}>Package</th>
//               <th style={{ border: "1px solid #ddd", padding: "10px" }}>Amount/Hour</th>
//               <th style={{ border: "1px solid #ddd", padding: "10px" }}>Fees/Day</th>
//               <th style={{ border: "1px solid #ddd", padding: "10px" }}>Total Duration (Days)</th>
//               <th style={{ border: "1px solid #ddd", padding: "10px" }}>Total Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td style={{ border: "1px solid #ddd", padding: "10px" }}>{packageName}</td>
//               <td style={{ border: "1px solid #ddd", padding: "10px" }}>${amountPerHour}</td>
//               <td style={{ border: "1px solid #ddd", padding: "10px" }}>${feesPerDay}</td>
//               <td style={{ border: "1px solid #ddd", padding: "10px" }}>{subscriptionDuration} days</td>
//               <td style={{ border: "1px solid #ddd", padding: "10px" }}>${totalAmount}</td>
//             </tr>
//           </tbody>
//         </table>

//         <p
//           style={{
//             fontWeight: "bold",
//             textAlign: "right",
//             marginTop: "20px",
//           }}
//         >
//           Total Amount Due: ${totalAmount}
//         </p>

//         <button
//           style={{
//             backgroundColor: "#3498db",
//             color: "#fff",
//             border: "none",
//             padding: "10px 20px",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//           onClick={handleClick}
//         >
//           Pay Now
//         </button>
//       </div>
//       <div style={{ textAlign: "center", marginTop: "20px", fontSize: "12px" }}>
//         <p>Powered by AL Furqan</p>
//       </div>
//     </div>
//   );
// };

// export default Invoice;
// "use client"; // Mark this as a Client Component

// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom"; // React Router's useLocation hook
// import { useRouter } from "next/navigation"; // Import useRouter hook from Next.js

// interface Student {
//   studentFirstName: string;
//   studentLastName: string;
//   learningInterest: string;
//   studentCountry: string;
//   studentEmail: string;
//   studentCountryCode: string;
//   studentPhone: string;
// }

// interface Subscription {
//   subscriptionName: string;
//   subscriptionPricePerHr: number;
//   subscriptionDays: number;
// }

// interface InvoiceData {
//   student: Student;
//   subscription: Subscription;
//   hours: number;
//   planTotalPrice: number;
// }

// const Invoice = () => {
//   const location = useLocation();
//   const router = useRouter(); // Initialize useRouter hook

//   const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//    const[evaluationData,setEvaluationData]=useState("");
//   // Extract the student ID from the URL query string
//   const params = new URLSearchParams(location.search);
//   const studentId = params.get("id");

//   console.log("Student ID from URL:", studentId); // Debugging line

//   const fetchInvoiceData = async (studentId: string) => {
//     if (!studentId) {
//       setError("Student ID is missing.");
//       setLoading(false);
//       return;
//     }

//     try {
//       // Log the URL to check the endpoint
//       console.log("Fetching data from:", `http://localhost:5001/evaluationlist/${studentId}`);

//       const response = await fetch(`http://localhost:5001/evaluationlist/${studentId}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const data = await response.json();
//       alert(JSON.stringify(data));
//       setEvaluationData(data);
//       return data;
//     } catch (err: any) {
//       console.error("Error fetching invoice data:", err.message);
//       setError("Unable to fetch invoice data. Please try again later.");
//     }
//   };

//   useEffect(() => {
//     if (studentId) {
//       const fetchData = async () => {
//         try {
//           setLoading(true);
//           const data = await fetchInvoiceData(studentId);
//           setInvoiceData(data);
//         } catch (err) {
//           setError("Failed to load invoice data.");
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchData();
//     } else {
//       setError("No student ID provided in the URL.");
//       setLoading(false);
//     }
//   }, [studentId]);

//   if (loading) {
//     return <div>Loading invoice...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!invoiceData) {
//     return <div>No invoice data found.</div>;
//   }

//   const { student, subscription, hours, planTotalPrice } = invoiceData;
//   const fullName = `${student.studentFirstName} ${student.studentLastName}`;
//   const courseName = student.learningInterest;
//   const packageName = subscription.subscriptionName;
//   const amountPerHour = subscription.subscriptionPricePerHr;
//   const totalAmount = planTotalPrice;
//   const feesPerDay = amountPerHour * hours;
//   const subscriptionDuration = subscription.subscriptionDays;
//   const country = student.studentCountry;
//   const email = student.studentEmail;
//   const phoneNumber = `${student.studentCountryCode} ${student.studentPhone}`;

 
//   const handleClick = () => {
//     const evaluationid:number = evaluationData._id;  // Replace with your actual evaluation ID
//     const totalprice:number = evaluationData.planTotalPrice;
//   if (evaluationid && totalprice) {
//     // Use router.push with query parameters
//     router.push(`/Mainvoice?evaluationid=${evaluationid}&totalprice=${totalprice}`);
//   } else {
//     console.error("Evaluation ID or total price is missing.");
//   }
// };
//   return (
//     <div className="invoice-container">
//       <div className="invoice-header">
//         <h1>Invoice</h1>
//       </div>
//       <div className="invoice-details">
//         <p><strong>Student Details:</strong></p>
//         <p>
//           Name: {fullName}<br />
//           Email: <a href={`mailto:${email}`}>{email}</a><br />
//           Phone: {phoneNumber}<br />
//           Country: {country}
//         </p>

//         <p><strong>Course:</strong> {courseName}</p>

//         <table className="invoice-table">
//           <thead>
//             <tr>
//               <th>Package</th>
//               <th>Amount/Hour</th>
//               <th>Fees/Day</th>
//               <th>Total Duration (Days)</th>
//               <th>Total Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>{packageName}</td>
//               <td>${amountPerHour}</td>
//               <td>${feesPerDay}</td>
//               <td>{subscriptionDuration} days</td>
//               <td>${totalAmount}</td>
//             </tr>
//           </tbody>
//         </table>

//         <p className="total-amount-due">Total Amount Due: ${totalAmount}</p>

//         <button className="pay-now-btn" onClick={handleClick}>
//           Pay Now
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Invoice;
'use client';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { useLocation } from 'react-router-dom';
import Image from 'next/image';

const stripePromise = loadStripe('pk_test_51LilJwCsMeuBsi2YvvK4gor68JPLEOcF2KIt1GuO8qplGSzCSjKTI2BYZ7Z7XLKD1VA8riExXLOT73YHQIA8wbUJ000VrpQkNE');

// Interfaces
interface Student {
  studentFirstName: string;
  studentLastName: string;
  learningInterest: string;
  studentCountry: string;
  studentEmail: string;
  studentCountryCode: string;
  studentPhone: string;
}

interface Subscription {
  subscriptionName: string;
  subscriptionPricePerHr: number;
  subscriptionDays: number;
}

interface InvoiceData {
  student: Student;
  subscription: Subscription;
  hours: number;
  planTotalPrice: number;
}

const Invoice = () => {
  const location = useLocation();
  const[invoiceshow,setInvoiceShow]=useState(true);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evaluationData, setEvaluationData] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [showPayment, setShowPayment] = useState(false); // State to control when payment form should be shown
  const invoiceDate = new Date().toLocaleDateString(); 
  const params = new URLSearchParams(location.search);
  const studentId = params.get('id');

  const fetchInvoiceData = async (studentId: string) => {
    if (!studentId) {
      setError('Student ID is missing.');
      setLoading(false);
      return;
    }

    try {
      const auth=localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5001/evaluationlist/${studentId}`,{
        headers: { 'Content-Type': 'application/json' ,
          'Authorization': `Bearer ${auth}` ,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setEvaluationData(data);
      return data;
    } catch (err: any) {
      console.error('Error fetching invoice data:', err.message);
      setError('Unable to fetch invoice data. Please try again later.');
    }
  };

  useEffect(() => {
    if (studentId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const data = await fetchInvoiceData(studentId);
          setInvoiceData(data);
        } catch (err) {
          setError('Failed to load invoice data.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setError('No student ID provided in the URL.');
      setLoading(false);
    }
  }, [studentId]);

  if (loading) {
    return <div>Loading invoice...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!invoiceData) {
    return <div>No invoice data found.</div>;
  }

  const { student, subscription, hours, planTotalPrice } = invoiceData;
  const fullName = `${student.studentFirstName} ${student.studentLastName}`;
  const courseName = student.learningInterest;
  const packageName = subscription.subscriptionName;
  const amountPerHour = subscription.subscriptionPricePerHr;
  const totalAmount = planTotalPrice;
  const feesPerDay = amountPerHour * hours;
  const subscriptionDuration = subscription.subscriptionDays;
  const country = student.studentCountry;
  const email = student.studentEmail;
  const phoneNumber = `${student.studentCountryCode} ${student.studentPhone}`;

  const handleClick = async() => {
   
    const evaluationid = evaluationData._id;  // Replace with your actual evaluation ID
    const totalprice = evaluationData.planTotalPrice;
    const auth=localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:5001/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' ,
        'Authorization': `Bearer ${auth}` ,
      },
      body: JSON.stringify({ amount: totalprice, currency: 'usd',evaluationId:evaluationid,paymentIntentResponse:"" }),
    });
    const data = await response.json();
    console.log(">>>>>>>>>>>>>",data);
    setClientSecret(data.clientSecret);
    setShowPayment(true);
    setInvoiceShow(false);
  };

  return (
    <div className="invoice-container">
      {invoiceshow && (
      <div style={{ fontFamily: "Arial, sans-serif"}} className="bg-[#f9f9f9] p-6 rounded-lg w-[900px] ml-72">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Image
          src="/assets/images/alf2.png" width={150} height={150} className="p-6 w-52"
          alt="AL FURQAN Academy"
        />
        <div className="text-right p-10">
          <h2 className="text-right text-[30px]">INVOICE</h2>
          <p className="text-right text-[13px]">Invoice# AFA-24E928E-869</p>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "30px",
        }}
      >
        <p>
          <strong>BILL TO:</strong>
        </p>
        <p className="text-[13px] mb-14">
          {fullName}
          <br />
          Contact: {phoneNumber}
          <br />
          Email: <a href={`mailto:${email}`}>{email}</a>
        </p>
        <p className="text-right -mt-28 text-[13px]">
          Invoice Date: {invoiceDate}
          <br />
          Terms: Due on 2 days
          <br />
          Invoice Due Date: {subscriptionDuration}
        </p>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr className="bg-[#273450] text-white text-center">
              <th style={{  padding: "10px" }}>#</th>
              <th style={{  padding: "10px" }}>
                Item & Description
              </th>
              <th style={{  padding: "10px" }}>Country</th>
              {/* <th style={{  padding: "10px" }}>Rate</th> */}
              <th style={{  padding: "10px" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{  padding: "10px" }} className="text-center border-b-2">1</td>
              <td style={{  padding: "10px" }} className="text-center border-b-2">
                {courseName} / {packageName}
              </td>
              <td style={{  padding: "10px" }} className="text-center border-b-2">
                {country}
              </td>
              {/* <td style={{  padding: "10px" }} className="text-center border-b-2">{rate}</td> */}
              <td style={{  padding: "10px" }} className="text-center border-b-2"> ${totalAmount}</td>
            </tr>
          </tbody>
        </table>
        <p className="ml-[610px]"
          style={{
            fontWeight: "bold",
            marginTop: "10px",
          }}
        >
          Sub Total &nbsp;&nbsp;&nbsp;${totalAmount} 
        </p>

        <p className="ml-[645px]"
          style={{
            fontWeight: "bold",
            marginTop: "10px",
          }}
        >
          Total &nbsp;&nbsp;&nbsp;${totalAmount} 
        </p>

        {/* Payment Button */}
        <div  className="ml-[630px] mt-6">
          <button onClick={handleClick} style={{ padding: "10px 20px", backgroundColor: "#2c3e50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Pay Now
          </button>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: "20px", fontSize: "12px" }}>
        <p>Powered by AL Furqan</p>
      </div>
    </div>
      )}
      {/* Payment Form */}
      {showPayment && clientSecret && (
        <div className="payment-form-container mt-6">
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm clientSecret={clientSecret} evaluationId={evaluationData._id} />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default Invoice;

