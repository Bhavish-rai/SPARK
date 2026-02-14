import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    const querySnapshot = await getDocs(collection(db, "appointments"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "appointments", id), {
      status: status,
    });
    fetchAppointments();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Doctor Dashboard</h1>

        <h2 style={styles.subtitle}>Patient Appointments</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Patient</th>
              <th style={styles.th}>Doctor</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Reason</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="7" style={styles.noData}>
                  No Appointments Found
                </td>
              </tr>
            ) : (
              appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td style={styles.td}>{appointment.patientEmail}</td>
                  <td style={styles.td}>{appointment.doctorName}</td>
                  <td style={styles.td}>{appointment.date}</td>
                  <td style={styles.td}>{appointment.time}</td>
                  <td style={styles.td}>{appointment.reason}</td>
                  <td style={styles.td}>{appointment.status}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.acceptBtn}
                      onClick={() =>
                        updateStatus(appointment.id, "approved")
                      }
                      disabled={appointment.status !== "pending"}
                    >
                      Accept
                    </button>

                    <button
                      style={styles.rejectBtn}
                      onClick={() =>
                        updateStatus(appointment.id, "rejected")
                      }
                      disabled={appointment.status !== "pending"}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <button style={styles.logoutBtn} onClick={handleLogout}>
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
    padding: "40px",
  },
  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
  },
  title: {
    textAlign: "center",
    marginBottom: "10px",
    color: "#2c7be5",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#555",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    borderBottom: "2px solid #ddd",
    padding: "10px",
    textAlign: "left",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #eee",
  },
  noData: {
    textAlign: "center",
    padding: "20px",
  },
  acceptBtn: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    marginRight: "5px",
    cursor: "pointer",
  },
  rejectBtn: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  logoutBtn: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default DoctorDashboard;
