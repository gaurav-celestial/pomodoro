import { useEffect, useState } from "react";
import "./Timer.css";

import BreakImg from "../assets/break.gif";
import Modal from "./Modal";

import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

import { useTimer } from "../hooks/useTimer.jsx";
import { useNavigate } from "react-router-dom";
import Game from "./Game.jsx";
import TicTacToe from "../small-components/TicTacToe/TicTacToe.jsx";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { timerActions } from "../store/index.js";
import Summary from "../small-components/Summary.jsx";

let myInterval;
let timeBreakpoint;

export default function Timer({ currentTask }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mode = useSelector((state) => state.settings.mode);
  let timerStatus = useSelector((state) => state.timer?.timerStatus?.payload);

  const [gameMode, setGameMode] = useState(false);
  const [confirmCheckedTask, setConfirmCheckedTask] = useState();
  const [fetchTimer, setFetchTimer] = useState(true);

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

  console.log(currentTaskState);

  useEffect(() => {
    if (isBreakTimerRunning) setShowStartTimerButton(false);
    if (isTaskTimerRunning) setShowStartTimerButton(true);

    if (
      (isTaskTimerRunning && isTaskStarted) ||
      (isBreakTimerRunning && isBreakStarted)
    ) {
      myInterval = setInterval(() => {
        timerNo((prevState) => {
          return { ...prevState, mili: prevState.mili - 200 };
        });
      }, 200);
    }

    if (taskTimer.min === 0 && taskTimer.sec === 0) {
      setShowModal("summary");
      setIsTaskTimerRunning(false);
      setTaskTimer({
        min: currentTaskState.totalTimer,
        sec: 0,
        mili: 1000,
      });
      setCurrentTaskState((prev) => {
        const tasksArr = prev.taskGroup.tasks.map((task) => {
          if (task.isChecked) {
            return task;
          } else {
            const newTask = { ...task, isChecked: false };
            return newTask;
          }
        });
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
      setShowModal("break-end-auto");
      console.log("break over");
    }

    return () => {
      clearInterval(myInterval);

      if (fetchTimer) {
        dispatch(
          timerActions.updateState({
            payload: {
              isTaskTimerRunning,
              isBreakTimerRunning,
              taskTimer,
              activeTimer,
              isTaskStarted,
              isBreakStarted,
              breakTimer,
              currentTaskState,
              showModal,
              showStartTimerButton,
              confirmCheckedTask,
              gameMode,
              myInterval,
              timeBreakpoint,
            },
          })
        );
      }
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
    dispatch,
    activeTimer,
    isTaskStarted,
    isBreakStarted,
    showStartTimerButton,
    confirmCheckedTask,
    gameMode,
    fetchTimer,
  ]);

  useEffect(() => {
    if (
      (timerStatus || currentTaskState === timerStatus?.currentTaskState) &&
      fetchTimer
    ) {
      setIsTaskTimerRunning(timerStatus.isTaskTimerRunning);
      setIsBreakTimerRunning(timerStatus.isBreakTimerRunning);
      setTaskTimer(timerStatus.taskTimer);
      setActiveTimer(timerStatus.activeTimer);
      setIsTaskStarted(timerStatus.isTaskStarted);
      setIsBreakStarted(timerStatus.isBreakStarted);
      setBreakTimer(timerStatus.breakTimer);
      setCurrentTaskState(timerStatus.currentTaskState);
      setShowModal(timerStatus.showModal);
      setShowStartTimerButton(timerStatus.showStartTimerButton);
      setConfirmCheckedTask(timerStatus.confirmCheckedTask);
      setGameMode(timerStatus.gameMode);
    }
  }, []);

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
    if (variant === "task") {
      setIsTaskStarted(false);
      // setIsTaskTimerRunning(false);
    }
    if (variant === "break") {
      setIsBreakStarted(false);
      // setIsBreakTimerRunning(false);
    }
  };

  const setChecked = (val) => {
    const currentSecRemaining = taskTimer.min * 60 + taskTimer.sec;
    const selectedTaskTime = val.timer * 60;

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

  const updateTask = async () => {
    timeBreakpoint = undefined;
    navigate("/");
  };

  const removeModal = function () {
    setShowModal(false);
  };

  const pauseTask = function () {
    setIsTaskTimerRunning(false);
  };

  const continueTask = function () {
    setIsTaskTimerRunning(true);
  };

  const cancelFetchingTimer = function () {
    setFetchTimer(false);
  };

  const continueBreak = function () {
    setIsBreakTimerRunning(true);
  };

  const showBreakModal = function () {
    setShowModal("break-end");
  };

  let content;
  if (!currentTaskState) content = <>Nothing here</>;
  else {
    content = (
      <div
        className={`timers-container ${
          mode === "dark" ? "mode2-timers-container" : undefined
        }`}
      >
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
                            onClick={() => {
                              setConfirmCheckedTask(task);
                              setShowModal("confirm");
                              // setChecked(task);
                            }}
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

          <ul className="summary-ul">
            {isBreakTimerRunning && (
              <Summary currentTaskState={currentTaskState} />
            )}
          </ul>
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
            <>
              <div className="game-btn-container">
                <p>GAME</p>
                <button
                  className={`game-btn game-btn1 ${
                    gameMode === "TTT" ? "active-game-btn" : undefined
                  }`}
                  onClick={() => setGameMode("TTT")}
                >
                  TTT
                </button>
                <button
                  className={`game-btn game-btn2 ${
                    gameMode === "GTN" ? "active-game-btn" : undefined
                  }`}
                  onClick={() => setGameMode("GTN")}
                >
                  GMN
                </button>
                <button
                  className={`game-btn game-btn-rest ${
                    !gameMode ? "active-game-btn" : undefined
                  }`}
                  onClick={() => {
                    setGameMode(false);
                  }}
                >
                  Rest
                </button>
              </div>

              <div className="break-content">
                {gameMode === "GTN" ? (
                  <Game />
                ) : gameMode === "TTT" ? (
                  <TicTacToe />
                ) : (
                  <img
                    className="rest-img"
                    width={200}
                    src={BreakImg}
                    alt="image"
                  />
                )}

                <br />
              </div>
              <button
                className="back-btn"
                onClick={() => {
                  setShowModal("confirm-end");
                  setIsTaskTimerRunning(false);
                  setIsBreakTimerRunning(false);
                }}
              >
                &lt;- Finish
              </button>
            </>
          )}
        </div>
        {showModal === "summary" && (
          <Modal
            modalType={showModal}
            startBreak={startBreak}
            currentTaskState={currentTaskState}
            updateTask={updateTask}
          />
        )}
        {(showModal === "break-end" || showModal === "break-end-auto") && (
          <Modal
            modalType={showModal}
            startBreak={startBreak}
            currentTaskState={currentTaskState}
            updateTask={updateTask}
            cancelFetchingTimer={cancelFetchingTimer}
            removeModal={removeModal}
          />
        )}

        {showModal === "confirm" && (
          <Modal
            modalType={showModal}
            startBreak={startBreak}
            currentTaskState={currentTaskState}
            updateTask={updateTask}
            setChecked={setChecked}
            confirmCheckedTask={confirmCheckedTask}
            removeModal={removeModal}
            pauseTask={pauseTask}
            continueTask={continueTask}
          />
        )}
        {showModal === "confirm-end" && (
          <Modal
            currentTaskState={currentTaskState}
            modalType={showModal}
            removeModal={removeModal}
            continueBreak={continueBreak}
            showBreakModal={showBreakModal}
          />
        )}
      </div>
    );
  }

  return content;
}
