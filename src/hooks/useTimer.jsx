import { useEffect, useState } from "react";

export const useTimer = (currentTask, myInterval) => {
  const [showStartTimerButton, setShowStartTimerButton] = useState(true);
  const [currentTaskState, setCurrentTaskState] = useState(currentTask || null);
  const [showModal, setShowModal] = useState(false);

  const [taskTimer, setTaskTimer] = useState({
    min: currentTaskState.totalTimer || null,
    sec: 0,
    mili: 1000,
  });

  const [breakTimer, setBreakTimer] = useState({
    min: Number(currentTaskState.taskGroup.breakTime),
    sec: 0,
    mili: 1000,
  });

  const [activeTimer, setActiveTimer] = useState("task");
  const [isTaskTimerRunning, setIsTaskTimerRunning] = useState(false); // do true
  const [isBreakTimerRunning, setIsBreakTimerRunning] = useState(false);

  const [isTaskStarted, setIsTaskStarted] = useState(false);
  const [isBreakStarted, setIsBreakStarted] = useState(true);

  const [summaryJsx, setSummaryJsx] = useState("");

  let timerNo = isTaskTimerRunning ? setTaskTimer : setBreakTimer;

  if (taskTimer.mili <= 0 || breakTimer.mili <= 0) {
    timerNo((prevState) => {
      return { ...prevState, sec: prevState.sec - 1, mili: 1000 };
    });
  }

  if (taskTimer.sec < 0 || breakTimer.sec < 0) {
    timerNo((prevState) => {
      return { ...prevState, min: prevState.min - 1, sec: 59, mili: 1000 };
    });
  }

  const handleReset = () => {
    //Wrong
    setTaskTimer([currentTaskState.totalTimer, 0, 0]);
    clearInterval(myInterval);
  };

  const startTimer = () => {
    setIsTaskTimerRunning(true);
    setIsTaskStarted(true);
  };

  useEffect(() => {
    const temp = currentTaskState.taskGroup.tasks.every(
      (task) => task.isChecked
    );
    if (temp && isTaskTimerRunning) {
      setShowModal("summary");
      setIsTaskTimerRunning(false);
      console.log("task over");
    }
  }, [currentTaskState, isTaskTimerRunning]);

  const startBreak = (tempSummaryJsx, totalTimeSavedorWasted) => {
    setShowModal(false);
    setActiveTimer("break");

    // setTaskTimer({
    //   min: currentTaskState.totalTimer,
    //   sec: 0,
    //   mili: 0,
    // });

    setIsBreakTimerRunning(true);

    const finalSummaryJsx = (
      <>
        {tempSummaryJsx}
        {totalTimeSavedorWasted >= 0 ? (
          <li className="saved">
            Total {totalTimeSavedorWasted} seconds saved
          </li>
        ) : (
          <li className="wasted">
            Total {Math.abs(totalTimeSavedorWasted)} seconds wasted
          </li>
        )}
      </>
    );
    setSummaryJsx(finalSummaryJsx);
  };

  return {
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
  };
};
