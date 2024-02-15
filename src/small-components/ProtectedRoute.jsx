import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.settings.user);
  // const user = localStorage.getItem("user");
  let location = useLocation();

  if (!user) {
    console.log("navigating to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;
