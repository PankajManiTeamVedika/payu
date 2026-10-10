import React, { useEffect, useState } from "react";
import "../assets/css/Home.css";
import "../assets/css/Home.css";
import logo from "../assets/image/originalLogo.png";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const PaymentHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { loanId } = location.state || {};


  const [payments, setPayments] = useState([]);
  const [historyType, setHistoryType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getCollectionMode = (mode) => {
  switch (Number(mode)) {
    case 1:
      return "NEFT";
    case 2:
      return "CASH";
    case 3:
      return "BANK";
    case 4:
      return "JOURNAL";
    case 5:
      return "NACH";
    case 6:
      return "WRITEOFF";
    case 7:
      return "DEATH MARK";
    case 8:
      return "RENEWAL LOAN CLOSE";
    case 9:
      return "NPA Restructure Adjustment";
    case 10:
      return "QR PAYMENT";
    case 11:
      return "UPI";
    case 13:
      return "PAYU";
    default:
      return "UNKNOWN";
  }
};

  const fetchPaymentHistory = async () => {
    if (!loanId) {
      setError("Loan ID missing.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const url = `https://swatahlms.teamvedika.com/api/paymentHistory?loanId=${loanId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const text = await response.text();
      console.log("Payment History Raw Response:", text);

      let result;

      try {
        result = JSON.parse(text);
      } catch (e) {
        throw new Error("Payment history API is not returning JSON.");
      }

      if (response.ok && Array.isArray(result?.data)) {
        setPayments(result.data);
        setHistoryType(result?.type || "");
      } else {
        setPayments([]);
        setError("No payment history found.");
      }
    } catch (err) {
      console.error("Payment History Error:", err);
      setPayments([]);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, [loanId]);

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    });
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

 

  const totalPaid = payments.reduce(
    (sum, item) => sum + Number(item?.coll_amt || 0),
    0
  );

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <div className="history-logo">
            <img src={logo} alt="Vedika Finance Logo" />
          </div>

          <LogoutButton />
        </div>

        <div className="history-hero">
          <div>
            <p className="history-label">Payment Records</p>
            <h2>Payment History</h2>
            <p className="history-subtitle">
              View all payment collections linked with this loan account.
            </p>
          </div>

          <button className="history-back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        <div className="history-summary-grid">
          <div className="history-summary-card">
            <p>Loan ID</p>
            <h3>{loanId || "N/A"}</h3>
          </div>

          <div className="history-summary-card">
            <p>Total Payments</p>
            <h3>{payments.length}</h3>
          </div>

          <div className="history-summary-card">
            <p>Total Amount Paid</p>
            <h3>{formatAmount(totalPaid)}</h3>
          </div>

          <div className="history-summary-card">
            <p>Search Type</p>
            <h3>{historyType || "N/A"}</h3>
          </div>
        </div>

        <div className="history-card">
          <div className="history-card-top">
            <div>
              <h3>Transaction List</h3>
              <p>Latest payment records received from system.</p>
            </div>

            <button
              className="history-refresh-btn"
              onClick={fetchPaymentHistory}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {loading && (
            <div className="history-loader">
              <div className="history-spinner"></div>
              <p>Loading payment history...</p>
            </div>
          )}

          {!loading && error && (
            <div className="history-error-box">
              <h4>Unable to load history</h4>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && payments.length === 0 && (
            <div className="history-empty-box">
              <h4>No payment history available</h4>
              <p>No transaction found for this loan ID.</p>
            </div>
          )}

          {!loading && payments.length > 0 && (
            <div className="history-table-wrap">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Sr.</th>
                    <th>Loan ID</th>
                    <th>Branch</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Collection Date</th>
                    <th>Mode</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{payment.loan_id || "N/A"}</td>
                      <td>{payment.branch_name || "N/A"}</td>
                      <td>{payment.consumer_name || "N/A"}</td>
                      <td className="amount-cell">
                        {formatAmount(payment.coll_amt)}
                      </td>
                      <td>{formatDate(payment.coll_date)}</td>
                      <td>
                        <span className="mode-badge">
                          {getCollectionMode(payment.coll_mode)}
                        </span>
                      </td>
                      <td>
                        <span className="success-badge">Received</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;