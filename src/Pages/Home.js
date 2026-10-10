import React, { useState } from "react";
import "../assets/css/Home.css";
import { useNavigate } from "react-router-dom";
import Header from "../Component/Header";
import HeroSection from "../Component/HeroSection";
import { isOtpSuccessResponse } from "../utils/otpResponse";
import upi from "../assets/image/upi.webp";
import card from "../assets/image/card.png";
import netbank from "../assets/image/netbank.png";
import wallet from "../assets/image/wallet.png";

const Home = () => {
  const navigate = useNavigate();

  const [loanNo, setLoanNo] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWhyAsk, setShowWhyAsk] = useState(false);
  

  const handleSendOtp = async () => {
    const loanValue = loanNo.trim();

    if (!loanValue) {
      alert("Please enter Loan Account Number");
      return;
    }

    const apiUrl = `https://swatahlms.teamvedika.com/api/sendOtp?loanId=${encodeURIComponent(
      loanValue
    )}`;

    try {
      setLoading(true);

      const response = await fetch(apiUrl, {
        method: "POST",
      });
  console.log("OTP API Response:", response);
      const contentType = response.headers.get("content-type");

      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log("OTP API DATA:", data);
      const isSuccess = isOtpSuccessResponse(response, data);
      if (isSuccess) {
        navigate("/otp", {
          state: {
            loanNo: loanValue,
            mobile: "",
            maskedMobile: data?.mobile || "",
            loginType: "loan",
            apiResponse: data,
          },
        });
      } else {
        alert(
          typeof data === "object" && data !== null
            ? data.message || "Failed to send OTP"
            : data || "Failed to send OTP"
        );
      }
    } catch (err) {
      console.error("OTP API Error:", err);
      const message =
        err?.message?.includes("CORS") || err?.message?.includes("Access-Control-Allow-Origin")
          ? "The API server is not allowing requests from this frontend origin. Please enable CORS on the backend for http://localhost:3002 and https://emipay.teamvedika.com."
          : "Unable to reach the OTP service. Please check the network connection or backend availability.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <Header />
        <HeroSection />

        <div className="steps">
          <div className="step active">
            <span>1</span> Loan details
          </div>
          <div className="step">
            <span>2</span> Verify OTP
          </div>
          <div className="step">
            <span>3</span> Review EMI
          </div>
          <div className="step">
            <span>4</span> Payment
          </div>
          <div className="step">
            <span>5</span> Done
          </div>
        </div>

        <main className="home-main full-form">
          <section className="loan-box full-width">
            <h2>Find your loan</h2>

            <p>
              Enter the loan account number printed on your sanction letter or
              welcome SMS.
            </p>

            <div className="input-group">
              <div className="label-with-icon">
                <label>Loan Account Number</label>
              </div>

              <input
                  type="text"
                  value={loanNo}
                  maxLength={7}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setLoanNo(value);
                  }}
                  placeholder="0000000"
                />
            </div>

            {/* <div className="input-group">
              <label style={{ marginLeft: "20%" }}>OR</label>
            </div> */}

            {/* <div className="input-group">
              <label>Registered Mobile Number</label>

              <input
                type="tel"
                value={mobile}
                maxLength="10"
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                placeholder="+91  XXXXX XXXXX"
              />

              <small>We'll send a one-time password to verify it’s you.</small>
            </div> */}

            <button onClick={handleSendOtp} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"} {!loading && "→"}
            </button>

            <div className="line"></div>

            <div className="input-group">
              <label>Accepted Payments</label>
            </div>

            <div className="payments">
              <span>
                <img src={upi} alt="UPI" style={{ height: "20px" }} />
              </span>
              <span>
                <img src={card} alt="Cards" style={{ height: "20px" }} />
              </span>
              <span>
                <img
                  src={netbank}
                  alt="Net Banking"
                  style={{ height: "20px" }}
                />
              </span>
              <span>
                <img src={wallet} alt="Wallets" style={{ height: "20px" }} />
              </span>
            </div>
          </section>
        </main>

        <footer className="home-footer">
          <p>© 2026 Vedika Credit Capital Ltd.</p>

           <p>Version 1.0.5</p>

         <div>
  <span><a href="https://teamvedika.com/privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy</a></span>

  <span><a href="https://teamvedika.com/terms-conditions/" target="_blank" rel="noopener noreferrer">Terms</a></span>

  <span><a href="https://teamvedika.com/regulatory/" target="_blank" rel="noopener noreferrer">Grievance</a></span>
  <span><a href="https://teamvedika.com/" target="_blank" rel="noopener noreferrer">teamvedika.com</a></span>
</div>
        </footer>
      </div>

      {showWhyAsk && (
        <div className="modal-overlay">
          <div className="why-modal">
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowWhyAsk(false)}
            >
              ×
            </button>

            <div className="modal-icon">?</div>

            <h3>WHY WE ASK</h3>

            <p>
              We use your loan number and registered mobile number only to verify
              your identity and fetch your correct outstanding amount securely.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;