import { useEffect } from "react";
import "./Timer.css";

import Modal from "./Modal";

import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

import { TimerHook } from "../hooks/useTimer.jsx";

let myInterval;
let timeBreakpoint;

export default function Timer({ currentTask, updateTask }) {
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
  } = TimerHook(currentTask, myInterval, timeBreakpoint);

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
      console.log("task over");
      console.log("show modal in task 0 ", showModal);
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
      console.log("show modal in task 0 ", showModal);

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
                if (task.isChecked) {
                  return (
                    <div key={task.task} className="task-list-item">
                      <li className="timer-task-card">
                        {showStartTimerButton && (
                          <RadioButtonCheckedIcon
                            disabled={!showStartTimerButton}
                            className="unchecked-btn"
                          />
                        )}
                        {task.task}
                        <p>Completed in {task.timeTook + " Sec" || ""}</p>
                      </li>
                      <p className="task-item-time">{task.timer} min</p>
                    </div>
                  );
                } else {
                  return (
                    <div key={task.task} className="task-list-item">
                      <li key={task.task} className="timer-task-card">
                        {showStartTimerButton && (
                          <RadioButtonUncheckedIcon
                            disabled={!showStartTimerButton}
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
