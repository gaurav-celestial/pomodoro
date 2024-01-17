import { useEffect } from "react";
import "./Modal.css";

import useSound from "use-sound";
import { useDispatch } from "react-redux";
import { timerActions } from "../store";

const Modal = ({
  modalType,
  currentTaskState,
  startBreak,
  updateTask,
  confirmCheckedTask,
  setChecked,
  removeModal,
  pauseTask,
  continueTask,
  continueBreak,
  cancelFetchingTimer,
  showBreakModal,
}) => {
  // console.log(modalType);
  let totalTimeSavedorWasted = 0;
  let content;

  const dispatch = useDispatch();

  const [playSound] = useSound("/src/assets/beepbeep.mp3");

  useEffect(() => {
    if (modalType === "confirm") pauseTask();
  }, [pauseTask, modalType]);

  useEffect(() => {
    if (modalType === "break-end-auto") {
      playSound();
    }
  }, [playSound, modalType]);

  useEffect(() => {
    if (modalType === "break-end" || modalType === "break-end-auto") {
      cancelFetchingTimer();
      dispatch(timerActions.clearState());
    }
  }, [modalType, dispatch, cancelFetchingTimer]);

  content = currentTaskState.taskGroup.tasks.map((task, i) => {
    totalTimeSavedorWasted += task.savedOrWastedTime || -task.timer * 60;
    return (
      <>
        <li key={i}>
          {task.task}{" "}
          {task.timeTookInSeconds
            ? `Completed in ${task.timeTookInSeconds} Seconds `
            : `Not Completed `}
          {task.savedOrWastedTime >= 0 &&
            `-- ${task.savedOrWastedTime} Seconds Saved`}
          {task.savedOrWastedTime <= 0 &&
            `-- ${Math.abs(task.savedOrWastedTime)} Seconds Wasted`}
          {isNaN(task.savedOrWastedTime) &&
            `-- ${Math.abs(task.timer * 60)} Seconds Wasted`}
        </li>
      </>
    );
  });

  return (
    <>
      <div
        className={`todo modal ${
          modalType === "confirm" || modalType === "confirm-end"
            ? "small-modal"
            : undefined
        }`}
      >
        {modalType === "summary" && (
          <>
            <h2>Summary</h2>
            <p>You have completed all the tasks</p>
            <hr />
            <ul className="model-ul">
              {content}
              {totalTimeSavedorWasted >= 0 ? (
                <li className="saved">
                  Total {totalTimeSavedorWasted} seconds saved
                </li>
              ) : (
                <li className="wasted">
                  Total {Math.abs(totalTimeSavedorWasted)} seconds wasted
                </li>
              )}
            </ul>
            <button className="summary-modal-btn" onClick={() => startBreak()}>
              Start Break Timer
            </button>
          </>
        )}

        {(modalType === "break-end" || modalType === "break-end-auto") && (
          <>
            <h2>Break Ended</h2>
            <hr />
            <ul className="model-ul">
              {content}
              {totalTimeSavedorWasted >= 0 ? (
                <li className="saved">
                  Total {totalTimeSavedorWasted} seconds saved
                </li>
              ) : (
                <li className="wasted">
                  Total {Math.abs(totalTimeSavedorWasted)} seconds wasted
                </li>
              )}
            </ul>
            <button
              className="summary-modal-btn"
              onClick={() => {
                updateTask();
              }}
            >
              Go Home
            </button>
          </>
        )}

        {modalType === "confirm" && (
          <>
            <h2>Are you sure ?</h2>
            <hr />
            <p>Have you completed {confirmCheckedTask.task} ?</p>
            <button
              className="summary-modal-btn"
              onClick={() => {
                setChecked(confirmCheckedTask);
                continueTask();
                removeModal();
              }}
            >
              Yes
            </button>
            <button
              className="summary-modal-btn"
              onClick={() => {
                continueTask();
                removeModal();
              }}
            >
              No
            </button>
          </>
        )}
        {modalType === "confirm-end" && (
          <>
            <h2>Are you sure ?</h2>
            <hr />
            <p>Finish Break ?</p>
            <button
              className="summary-modal-btn"
              onClick={() => {
                showBreakModal();
              }}
            >
              Yes
            </button>
            <button
              className="summary-modal-btn"
              onClick={() => {
                removeModal();
                continueBreak();
              }}
            >
              No
            </button>
          </>
        )}
      </div>
      <div className="overlay"></div>
    </>
  );
};

export default Modal;
