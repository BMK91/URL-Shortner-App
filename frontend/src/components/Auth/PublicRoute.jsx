import { useAuth } from "@hooks/useAuth";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const isAuthenticated = useAuth();
  // console.log("PublicRoute - isAuthenticated:", isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default PublicRoute;
