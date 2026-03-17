import React , {useEffect, useState} from "react";
import {FaUser, FaEnvelope, FaLock} from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import API from "../Services/api";
import { FaCheckCircle } from "react-icons/fa";
import { FaFire } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";


const quotes = ["Start small. Stay consistent",
    "Your future self will thank you",
    "Every habit begins with a single step",
    "Build habits. Build your life"
];

function Register(){
    
    const navigate = useNavigate();

    const[name, setName] = useState("");

    const[email, setEmail] = useState("");

    const[password, setPassword] = useState("");

    const[error, setError] = useState("");

    const[loading, setLoading] = useState(false);

    const [quoteIndex, setQuoteIndex] = useState(0);
    
    const [showPassword, setShowPassword] = useState(false);
    

    useEffect(() =>{

        const interval = setInterval(() =>{
            setQuoteIndex((prev) => (prev + 1) % quotes.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("form submitted");

        setError("");

        setLoading(true);
        
        try{
            await API.post("/register", {
                name, email, password
            });
            
            //alert message for successfull registration
            Swal.fire({
                title: "Welcome to HabitForge",
                text: "Your account has been created successfully!",
                icon: "success",
                confirmButtonText: "Continue for login",
                background: "#111633",
                color: "#fff",
                confirmButtonColor: "#7c3aed"
            }).then(() => {
                navigate("/login");
            });
        }

        catch(error){
            setError("user already exists or registration failed");
        }

        finally{
            setLoading(false);
        }
    };

    return(
       <div className="relative h-screen bg-[#0B0F2A] flex items-center justify-center overflow-hidden">
             
             <div className="absolute inset-0 pointer-events-none">
            
                    <FaCheckCircle className="absolute text-indigo-500 text-3xl animate-float1 top-20 left-20 opacity-60"></FaCheckCircle>
                    <FaFire className="absolute text-orange-500 text-3xl animate-float2 top-40 right-32 opacity-60"></FaFire>
                    <FaCalendarAlt className="absolute text-purple-400 text-3xl animate-float3 bottom-40 left-40 opacity-60"></FaCalendarAlt>
                    <FaChartLine className="absolute text-blue-400 text-3xl animate-float4 bottom-20 right-20 opacity-60"></FaChartLine>
                  
            </div>
            
            <div className="bg-[#111633] p-10 rounded-xl w-96 text-white glow-card">
                
                <span className=" flex items-center justify-center text-5xl mb-4">🔥</span>

                <h1 className="text-3xl font-bold text-center mb-2">Sign Up</h1>

                <p className="text-center text-gray-400 mb-6">Create your HabitForge account</p>

                <p className="text-center text-purple-300 italic mb-6 transition-opacity duration-500">"{quotes[quoteIndex]}"</p>

                <form onSubmit = {handleSubmit} className="flex flex-col gap-4">
                    
                    <div className="flex items-center bg-[#1B2147] p-3 rounded-md focus-within:ring-2 focus-within:ring-purple-500 transition-all duration-200">
                        
                        <FaUser className="text-gray-400 mr-3"></FaUser>

                        <input type = "text" placeholder="Name" className="bg-transparent w-full focus:outline-none" onChange = {(e) => setName(e.target.value)}></input>
                    </div>

                    <div className="flex items-center bg-[#1B2147] p-3 rounded-md focus-within:ring-2 focus-within:ring-purple-500 transition-all duration-200">
                        
                        <FaEnvelope className="text-gray-400 mr-3"></FaEnvelope>

                        <input type = "email" placeholder="Email" className="bg-transparent w-full focus:outline-none" onChange = {(e) => setEmail(e.target.value)}></input>

                    </div>

                    <div className="flex items-center bg-[#1B2147] p-3 rounded-md focus-within:ring-2 focus-within:ring-purple-500 transition-all duration-200">
                        
                        <FaLock className="text-gray-400 mr-3"></FaLock>

                        <input type={showPassword ? "text" : "password"} placeholder="Password" className="bg-transparent w-full focus:outline-none" onChange = {(e) => setPassword(e.target.value)}></input>

                        <span className="cursor-pointer text-gray-400 ml-3" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash></FaEyeSlash> : <FaEye></FaEye>}</span>
                        
                    </div>

                    <button type = "submit" disabled = {loading} className="bg-gradient-to-r from-purple-600 to-indigo-500 p-3 rounded-md font-semibold hover:scale-105 transition-transform duration-200 disabled:opacity-60 disabled:cursor-not-allowed">{loading ? "Creating account..." : "Register"}</button>
                
                </form>

                {error && (
                    <p className="text-red-400 text-sm text-center mt-3">{error}</p>
                )}

                <p className="text-center text-sm mt-4">Already have an account?
                    
                    <Link to = "/login" className="text-purple-400 ml-1 hover:text-purple-300">login</Link>
                
                </p>
            
            </div>
       
       </div> 
    );
    
}

export default Register;