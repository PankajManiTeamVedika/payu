import React from "react";
import "../assets/css/Home.css";

const HeroSection = () => {
  return (
    <section className="hero">
      <h1>
        Pay your monthly{" "}
        <span style={{ color: "#d1212c" }}>EMI</span> in under a minute.
      </h1>

      <p className="hero-text">
        Enter your loan account number, check your dues, and pay securely in
        just a few clicks.
      </p>
    </section>
  );
};

export default HeroSection;