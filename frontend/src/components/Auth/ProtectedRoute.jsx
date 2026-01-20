import { useAuth } from "@hooks/useAuth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuth();
  // console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);

  if (isAuthenticated) {
    return children;
  }
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
