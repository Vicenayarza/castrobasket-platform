import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "@/firebase/firebase";

export default function ProtectedRoute({

  children,

  role,

}) {

  const [loading, setLoading] = useState(true);

  const [allowed, setAllowed] = useState(false);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(

      auth,

      async (user) => {

        if (!user) {

          setAllowed(false);

          setLoading(false);

          return;

        }

        const snapshot = await getDoc(

          doc(db, "users", user.uid)

        );

        if (!snapshot.exists()) {

          setAllowed(false);

          setLoading(false);

          return;

        }

        const data = snapshot.data();

        if (!data.active) {

          setAllowed(false);

          setLoading(false);

          return;

        }

        if (role && data.role !== role) {

          setAllowed(false);

          setLoading(false);

          return;

        }

        setAllowed(true);

        setLoading(false);

      }

    );

    return unsubscribe;

  }, [role]);

  if (loading) {

    return (

      <div className="flex items-center justify-center min-h-screen">

        Cargando...

      </div>

    );

  }

  if (!allowed) {

    return <Navigate to="/login" replace />;

  }

  return children;

}