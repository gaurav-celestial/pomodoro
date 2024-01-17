import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRouteTimerRun = ({ children }) => {
  let timerStatus = useSelector((state) => state.timer?.timerStatus?.payload);

  console.log(timerStatus);

  let location = useLocation();
  const isLocation = location.href === "/timer";

  if (!isLocation && timerStatus) {
    return <Navigate to="/timer" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRouteTimerRun;
