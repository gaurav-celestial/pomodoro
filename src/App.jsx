// import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Homepage from "./components/HomePage";
import Timer from "./components/Timer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Game from "./components/Game";
import Switch from "./small-components/Switch";
import { useState } from "react";
import { useSelector } from "react-redux";
import TicTacToe from "./small-components/TicTacToe/TicTacToe";

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
          element={<Homepage handleCurrentTask={handleCurrentTask} />}
        />
        <Route path="/timer" element={<Timer currentTask={currentTask} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/game" element={<Game />} />
        <Route path="/game2" element={<TicTacToe />} />
        <Route path="/switch" element={<Switch />} />
      </Routes>
    </Router>
  );
};

export default App;
