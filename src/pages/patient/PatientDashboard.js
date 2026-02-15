import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";

function PatientDashboard() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", phone: "", age: "", gender: "", address: "",
    height: "", weight: "", bloodGroup: "",
    sleepHours: "", symptoms: "", medicalHistory: "", allergies: "",
    doctorEmail: "", date: "", time: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "appointments"), {
        ...formData,
        patientEmail: auth.currentUser.email,
        patientUid: auth.currentUser.uid,
        status: "pending",
        createdAt: new Date()
      });
      alert("Registration & Appointment Sent Successfully!");
      setFormData({
        name: "", phone: "", age: "", gender: "", address: "",
        height: "", weight: "", bloodGroup: "",
        sleepHours: "", symptoms: "", medicalHistory: "", allergies: "",
        doctorEmail: "", date: "", time: ""
      });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="glass-nav">
        <div className="logo">
          <span className="logo-icon">✨</span> SparkHealth
        </div>
        <div className="nav-right">
          <span className="user-badge">Patient Portal</span>
          <button onClick={handleLogout} className="btn-secondary">Logout</button>
        </div>
      </nav>
      
      <main className="dashboard-content">
        <header className="page-header">
          <h1>Medical Intake Form</h1>
          <p>Provide your clinical details below to help your specialist prepare for your consultation.</p>
        </header>

        <section className="form-card">
          <form onSubmit={handleSubmit} className="health-form">
            
            <h3 className="section-divider"><span>01</span> Personal & Vitals</h3>
            <div className="form-grid">
              <div className="input-group">
                <label>Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Alex John" />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 555 000 0000" />
              </div>
              <div className="input-group">
                <label>Age</label>
                <input name="age" type="number" value={formData.age} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Blood Group</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required>
                  <option value="">Select Group</option>
                  <option>O+</option><option>A+</option><option>B+</option><option>AB+</option>
                  <option>O-</option><option>A-</option><option>B-</option><option>AB-</option>
                </select>
              </div>
              <div className="input-group">
                <label>Height (cm)</label>
                <input name="height" type="number" value={formData.height} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Weight (kg)</label>
                <input name="weight" type="number" value={formData.weight} onChange={handleChange} required />
              </div>
            </div>

            <h3 className="section-divider"><span>02</span> Clinical Background</h3>
            <div className="form-grid">
              <div className="input-group">
                <label>Avg. Sleep (Hrs/Night)</label>
                <input name="sleepHours" type="number" value={formData.sleepHours} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Specialist Email</label>
                <input name="doctorEmail" type="email" value={formData.doctorEmail} onChange={handleChange} required placeholder="doctor@spark.com" />
              </div>
            </div>

            <div className="full-width-inputs">
              <div className="input-group">
                <label>Chronic Conditions / Past History</label>
                <textarea name="medicalHistory" value={formData.medicalHistory} rows="3" onChange={handleChange} placeholder="Any long-term illnesses or past surgeries..." />
              </div>
              <div className="input-group">
                <label>Known Allergies</label>
                <textarea name="allergies" value={formData.allergies} rows="2" onChange={handleChange} placeholder="Food, medicine, or seasonal allergies..." />
              </div>
              <div className="input-group">
                <label>Current Symptoms</label>
                <textarea name="symptoms" value={formData.symptoms} rows="3" onChange={handleChange} required placeholder="Describe what you are feeling today..." />
              </div>
            </div>

            <h3 className="section-divider"><span>03</span> Appointment Scheduling</h3>
            <div className="form-grid">
              <div className="input-group">
                <label>Preferred Date</label>
                <input name="date" type="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Preferred Time</label>
                <input name="time" type="time" value={formData.time} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">Confirm Registration & Book</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default PatientDashboard;