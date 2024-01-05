import "./Homepage.css";

import { useEffect, useRef, useState } from "react";
// import ProfileImg from "../assets/profile.jpg";
import Logo from "../assets/logo.png";
import Todo from "./Todo";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GenerateRecentlyCards from "./GenerateRecentlyCards";
import GenerateCompletedCards from "./GenerateCompletedCards";
import GenerateIncompletedCards from "./GenerateIncompletedCards";

function Homepage({ handleCurrentTask }) {
  const [modalState, setModalState] = useState(false);
  const [taskGroups, setTaskGroups] = useState([]);
  const [activeTab, setActiveTab] = useState("Recently");
  const [activeTabContent, setActiveTabContent] = useState();
  const [mode, setMode] = useState("mode1");
  const [user, setUser] = useState({
    user: "Guest",
    image: "default",
    profession: "",
  });

  const selectRef = useRef();

  const date = new Date();
  let options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formattedDate = Intl.DateTimeFormat("en-in", options).format(date);

  const navigate = useNavigate();

  const closeModal = function () {
    setModalState(false);
  };

  const showModal = function () {
    setModalState(true);
  };

  const tasksSubmit = (value) => {
    setTaskGroups((prev) => [...prev, value]);
  };

  const playTimer = (val) => {
    handleCurrentTask(val);
    navigate("/timer");
  };

  const setActiveTabToDefault = () => {
    setActiveTab("Recently");
  };

  console.log(user);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setUser(user);
  }, []);

  useEffect(() => {
    async function fetchTaskGroups() {
      const res = await axios({
        method: "get",
        url: "http://localhost:5000/api/taskGroups",
      });
      setTaskGroups(res.data);
    }
    fetchTaskGroups();
  }, []);

  console.log(taskGroups);

  useEffect(() => {
    if (activeTab === "Recently") {
      const recently = taskGroups.filter((taskGroup) => {
        const temp = taskGroup.tasks.every((task) => {
          return task.isChecked === undefined;
        });
        return temp;
      });
      setActiveTabContent(recently);
    }

    if (activeTab === "Completed") {
      const recently = taskGroups.filter((taskGroup) => {
        const temp = taskGroup.tasks.every((task) => {
          return task.isChecked === true;
        });
        return temp;
      });

      setActiveTabContent(recently);
    }

    if (activeTab === "Incompleted") {
      const recently = taskGroups.filter((taskGroup) => {
        const temp = taskGroup.tasks.some((task) => {
          return task.isChecked === false;
        });
        return temp;
      });
      setActiveTabContent(recently);
    }
  }, [activeTab, taskGroups]);

  return (
    <>
      <div
        className={`container ${
          mode === "mode2" ? "mode2-container" : undefined
        }`}
      >
        <div className="header">
          <div className="logo-container">
            <img className="logo" src={Logo} alt="logo" width="70" />
            <select
              ref={selectRef}
              onChange={() => {
                setMode(selectRef.current.value);
              }}
              name="mode"
              id="mode"
            >
              <option value="mode1">Mode 1</option>
              <option value="mode2">Mode 2</option>
            </select>
          </div>
          <div className="profile-data">
            <div className="profile-details">
              <h4 className="name">{user.user}</h4>
              <p className="designation">{user.profession}</p>
            </div>
            <img src={`/src/assets/${user.image}.jpg`} width={50} alt="hello" />
            {user.user === "Guest" ? (
              <button
                onClick={() => {
                  navigate("/login");
                }}
                className={`login-btn ${
                  mode === "mode2" ? "mode2-login-btn" : ""
                }`}
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  setUser({
                    user: "Guest",
                    image: "default",
                    profession: "",
                  });
                }}
                className={`login-btn ${
                  mode === "mode2" ? "mode2-login-btn" : ""
                }`}
              >
                Logout
              </button>
            )}
          </div>
        </div>

        <div className="columns">
          <div className="column column2">
            <h2>My tasks</h2>
            <div className="btn-group">
              <button
                onClick={() => {
                  setActiveTab("Recently");
                }}
                className={`tab-btn ${
                  activeTab === "Recently" &&
                  `active-tab ${
                    mode === "mode2" ? " mode2-active-tab" : undefined
                  } `
                }`}
              >
                Recently
              </button>
              <button
                onClick={() => {
                  setActiveTab("Completed");
                }}
                className={`tab-btn ${
                  activeTab === "Completed" &&
                  `active-tab ${
                    mode === "mode2" ? "active-tab mode2-active-tab" : undefined
                  } `
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => {
                  setActiveTab("Incompleted");
                }}
                className={`tab-btn ${
                  activeTab === "Incompleted" &&
                  `active-tab ${
                    mode === "mode2" ? "active-tab mode2-active-tab" : undefined
                  } `
                }`}
              >
                Incompleted
              </button>
            </div>
            <div className="tasks">
              <div>
                {activeTab === "Recently" && (
                  <>
                    <GenerateRecentlyCards
                      playTimer={playTimer}
                      activeTabContent={activeTabContent}
                      onClick={showModal}
                      mode={mode}
                    />
                  </>
                )}
                {activeTab === "Completed" && (
                  <>
                    <GenerateCompletedCards
                      playTimer={playTimer}
                      activeTabContent={activeTabContent}
                    />
                  </>
                )}
                {activeTab === "Incompleted" && (
                  <>
                    <GenerateIncompletedCards
                      playTimer={playTimer}
                      activeTabContent={activeTabContent}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="column column3">
            <div className="add-task">
              <div className="current-date">
                {formattedDate}
                <br />
                <span>Today</span>
              </div>
              <button onClick={showModal}>+ Add Task</button>
            </div>
          </div>
        </div>
      </div>

      {modalState && (
        <div className="div">
          <Todo
            setActiveTabToDefault={setActiveTabToDefault}
            onRemove={closeModal}
            tasksSubmit={tasksSubmit}
          />
        </div>
      )}
    </>
  );
}

export default Homepage;
