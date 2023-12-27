import { useEffect, useState } from "react";
import "./Timer.css";

import Modal from "./Modal";

import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

let myInterval;
let timeBreakpoint;

export default function Timer({ currentTask }) {
  const [currentTaskState, setCurrentTaskState] = useState(currentTask || null);
  const [showModal, setShowModal] = useState(false);

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

  const [summaryJsx, setSummaryJsx] = useState("");

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
    const currentSecRemaining = taskTimer.min * 60 + taskTimer.sec;
    const selectedTaskTime = val.timer * 60;

    console.log(timeBreakpoint);

    console.log(
      "you took ",
      timeBreakpoint
        ? timeBreakpoint - currentSecRemaining
        : currentTaskState.totalTimer * 60 - currentSecRemaining
    );

    const timeTook = timeBreakpoint
      ? timeBreakpoint - currentSecRemaining
      : currentTaskState.totalTimer * 60 - currentSecRemaining;

    const savedOrWastedTime = selectedTaskTime - timeTook;

    timeBreakpoint = currentSecRemaining;

    const newArr = currentTaskState.taskGroup.tasks.filter(
      (task) => task !== val
    );
    newArr.push({ ...val, isChecked: true, timeTook, savedOrWastedTime });

    setCurrentTaskState((prev) => {
      return {
        ...prev,
        taskGroup: { ...prev.taskGroup, tasks: newArr },
      };
    });
  };

  useEffect(() => {
    const temp = currentTaskState.taskGroup.tasks.every(
      (task) => task.isChecked
    );
    if (temp) {
      setIsTaskTimerRunning(false);
      setActiveTimer("break");
      console.log("task over");
      setShowModal(true);
    }
  }, [currentTaskState]);

  const startBreak = (tempSummaryJsx, totalTimeSaved) => {
    setIsBreakTimerRunning(true);
    setShowModal(false);
    const finalSummaryJsx = (
      <>
        {tempSummaryJsx}
        <p>Total {totalTimeSaved} secodns saved</p>
      </>
    );

    setSummaryJsx(finalSummaryJsx);
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
                if (task.isChecked) {
                  return (
                    <li key={task.task} className="timer-task-card">
                      <RadioButtonCheckedIcon className="unchecked-btn" />
                      {task.task}
                      <p>{task.timeTook + " Sec" || ""}</p>
                    </li>
                  );
                } else {
                  return (
                    <li key={task.task} className="timer-task-card">
                      <RadioButtonUncheckedIcon
                        onClick={() => setChecked(task)}
                        className="unchecked-btn"
                      />
                      {task.task}
                    </li>
                  );
                }
              })}
            </ul>
          </div>

          {summaryJsx}
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
        {showModal && (
          <Modal startBreak={startBreak} currentTaskState={currentTaskState} />
        )}
      </div>
    );
  }

  return content;
}
