import "./Homepage.css";

import { useEffect, useState } from "react";
// import ProfileImg from "../assets/profile.jpg";
import Logo from "../assets/logo.png";
import Todo from "./Todo";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GenerateRecentlyCards from "./GenerateRecentlyCards";
import GenerateCompletedCards from "./GenerateCompletedCards";
import GenerateIncompletedCards from "./GenerateIncompletedCards";
import Dropdown from "./Dropdown";
import Switch from "../small-components/Switch";

import { useDispatch, useSelector } from "react-redux";
import { settingsActions } from "../store";

import { timerActions } from "../store/index.js";

function Homepage({ handleCurrentTask }) {
  const [modalState, setModalState] = useState(false);
  const [taskGroups, setTaskGroups] = useState([]);
  const [activeTab, setActiveTab] = useState("Recently");
  const [activeTabContent, setActiveTabContent] = useState();
  const [user, setUser] = useState({
    user: "Guest",
    image: "default",
    profession: "",
  });

  let timerStatus = useSelector((state) => state.timer?.timerStatus?.payload);

  const mode = useSelector((state) => state.settings.mode);
  const dispatch = useDispatch();

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
    navigate(`/timer`);
  };

  const setActiveTabToDefault = () => {
    setActiveTab("Recently");
  };

  useEffect(() => {
    if (
      timerStatus?.showModal === "break-end" ||
      timerStatus?.showModal === "break-end-auto"
    ) {
      console.log("here");
      dispatch(timerActions.clearState());
      console.log(timerStatus?.showModal);
    }
  }, [timerStatus, dispatch, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timerStatus) {
        navigate("/timer");
      }
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [timerStatus, navigate]);

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

  const logout = (event) => {
    localStorage.removeItem("user");
    setUser({
      user: "Guest",
      image: "default",
      profession: "",
    });
  };

  return (
    <>
      <div
        className={`container ${
          mode === "dark" ? "mode2-container" : undefined
        }`}
      >
        <div className="header">
          <div className="logo-container">
            <img className="logo" src={Logo} alt="logo" width="70" />
            <Switch
              onClick={() => {
                console.log("switching");
                dispatch(
                  mode === "light"
                    ? settingsActions.changeModeToDark()
                    : settingsActions.changeModeToLight()
                );
              }}
            />
            <p>{mode === "light" ? "Light" : "Dark"}</p>
          </div>
          <Dropdown user={user} logout={logout} />
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
                    mode === "dark" ? " mode2-active-tab" : "tab-btn-unselected"
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
                    mode === "dark"
                      ? "active-tab mode2-active-tab"
                      : "tab-btn-unselected"
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
                    mode === "dark"
                      ? "active-tab mode2-active-tab"
                      : "tab-btn-unselected"
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
