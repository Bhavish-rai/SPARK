import React, { useState, useEffect, useCallback } from "react";
import { collection, query, where, getDocs, updateDoc, doc, setDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "../../styles/dashboard.css";

function DoctorDashboard() {
  const navigate = useNavigate();
  const doctorEmail = auth.currentUser?.email;
  const [view, setView] = useState("patients"); 
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [conditionNote, setConditionNote] = useState("");

  const fetchData = useCallback(async () => {
    if (!doctorEmail) return;
    const qA = query(collection(db, "appointments"), where("doctorEmail", "==", doctorEmail), where("status", "==", "pending"));
    const snapA = await getDocs(qA);
    setAppointments(snapA.docs.map(d => ({ id: d.id, ...d.data() })));

    const qP = query(collection(db, "doctors_patients"), where("doctorEmail", "==", doctorEmail));
    const snapP = await getDocs(qP);
    setPatients(snapP.docs.map(d => ({ id: d.id, ...d.data() })));
  }, [doctorEmail]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleApprove = async (app) => {
    try {
      const appRef = doc(db, "appointments", app.id);
      await updateDoc(appRef, { status: "approved" });

      const pRef = doc(db, "doctors_patients", app.id);
      await setDoc(pRef, {
        ...app,
        docId: app.id,
        history: [{ 
          date: new Date().toLocaleDateString(), 
          sleep: Number(app.sleepHours) || 0, 
          note: "Record Opened: Appointment Approved." 
        }]
      });

      alert("Patient Approved!");
      fetchData();
      setView("patients");
    } catch (e) { console.error(e); }
  };

  const updateCondition = async () => {
    if (!selectedPatient || !conditionNote) return;
    try {
      const targetId = selectedPatient.docId || selectedPatient.id;
      const pRef = doc(db, "doctors_patients", targetId);
      
      await updateDoc(pRef, {
        history: arrayUnion({ 
          date: new Date().toLocaleDateString(), 
          sleep: Number(selectedPatient.sleepHours) || 0, 
          note: conditionNote 
        })
      });

      alert("Clinical Status Updated");
      setConditionNote("");
      fetchData(); 
    } catch (e) { alert("Error: Patient record not found. Try re-approving."); }
  };

  return (
    <div className="doc-layout">
      <nav className="doc-nav">
        <div className="nav-brand">✨ SparkHealth <span>Clinical</span></div>
        <div className="nav-menu">
          <button className={view === "patients" ? "active" : ""} onClick={() => {setView("patients"); setSelectedPatient(null);}}>Patient List</button>
          <button className={view === "requests" ? "active" : ""} onClick={() => {setView("requests"); setSelectedPatient(null);}}>
            Requests <span className="count-badge">{appointments.length}</span>
          </button>
        </div>
        <button className="btn-logout-pro" onClick={() => {auth.signOut(); navigate("/");}}>Sign Out</button>
      </nav>

      <div className="main-content">
        <aside className="sidebar">
          <h2 className="sidebar-title">{view === "patients" ? "Active Patients" : "New Inquiries"}</h2>
          <div className="scroll-list">
            {(view === "patients" ? patients : appointments).map(item => (
              <div key={item.id} className={`list-card ${selectedPatient?.id === item.id ? "active-card" : ""}`} onClick={() => setSelectedPatient(item)}>
                <h4>{item.name}</h4>
                <p>{item.date} • {item.time}</p>
              </div>
            ))}
          </div>
        </aside>

        <section className="terminal">
          {selectedPatient ? (
            <div className="medical-record">
              <div className="record-header">
                <div>
                  <h1>{selectedPatient.name}</h1>
                  <p className="sub-text">{selectedPatient.age}y/o • {selectedPatient.bloodGroup} • {selectedPatient.patientEmail}</p>
                </div>
                {view === "requests" && <button className="btn-primary-pro" onClick={() => handleApprove(selectedPatient)}>Confirm Approval</button>}
              </div>

              <div className="vitals-row">
                <div className="v-card"><span>Weight</span><strong>{selectedPatient.weight} kg</strong></div>
                <div className="v-card"><span>Height</span><strong>{selectedPatient.height} cm</strong></div>
                <div className="v-card"><span>Contact</span><strong>{selectedPatient.phone}</strong></div>
              </div>

              <div className="chart-container">
                <h3 style={{marginBottom: '20px'}}>Patient Wellness Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={selectedPatient.history}>
                    <defs><linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/><stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" hide />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="sleep" stroke="#14b8a6" fillOpacity={1} fill="url(#colorPv)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="clinical-notes">
                <div className="history-timeline">
                  {selectedPatient.history?.map((entry, i) => (
                    <div key={i} className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <span className="time-date">{entry.date}</span>
                        <p>{entry.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <textarea className="update-textarea" placeholder="Enter clinical assessment..." value={conditionNote} onChange={(e) => setConditionNote(e.target.value)} />
                <button className="btn-primary-pro" onClick={updateCondition}>Confirm Clinical Update</button>
              </div>
            </div>
          ) : (
            <div className="welcome-screen"><h2>Select a patient to begin analysis</h2></div>
          )}
        </section>
      </div>
    </div>
  );
}

export default DoctorDashboard;