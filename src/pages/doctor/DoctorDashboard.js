import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../firebase"; // Make sure firebase.js is inside src folder

function DoctorDashboard() {
  const navigate = useNavigate();
  const doctorEmail = auth.currentUser?.email;

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  // ✅ Fetch Appointments
  const fetchAppointments = useCallback(async () => {
    if (!doctorEmail) return;

    try {
      const q = query(
        collection(db, "appointments"),
        where("doctorEmail", "==", doctorEmail)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      setAppointments(data);

      const uniquePatients = [
        ...new Set(data.map((a) => a.patientEmail)),
      ];
      setPatients(uniquePatients);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }, [doctorEmail]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // ✅ Update Status
  const updateStatus = async (id, status) => {
    try {
      const appointmentRef = doc(db, "appointments", id);
      await updateDoc(appointmentRef, { status });
      fetchAppointments();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Doctor Dashboard</h2>

      <button onClick={handleLogout}>Logout</button>

      <h3 style={{ marginTop: "20px" }}>Appointments</h3>

      {appointments.length === 0 ? (
        <p>No appointments found</p>
      ) : (
        appointments.map((appointment) => (
          <div
            key={appointment.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p><strong>Patient:</strong> {appointment.patientEmail}</p>
            <p><strong>Date:</strong> {appointment.date}</p>
            <p><strong>Time:</strong> {appointment.time}</p>
            <p><strong>Status:</strong> {appointment.status}</p>

            {appointment.status === "pending" && (
              <>
                <button
                  onClick={() => updateStatus(appointment.id, "approved")}
                  style={{ marginRight: "10px" }}
                >
                  Approve
                </button>

                <button
                  onClick={() => updateStatus(appointment.id, "rejected")}
                >
                  Reject
                </button>
              </>
            )}
          </div>
        ))
      )}

      <h3>Total Patients: {patients.length}</h3>
    </div>
  );
}

export default DoctorDashboard;
