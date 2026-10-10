import React, { useEffect, useState } from "react";
import "../assets/css/Home.css";
import logo from "../assets/image/originalLogo.png";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const LoanDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const stateData = location.state || {};

  const [loanData, setLoanData] = useState({
    mobile: stateData.mobile || "",
    name: stateData.name || "",
    loanId: stateData.loanId || stateData.loanNo || "",
    totalAmount: stateData.totalAmount || "",
    emiAmount: stateData.emiAmount || "",
    interestRate: stateData.interestRate || "",
    branchName: stateData.branchName || "",
  });

  const [amount, setAmount] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const {
    mobile,
    name,
    loanId,
    totalAmount,
    emiAmount,
    branchName,
  } = loanData;

  // ✅ CONDITION 1:
  // If mobile already comes from previous page, this API will NOT hit.

  // ✅ CONDITION 2:
  // If only loanId comes and mobile is missing, then this API will hit.
  useEffect(() => {
    const fetchLoanDetailsByLoanId = async () => {
      if (!loanId) return;
      if (mobile) return;

      try {
        setDetailsLoading(true);

        const apiUrl = `http://20.219.130.232:8080/payUapis/api/fetch-loan?loanId=${loanId}`;

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loanId: loanId,
          }),
        });

        const result = await response.json();
        console.log("Loan Details By Loan ID:", result);

        // Change keys as per actual API response
        const data = result?.data || result;

        if (response.ok && data) {
          setLoanData((prev) => ({
            ...prev,
            mobile:
              data.mobile ||
              data.mobileNo ||
              data.MobileNo ||
              data.phone ||
              prev.mobile,

            name:
              data.name ||
              data.customerName ||
              data.cust_name ||
              prev.name,

            loanId:
              data.loanId ||
              data.loan_id ||
              data.loanNo ||
              prev.loanId,

            totalAmount:
              data.totalAmount ||
              data.loanAmount ||
              data.loan_amt ||
              prev.totalAmount,

            emiAmount:
              data.emiAmount ||
              data.emi ||
              data.emi_amt ||
              prev.emiAmount,

            branchName:
              data.branchName ||
              data.branch_name ||
              prev.branchName,
          }));
        } else {
          alert("Loan details not found");
        }
      } catch (error) {
        console.error("Fetch Loan Details Error:", error);
        alert("Unable to fetch loan details");
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchLoanDetailsByLoanId();
  }, [loanId, mobile]);

  const payFullAmount = () => {
    setAmount(emiAmount || "");
    setIsReadOnly(true);
  };

  const payCustomAmount = () => {
    setAmount("");
    setIsReadOnly(false);
  };

  const handlePayment = async () => {
    const payAmount = Number(amount);

    if (!loanId) {
      alert("Loan ID missing");
      return;
    }

    if (!amount) {
      alert("Please enter payment amount");
      return;
    }

    if (payAmount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    if (emiAmount && payAmount > Number(emiAmount)) {
      alert("Amount cannot be greater than EMI amount");
      return;
    }

    try {
      setLoading(true);

      const email = "abc@gmail.com";

      const paymentUrl =
        `http://20.219.130.232:8080/payUapis/api/initiate-payment` +
        `?amount=${payAmount}` +
        `&loanId=${loanId}` +
        `&email=${email}` +
        `&phone=${mobile}`;

      const response = await fetch(paymentUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });

      const text = await response.text();
      console.log("Raw Payment Response:", text);

      let result;

      try {
        result = JSON.parse(text);
      } catch (e) {
        throw new Error("Invalid payment API response");
      }

      if (response.ok && result?.redirectUri) {
        const paymentWindow = window.open(result.redirectUri, "_blank");

        navigate("/payment-status", {
          state: {
            orderId: result.orderId,
            loanId: loanId,
          },
        });

        if (!paymentWindow) {
          alert("Popup blocked. Please allow popups.");
        }
      } else {
        alert("Payment initiation failed");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="header">
        <h2 className="logo">
          <img src={logo} alt="Vedika Finance Logo" />
        </h2>
        <LogoutButton />
      </div>

      <div className="banner"></div>

      <div className="login-card">
        <h3>Loan / EMI Details</h3>

        {detailsLoading && <p>Fetching loan details...</p>}

        <p>
          <b>Name:</b> {name || "N/A"}
        </p>
        {mobile && mobile.trim() !== "" && (
          <p>
            <b>Mobile:</b> +91 {mobile}
          </p>
        )}

        <p>
          <b>Loan Number:</b> {loanId || "N/A"}
        </p>

        <p>
          <b>Branch Name:</b> {branchName || "N/A"}
        </p>

        <div className="mobile-input">
          <input
            type="text"
            readOnly
            value={`₹${Number(totalAmount || 0).toLocaleString("en-IN")}`}
          />
          <label>Loan Amount</label>
        </div>

        <div className="mobile-input">
          <input
            type="text"
            readOnly
            value={`₹${Number(emiAmount || 0).toLocaleString("en-IN")}`}
          />
          <label>EMI Amount</label>
        </div>

       <div className="mobile-input">
            <input
              type="number"
              value={amount}
              min="1"
              max="10000000"
              readOnly={isReadOnly}
              onChange={(e) => {
                if (isReadOnly) return;

                let value = e.target.value;

                if (value === "") {
                  setAmount("");
                  return;
                }

                if (Number(value) > 10000000) {
                  value = "10000000";
                }

                if (Number(value) < 0) {
                  value = "1";
                }

                setAmount(value);
              }}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-", "."].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder="Enter Payment Amount"
              style={{
                width: "100%",
                height: "45px",
                fontSize: "16px",
                padding: "10px",
                boxSizing: "border-box",
              }}
            />
            <label>Payment Amount</label>
          </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <button
            className="continue-btn"
            style={{ background: "#30348f", color: "white" }}
            onClick={payFullAmount}
            disabled={loading || detailsLoading || !emiAmount}
          >
            Pay Full EMI
          </button>

          <button
            className="continue-btn"
            style={{ background: "#30348f", color: "white" }}
            onClick={payCustomAmount}
            disabled={loading || detailsLoading}
          >
            Pay Custom Amount
          </button>
        </div>

        <button
          className="continue-btn"
          style={{
            background: loading || detailsLoading ? "#999" : "#30348f",
            color: "white",
          }}
          disabled={loading || detailsLoading}
          onClick={handlePayment}
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
};

export default LoanDetails;