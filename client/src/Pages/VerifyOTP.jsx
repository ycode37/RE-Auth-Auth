import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { server } from "../main";
import { toast } from "react-toastify";
import axios from "axios";

const VerifyOTP = () => {
  const [OTP, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("email");
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${server}/api/v1/verify-otp`,
        {
          email: email,
          otp: OTP,
        },
        {
          withCredentials: true, // Include cookies in the request
        },
      );
      localStorage.clear("email");
      toast.success(data.message);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#EFF2F6]">
      <style>{`
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatBlob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -25px) scale(1.05); }
        }
        .login-card {
          animation: riseIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow:
            0 8px 32px rgba(31, 45, 61, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.7);
        }
        .login-hero { animation: riseIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both; }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.55;
          animation: floatBlob 12s ease-in-out infinite;
        }

        .field { position: relative; }
        .field input {
          border: none;
          border-bottom: 1.5px solid rgba(28, 43, 57, 0.15);
          background: transparent;
          transition: border-color 0.3s ease;
        }
        .field input:focus { border-color: rgba(28, 43, 57, 0.15); outline: none; }
        .field::after {
          content: "";
          position: absolute;
          left: 0; bottom: -1.5px;
          width: 100%; height: 1.5px;
          background: #1C2B39;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .field:focus-within::after { transform: scaleX(1); }
        .field label { transition: color 0.3s ease; }
        .field:focus-within label { color: #1C2B39; }

        .submit-btn {
          transition: transform 0.15s ease, background-color 0.25s ease, box-shadow 0.25s ease;
        }
        .submit-btn:hover { background-color: #101A24; box-shadow: 0 6px 20px -6px rgba(16,26,36,0.45); }
        .submit-btn:active { transform: scale(0.97); }

        .signup-link { position: relative; }
        .signup-link::after {
          content: "";
          position: absolute;
          left: 0; bottom: -2px;
          width: 100%; height: 1px;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s ease;
        }
        .signup-link:hover::after { transform: scaleX(1); transform-origin: left; }
      `}</style>

      <div
        className="blob"
        style={{
          width: 420,
          height: 420,
          top: -80,
          left: -100,
          background: "#A7C7E7",
        }}
      />
      <div
        className="blob"
        style={{
          width: 380,
          height: 380,
          bottom: -100,
          right: -60,
          background: "#CFE3D8",
          animationDelay: "3s",
        }}
      />
      <div
        className="blob"
        style={{
          width: 260,
          height: 260,
          top: "35%",
          right: "20%",
          background: "#E7D9C7",
          animationDelay: "6s",
        }}
      />

      <section className="relative text-slate-500">
        <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
          <div className="login-hero lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
            <span className="text-xs tracking-widest uppercase text-slate-400 font-medium">
              Welcome back
            </span>
            <h1 className="mt-3 font-medium text-3xl text-[#1C2B39] tracking-tight">
              Good to see you again.
            </h1>
            <p className="leading-relaxed mt-4 text-slate-500">
              Sign in to pick up right where you left off.
            </p>
          </div>

          <form
            onSubmit={submitHandler}
            className="login-card lg:w-2/6 md:w-1/2 rounded-[28px] p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0"
          >
            <h2 className="text-[#1C2B39] text-lg font-medium mb-6">Log In</h2>

            <div className="field mb-6">
              <label
                htmlFor="OTP"
                className="block text-sm text-slate-500 mb-1"
              >
                OTP
              </label>
              <input
                type="number"
                id="OTP"
                name="OTP"
                className="w-full text-base text-[#1C2B39] py-1.5 px-0"
                value={OTP}
                onChange={(e) => setOTP(e.target.value)}
                required
              />
            </div>

            <button
              disabled={loading}
              className="submit-btn text-white bg-[#1C2B39] border-0 py-2.5 px-8 rounded-2xl text-base font-medium"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <Link
              to="/register"
              className="signup-link text-xs text-slate-500 mt-4 w-fit"
            >
              Don't have an account? Sign up
            </Link>
          </form>
        </div>
      </section>
    </div>
  );
};

export default VerifyOTP;
