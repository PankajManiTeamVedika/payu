import React, { useEffect, useState } from "react";
import "../assets/css/Home.css";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Component/Header";
import HeroSection from "../Component/HeroSection";

const LoanDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { mobile, loanNo } = location.state || {};

  const [viewType, setViewType] = useState("emi");
  const [designType, setDesignType] = useState("");
  const [emiCount, setEmiCount] = useState(1);
  const [payAdvance, setPayAdvance] = useState(false);

  const [includeBouncing, setIncludeBouncing] = useState(false);
  const [includePenal, setIncludePenal] = useState(false);

  const [bouncing, setBouncing] = useState(0);
  const [penal, setPenal] = useState(0);

  const [loanData, setLoanData] = useState(null);
  const [emiData, setEmiData] = useState(null);
  const [forecloseData, setForecloseData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [forecloseLoading, setForecloseLoading] = useState(false);

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const setDesignByFlag = (flag) => {
    if (Number(flag) === 1) {
      setDesignType("current");
    } else if (Number(flag) === 2) {
      setDesignType("advance");
    } else if (Number(flag) === 3) {
      setDesignType("overdue");
    } else {
      setApiError(true);
    }
  };

  const getLoanTypeName = (loanType) => {
    if (Number(loanType) === 2) return "Micro Business Loan";
    if (Number(loanType) === 5) return "E-Rickshaw";
    return "Others";
  };

  const getStatusName = (status) => {
    if (Number(status) === 1) return "Active";
    if (Number(status) === 2) return "Closed";
    return "Closed";
  };

  const getStatusClass = (status) => {
    if (Number(status) === 1 || Number(status) === 2) return "green";
    return "orange";
  };

  const getMonthlyEmiAmount = (data) => {
    return Number(data?.next_emi || data?.emi_due || data?.emi_amount || 0);
  };

  const getAdvanceEmiAmount = (data) => {
    return Number(
      data?.advance_emi_amount || data?.next_emi || data?.emi_due || 0
    );
  };

  const getOverdueEmiAmount = (data) => {
    return Number(data?.total_emi_amount || data?.emi_due || data?.next_emi || 0);
  };

  const getOverdueMaxEmi = (data) => {
    const totalEmiAmount = Number(data?.total_emi_amount || 0);
    const singleEmiAmount = Number(data?.emi_amount || 0);

    if (totalEmiAmount > 0 && singleEmiAmount > 0) {
      return Math.max(1, Math.round(totalEmiAmount / singleEmiAmount));
    }

    return Number(data?.installDiff || 1);
  };

  const resetChargeState = (data) => {
    setBouncing(Number(data?.bouncing_charges || 0));
    setPenal(Number(data?.penal_charges || 0));

    setIncludeBouncing(false);
    setIncludePenal(false);
    setPayAdvance(false);

    if (Number(data?.flag) === 3) {
      setEmiCount(getOverdueMaxEmi(data));
    } else {
      setEmiCount(1);
    }
  };

  useEffect(() => {
    const fetchLoanDetails = async () => {
      if (!loanNo) {
        setApiError(true);
        return;
      }

      const apiUrl = `https://swatahlms.teamvedika.com/api/fetchLoan?loanId=${encodeURIComponent(
        loanNo
      )}&flag=0`;

      try {
        setLoading(true);
        setApiError(false);

        const response = await fetch(apiUrl, {
          method: "POST",
        });

        const contentType = response.headers.get("content-type");

        let result;
        if (contentType && contentType.includes("application/json")) {
          result = await response.json();
        } else {
          result = await response.text();
        }

        console.log("Initial EMI Response:", result);

        if (!response.ok || !result?.data) {
          setApiError(true);
          return;
        }

        const data = result.data;

        setEmiData(data);
        setLoanData(data);
        setDesignByFlag(data.flag);
        resetChargeState(data);
        setViewType("emi");
      } catch (err) {
        console.error("Fetch Loan Error:", err);
        setApiError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanDetails();
  }, [loanNo]);

  const handleMonthlyEmiClick = async () => {
    if (emiData) {
      setLoanData(emiData);
      setDesignByFlag(emiData.flag);
      resetChargeState(emiData);
      setViewType("emi");
      return;
    }

    if (!loanNo) {
      alert("Loan number not found");
      return;
    }

    const apiUrl = `/fetchLoan?loanId=${encodeURIComponent(
      loanNo
    )}&flag=0`;

    try {
      setLoading(true);

      const response = await fetch(apiUrl, {
        method: "POST",
      });

      const contentType = response.headers.get("content-type");

      let result;
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      console.log("Monthly EMI Response:", result);

      if (!response.ok || !result?.data) {
        alert("Unable to fetch EMI details");
        return;
      }

      const data = result.data;

      setEmiData(data);
      setLoanData(data);
      setDesignByFlag(data.flag);
      resetChargeState(data);
      setViewType("emi");
    } catch (err) {
      console.error("Monthly EMI Error:", err);
      alert("Unable to fetch EMI details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForeclosureClick = async () => {
    if (forecloseData) {
      setLoanData(forecloseData);
      setViewType("foreclose");
      setBouncing(Number(forecloseData?.bouncing_charges || 0));
      setPenal(Number(forecloseData?.penal_charges || 0));
      return;
    }

    if (!loanNo) {
      alert("Loan number not found");
      return;
    }

    const apiUrl = `/fetchLoan?loanId=${encodeURIComponent(
      loanNo
    )}&flag=1`;

    try {
      setForecloseLoading(true);

      const response = await fetch(apiUrl, {
        method: "POST",
      });

      const contentType = response.headers.get("content-type");

      let result;
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      console.log("Foreclosure Response:", result);

      if (!response.ok || !result?.data) {
        alert("Unable to fetch foreclosure details");
        return;
      }

      const data = result.data;

      setForecloseData(data);
      setLoanData(data);
      setViewType("foreclose");

      setBouncing(Number(data?.bouncing_charges || 0));
      setPenal(Number(data?.penal_charges || 0));
    } catch (err) {
      console.error("Foreclosure API Error:", err);
      alert("Unable to fetch foreclosure details. Please try again.");
    } finally {
      setForecloseLoading(false);
    }
  };

  const monthlyEmiAmount = getMonthlyEmiAmount(emiData);
  const advanceEmiAmount = getAdvanceEmiAmount(emiData);
  const overdueEmiAmount = getOverdueEmiAmount(emiData);

  const maxEmi =
    designType === "overdue"
      ? getOverdueMaxEmi(emiData)
      : Number(emiData?.next_emi_after_this || 1);

  const selectedBouncing = includeBouncing ? Number(bouncing || 0) : 0;
  const selectedPenal = includePenal ? Number(penal || 0) : 0;

  const monthlyTotal =
    Number(monthlyEmiAmount || 0) +
    Number(selectedBouncing) +
    Number(selectedPenal);

  const advanceTotal =
    (payAdvance ? Number(advanceEmiAmount || 0) : 0) +
    Number(selectedBouncing) +
    Number(selectedPenal);

  const overdueSubtotal =
    Number(overdueEmiAmount || 0) * Number(emiCount || 1);

  // const overdueTotal =
  //   Number(overdueSubtotal || 0) +
  //   Number(selectedBouncing) +
  //   Number(selectedPenal);

      const overdueTotal =
    Number(1);

  const foreclosureBaseAmount = Number(
    loanData?.outstanding || forecloseData?.outstanding || 0
  );

  const foreclosureInterest = Number(
    loanData?.foreclose_int || forecloseData?.foreclose_int || 0
  );

  const foreclosureBouncing = Number(
    loanData?.bouncing_charges || forecloseData?.bouncing_charges || 0
  );

  const foreclosurePenal = Number(
    loanData?.penal_charges || forecloseData?.penal_charges || 0
  );

  const foreclosureTotal =
    Number(foreclosureBaseAmount || 0) +
    Number(foreclosureInterest || 0) +
    Number(foreclosureBouncing || 0) +
    Number(foreclosurePenal || 0);

  const getPayableAmount = () => {
    if (viewType === "emi") {
      if (designType === "advance") {
        return Number(advanceTotal || 0);
      }

      if (designType === "overdue") {
        return Number(overdueTotal || 0);
      }

      return Number(monthlyTotal || 0);
    }

    if (viewType === "foreclose") {
      return Number(foreclosureTotal || loanData?.total_pay_amount || 0);
    }

    return 0;
  };

  const payableAmount = getPayableAmount();

  const handleSubmit = async () => {
    const finalAmount = payableAmount;

    if (!loanNo) {
      alert("Loan ID missing");
      return;
    }

    if (!finalAmount || Number(finalAmount) <= 0) {
      alert("Payment amount is invalid");
      return;
    }

    try {
      setLoading(true);

      const staticEmail = "abc@gmail.com";
      const staticPhone = mobile || "0000000000";
        //  firstname, product,flag
      // const paymentUrl =
      //   `https://swatahlms.teamvedika.com/api/initiatePayment` +
      //   `?loanId=${encodeURIComponent(loanNo)}` +
      //   `&email=${encodeURIComponent(staticEmail)}` +
      //   `&phone=${encodeURIComponent(staticPhone)}` +
      //   `&amount=${encodeURIComponent(finalAmount)}`;

      const paymentUrl =
        `https://swatahlms.teamvedika.com/api/initiatePayment` +
        `?loanId=${encodeURIComponent(loanNo)}` +
        `&email=${encodeURIComponent(staticEmail)}` +
        `&phone=${encodeURIComponent(staticPhone)}` +
        `&amount=${encodeURIComponent(finalAmount)}` +
        `&productInfo=${encodeURIComponent(getLoanTypeName(loanData?.loan_type))}` +
        `&flag=${encodeURIComponent(loanData?.flag)}` +
        `&firstName=${encodeURIComponent(loanData?.customer_details)}`;

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

      if (response.ok && result?.payment_url) {
        // const customerData = {
        //   mobile: staticPhone,
        //   email: staticEmail,

        //   loanNo,
        //   loanId: loanNo,

        //   name: loanData?.customer_details,
        //   product: getLoanTypeName(loanData?.loan_type),

        //   paymentType: viewType,
        //   designType,
        //   amount: finalAmount,

        //   emiCount,
        //   maxEmi,

        //   includeBouncing,
        //   includePenal,
        //   bouncingCharge:
        //     viewType === "foreclose" ? foreclosureBouncing : selectedBouncing,
        //   penalCharge:
        //     viewType === "foreclose" ? foreclosurePenal : selectedPenal,

        //   orderId: result?.orderId,
        //   redirectUri: result?.redirectUri,

        //   apiResponse: loanData,
        //   paymentResponse: result,
        // };

        // const paymentWindow = window.open(result.redirectUri, "_blank");

        // if (!paymentWindow) {
        //   alert("Popup blocked. Please allow popups.");
        //   return;
        // }

        // navigate("/payment-status", { state: customerData });
         const form = document.createElement("form");
          form.method = "POST";
          form.action = result.payment_url;

          // Open in new tab
        

          const fields = [
            "key",
            "txnid",
            "amount",
            "productinfo",
            "firstname",
            "email",
            "phone",
            "surl",
            "furl",
            "hash",
          ];

          fields.forEach((field) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = field;
            input.value = result[field] || "";
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
      } else {
        navigate("/payment-unsuccessful", {
          state: {
            loanNo,
            amount: finalAmount,
            orderId: result?.orderId,
            status: result?.status || "FAILED",
            message: result?.message || "Payment initiation failed",
          },
        });
      }
    } catch (error) {
      console.error("Payment Error:", error);

      navigate("/payment-unsuccessful", {
        state: {
          loanNo,
          amount: finalAmount,
          status: "FAILED",
          message: error.message || "Something went wrong",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const ChargeOptions = ({ editable = false }) => {
    return (
      <>
        <label className="advance-check">
          <input
            type="checkbox"
            checked={includeBouncing}
            onChange={(e) => setIncludeBouncing(e.target.checked)}
          />
          <div>
            <b>Add Bouncing Charge</b>
            <p>₹ {formatAmount(bouncing)}</p>
          </div>
        </label>

        {includeBouncing && editable && (
          <div className="amount-row">
            <span>Bouncing Charge Input</span>
            <input
              type="number"
              value={bouncing}
              min="0"
              onChange={(e) =>
                setBouncing(Math.max(0, Number(e.target.value)))
              }
              className="edit-input"
            />
          </div>
        )}

        <label className="advance-check">
          <input
            type="checkbox"
            checked={includePenal}
            onChange={(e) => setIncludePenal(e.target.checked)}
          />
          <div>
            <b>Add Penal Charge</b>
            <p>₹ {formatAmount(penal)}</p>
          </div>
        </label>

        {includePenal && editable && (
          <div className="amount-row">
            <span>Penal Charge Input</span>
            <input
              type="number"
              value={penal}
              min="0"
              onChange={(e) => setPenal(Math.max(0, Number(e.target.value)))}
              className="edit-input"
            />
          </div>
        )}
      </>
    );
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
          <div className="step completed">
            <span>✓</span> Verify OTP
          </div>
          <div className="step active">
            <span>3</span> Review EMI
          </div>
          <div className="step">
            <span>4</span> Payment
          </div>
          <div className="step">
            <span>5</span> Done
          </div>
        </div>

        {loading && (
          <section className="card">
            <div className="loader-box">
              <div className="loader"></div>
              <p>Loading loan details...</p>
            </div>
          </section>
        )}

        {!loading && apiError && (
          <section className="card no-loan-card">
            <h2>No Loan Found</h2>
            <p>
              We could not find any loan details for this loan number. Please
              check the loan number and try again.
            </p>

            <button className="back" onClick={() => navigate("/")}>
              ← Back to Loan Search
            </button>
          </section>
        )}

        {!loading && !apiError && loanData && (
          <div className="review-layout">
            <main className="review-card">
              {designType === "current" && (
                <>
                  <div className="emi-tabs">
                    <button
                      className={viewType === "emi" ? "active-tab" : ""}
                      onClick={handleMonthlyEmiClick}
                    >
                      This month’s EMI
                    </button>

                    <button
                      className={viewType === "foreclose" ? "active-tab" : ""}
                      onClick={handleForeclosureClick}
                      disabled={forecloseLoading}
                    >
                      {forecloseLoading ? "Loading..." : "Foreclose loan"}
                    </button>
                  </div>

                  {viewType === "emi" && (
                    <>
                      <h2>This month's EMI</h2>

                      <div className="emi-user-grid">
                        <div>
                          <label>BORROWER</label>
                          <h3>{loanData?.customer_details}</h3>
                        </div>

                        <div>
                          <label>PRODUCT</label>
                          <h3>{getLoanTypeName(loanData?.loan_type)}</h3>
                        </div>
                      </div>

                      <div className="amount-row">
                        <span>EMI Due</span>
                        <b>₹ {formatAmount(monthlyEmiAmount)}</b>
                      </div>

                      <ChargeOptions editable={false} />

                      <div className="amount-due-box">
                        <div>
                          <label>AMOUNT DUE</label>
                          <p>EMI + selected charges</p>
                        </div>
                        <h2>₹{formatAmount(monthlyTotal)}</h2>
                      </div>
                    </>
                  )}
                </>
              )}

              {designType === "advance" && (
                <>
                  <div className="emi-tabs">
                    <button
                      className={viewType === "emi" ? "active-tab" : ""}
                      onClick={handleMonthlyEmiClick}
                    >
                      Pay in advance
                    </button>

                    <button
                      className={viewType === "foreclose" ? "active-tab" : ""}
                      onClick={handleForeclosureClick}
                      disabled={forecloseLoading}
                    >
                      {forecloseLoading ? "Loading..." : "Foreclose loan"}
                    </button>
                  </div>

                  {viewType === "emi" && (
                    <>
                      <h2>You're all caught up</h2>

                      <p>
                        No payment is due right now. You can pay your upcoming
                        EMI in advance.
                      </p>

                      <div className="emi-user-grid">
                        <div>
                          <label>BORROWER</label>
                          <h3>{loanData?.customer_details}</h3>
                        </div>

                        <div>
                          <label>PRODUCT</label>
                          <h3>{getLoanTypeName(loanData?.loan_type)}</h3>
                        </div>
                      </div>

                      <div className="amount-row">
                        <span>Current EMI Due</span>
                        <b className="green">₹ 0.00</b>
                      </div>

                      <div className="amount-row">
                        <span>Advance EMI Amount</span>
                        <b>₹ {formatAmount(advanceEmiAmount)}</b>
                      </div>

                      <label className="advance-check">
                        <input
                          type="checkbox"
                          checked={payAdvance}
                          onChange={(e) => setPayAdvance(e.target.checked)}
                        />
                        <div>
                          <b>Pay Advance EMI</b>
                          <p>Pay your upcoming EMI today.</p>
                        </div>
                      </label>

                      <ChargeOptions editable={false} />

                      <div className="amount-due-box">
                        <div>
                          <label>
                            {payableAmount > 0
                              ? "TOTAL PAYABLE"
                              : "NO PAYMENT DUE"}
                          </label>
                          <p>
                            {payableAmount > 0
                              ? "Advance EMI + selected charges"
                              : "Select advance EMI or charges to pay"}
                          </p>
                        </div>
                        <h2>₹{formatAmount(advanceTotal)}</h2>
                      </div>
                    </>
                  )}
                </>
              )}

              {designType === "overdue" && (
                <>
                  <div className="emi-tabs">
                    <button
                      className={viewType === "emi" ? "active-tab" : ""}
                      onClick={handleMonthlyEmiClick}
                    >
                      Pay overdue EMIs
                    </button>

                    <button
                      className={viewType === "foreclose" ? "active-tab" : ""}
                      onClick={handleForeclosureClick}
                      disabled={forecloseLoading}
                    >
                      {forecloseLoading ? "Loading..." : "Foreclose loan"}
                    </button>
                  </div>

                  {viewType === "emi" && (
                    <>
                      <h2>Clear overdue payment</h2>

                      <p>
                        Total overdue EMI amount is{" "}
                        <b>₹ {formatAmount(emiData?.total_emi_amount)}</b>. You
                        can pay up to <b>{maxEmi}</b> EMI(s).
                      </p>

                      <div className="emi-user-grid">
                        <div>
                          <label>BORROWER</label>
                          <h3>{loanData?.customer_details}</h3>
                        </div>

                        <div>
                          <label>PRODUCT</label>
                          <h3>{getLoanTypeName(loanData?.loan_type)}</h3>
                        </div>
                      </div>

                      <div className="amount-row">
                        <span>Number of EMIs to pay</span>

                        <div className="emi-counter">
                          <button
                            type="button"
                            disabled={emiCount <= 1}
                            onClick={() =>
                              setEmiCount((prev) => Math.max(1, prev - 1))
                            }
                          >
                            −
                          </button>

                          <span>{emiCount}</span>

                          <button
                            type="button"
                            disabled={emiCount >= maxEmi}
                            onClick={() =>
                              setEmiCount((prev) =>
                                Math.min(maxEmi, prev + 1)
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="amount-row">
                        <span>Single EMI Amount</span>
                        <b>₹ {formatAmount(overdueEmiAmount)}</b>
                      </div>

                      <div className="amount-row">
                        <span>Selected EMI Amount</span>
                        <b>
                          ₹ {formatAmount(overdueSubtotal)} ({emiCount} EMI)
                        </b>
                      </div>

                      <ChargeOptions editable={true} />

                      <div className="amount-due-box">
                        <div>
                          <label>TOTAL PAYABLE</label>
                          <p>Selected EMI + selected charges</p>
                        </div>
                        <h2>₹{formatAmount(overdueTotal)}</h2>
                      </div>
                    </>
                  )}
                </>
              )}

              {viewType === "foreclose" && (
                <>
                  <h2>Close this loan today</h2>

                  <div className="emi-user-grid">
                    <div>
                      <label>BORROWER</label>
                      <h3>{loanData?.customer_details}</h3>
                    </div>

                    <div>
                      <label>PRODUCT</label>
                      <h3>{getLoanTypeName(loanData?.loan_type)}</h3>
                    </div>
                  </div>

                  <div className="amount-row">
                    <span>Outstanding Principal</span>
                    <b>₹ {formatAmount(foreclosureBaseAmount)}</b>
                  </div>

                  <div className="amount-row">
                    <span>Foreclosure Interest</span>
                    <b>₹ {formatAmount(foreclosureInterest)}</b>
                  </div>

                  <div className="amount-row">
                    <span>Bouncing Charges</span>
                    <b>₹ {formatAmount(foreclosureBouncing)}</b>
                  </div>

                  <div className="amount-row">
                    <span>Penal Charges</span>
                    <b>₹ {formatAmount(foreclosurePenal)}</b>
                  </div>

                  <div className="amount-due-box">
                    <div>
                      <label>TOTAL FORECLOSURE PAYABLE</label>
                      <p>
                        Outstanding + foreclosure interest + mandatory charges
                      </p>
                    </div>
                    <h2>₹{formatAmount(foreclosureTotal)}</h2>
                  </div>
                </>
              )}

              <div className="actions">
                <button className="back" onClick={() => navigate(-1)}>
                  ← Back
                </button>

                <button
                  className="pay-btn"
                  onClick={handleSubmit}
                  disabled={loading || Number(payableAmount) <= 0}
                >
                  Pay Securely →
                </button>
              </div>
            </main>

            <section className="loan-card">
              <h4>LOAN SUMMARY</h4>

              <div>
                <span>Loan number</span>
                <b>{loanData?.loan_number || loanNo}</b>
              </div>

              <div>
                <span>Customer</span>
                <b>{loanData?.customer_details}</b>
              </div>

              <div>
                <span>Sanctioned</span>
                <b>₹ {formatAmount(loanData?.sanctioned)}</b>
              </div>

              <div>
                <span>Outstanding</span>
                <b>₹ {formatAmount(loanData?.outstanding)}</b>
              </div>

              <div>
                <span>Paid so far</span>
                <b>₹ {formatAmount(loanData?.paid_so_far)}</b>
              </div>

              <div>
                <span>Status</span>
                <b className={getStatusClass(loanData?.status)}>
                  {getStatusName(loanData?.status)}
                </b>
              </div>

              {viewType === "foreclose" ? (
                <>
                  <div>
                    <span>Foreclosure Interest</span>
                    <b>₹ {formatAmount(foreclosureInterest)}</b>
                  </div>

                  <div>
                    <span>Bouncing Charges</span>
                    <b>₹ {formatAmount(foreclosureBouncing)}</b>
                  </div>

                  <div>
                    <span>Penal Charges</span>
                    <b>₹ {formatAmount(foreclosurePenal)}</b>
                  </div>

                  <div>
                    <span>Total Pay Amount</span>
                    <b>₹ {formatAmount(foreclosureTotal)}</b>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span>
                      {designType === "advance"
                        ? "Advance EMI Amount"
                        : designType === "overdue"
                        ? "Selected Overdue EMI"
                        : "Monthly EMI Amount"}
                    </span>
                    <b>
                      ₹{" "}
                      {formatAmount(
                        designType === "advance"
                          ? advanceEmiAmount
                          : designType === "overdue"
                          ? overdueSubtotal
                          : monthlyEmiAmount
                      )}
                    </b>
                  </div>

                  {designType === "overdue" && (
                    <div>
                      <span>Selected EMI Count</span>
                      <b>
                        {emiCount} / {maxEmi}
                      </b>
                    </div>
                  )}

                  <div>
                    <span>Bouncing Charges</span>
                    <b>₹ {formatAmount(bouncing)}</b>
                  </div>

                  <div>
                    <span>Penal Charges</span>
                    <b>₹ {formatAmount(penal)}</b>
                  </div>

                  <div>
                    <span>Total Selected Payable</span>
                    <b>₹ {formatAmount(payableAmount)}</b>
                  </div>

                  <div>
                    <span>Due Date</span>
                    <b>{loanData?.due_date || "-"}</b>
                  </div>
                </>
              )}
            </section>
          </div>
        )}

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

export default LoanDetail;