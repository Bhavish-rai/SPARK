import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { auth, db } from "../../firebase"; // FIXED PATH
import { useNavigate, Link } from "react-router-dom";
import "../../styles/auth.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // --- START WHITELIST CHECK ---
      if (role === "doctor") {
        const doctorRef = doc(db, "authorized_doctors", email.toLowerCase().trim());
        const doctorSnap = await getDoc(doctorRef);

        if (!doctorSnap.exists()) {
          alert("Access Denied: Your email is not on the authorized medical staff list.");
          setLoading(false);
          return; 
        }
      }
      // --- END WHITELIST CHECK ---

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role,
        createdAt: new Date().toISOString()
      });

      navigate(role === "doctor" ? "/doctor" : "/patient");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
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
          <Link to="/login" className="btn-outline">Sign In</Link>
        </nav>

        <div className="auth-split">
          <div className="form-container">
            <h2 className="welcome-text">Create Account</h2>
            <p className="sub-header">Join our medical community today.</p>

            <div className="role-switcher">
              <button 
                type="button"
                className={role === "patient" ? "role-btn active" : "role-btn"} 
                onClick={() => setRole("patient")}
                disabled={loading}
              >
                Patient
              </button>
              <button 
                type="button"
                className={role === "doctor" ? "role-btn active" : "role-btn"} 
                onClick={() => setRole("doctor")}
                disabled={loading}
              >
                Doctor
              </button>
            </div>
            
            <form onSubmit={handleRegister} className="login-form">
              <div className="input-field">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@gmail.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  disabled={loading}
                />
              </div>
              <div className="input-field">
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder="Create a password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  disabled={loading}
                />
              </div>
              <button type="submit" className="btn-confirm" disabled={loading}>
                {loading ? "Verifying..." : `Register as ${role.charAt(0).toUpperCase() + role.slice(1)} →`}
              </button>
            </form>
            <p className="footer-note" style={{marginTop: '20px', color: '#64748b'}}>
              Already have an account? <Link to="/login" style={{color: '#14b8a6', fontWeight: 'bold'}}>Sign in</Link>
            </p>
          </div>

          <div className="quote-container" style={{background: '#f0fdf4'}}>
            <div className="quote-box">
             
              <h1 className="medical-quote" style={{color: '#166534'}}>
                The greatest wealth is health, and the greatest honor is serving it.
              </h1>
              <p className="quote-author">— SparkHealth Mission</p>
            </div>
            <div className="decorative-circle" style={{background: '#22c55e'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;