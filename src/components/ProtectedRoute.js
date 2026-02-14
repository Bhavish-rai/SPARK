import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

function ProtectedRoute({ children, allowedRole }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      const user = auth.currentUser;

      if (!user) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const role = docSnap.data().role;

        if (role === allowedRole) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      }

      setLoading(false);
    };

    checkUserRole();
  }, [allowedRole]);

  if (loading) return <div>Loading...</div>;

  if (!authorized) return <Navigate to="/" />;

  return children;
}

export default ProtectedRoute;
