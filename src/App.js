import './App.css';
import { Route, Routes } from 'react-router-dom';
import useVersionCheck from './hooks/useVersionCheck';
import Home from './Pages/Home';
import Maintenance from './Pages/Maintenance';
import OtpVerify from './Pages/OtpVerify';
import LoanDetail from './Pages/LoanDetail';

import PaymentStatus from './Pages/PaymentStatus';
import PaymentHistory from './Pages/PaymentHistory';
import PaymentUnsuccessful from './Pages/PaymentUnsuccessful';

function App() {
  useVersionCheck();

  return (
    <Routes>
        {/* <Route path="/" element={<Maintenance />} /> */}
        {/* Maintenance mode is ON — revert to normal by swapping the line above back to: */}
        <Route path="/" element={<Home />} />
        <Route path="/otp" element={<OtpVerify />} />
        <Route path="/loan-detail" element={<LoanDetail />} />
         <Route path="/payment-status" element={<PaymentStatus />} />
         <Route path="/payment-history" element={<PaymentHistory />} />
         <Route path="/payment-unsuccessful" element={<PaymentUnsuccessful />} />
        {/* <Route path="/select-paymentMethod" element={<SelectPaymentMethod />} /> */}
        {/* <Route path="/loan-details" element={<LoanDetails />} /> */}
        {/* <Route path="/due-amount" element={<DueAmount/>} /> */}
        {/* <Route path="/create-payment-order" element={<CreatePaymentOrder />} /> */}
        {/* <Route path="/payment-gateway" element={<PaymentGateway />} /> */}
       
        {/* <Route path="/receipt" element={<Receipt />} />
         */}
    </Routes>
  );
}

export default App;
