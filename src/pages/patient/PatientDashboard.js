import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function PatientDashboard() {
  const navigate = useNavigate();

  const [doctorEmail, setDoctorEmail] = useState("");
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
        doctorEmail: doctorEmail,   // ✅ IMPORTANT
        date,
        time,
        reason,
        status: "pending",
      });

      alert("Appointment Booked Successfully!");
      setDoctorEmail("");
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
        <h1>Patient Dashboard</h1>

        <form onSubmit={handleAppointment} style={styles.form}>
          <input
            type="email"
            placeholder="Doctor Email"
            value={doctorEmail}
            onChange={(e) => setDoctorEmail(e.target.value)}
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

          <button type="submit" style={styles.button}>
            Book Appointment
          </button>
        </form>

        <button onClick={handleLogout} style={styles.logout}>
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
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
  },
  textarea: {
    padding: "10px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#2c7be5",
    color: "white",
    border: "none",
  },
  logout: {
    marginTop: "15px",
    padding: "8px",
  },
};

export default PatientDashboard;
