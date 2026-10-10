import React, { useState } from "react";
import "../assets/css/Home.css";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Component/Header";
import HeroSection from "../Component/HeroSection";
import { isOtpSuccessResponse } from "../utils/otpResponse";

const OtpVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { mobile, loanNo, loginType,maskedMobile } = location.state || {};

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  // const maskedMobile = mobile
  //   ? `92XXX XX${mobile.toString().slice(-2)}`
  //   : "92XXX XX35";

  console.log("Received from previous page:", { mobile, loanNo, loginType, maskedMobile});

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

 const handleVerify = async () => {
  const finalOtp = otp.join("");

  if (finalOtp.length !== 6) {
    alert("Please enter 6 digit OTP");
    return;
  }

  if (!loanNo) {
    alert("Loan number not found");
    return;
  }

  const apiUrl = `https://swatahlms.teamvedika.com/api/verifyOtp?loanId=${encodeURIComponent(
    loanNo
  )}&otp=${encodeURIComponent(finalOtp)}`;

  try {
    setLoading(true);

    const response = await fetch(apiUrl, {
      method: "POST",
    });

    const contentType = response.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    console.log("OTP Verify Response:", data);

    const isSuccess = isOtpSuccessResponse(response, data);

    if (isSuccess) {
      navigate("/loan-detail", {
        state: {
          loanNo,
          mobile: "",
          loginType: "loan",
          apiResponse: data,
        },
      });
    } else {
      alert(
        typeof data === "object" && data !== null
          ? data.message || "Invalid OTP"
          : data || "Invalid OTP"
      );
    }
  } catch (err) {
    console.error("OTP Verify Error:", err);
    const message =
      err?.message?.includes("CORS") || err?.message?.includes("Access-Control-Allow-Origin")
        ? "The API server is not allowing requests from this frontend origin. Please enable CORS on the backend for http://localhost:3002 and https://emipay.teamvedika.com."
        : "Unable to reach the OTP verification service. Please check the network connection or backend availability.";
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
          <div className="step completed">
            <span>✓</span> Loan details
          </div>
          <div className="step active">
            <span>2 </span> Verify OTP
          </div>
          <div className="step ">
            <span>3</span> Review EMI
          </div>
          <div className="step">
            <span>4</span> Payment
          </div>
          <div className="step">
            <span>5</span> Done
          </div>
        </div>

        <section className="card">
          <h2>Verify it's you</h2>

          <p>
            {loanNo ? (
              <>
                We've sent a 6-digit code for Loan No: <b>{maskedMobile}</b>. It’s
                valid for 5 minutes.
              </>
            ) : (
              <>
                We've sent a 6-digit code to <b>+91 {maskedMobile}</b>. It’s
                valid for 5 minutes.
              </>
            )}
          </p>

          <label>ONE-TIME PASSWORD</label>

          <div className="otp-boxes">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                value={digit}
                maxLength="1"
                onChange={(e) => handleOtpChange(e.target.value, index)}
              />
            ))}
          </div>

          <div className="otp-info">
            <span>
              Didn’t receive it? <b>Resend in 19s</b>
            </span>
          </div>

          <div className="actions">
            <button className="back" onClick={() => navigate(-1)}>
              ← Back
            </button>

            <button className="verify" onClick={handleVerify} disabled={loading}>
              {loading ? "Verifying..." : "Verify →"}
            </button>
          </div>
        </section>

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
    </div>
  );
};

export default OtpVerify;