import React, { useState } from "react";
import "../assets/css/Home.css";
import { useNavigate, useLocation } from "react-router-dom";

const SelectPaymentMethod = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    mobile = "",
    name = "Rakesh K. Sinha",
    amount = 12977.54,
    paymentType = "emi"
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");

  const payableAmount =
    paymentType === "foreclose" ? 285985.87 : Number(amount || 12977.54);

  const handlePay = () => {
    navigate("/payment-status", {
      state: {
        ...location.state,
        paymentMethod,
        upiId,
        payableAmount
      }
    });
  };

  return (
    <div className="home-page">
      <div className="home-container">

        <header className="home-header">
          <div className="brand">
            <div className="brand-icon">V</div>
            <div>
              <h2>Vedika<span>.</span></h2>
              <p>LOANS · REPAYMENT PORTAL</p>
            </div>
          </div>

          <div className="header-info">
            <span>🔒 256-bit SSL</span>
          </div>
        </header>

        <section className="hero">
          <p className="hero-label">EMI PAYMENT</p>
          <h1>
            Pay your monthly <em>EMI</em> in under a minute.
          </h1>
          <p className="hero-text">
            Enter your loan account number to fetch dues, choose how you'd like to
            pay, and we'll email a stamped receipt the moment it clears.
          </p>
        </section>

        <div className="steps">
          <div className="step completed"><span>✓</span> Loan details</div>
          <div className="step completed"><span>✓</span> Verify OTP</div>
          <div className="step completed"><span>✓</span> Review EMI</div>
          <div className="step active"><span>4</span> Payment</div>
          <div className="step"><span>5</span> Done</div>
        </div>

        <main className="payment-card">
          <h2>How would you like to pay?</h2>
          <p>
            All transactions are encrypted and processed via PCI-DSS compliant
            gateways.
          </p>

          <div className="payment-methods">

            <div
              className={`payment-option ${paymentMethod === "upi" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("upi")}
            >
              <div className="payment-icon">U</div>
              <div className="payment-text">
                <h3>UPI</h3>
                <p>Pay instantly with any UPI app — GPay, PhonePe, Paytm, BHIM</p>
              </div>
              <div className="radio-dot"></div>
            </div>

            <div
              className={`payment-option ${paymentMethod === "card" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("card")}
            >
              <div className="payment-icon">▭</div>
              <div className="payment-text">
                <h3>Debit / Credit card</h3>
                <p>Visa, Mastercard, RuPay accepted · 1% gateway fee on credit cards</p>
              </div>
              <div className="radio-dot"></div>
            </div>

            <div
              className={`payment-option ${paymentMethod === "netbanking" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("netbanking")}
            >
              <div className="payment-icon">⌂</div>
              <div className="payment-text">
                <h3>Net banking</h3>
                <p>Direct debit from 50+ supported banks</p>
              </div>
              <div className="radio-dot"></div>
            </div>

            <div
              className={`payment-option ${paymentMethod === "wallet" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("wallet")}
            >
              <div className="payment-icon">◇</div>
              <div className="payment-text">
                <h3>Wallets</h3>
                <p>Paytm, Amazon Pay, Mobikwik, Freecharge</p>
              </div>
              <div className="radio-dot"></div>
            </div>

          </div>

         {paymentMethod === "upi" && (
  <div className="upi-box">
    <label>YOUR UPI ID</label>
    <input
      type="text"
      value={upiId}
      onChange={(e) => setUpiId(e.target.value)}
      placeholder="yourname@okaxis"
    />
    <p>A collect request will appear in your UPI app.</p>
  </div>
)}

{paymentMethod === "card" && (
  <div className="upi-box">
    <label>CARD DETAILS</label>

    <input type="text" placeholder="Card number" maxLength="19" />

    <div className="card-row">
      <input type="text" placeholder="MM/YY" maxLength="5" />
      <input type="password" placeholder="CVV" maxLength="3" />
    </div>

    <p>Your card details are securely encrypted.</p>
  </div>
)}

{paymentMethod === "netbanking" && (
  <div className="upi-box">
    <label>CHOOSE YOUR BANK</label>

    <select className="select-field">
      <option value="">Select bank</option>
      <option>SBI Bank</option>
      <option>HDFC Bank</option>
      <option>ICICI Bank</option>
      <option>Axis Bank</option>
      <option>Punjab National Bank</option>
      <option>Bank of Baroda</option>
    </select>

    <p>You’ll be redirected to your bank’s secure page.</p>
  </div>
)}

{paymentMethod === "wallet" && (
  <div className="upi-box">
    <label>CHOOSE WALLET</label>

    <select className="select-field">
      <option value="">Select wallet</option>
      <option>Paytm</option>
      <option>Amazon Pay</option>
      <option>Mobikwik</option>
      <option>Freecharge</option>
    </select>

    <p>You’ll be redirected to selected wallet app/page.</p>
  </div>
)}

          <div className="actions">
            <button className="back" onClick={() => navigate(-1)}>
              ← Back
            </button>

            <button className="pay-btn" onClick={handlePay}>
              Pay ₹{payableAmount.toLocaleString("en-IN")} securely →
            </button>
          </div>
        </main>

        <section className="order-summary-card">
          <h4>ORDER SUMMARY</h4>

          <div>
            <span>{paymentType === "foreclose" ? "Foreclosure Amount" : "EMI · 5 May 2026"}</span>
            <b>₹ {payableAmount.toLocaleString("en-IN")}</b>
          </div>

          <div>
            <span>Charges (bouncing + penal)</span>
            <b className="green">FREE</b>
          </div>

          <div>
            <span>Convenience fee</span>
            <b className="green">FREE</b>
          </div>

          <div className="total-payable">
            <div>
              <label>TOTAL PAYABLE</label>
            </div>
            <h2>₹{payableAmount.toLocaleString("en-IN")}</h2>
          </div>

          <p>
            By proceeding you authorise Vedika Finance Pvt. Ltd. to debit the
            above amount towards your loan account.
          </p>
        </section>

        <footer className="home-footer">
          <p>© 2026 Vedika Finance Pvt. Ltd. · CIN U65923MH2014PTC123456</p>
          <div>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Grievance</span>
            <span>teamvedika.com</span>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default SelectPaymentMethod;