import { useEffect, useState } from "react";
import "./Timer.css";

import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

let myInterval;
export default function Timer({ currentTask }) {
  console.log(currentTask);
  const [currentTaskState, setCurrentTaskState] = useState(currentTask || null);

  const [taskTimer, setTaskTimer] = useState({
    min: currentTaskState.totalTimer || null,
    sec: 0,
    mili: 1000,
  });

  const [breakTimer, setBreakTimer] = useState({
    min: 10,
    sec: 0,
    mili: 1000,
  });

  const [activeTimer, setActiveTimer] = useState("task");
  const [isTaskTimerRunning, setIsTaskTimerRunning] = useState(false); //do true
  const [isBreakTimerRunning, setIsBreakTimerRunning] = useState(false);

  const [isTaskStarted, setIsTaskStarted] = useState(false);
  const [isBreakStarted, setIsBreakStarted] = useState(true);

  let timerNo = isTaskTimerRunning ? setTaskTimer : setBreakTimer;

  useEffect(() => {
    if (isTaskTimerRunning || isBreakTimerRunning) {
      myInterval = setInterval(() => {
        timerNo((prevState) => {
          return { ...prevState, mili: prevState.mili - 200 };
        });
      }, 200);
    }

    if (taskTimer.min === 0 && taskTimer.sec === 0) {
      setIsTaskTimerRunning(false);
      setIsBreakTimerRunning(true);
      setTaskTimer({
        min: currentTaskState.totalTimer,
        sec: 0,
        mili: 0,
      });
      setActiveTimer("break");
      console.log("task over");
    }

    if (breakTimer.min === 0 && breakTimer.sec === 0) {
      setIsTaskTimerRunning(false);
      setIsBreakTimerRunning(false);
      setBreakTimer({
        min: 10,
        sec: 0,
        mili: 1000,
      });
      setActiveTimer("task");
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
    currentTaskState.totalTimer,
  ]);

  if (taskTimer.mili < 0 || breakTimer.mili < 0) {
    timerNo((prevState) => {
      return { ...prevState, sec: prevState.sec - 1, mili: 1000 };
    });
  }

  if (taskTimer.sec < 0 || breakTimer.sec < 0) {
    timerNo((prevState) => {
      return { ...prevState, min: prevState.min - 1, sec: 59, mili: 1000 };
    });
  }

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

  const handleReset = () => {
    //Wrong
    setTaskTimer([currentTaskState.totalTimer, 0, 0]);
    clearInterval(myInterval);
  };

  const startTimer = () => {
    setIsTaskTimerRunning(true);
    setIsTaskStarted(true);
  };

  const setChecked = (val) => {
    const totalTime = currentTaskState.totalTimer * 60;
    const currentSecRemaining = taskTimer.min * 60 + taskTimer.sec;
    const selectedTaskTime = val.timer * 60;
    console.log("Total Seconds " + totalTime);
    console.log("remaining seconds " + currentSecRemaining);
    console.log(totalTime - currentSecRemaining);
    console.log("selected task time " + selectedTaskTime);
    console.log(val);
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
          {isTaskTimerRunning ? (
            activeTimer === "task" && (
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
          ) : (
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
                return (
                  <li key={task.task} className="timer-task-card">
                    <RadioButtonUncheckedIcon
                      onClick={() => setChecked(task)}
                      className="unchecked-btn"
                    />
                    {task.task}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div
          className={`timer-container ${
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
        </div>
      </div>
    );
  }

  return content;
}
