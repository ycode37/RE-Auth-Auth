import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Verify from "./Pages/Verify";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import VerifyOTP from "./Pages/VerifyOTP";
import { ToastContainer } from "react-toastify";
import { AppData } from "./Context/AppContext";

const App = () => {
  const { isAuth, loading } = AppData();
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isAuth ? <Home /> : <Login />} />
          <Route path="/register" element={isAuth ? <Home /> : <Register />} />
          <Route path="/login" element={isAuth ? <Home /> : <Login />} />
          <Route
            path="/verify-otp"
            element={isAuth ? <Home /> : <VerifyOTP />}
          />
          <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />
          <Route
            path="/dashboard"
            element={isAuth ? <Dashboard /> : <Login />}
          />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
};

export default App;
