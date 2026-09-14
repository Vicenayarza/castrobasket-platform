import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  role,
}) {
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Error leyendo la sesión:", error);
    localStorage.removeItem("user");
  }

  // No ha iniciado sesión
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // El usuario está desactivado
  if (user.active === false) {
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // No tiene el rol necesario
  if (role && user.role !== role) {
    if (user.role === "admin") {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }

    if (user.role === "referee") {
      return (
        <Navigate
          to="/referee"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}