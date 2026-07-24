import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Loader, Phone, Building, Hash } from 'lucide-react';
import Input from "./Input.jsx";
import { useAuthStore } from "./authStore.js";

const SignUpPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [centerName, setCenterName] = useState("");
    const [centerId, setCenterId] = useState("");
    const { signup, error, isLoading } = useAuthStore();
    const navigate = useNavigate();
    
    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await signup(name, email, password, phone, centerName, centerId);
            navigate("/verify-email");
        } catch (err) {
            console.error(err);
        }
    };

    return (
    <div className="auth-container" style={{maxWidth: "450"}}>
        <h2 style={{ textAlign: 'center' }}>Create Account</h2>
        <p style={{ textAlign: 'center' }}>Get Started to Explore the Secured World</p>
        <form onSubmit={handleSignUp}>
            <div className="auth-form-grid">
                <Input icon={User} placeholder='Full Name' value={name} onChange={(e) => setName(e.target.value)} required />
                <Input icon={Mail} placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input icon={Lock} type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Input icon={Phone} placeholder='Phone' value={phone} onChange={(e) => setPhone(e.target.value)} required />
                <Input icon={Building} placeholder='Center Name' value={centerName} onChange={(e) => setCenterName(e.target.value)} required />
                <Input icon={Hash} placeholder='Center ID' value={centerId} onChange={(e) => setCenterId(e.target.value)} required />
            </div>
            {error && <p className="error-text">{error}</p>}
            
            <button className="auth-btn" style={{ marginTop: '35px' }} type="submit" disabled={isLoading}>
                {isLoading ? <Loader className="animate-spin" size={18} /> : "Sign Up"}
            </button>
        </form>
        <div className="auth-footer">
            <p>Already Have An Account?
                <Link to="/login">Login</Link>
            </p>
        </div>
    </div>
    );
};

export default SignUpPage;