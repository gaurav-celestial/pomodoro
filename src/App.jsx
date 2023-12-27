// import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Homepage from "./components/HomePage";
import Timer from "./components/Timer";
import { useState } from "react";

// const router = createBrowserRouter([
//   { path: "/", element: <Homepage /> },
//   { path: "/timer", element: <Timer /> },
// ]);

const App = () => {
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
      </Routes>
    </Router>
  );
};

export default App;
