import "./Modal.css";

const Modal = ({ currentTaskState, startBreak, activeTimer, updateTask }) => {
  let totalTimeSavedorWasted = 0;
  let content;

  console.log(activeTimer);

  content = currentTaskState.taskGroup.tasks.map((task, i) => {
    totalTimeSavedorWasted += task.savedOrWastedTime || -task.timer * 60;

    return (
      <>
        <li key={i}>
          {task.task}{" "}
          {task.timeTook
            ? `Completed in ${task.timeTook} Seconds `
            : `Not Completed `}
          {task.savedOrWastedTime >= 0 &&
            `-- ${task.savedOrWastedTime} Seconds Saved`}
          {task.savedOrWastedTime <= 0 &&
            `${Math.abs(task.savedOrWastedTime)} Seconds Wasted`}
          {isNaN(task.savedOrWastedTime) &&
            `${Math.abs(task.timer * 60)} Seconds Wasted`}
        </li>
      </>
    );
  });

  return (
    <>
      <div className="todo modal">
        <h2>Summary</h2>
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

        {activeTimer === "task" ? (
          <button
            className="summary-modal-btn"
            onClick={() => startBreak(content, totalTimeSavedorWasted)}
          >
            Start Break Timer
          </button>
        ) : (
          <button className="summary-modal-btn" onClick={updateTask}>
            Go Home
          </button>
        )}
      </div>
      <div className="overlay"></div>
    </>
  );
};

export default Modal;
