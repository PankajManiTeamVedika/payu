import React, { useEffect, useState } from "react";
import "../assets/css/Home.css";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../Component/Header";

const PaymentStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState("");

  const isSuccess =
    paymentData?.status?.toLowerCase() === "success" ||
    paymentData?.status?.toLowerCase() === "captured" ||
    paymentData?.status?.toLowerCase() === "completed" ||
    paymentData?.status?.toLowerCase() === "payment success" ||
    paymentData?.status?.toLowerCase() === "settled";

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const status = queryParams.get("status");
    const txnid = queryParams.get("txnid");
    const loanId = queryParams.get("loanId");
    const payUID = queryParams.get("payUID");
    const amount = queryParams.get("amount");
    const mode = queryParams.get("mode");
    const paymentType = queryParams.get("paymentType") || "emi";

    if (!status || !txnid || !loanId) {
      setError("Payment response data missing.");
      setLoading(false);
      return;
    }

    setPaymentData({
      status,
      txnid,
      loanId,
      payUID,
      amount: amount || "0",
      method: mode || "-",
      paymentType,
      orderId: txnid,
      paymentId: payUID || txnid,
      extOrderId: txnid,
      paidOn: new Date(),
    });

    setLoading(false);
  }, [location.search]);

  useEffect(() => {
    const postPaymentSuccess = async () => {
      if (!paymentData || !isSuccess) return;

      try {
        const payload = {
          udf1: paymentData.loanId,
          status: "success",
          txnid: paymentData.txnid || "",
          payUID: paymentData.payUID || "",
          amount: paymentData.amount || "",
        };

        const response = await fetch(
          "https://swatahlms.teamvedika.com/api/success/0",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const result = await response.json();
        console.log("Internal API Response:", result);
      } catch (error) {
        console.error("Error sending post-payment request:", error);
      }
    };

    postPaymentSuccess();
  }, [paymentData, isSuccess]);

  const handleDownloadReceipt = () => {
    window.print();
  };

  const formatAmount = (amount) => {
    if (!amount) return "₹0.00";

    return Number(amount).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <Header />

        <section className="hero no-print">
          <h1>
            Pay your monthly{" "}
            <span style={{ color: "#d1212c" }}>EMI</span> in under a minute.
          </h1>
        </section>

        <div className="steps no-print">
          <div className="step completed">✓ Loan details</div>
          <div className="step completed">✓ Verify OTP</div>
          <div className="step completed">✓ Review EMI</div>
          <div className="step completed">✓ Payment</div>
          <div className="step active">5 Done</div>
        </div>

        <main className="payment-success-card">
          {loading ? (
            <div className="status-loader">
              <div className="spinner"></div>
              <p>Processing payment...</p>
            </div>
          ) : error ? (
            <div className="success-top">
              <div className="success-check failed">!</div>
              <p className="success-label">STATUS CHECK FAILED</p>
              <h2>{error}</h2>

              <div className="actions no-print">
                <button
                  className="pay-btn"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>

                <button className="back" onClick={() => navigate("/")}>
                  Back to payment
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="success-top">
                <div
                  className={isSuccess ? "success-check" : "success-check failed"}
                >
                  {isSuccess ? "✓" : "!"}
                </div>

                <p className="success-label">
                  {isSuccess ? "PAYMENT SUCCESSFUL" : "PAYMENT FAILED"}
                </p>

                <h2>
                  {formatAmount(paymentData?.amount)}{" "}
                  {isSuccess ? "Received. Thank you." : "Payment not completed."}
                </h2>

                <p>
                  {paymentData?.paymentType === "foreclose"
                    ? "Foreclosure payment status updated."
                    : "Normal EMI payment status updated."}
                </p>
              </div>

              <div className="receipt-section" id="receipt-print-area">
                <h3>Transaction receipt</h3>

                <div className="receipt-grid">
                  <div>
                    <label>REFERENCE ID / TXN ID</label>
                    <p>{paymentData?.txnid || "-"}</p>
                  </div>

                  <div>
                    <label>PAYU ID</label>
                    <p>{paymentData?.payUID || "-"}</p>
                  </div>

                  <div>
                    <label>PAYMENT ID</label>
                    <p>{paymentData?.paymentId || "-"}</p>
                  </div>

                  <div>
                    <label>PAID ON</label>
                    <p>{formatDate(paymentData?.paidOn)}</p>
                  </div>

                  <div>
                    <label>LOAN NUMBER</label>
                    <p>{paymentData?.loanId || "-"}</p>
                  </div>

                  <div>
                    <label>PAYMENT TYPE</label>
                    <p>
                      {paymentData?.paymentType === "foreclose"
                        ? "Foreclosure"
                        : "Normal EMI"}
                    </p>
                  </div>

                  <div>
                    <label>EXT ORDER ID</label>
                    <p>{paymentData?.extOrderId || "-"}</p>
                  </div>

                  <div>
                    <label>METHOD</label>
                    <p>{paymentData?.method || "-"}</p>
                  </div>

                  <div>
                    <label>STATUS</label>
                    <p className={isSuccess ? "green" : "red"}>
                      {paymentData?.status || "-"}
                    </p>
                  </div>
                </div>

                <div className="amount-paid-box">
                  <label>AMOUNT PAID</label>
                  <h2>{formatAmount(paymentData?.amount)}</h2>
                </div>

                <div className="receipt-footer print-only">
                  <p>This is a system generated receipt.</p>
                  <p>Vedika Credit Capital Ltd.  <a href="https://teamvedika.com/" target="_blank" rel="noopener noreferrer">teamvedika.com</a></p>
                </div>
              </div>

              <div className="actions no-print">
                <button className="pay-btn" onClick={handleDownloadReceipt}>
                  ⬇ Download receipt
                </button>

                {isSuccess && (
                  <button
                    className="pay-btn"
                    onClick={() =>
                      navigate("/payment-history", {
                        state: {
                          loanId: paymentData?.loanId,
                        },
                      })
                    }
                  >
                    View History
                  </button>
                )}

                <button className="back" onClick={() => navigate("/")}>
                  Make another payment
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default PaymentStatus;