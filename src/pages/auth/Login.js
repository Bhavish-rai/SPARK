import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase"; // FIXED PATH
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.role === "doctor") {
          navigate("/doctor");
        } else {
          navigate("/patient");
        }
      } else {
        alert("No user profile found.");
      }
    } catch (err) {
      alert("Login Failed: " + err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <nav className="auth-nav">
          <div className="logo">✨ Spark<span>Health</span></div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/doctors">Doctors</Link>
          </div>
          <Link to="/register" className="btn-outline">Sign Up</Link>
        </nav>

        <div className="auth-split">
          <div className="form-container">
            <h2 className="welcome-text">Welcome Back</h2>
            <p className="sub-header">Please enter your credentials to access the clinical portal.</p>
            
            <form onSubmit={handleLogin} className="login-form">
              <div className="input-field">
                <label>Email Address</label>
                <input type="email" placeholder="doctor@sparkhealth.com" onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="input-field">
                <label>Password</label>
                <input type="password" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn-confirm">
                Sign In <span>→</span>
              </button>
            </form>
          </div>

          <div className="quote-container">
            <div className="quote-box">
              
              <h1 className="medical-quote">
                Wherever the art of Medicine is loved, there is also a love of Humanity.
              </h1>
              <p className="quote-author">— Hippocrates</p>
            </div>
            <div className="decorative-circle"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;