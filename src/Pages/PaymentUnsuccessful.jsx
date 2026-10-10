import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Component/Header";
import "../assets/css/PaymentUnsuccessful.css";

const PaymentUnsuccessful = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read data from URL
  const queryParams = new URLSearchParams(location.search);

  const urlStatus = queryParams.get("status");
  const urlTxnid = queryParams.get("txnid");
  const urlLoanId = queryParams.get("loanId");
  const urlPayUID = queryParams.get("payUID");
  const urlAmount = queryParams.get("amount");
  const urlMessage = queryParams.get("message");

  // Fallback: if data comes from navigate state
  const paymentData = location.state || {};

  const loanNo = paymentData.loanNo || urlLoanId;
  const loanId = paymentData.loanId || urlLoanId;
  const amount = paymentData.amount || urlAmount;
  const orderId = paymentData.orderId || urlTxnid;
  const payUID = paymentData.payUID || urlPayUID;
  const message = paymentData.message || urlMessage;
  const status = paymentData.status || urlStatus;

  const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="payment-failed-page">
      <Header />

      <div className="payment-failed-container">
        <div className="failed-card">
          <div className="failed-icon">!</div>

          <h1>Payment Unsuccessful</h1>

          <p className="failed-message">
            Your payment was not completed. No payment has been confirmed for
            this transaction.
          </p>

          <div className="failed-info-box">
            <div>
              <span>Loan Number</span>
              <b>{loanNo || loanId || "-"}</b>
            </div>

            <div>
              <span>Amount</span>
              <b>₹ {formatAmount(amount)}</b>
            </div>

            <div>
              <span>Order ID / TXN ID</span>
              <b>{orderId || "-"}</b>
            </div>

            <div>
              <span>PayU ID</span>
              <b>{payUID || "-"}</b>
            </div>

            <div>
              <span>Status</span>
              <b className="failed-status">
                {status || "Payment Not Completed"}
              </b>
            </div>
          </div>

          <div className="reason-box">
            <h3>Possible Reason</h3>
            <p>
              {message ||
                "Payment was cancelled, failed, timed out, or not confirmed by the payment gateway."}
            </p>
          </div>

          <div className="failed-actions single-action">
            <button className="home-btn" onClick={handleGoHome}>
              Back to Home
            </button>
          </div>

          <p className="support-text">
            If money was deducted from your bank account, please wait for bank
            confirmation or contact Vedika support with your Order ID / TXN ID.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentUnsuccessful;