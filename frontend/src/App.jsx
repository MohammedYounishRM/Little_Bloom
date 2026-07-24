import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./components/authStore.js";
import SignUpPage from "./components/SignUp.jsx";
import LoginPage from "./components/Login.jsx";
import EmailVerificationPage from "./components/EmailVerification.jsx";
import ForgotPasswordPage from "./components/ForgotPassword.jsx";
import ResetPasswordPage from "./components/ResetPassword.jsx";
import VerifyResetOtpPage from "./components/VerifyResetOtp.jsx";
import HomePage from "./components/Home.jsx";
import SideBar from "./components/SideBar.jsx";
import DashBoard from "./components/DashBoard.jsx";
import ChildManagement from "./components/ChildManagement.jsx";
import Attendance from "./components/Attendance.jsx";
import Growth from "./components/Growth.jsx";
import ProfilePage from "./components/Profile.jsx";

const ProtectRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  
  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  
  useEffect(() => { checkAuth(); }, [checkAuth]);

  if (isCheckingAuth) {
    return (<div className="auth-page-wrapper">
         <div className="auth-container" style={{ textAlign: "center" }}>Loading Authorization...</div>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<RedirectAuthenticatedUser><HomePage /></RedirectAuthenticatedUser>} />
        <Route path="/login" element={<RedirectAuthenticatedUser><LoginPage /></RedirectAuthenticatedUser>} />
        <Route path="/signup" element={<RedirectAuthenticatedUser><SignUpPage /></RedirectAuthenticatedUser>} />
        <Route path="/verify-email" element={<RedirectAuthenticatedUser><EmailVerificationPage /></RedirectAuthenticatedUser>} />
        <Route path="/verify-reset-otp" element={<RedirectAuthenticatedUser><VerifyResetOtpPage /></RedirectAuthenticatedUser>} />
        <Route path="/forgot-password" element={<RedirectAuthenticatedUser><ForgotPasswordPage /></RedirectAuthenticatedUser>} />
        <Route path="/reset-password" element={<RedirectAuthenticatedUser><ResetPasswordPage /></RedirectAuthenticatedUser>} />
        <Route element={<ProtectRoute><SideBar /></ProtectRoute>} >
        <Route path="/dashboard" element={<ProtectRoute><DashBoard /></ProtectRoute>} />
        <Route path="/child-management" element={<ProtectRoute><ChildManagement /></ProtectRoute>} />
        <Route path="/attendance" element={<ProtectRoute><Attendance /></ProtectRoute>} />        
        <Route path="/growth" element={<ProtectRoute><Growth /></ProtectRoute>} />
        <Route path="/profile" element={<ProtectRoute><ProfilePage /></ProtectRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default App;