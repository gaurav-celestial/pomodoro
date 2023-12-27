import "./Modal.css";

const Modal = ({ currentTaskState, startBreak }) => {
  let totalTimeSaved = 0;
  let content;

  content = currentTaskState.taskGroup.tasks.map((task, i) => {
    totalTimeSaved += task.savedOrWastedTime;
    return (
      <>
        <li key={i}>
          {task.task} Completed in {task.timeTook} Seconds :{" "}
          {task.savedOrWastedTime} Seconds Saved
        </li>
      </>
    );
  });

  return (
    <>
      <div className="todo modal">
        <h2>Summary</h2>
        <hr />
        <ul className="model-ul">{content}</ul>
        <p>Total Saved {totalTimeSaved}</p>
        <button onClick={() => startBreak(content, totalTimeSaved)}>
          Start Break Timer
        </button>
      </div>
      <div className="overlay"></div>
    </>
  );
};

export default Modal;
