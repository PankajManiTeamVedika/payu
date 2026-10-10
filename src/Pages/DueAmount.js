import React, { useState } from "react";
import "../assets/css/Home.css";
import logo from "../assets/image/originalLogo.png";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const DueAmount = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const { mobile, name, totalAmount, dueAmount } = location.state || {};

  const [amount, setAmount] = useState("");

  // Fill full due amount
  const payFullAmount = () => {
    setAmount(dueAmount);
  };

  // Allow manual payment
  const payCustomAmount = () => {
    setAmount("");
  };

  const handlePayment = () => {

    if (!amount) {
      alert("Please enter payment amount");
      return;
    }

    const paymentData = {
      name,
      mobile,
      payAmount: amount,
      totalAmount,
      dueAmount
    };

    navigate("/create-payment-order", { state: paymentData });
  };

  return (
    <div className="main-container">

      {/* Header */}
      <div className="header">
        <h2 className="logo">
          <img src={logo} alt="Vedika Finance Logo" />
        </h2>
        <LogoutButton />
      </div>

      <div className="banner"></div>

      {/* Due Amount Card */}
      <div className="login-card">

        <h3>Loan Due Details</h3>

        <p><b>Name:</b> {name}</p>
        <p><b>Mobile:</b> +91 {mobile}</p>

        <div className="mobile-input">
          <input type="text" readOnly value={`₹${totalAmount}`} />
          <label>Total Loan Amount</label>
        </div>

        <div className="mobile-input">
          <input
            type="text"
            readOnly
            value={`₹${totalAmount - dueAmount}`}
          />
          <label>Paid Amount</label>
        </div>

        <div className="mobile-input">
          <input type="text" readOnly value={`₹${dueAmount}`} />
          <label>Due Amount</label>
        </div>

        {/* Payment Amount */}
        <div className="mobile-input">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter Payment Amount"
          />
          <label>Payment Amount</label>
        </div>

        {/* Buttons */}
        <div style={{display:"flex", gap:"10px", marginBottom:"15px"}}>

          <button className="continue-btn btn-success" style={{background: "#30348f",color: "white"}} onClick={payFullAmount}>
            Pay Full Due
          </button>

          <button className="continue-btn btn-success" style={{background: "#30348f",color: "white"}} onClick={payCustomAmount}>
            Pay Custom Amount
          </button>

        </div>

        <button className="continue-btn btn-success" style={{background: "#30348f",color: "white"}} onClick={handlePayment}>
          Proceed to Payment
        </button>

      </div>

    </div>
  );
};

export default DueAmount;