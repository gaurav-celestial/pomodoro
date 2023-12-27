import "./Homepage.css";

import { useState } from "react";
import ProfileImg from "../assets/profile.png";
import Logo from "../assets/logo.png";

import NotificationsIcon from "@mui/icons-material/Notifications";
import EmailIcon from "@mui/icons-material/Email";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Todo from "./Todo";
import { useNavigate } from "react-router-dom";

function Homepage({ handleCurrentTask }) {
  const [modalState, setModalState] = useState(false);
  const [taskGroups, setTaskGroups] = useState([]);
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

  return (
    <>
      <div className="container">
        <div className="column column1">
          <img className="logo" src={Logo} alt="logo" width="70" />
          <div className="page-btn">
            <button className="active-page">Dashboard</button>
            <button>Analytics</button>
            <button>Settings</button>
          </div>
        </div>
        <div className="column column2">
          <h4 className="greet-heading">Hello Gaurav!</h4>
          <h1 className="primary-heading">
            You&apos;ve got <br /> 8 tasks today
          </h1>
          <input
            className="search-box"
            type="text"
            placeholder="search something"
          />

          <h2>My tasks</h2>
          {/* <div className="btn-group">
          <button className="active-tab">Recently</button>
          <button>Today</button>
          <button>Upcoming</button>
          <button>Later</button>
        </div> */}
          <div className="tasks">
            {taskGroups.map((taskGroup) => {
              let totalTimer = 0;
              return (
                <div key={taskGroup.title} className="task-1 card">
                  <h5 className="task-title">{taskGroup.title}</h5>
                  <p>{taskGroup.desc}</p>
                  <h5>Tasks</h5>
                  {taskGroup.tasks.map((task) => {
                    totalTimer = totalTimer + task.timer;
                    return (
                      <li key={task.task}>
                        {task.task} -
                        <span className="timer-span">{task.timer} min</span>
                      </li>
                    );
                  })}

                  <div className="start-timer">
                    <p> Start Timer {totalTimer} min </p>
                    <button>
                      <PlayArrowIcon
                        onClick={() => playTimer({ taskGroup, totalTimer })}
                        className="play-btn"
                      />
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="task-1 card">No tasks here</div>
          </div>
        </div>
        <div className="column column3">
          <div className="profile">
            <div className="profile-data">
              <img src={ProfileImg} width={50} alt="hello" />
              <div className="profile-details">
                <h4 className="name">Gaurav Yadav</h4>
                <p className="designation">Web Developer</p>
              </div>
            </div>
            <div className="icons">
              <p className="noti-icon">
                <NotificationsIcon />
              </p>
              <p className="email-icon">
                <EmailIcon />
              </p>
            </div>
          </div>

          <div className="project-timer card">
            <div className="card-content">
              <h5>Project Time Tracker</h5>
              <p>You can add a timer</p>
            </div>
            <button>
              <PlayArrowIcon className="play-btn" />
            </button>
          </div>

          <div className="add-task">
            <div className="current-date">
              December 22, 2023
              <br />
              <span>Today</span>
            </div>
            <button onClick={showModal}>+ Add Task</button>
          </div>
        </div>
      </div>

      {modalState && (
        <div className="div">
          <Todo onRemove={closeModal} tasksSubmit={tasksSubmit} />
        </div>
      )}
    </>
  );
}

export default Homepage;
