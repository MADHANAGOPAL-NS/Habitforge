import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import API from "../Services/api";

function Login() {
  
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    
    e.preventDefault();

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

    finally{
      setLoading(false);
    }
  
  };

  return (
    <div className="h-screen bg-[#0B0F2A] flex items-center justify-center">
      <div className="bg-[#111633] p-10 rounded-xl w-96 text-white shadow-lg flex flex-col items-center">
        
        {/* Decorative icon */}
        
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
          <path d="M24 4L28 16H40L30 24L34 36L24 28L14 36L18 24L8 16H20L24 4Z" fill="#FFB300"/>
        </svg>
        
        <h1 className="text-3xl font-bold text-center mb-2">Login</h1>
        
        <p className="text-center text-gray-400 mb-6">Welcome Back!</p>
        
        {/* Motivational quote */}
        <p className="text-center text-purple-300 italic mb-6">"Small habits, when repeated daily, become big achievements."</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div className="flex items-center bg-[#1B2147] p-3 rounded-md">
            <FaEnvelope className="text-gray-400 mr-3" />
            <input type="email" placeholder="Email" className="bg-transparent outline-none w-full" onChange={(e) => setEmail(e.target.value)} />
          </div>
          
          <div className="flex items-center bg-[#1B2147] p-3 rounded-md">
            <FaLock className="text-gray-400 mr-3" />
            <input type="password" placeholder="Password" className="bg-transparent outline-none w-full" onChange={(e) => setPassword(e.target.value)} />
          </div>
          
          <button type="submit" disabled = {loading} className="bg-gradient-to-r from-purple-600 to-indigo-500 p-3 rounded-md font-semibold hover:opacity-90 transition">{loading ? "Logging in..." : "Login"}</button>
        
        </form>

        {error && (
          
          <p className="text-red-400 text-sm text-center mt-3">{error}</p>
          
          )}
        <p className="text-center text-sm text-gray-400 mt-4 cursor-pointer hover:text-white">Forgot Password?</p>
        
        <p className="text-center text-sm mt-4">Don't have an account?
          <Link to="/register" className="text-purple-400 ml-1 hover:text-purple-300">Sign Up</Link>
        </p>
      
      </div>
    
    </div>
  );
}

export default Login;