import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import API from "../Services/api";
import { FaCheckCircle } from "react-icons/fa";
import { FaFire } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const quotes = ["Small habits create big results.",
  "Consistency beats motivation.",
  "Improve 1% every day.",
  "Discipline builds success."
]

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [quoteIndex, setQuoteIndex] = useState(0);

  const [showPassword, setShowPassword] = useState(false);

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email.trim() || !newPassword.trim()) {
      return setError("Please enter your email and a new password.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError("Please enter a valid email address.");
    }
    setError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const res = await API.post("/reset-password", { email, newPassword });
      setSuccessMsg(res.data.message || "Password updated successfully!");
      setTimeout(() => {
        setIsForgotPassword(false);
        setSuccessMsg("");
        setNewPassword("");
        setPassword("");
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {

    e.preventDefault();

    // 1. Check for empty fields

    if (!email.trim() || !password.trim()) {
      return setError("Please enter both email and password.");
    }

    // 2. Validate Email Format

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError("Please enter a valid email address.");
    }


    setError("");

    setLoading(true);

    try {

      const res = await API.post("/login", { email, password });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    }

    catch (error) {
      setError("Invalid email or password");
    }

    finally {
      setLoading(false);
    }

  };

  return (
    <div className="relative h-screen bg-[#0B0F2A] flex items-center justify-center overflow-hidden">

      <div className="absolute inset-0 pointer-events-none">

        <FaCheckCircle className="absolute text-indigo-500 text-3xl animate-float1 top-20 left-20 opacity-60"></FaCheckCircle>
        <FaFire className="absolute text-orange-500 text-3xl animate-float2 top-40 right-32 opacity-60"></FaFire>
        <FaCalendarAlt className="absolute text-purple-400 text-3xl animate-float3 bottom-40 left-40 opacity-60"></FaCalendarAlt>
        <FaChartLine className="absolute text-blue-400 text-3xl animate-float4 bottom-20 right-20 opacity-60"></FaChartLine>

      </div>

      <div className="bg-[#111633] p-10 rounded-xl w-96 text-white flex flex-col items-center glow-card">

        {/* Decorative icon */}

        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
          <path d="M24 4L28 16H40L30 24L34 36L24 28L14 36L18 24L8 16H20L24 4Z" fill="#FFB300" />
        </svg>

        <h1 className="text-3xl font-bold text-center mb-2">{isForgotPassword ? "Reset Password" : "Login"}</h1>

        <p className="text-center text-gray-400 mb-6">{isForgotPassword ? "Set a new password" : "Welcome Back!"}</p>

        {/* Motivational quote */}
        {!isForgotPassword && <p className="text-center text-purple-300 italic mb-6 transition-opacity duration-500">"{quotes[quoteIndex]}"</p>}

        {isForgotPassword ? (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4 w-full">
            <div className="flex items-center bg-[#1B2147] p-3 rounded-md focus-within:ring-2 focus-within:ring-purple-500 transition-all duration-200">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input type="email" placeholder="Email" className="bg-transparent w-full focus:outline-none [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="flex items-center bg-[#1B2147] p-3 rounded-md focus-within:ring-2 focus-within:ring-purple-500 transition-all duration-200">
              <FaLock className="text-gray-400 mr-3" />
              <input type={showPassword ? "text" : "password"} placeholder="New Password" className="bg-transparent w-full focus:outline-none [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

              <span className="cursor-pointer text-gray-400 ml-3" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash></FaEyeSlash> : <FaEye></FaEye>}</span>
            </div>

            <button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-600 to-indigo-500 p-3 rounded-md font-semibold hover:scale-105 transition-transform duration-200 disabled:opacity-60 disabled:cursor-not-allowed">{loading ? "Updating..." : "Reset Password"}</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex items-center bg-[#1B2147] p-3 rounded-md focus-within:ring-2 focus-within:ring-purple-500 transition-all duration-200">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input type="email" placeholder="Email" className="bg-transparent w-full focus:outline-none [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="flex items-center bg-[#1B2147] p-3 rounded-md focus-within:ring-2 focus-within:ring-purple-500 transition-all duration-200">
              <FaLock className="text-gray-400 mr-3" />
              <input type={showPassword ? "text" : "password"} placeholder="Password" className="bg-transparent w-full focus:outline-none [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]" value={password} onChange={(e) => setPassword(e.target.value)} />

              <span className="cursor-pointer text-gray-400 ml-3" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash></FaEyeSlash> : <FaEye></FaEye>}</span>
            </div>

            <button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-600 to-indigo-500 p-3 rounded-md font-semibold hover:scale-105 transition-transform duration-200 disabled:opacity-60 disabled:cursor-not-allowed">{loading ? "Logging in..." : "Login"}</button>
          </form>
        )}

        {error && (
          <p className="text-red-400 text-sm text-center mt-3">{error}</p>
        )}

        {successMsg && (
          <p className="text-green-400 text-sm text-center mt-3">{successMsg}</p>
        )}

        {!isForgotPassword ? (
          <>
            <p className="text-center text-sm text-gray-400 mt-4 cursor-pointer hover:text-white" onClick={() => { setIsForgotPassword(true); setError(""); setSuccessMsg(""); }}>Forgot Password?</p>
            <p className="text-center text-sm mt-4">Don't have an account?
              <Link to="/register" className="text-purple-400 ml-1 hover:text-purple-300">Sign Up</Link>
            </p>
          </>
        ) : (
          <p className="text-center text-sm text-gray-400 mt-4 cursor-pointer hover:text-white" onClick={() => { setIsForgotPassword(false); setError(""); setSuccessMsg(""); }}>Back to Login</p>
        )}

      </div>

    </div>
  );
}

export default Login;