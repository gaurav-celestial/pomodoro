import { useEffect } from "react";
import "./Timer.css";

import BreakImg from "../assets/break.gif";

import Modal from "./Modal";

import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

import { useTimer } from "../hooks/useTimer.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

let myInterval;
let timeBreakpoint;

export default function Timer({ currentTask }) {
  const navigate = useNavigate();

  const {
    isTaskTimerRunning,
    isBreakTimerRunning,
    taskTimer,
    activeTimer,
    isTaskStarted,
    isBreakStarted,
    breakTimer,
    handleReset,
    startTimer,
    currentTaskState,
    showModal,
    summaryJsx,
    startBreak,
    timerNo,
    setIsBreakTimerRunning,
    setIsTaskTimerRunning,
    setTaskTimer,
    setActiveTimer,
    setBreakTimer,
    showStartTimerButton,
    setShowStartTimerButton,
    setIsTaskStarted,
    setIsBreakStarted,
    setShowModal,
    setCurrentTaskState,
  } = useTimer(currentTask, myInterval, timeBreakpoint);

  useEffect(() => {
    if (isBreakTimerRunning) setShowStartTimerButton(false);
    if (isTaskTimerRunning) setShowStartTimerButton(true);

    if (isTaskTimerRunning || isBreakTimerRunning) {
      myInterval = setInterval(() => {
        timerNo((prevState) => {
          return { ...prevState, mili: prevState.mili - 200 };
        });
      }, 200);
    }

    if (taskTimer.min === 0 && taskTimer.sec === 0) {
      setShowModal(true);
      setIsTaskTimerRunning(false);
      setTaskTimer({
        min: currentTaskState.totalTimer,
        sec: 0,
        mili: 1000,
      });

      setCurrentTaskState((prev) => {
        const tasksArr = prev.taskGroup.tasks.map((task) => {
          if (task.isChecked) {
            console.log("ischcked");
            return task;
          } else {
            console.log("isnotchcked");
            task.isChecked = false;
            return task;
          }
        });
        console.log(tasksArr);
        // return prev;
        return {
          ...prev,
          taskGroup: { ...prev.taskGroup, tasks: tasksArr },
        };
      });
      console.log("task over");
    }

    if (breakTimer.min === 0 && breakTimer.sec === 0) {
      setIsTaskTimerRunning(false);
      setIsBreakTimerRunning(false);
      // setBreakTimer({
      //   min: 10,
      //   sec: 59,
      //   mili: 1000,
      // });
      setShowModal(true);

      // setActiveTimer("task");
      console.log("break over");
    }

    return () => {
      clearInterval(myInterval);
    };
  }, [
    isTaskTimerRunning,
    isBreakTimerRunning,
    taskTimer,
    breakTimer,
    timerNo,
    setIsTaskTimerRunning,
    setIsBreakTimerRunning,
    setTaskTimer,
    setActiveTimer,
    setBreakTimer,
    setShowModal,
    setShowStartTimerButton,
    setCurrentTaskState,
    currentTaskState,
    showModal,
  ]);

  const handleStart = (variant) => {
    clearInterval(myInterval);
    if (variant === "task") setIsTaskStarted(true);
    if (variant === "break") setIsBreakStarted(true);
    myInterval = myInterval = setInterval(() => {
      timerNo((prevState) => {
        return { ...prevState, mili: prevState.mili - 200 };
      });
    }, 200);
  };
  const handleStop = (variant) => {
    clearInterval(myInterval);
    if (variant === "task") setIsTaskStarted(false);
    if (variant === "break") setIsBreakStarted(false);
  };

  const setChecked = (val) => {
    const currentSecRemaining = taskTimer.min * 60 + taskTimer.sec;
    const selectedTaskTime = val.timer * 60;

    console.log(timeBreakpoint);

    console.log(
      "you took ",
      timeBreakpoint
        ? timeBreakpoint - currentSecRemaining
        : currentTaskState.totalTimer * 60 - currentSecRemaining
    );

    const timeTookInSeconds = timeBreakpoint
      ? timeBreakpoint - currentSecRemaining
      : currentTaskState.totalTimer * 60 - currentSecRemaining;

    const savedOrWastedTime = selectedTaskTime - timeTookInSeconds;

    timeBreakpoint = currentSecRemaining;

    const newArr = currentTaskState.taskGroup.tasks.filter(
      (task) => task !== val
    );
    newArr.push({
      ...val,
      isChecked: true,
      timeTookInSeconds,
      savedOrWastedTime,
    });

    setCurrentTaskState((prev) => {
      return {
        ...prev,
        taskGroup: { ...prev.taskGroup, tasks: newArr },
      };
    });
  };

  const updateTask = () => {
    console.log("updated");
    console.log(currentTaskState);

    async function updateTask() {
      await axios({
        method: "put",
        url: "http://localhost:5000/api/taskGroups",
        data: { currentTaskState },
      });
    }
    updateTask();
    timeBreakpoint = undefined;
    navigate("/");
  };

  let content;
  if (!currentTask) content = <>Nothing here</>;
  else {
    content = (
      <div className="timers-container">
        <div
          className={`timer-container ${
            isTaskTimerRunning ? "active" : undefined
          }`}
        >
          <h1>Task Timer</h1>
          <h2>
            {isTaskTimerRunning ? (
              <div className="time">
                <div className="hour"> 00</div>
                <div className="min">
                  {taskTimer.min.toString().length > 1
                    ? taskTimer.min
                    : `0${taskTimer.min}`}
                </div>
                <div className="sec">
                  {taskTimer.sec.toString().length > 1
                    ? taskTimer.sec
                    : `0${taskTimer.sec}`}
                </div>
              </div>
            ) : (
              <div className="time">
                <div className="hour">00</div>
                <div className="min">
                  {taskTimer.min.toString().length > 1
                    ? taskTimer.min
                    : `0${taskTimer.min}`}
                </div>
                <div className="sec">
                  {taskTimer.sec.toString().length > 1
                    ? taskTimer.sec
                    : `0${taskTimer.sec}`}
                </div>
              </div>
            )}
          </h2>
          {isTaskTimerRunning
            ? activeTimer === "task" && (
                <div>
                  {isTaskStarted ? (
                    <button
                      className="start-stop"
                      onClick={() => {
                        handleStop("task");
                      }}
                    >
                      Stop
                    </button>
                  ) : (
                    <button
                      className="start-stop"
                      onClick={() => {
                        handleStart("task");
                      }}
                    >
                      Start
                    </button>
                  )}

                  <button className="reset" onClick={handleReset}>
                    Reset
                  </button>
                </div>
              )
            : showStartTimerButton && (
                <button className="start-timer-btn" onClick={startTimer}>
                  Start Timer
                </button>
              )}

          <div className="task-list ">
            {/* <h2>Tasks</h2> */}
            <ul className="timer-tasks-card">
              <div className="taskgroup-details">
                <div>
                  <h2>{currentTaskState.taskGroup.title}</h2>
                  <p className="taskgroup-desc">
                    {currentTaskState.taskGroup.desc}
                  </p>
                </div>
                <div className="taskgroup-timer">
                  {currentTaskState.totalTimer} Minutes
                </div>
              </div>

              {currentTaskState.taskGroup.tasks.map((task) => {
                console.log(task);
                if (task.isChecked) {
                  return (
                    <div key={task.task} className="task-list-item">
                      <li className="timer-task-card">
                        {isTaskTimerRunning && (
                          <RadioButtonCheckedIcon
                            disabled={!isTaskTimerRunning}
                            className="unchecked-btn"
                          />
                        )}
                        {task.task}
                        <p>
                          Completed in {task.timeTookInSeconds + " Sec" || ""}
                        </p>
                      </li>
                      <p className="task-item-time">{task.timer} min</p>
                    </div>
                  );
                } else {
                  return (
                    <div key={task.task} className="task-list-item">
                      <li key={task.task} className="timer-task-card">
                        {isTaskTimerRunning && (
                          <RadioButtonUncheckedIcon
                            disabled={!isTaskTimerRunning}
                            onClick={() => setChecked(task)}
                            className="unchecked-btn"
                          />
                        )}
                        {task.task}
                      </li>
                      <p className="task-item-time">{task.timer} min</p>
                    </div>
                  );
                }
              })}
            </ul>
          </div>

          <ul className="summary-ul">{summaryJsx}</ul>
        </div>

        <div
          className={`timer-container break-timer-container ${
            isBreakTimerRunning ? "active" : undefined
          }`}
        >
          <h1>Break Timer</h1>
          <h2>
            {isBreakTimerRunning ? (
              <div className="time">
                <div className="hour"> 00</div>
                <div className="min">
                  {breakTimer.min.toString().length > 1
                    ? breakTimer.min
                    : `0${breakTimer.min}`}
                </div>
                <div className="sec">
                  {breakTimer.sec.toString().length > 1
                    ? breakTimer.sec
                    : `0${breakTimer.sec}`}
                </div>
              </div>
            ) : (
              <div className="time">
                <div className="hour">00</div>
                <div className="min">
                  {breakTimer.min.toString().length > 1
                    ? breakTimer.min
                    : `0${breakTimer.min}`}
                </div>
                <div className="sec">
                  {breakTimer.sec.toString().length > 1
                    ? breakTimer.sec
                    : `0${breakTimer.sec}`}
                </div>
              </div>
            )}
          </h2>
          {activeTimer === "break" && (
            <div>
              {isBreakStarted ? (
                <button
                  className="start-stop"
                  onClick={() => {
                    handleStop("break");
                  }}
                >
                  Stop
                </button>
              ) : (
                <button
                  className="start-stop"
                  onClick={() => {
                    handleStart("break");
                  }}
                >
                  Start
                </button>
              )}

              <button className="reset" onClick={handleReset}>
                Reset
              </button>
            </div>
          )}
          {isBreakTimerRunning && (
            <div className="break-content">
              <img
                className="rest-img"
                width={200}
                src={BreakImg}
                alt="image"
              />
              <br />
              <button
                className="back-btn"
                onClick={() => {
                  setShowModal(true);
                  setIsTaskTimerRunning(false);
                  setIsBreakTimerRunning(false);
                }}
              >
                &lt;- Home
              </button>
            </div>
          )}
        </div>
        {showModal && (
          <Modal
            activeTimer={activeTimer}
            startBreak={startBreak}
            currentTaskState={currentTaskState}
            updateTask={updateTask}
          />
        )}
      </div>
    );
  }

  return content;
}
