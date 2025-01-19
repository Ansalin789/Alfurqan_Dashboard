import React from "react";

const PaymentStatus = ({ isSuccess, paymentDetails }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
      <div
        style={{
          width: "300px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "20px",
          backgroundColor: "#fff",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div>
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: isSuccess ? "#e1fbe1" : "#ffe0e0",
            }}
          >
            <span style={{ fontSize: "30px", color: isSuccess ? "green" : "red" }}>
              {isSuccess ? "✔️" : "❌"}
            </span>
          </div>
          <h2 style={{ color: isSuccess ? "green" : "red" }}>
            {isSuccess ? "Payment Success!" : "Payment Failed!"}
          </h2>
          <p>
            {isSuccess
              ? "Your payment has been successfully done."
              : "Your payment has been failed."}
          </p>
        </div>
        <hr style={{ margin: "20px 0" }} />
        <h3>Total Payment</h3>
        <div>
          <h4>{paymentDetails.courseName}</h4>
          <p>
            Month: {paymentDetails.month} Year: {paymentDetails.year}
          </p>
          <h1>${paymentDetails.amount}</h1>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <div style={boxStyle}>Ref Number<br />{paymentDetails.refNumber}</div>
          <div style={boxStyle}>Payment Time<br />{paymentDetails.paymentTime}</div>
          <div style={boxStyle}>Payment Method<br />{paymentDetails.paymentMethod}</div>
          <div style={boxStyle}>Sender Name<br />{paymentDetails.senderName}</div>
        </div>
        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "black",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Get PDF Receipt
        </button>
      </div>
    </div>
  );
};

const boxStyle = {
  border: "1px solid #ddd",
  borderRadius: "5px",
  padding: "10px",
  fontSize: "14px",
  textAlign: "center",
};

export default PaymentStatus;
