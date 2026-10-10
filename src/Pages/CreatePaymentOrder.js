import React from "react";
import "../assets/css/Home.css";
import logo from "../assets/image/originalLogo.png";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const CreatePaymentOrder = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const { name, mobile, payAmount } = location.state || {};

  const handleCreateOrder = () => {

    const paymentData = {
      name,
      mobile,
      amount: payAmount,
      orderId: "ORD" + Date.now()
    };

    console.log("Payment Order Created:", paymentData);

    navigate("/payment-gateway", { state: paymentData });
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

      {/* Payment Order Card */}
      <div className="login-card">

        <h3>Create Payment Order</h3>

        <p><b>Name:</b> {name}</p>
        <p><b>Mobile:</b> +91 {mobile}</p>

        <div className="mobile-input">
          <input
            type="text"
            readOnly
            value={`₹${payAmount}`}
          />
          <label>Payment Amount</label>
        </div>

        <button
          className="continue-btn"
          style={{ background: "#30348f", color: "white" }}
          onClick={handleCreateOrder}
        >
          Pay Now
        </button>

      </div>

    </div>
  );
};

export default CreatePaymentOrder;