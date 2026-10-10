import React from "react";
import Header from "../Component/Header";
import "../assets/css/Maintenance.css";

const Maintenance = () => {
  return (
    <div className="maintenance-page">
      <Header />

      <div className="maintenance-container">
        <div className="maintenance-card">
          <div className="maintenance-icon">🛠️</div>

          <h1>We'll be back soon</h1>

          <p className="maintenance-message">
            This website is currently under scheduled maintenance to improve
            your experience.
          </p>

          <p className="maintenance-subtext">
            Please check back after some time. We apologize for the
            inconvenience.
          </p>

          <p className="maintenance-support">
            For urgent assistance, please contact Vedika support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
