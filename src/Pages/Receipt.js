import React from "react";
import "../assets/css/Home.css";
import logo from "../assets/image/originalLogo.png";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Receipt = () => {

  const location = useLocation();
  const navigate = useNavigate();

const { name, mobile, amount, orderId, status } = location.state || {};
  const getStatusColor = () => {
  if (status === "Success") return "green";
  if (status === "Pending") return "orange";
  if (status === "Failed") return "red";
  return "black";
};

  const downloadReceipt = () => {
    window.print();
  };

  return (
    <div className="main-container">

      {/* Header */}
      <div className="header">
        <h2 className="logo">
          <img src={logo} alt="Vedika Finance Logo" />
        </h2>
        <LogoutButton/>
      </div>

      <div className="banner"></div>

      {/* Receipt Card */}
      <div className="login-card">

        <h3>Payment Receipt</h3>

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
            value={`Amount Paid : ₹${amount}`}
          />
        </div>

      <div className="mobile-input">
        <input
          type="text"
          readOnly
          value={`Status : ${status?.toUpperCase()}`}
          style={{
            color: getStatusColor(),
            fontWeight: "bold"
          }}
        />
      </div>

        <button className="continue-btn" style={{background: "#30348f",color: "white"}} onClick={downloadReceipt}>
          Download Receipt
        </button>

        <br /><br />

        <button
          className="continue-btn"
          style={{background: "#30348f",color: "white"}}
          onClick={() => navigate("/payment-history")}
        >
          View Payment History
        </button>

      </div>

    </div>
  );
};

export default Receipt;