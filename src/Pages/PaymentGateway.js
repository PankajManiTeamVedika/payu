import React from "react";
import "../assets/css/Home.css";
import logo from "../assets/image/originalLogo.png";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const PaymentGateway = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const { name, mobile, payAmount } = location.state || {};

  // Generate Order ID here
  const orderId = "ORD" + Date.now();
  const amount = payAmount;

  const handlePayment = () => {

    console.log("Processing Payment...");

    // 👉 Example external gateway (use your real API here)
    // window.open(
    //   `https://payment.example.com/pay?orderId=${orderId}&amount=${amount}&mobile=${mobile}`,
    //   "_blank"
    // );

    // Simulate success
    navigate("/receipt", {
      state: {
        name,
        mobile,
        amount,
        orderId,
        status: "success"
      }
    });
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

      {/* Payment Card */}
      <div className="login-card">

        <h3>Payment Gateway</h3>

        <p><b>Name:</b> {name}</p>
        <p><b>Mobile:</b> +91 {mobile}</p>

        <div className="mobile-input">
          <input
            type="text"
            readOnly
            value={`Order ID : ${orderId}`}
          />
        </div>

        <div className="mobile-input">
          <input
            type="text"
            readOnly
            value={`Amount : ₹${amount}`}
          />
        </div>

        <button
          className="continue-btn"
          style={{ background: "#30348f", color: "white" }}
          onClick={handlePayment}
        >
          Proceed to Pay
        </button>

      </div>

    </div>
  );
};

export default PaymentGateway;