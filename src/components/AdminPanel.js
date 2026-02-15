import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import "../../styles/auth.css"; // Reuse your clean styles

function AdminPanel() {
  const [newEmail, setNewEmail] = useState("");
  const [authorizedList, setAuthorizedList] = useState([]);

  // Fetch the current whitelist
  const fetchWhitelist = async () => {
    const querySnapshot = await getDocs(collection(db, "authorized_doctors"));
    const emails = querySnapshot.docs.map(doc => doc.id);
    setAuthorizedList(emails);
  };

  useEffect(() => { fetchWhitelist(); }, []);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (!newEmail) return;
    
    // Use the email as the Document ID for easy lookup
    await setDoc(doc(db, "authorized_doctors", newEmail.toLowerCase()), {
      addedAt: new Date().toISOString(),
      status: "verified"
    });
    
    setNewEmail("");
    fetchWhitelist();
    alert("Doctor authorized successfully!");
  };

  const removeDoctor = async (email) => {
    await deleteDoc(doc(db, "authorized_doctors", email));
    fetchWhitelist();
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '800px', minHeight: 'auto' }}>
        <h2 className="welcome-text">Admin <span>Panel</span></h2>
        <p className="sub-header">Manage authorized medical staff emails.</p>

        <form onSubmit={handleAddDoctor} className="login-form" style={{ display: 'flex', gap: '10px' }}>
          <div className="input-field" style={{ flex: 1 }}>
            <input 
              type="email" 
              placeholder="Enter professional email (e.g. dr.smith@clinic.com)" 
              value={newEmail} 
              onChange={(e) => setNewEmail(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn-confirm" style={{ padding: '0 30px', marginTop: '0', height: '55px' }}>
            Authorize
          </button>
        </form>

        <div className="whitelist-section" style={{ marginTop: '40px' }}>
          <h3>Authorized Emails ({authorizedList.length})</h3>
          <ul className="email-list">
            {authorizedList.map(email => (
              <li key={email} className="email-item">
                {email}
                <button onClick={() => removeDoctor(email)} className="btn-remove">Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;