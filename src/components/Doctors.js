import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore"; 
// This path is now correct for: src/components/Doctors.js
import { auth, db } from "../firebase"; 
import "../styles/auth.css";

const doctorData = [
  { id: "doc_1", name: "Sarah Jenkins", specialty: "Cardiologist", initial: "SJ", email: "s.jenkins@sparkhealth.com" },
  { id: "doc_2", name: "Marcus Thorne", specialty: "Neurologist", initial: "MT", email: "m.thorne@sparkhealth.com" },
  { id: "doc_3", name: "Elena Rodriguez", specialty: "Pediatrician", initial: "ER", email: "e.rodriguez@sparkhealth.com" },
  { id: "doc_4", name: "Julian Vance", specialty: "Orthopedic Surgeon", initial: "JV", email: "j.vance@sparkhealth.com" },
  { id: "doc_5", name: "Aria Smith", specialty: "Dermatologist", initial: "AS", email: "a.smith@sparkhealth.com" },
  { id: "doc_6", name: "Kevin Lee", specialty: "General Physician", initial: "KL", email: "k.lee@sparkhealth.com" }
];

function Doctors() {
  const [bookingId, setBookingId] = useState(null);
  const navigate = useNavigate();

  const handleBookAppointment = async (doctor) => {
    if (!auth.currentUser) {
      alert("Please sign in to book an appointment.");
      navigate("/login");
      return;
    }

    setBookingId(doctor.id);

    try {
      await addDoc(collection(db, "appointments"), {
        patientId: auth.currentUser.uid,
        patientEmail: auth.currentUser.email,
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        status: "pending",
        createdAt: new Date().toISOString()
      });

      alert(`Success! Appointment request for Dr. ${doctor.name} sent.`);
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Error: " + error.message);
    } finally {
      setBookingId(null);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card doctor-gallery">
        <nav className="auth-nav">
          <div className="logo">✨ Spark<span>Health</span></div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/doctors" className="active-link">Doctors</Link>
          </div>
          {auth.currentUser ? (
            <button onClick={() => auth.signOut()} className="btn-outline">Sign Out</button>
          ) : (
            <Link to="/login" className="btn-outline">Sign In</Link>
          )}
        </nav>

        <header className="gallery-header">
          <h1>Medical <span>Specialists</span></h1>
          <p>Verified clinical experts available for consultation.</p>
        </header>

        <div className="doctor-grid">
          {doctorData.map((doc) => (
            <div key={doc.id} className="doc-profile-card text-only">
              <div className="doc-avatar">{doc.initial}</div>
              <div className="doc-info">
                <h3>Dr. {doc.name}</h3>
                <span className="specialty-tag">{doc.specialty}</span>
                <div className="doc-contact">
                  <a href={`mailto:${doc.email}`} className="doc-email">{doc.email}</a>
                </div>
                <button 
                  onClick={() => handleBookAppointment(doc)} 
                  className="btn-confirm"
                  disabled={bookingId === doc.id}
                >
                  {bookingId === doc.id ? "Processing..." : "Book Appointment"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Doctors;