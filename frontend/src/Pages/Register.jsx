import React , {useState} from "react";

import {FaUser, FaEnvelope, FaLock} from "react-icons/fa";

import {Link, useNavigate} from "react-router-dom";

import API from "../Services/api";

function Register(){
    
    const navigate = useNavigate();

    const[name, setName] = useState("");

    const[email, setEmail] = useState("");

    const[password, setPassword] = useState("");

    const[error, setError] = useState("");

    const[loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("form submitted");

        setError("");

        setLoading(true);
        
        try{
            await API.post("/register", {
                name, email, password
            });
            

            navigate("/login");

        }

        catch(error){
            setError("user already exists or registration failed");
        }

        finally{
            setLoading(false);
        }
    };

    return(
       <div className="h-screen bg-[#0B0F2A] flex items-center justify-center">
            
            <div className="bg-[#111633] p-10 rounded-xl w-96 text-white shadow-lg">
                
                <span className=" flex items-center justify-center text-5xl mb-4">🔥</span>

                <h1 className="text-3xl font-bold text-center mb-2">Sign Up</h1>

                <p className="text-center text-gray-400 mb-6">Create your HabitForge account</p>

                <p className="text-center text-purple-300 italic mb-6">"Small habits, when repeated daily, become big achievements."</p>

                <form onSubmit = {handleSubmit} className="flex flex-col gap-4">
                    
                    <div className="flex items-center bg-[#1B2147] p-3 rounded-md">
                        
                        <FaUser className="text-gray-400 mr-3"></FaUser>

                        <input type = "text" placeholder="Name" className="bg-transparent outline-none w-full" onChange = {(e) => setName(e.target.value)}></input>
                    </div>

                    <div className="flex items-center bg-[#1B2147] p-3 rounded-md">
                        
                        <FaEnvelope className="text-gray-400 mr-3"></FaEnvelope>

                        <input type = "email" placeholder="Email" className="bg-transparent outline-none w-full" onChange = {(e) => setEmail(e.target.value)}></input>

                    </div>

                    <div className="flex items-center bg-[#1B2147] p-3 rounded-md">
                        
                        <FaLock className="text-gray-400 mr-3"></FaLock>

                        <input type = "password" placeholder="Password" className="bg-transparent outline-none w-full" onChange = {(e) => setPassword(e.target.value)}></input>
                    
                    </div>

                    <button type = "submit" disabled = {loading} className="bg-gradient-to-r from-purple-600 to-indigo-500 p-3 rounded-md font-semibold hover:opacity-90 transition">{loading ? "Creating account..." : "Register"}</button>
                
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