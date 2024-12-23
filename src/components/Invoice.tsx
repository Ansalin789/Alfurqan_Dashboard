// "use client"; // Mark this as a Client Component

// import React from "react";
// import { useLocation} from "react-router-dom"; // Import useLocation and useNavigate
// import { useRouter } from 'next/navigation';


// const Invoice = () => {
//   // Use useLocation to get the current URL
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);

//   // Extract query parameters from URL, or fall back to default values if not provided
//   const studentName = params.get('name') || "Joe Selvaraj"; // Default name if not in URL
//   const contact = "1234567890"; // Static for this example
//   const email = "jothikaselvaraj8787@gmail.com"; // Static for this example
//   const invoicePlan = params.get('plan') || "Elite"; // Default plan if not in URL
//   const invoiceDate = "12/31/2024"; // Static for this example
//   const dueDate = "01/15/2025"; // Static for this example
//   const courseName = "Quran"; // Static for this example
//   const quantity = "1"; // Static for this example
//   const rate = "16"; // Static for this example
//   const amount = "16"; // Static for this example
//   const discount = "0"; // Static for this example
//   const adjust = "16"; // Static for this example
//   const totalDue = params.get('due') || "16"; // Default due if not in URL

//   // Use useNavigate to navigate to a new page after payment

//   // Handle the payment button click
//   const router = useRouter();
//   const handleClick = () => {
//     if (router) {
//     router.push('Mainvoice');
//     } else {
//     console.error('Router is not available');
//     }
// };

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
//           <strong>BILL TO:</strong>
//         </p>
//         <p>
//           Student Name: {studentName}
//           <br />
//           Contact: {contact}
//           <br />
//           Email: <a href={`mailto:${email}`}>{email}</a>
//         </p>
//         <p>
//           Invoice Plan: {invoicePlan}
//           <br />
//           Invoice Date: {invoiceDate}
//           <br />
//           Invoice Due Date: {dueDate}
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
//               <th style={{ border: "1px solid #ddd", padding: "10px" }}>
//                 Course Name
//               </th>
//               <th style={{ border: "1px solid #ddd", padding: "10px" }}>
//                 Quantity
//               </th>
//               <th style={{ border: "1px solid #ddd", padding: "10px" }}>Rate</th>
//               <th style={{ border: "1px solid #ddd", padding: "10px" }}>
//                 Amount
//               </th>
//               <th style={{ border: "1px solid #ddd", padding: "10px" }}>
//                 Discount
//               </th>
//               <th style={{ border: "1px solid #ddd", padding: "10px" }}>
//                 Adjust
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td style={{ border: "1px solid #ddd", padding: "10px" }}>
//                 {courseName}
//               </td>
//               <td style={{ border: "1px solid #ddd", padding: "10px" }}>
//                 {quantity}
//               </td>
//               <td style={{ border: "1px solid #ddd", padding: "10px" }}>
//                 {rate}
//               </td>
//               <td style={{ border: "1px solid #ddd", padding: "10px" }}>
//                 {amount}
//               </td>
//               <td style={{ border: "1px solid #ddd", padding: "10px" }}>
//                 {discount}
//               </td>
//               <td style={{ border: "1px solid #ddd", padding: "10px" }}>
//                 {adjust}
//               </td>
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
//           Total Due: {totalDue}
//         </p>

//         {/* Payment Button */}
        
//     <button onClick={handleClick}>
//           PayNow
//         </button>
//       </div>
//       <div style={{ textAlign: "center", marginTop: "20px", fontSize: "12px" }}>
//         <p>Powered by AL Furqan</p>
//       </div>
//     </div>
//   );
// };

// export default Invoice;
   

"use client"; // Marks this as a Client Component
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRouter } from "next/navigation";

const fetchInvoiceData = async (studentId: string) => {
  try {
    const response = await fetch(`http://localhost:5001/evaluationlist/67629e347a3e2e252d90d753`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json(); // Return parsed JSON data
  } catch (err) {
    throw new Error("Failed to load invoice data.");
  }
};

const Invoice = () => {
  const location = useLocation();
  const router = useRouter();

  const params = new URLSearchParams(location.search);
  const studentId = params.get("id"); // Extract student ID from URL params

  const [invoiceData, setInvoiceData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (studentId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const data = await fetchInvoiceData(studentId);
          setInvoiceData(data); // Set fetched data
        } catch (err) {
          console.error(err);
          setError("Failed to load invoice data.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setError("Student ID not provided in the URL.");
      setLoading(false);
    }
  }, [studentId]);

  const handleClick = () => {
    router.push("/mainvoice");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!invoiceData) {
    return <div>No invoice data found.</div>;
  }

  // Extract relevant fields
  const {
    student,
    subscription,
    hours,
    planTotalPrice,
  } = invoiceData;

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

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
      <div
        style={{
          backgroundColor: "#2c3e50",
          color: "#fff",
          padding: "10px",
          textAlign: "center",
        }}
      >
        <h1>Invoice</h1>
      </div>
      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "20px",
          border: "1px solid #ddd",
        }}
      >
        <p>
          <strong>Student Details:</strong>
        </p>
        <p>
          Name: {fullName}
          <br />
          Email: <a href={`mailto:${email}`}>{email}</a>
          <br />
          Phone: {phoneNumber}
          <br />
          Country: {country}
        </p>

        <p>
          <strong>Course:</strong> {courseName}
        </p>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Package</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Amount/Hour</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Fees/Day</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Total Duration (Days)</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{packageName}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>${amountPerHour}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>${feesPerDay}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{subscriptionDuration} days</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>${totalAmount}</td>
            </tr>
          </tbody>
        </table>

        <p
          style={{
            fontWeight: "bold",
            textAlign: "right",
            marginTop: "20px",
          }}
        >
          Total Amount Due: ${totalAmount}
        </p>

        <button
          style={{
            backgroundColor: "#3498db",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleClick}
        >
          Pay Now
        </button>
      </div>
      <div style={{ textAlign: "center", marginTop: "20px", fontSize: "12px" }}>
        <p>Powered by AL Furqan</p>
      </div>
    </div>
  );
};

export default Invoice;
