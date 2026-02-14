import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function PatientDashboard() {
  const navigate = useNavigate();

  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleAppointment = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "appointments"), {
        patientId: auth.currentUser.uid,
        patientEmail: auth.currentUser.email,
        doctorName,
        date,
        time,
        reason,
        status: "pending",
      });

      alert("Appointment Booked Successfully!");
      setDoctorName("");
      setDate("");
      setTime("");
      setReason("");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Patient Dashboard</h1>

        <h2 style={styles.subtitle}>Book Appointment</h2>

        <form onSubmit={handleAppointment} style={styles.form}>
          <input
            type="text"
            placeholder="Doctor Name"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            style={styles.input}
          />

          <textarea
            placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            style={styles.textarea}
          />

          <button type="submit" style={styles.bookButton}>
            Book Appointment
          </button>
        </form>

        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #2c7be5, #00d4ff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "400px",
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
  title: {
    textAlign: "center",
    marginBottom: "10px",
    color: "#2c7be5",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#555",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  textarea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    minHeight: "80px",
    resize: "none",
  },
  bookButton: {
    padding: "12px",
    backgroundColor: "#2c7be5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#e63757",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
  },
};

export default PatientDashboard;
