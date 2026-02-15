# ✨ SparkHealth - Clinical Management Portal

SparkHealth is a specialized healthcare platform designed to bridge the gap between medical specialists and patients. Built with **React** and **Firebase**, it provides a secure, role-based environment for appointment scheduling, patient intake, and clinical record management.

## 🚀 Live Demo
**Link:** [https://spark-56a7f.web.app/]

---

## 🛠 Key Features

### 🔐 Secure Authentication & Authorization
- **Dual-Role Access:** Dedicated workflows for **Doctors** and **Patients**.
- **Medical Staff Whitelist:** A specialized security layer where only pre-authorized emails (verified via Firestore) can register as Doctors.
- **Protected Routing:** Prevents unauthorized access to clinical dashboards based on user role.

### 🏥 Patient Experience
- **Clinical Intake Form:** Patients provide vital stats (Height, Weight, Blood Group) and medical history upon booking.
- **Specialist Directory:** Browse a gallery of certified medical experts.
- **Real-time Status:** Track appointment requests from "Pending" to "Approved."

### 🩺 Doctor Dashboard
- **Patient Management:** View all active patients and incoming consultation requests.
- **Clinical Analytics:** Visualize patient wellness trends using **Recharts**.
- **Medical Records:** Add clinical notes and assessment updates directly to patient history.

---

## 📂 Project Structure

```text
spark/
├── public/              # Static assets & index.html (Title changed to SparkHealth)
├── src/
│   ├── components/      # Doctors.js, ProtectedRoute.js
│   ├── pages/
│   │   ├── auth/        # Login.js, Register.js
│   │   ├── doctor/      # DoctorDashboard.js
│   │   └── patient/     # PatientDashboard.js
│   ├── styles/          # auth.css, dashboard.css (Updated for Mobile)
│   ├── App.js           # Main Routing logic
│   └── firebase.js      # Firebase Configuration
├── .env                 # API Keys (Not pushed to GitHub)
└── firebase.json        # Hosting Configuration