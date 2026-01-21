import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { auth, status } = useSelector((state) => state.auth);
  // console.log("PublicRoute - isAuthenticated:", auth);

  if (status === "idle" || status === "loading") {
    return <div>Loading...</div>; // optional loading state
  }

  if (auth.authenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default PublicRoute;
