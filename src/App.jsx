// import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Homepage from "./components/HomePage";
import Timer from "./components/Timer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useState } from "react";
import { useSelector } from "react-redux";
import Settings from "./components/Settings";

import ProtectedRoute from "./small-components/ProtectedRoute";
import ProtectedRouteTimerRun from "./small-components/ProtectedRouteTimerRun";
import DisableBackButtonRoute from "./small-components/DisableBackButtonRoute";
import NotFound from "./small-components/NotFound";

// const router = createBrowserRouter([
//   { path: "/", element: <Homepage /> },
//   { path: "/timer", element: <Timer /> },
// ]);

const App = () => {
  const theme = useSelector((state) => state.mode);
  console.log(theme);

  // const navigate = useNavigate();
  const [currentTask, setCurrentTask] = useState(null);

  const handleCurrentTask = (val) => {
    setCurrentTask(val);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ProtectedRouteTimerRun>
                <Homepage handleCurrentTask={handleCurrentTask} />
              </ProtectedRouteTimerRun>
            </ProtectedRoute>
          }
        />
        <Route
          path="/timer"
          element={
            <ProtectedRoute>
              <DisableBackButtonRoute>
                <Timer currentTask={currentTask} />
              </DisableBackButtonRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRouteTimerRun>
              <Login />
            </ProtectedRouteTimerRun>
          }
        />
        <Route
          path="/signup"
          element={
            <ProtectedRouteTimerRun>
              <Signup />
            </ProtectedRouteTimerRun>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <ProtectedRouteTimerRun>
                <Settings />
              </ProtectedRouteTimerRun>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <ProtectedRouteTimerRun>
              <NotFound />
            </ProtectedRouteTimerRun>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
