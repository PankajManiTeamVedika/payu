import React from "react";
import "../assets/css/Header.css";

const Header = () => {
  return (
    <header className="clean-header">
      <div className="header-inner">
        <div className="logo-area">
          <img
            src="https://teamvedika.com/wp-content/uploads/2022/01/New-Logo-Vedika-768x320.png"
            alt="Vedika Finance Logo"
            className="header-logo"
          />
        </div>

        <div className="header-actions">
          <div className="secure-badge">🔒 Secure Payment</div>

          <div className="customer-care">
             <strong>📞 9431710000</strong>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;