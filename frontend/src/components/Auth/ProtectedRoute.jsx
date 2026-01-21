import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { auth, status } = useSelector((state) => state.auth);
  // console.log("ProtectedRoute - isAuthenticated:", auth);

  if (status === "idle" || status === "loading") {
    return <div>Loading...</div>; // optional loading state
  }

  if (auth.authenticated) {
    return children;
  }
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
