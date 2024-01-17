const Summary = ({ currentTaskState }) => {
  let totalTimeSavedorWasted = 0;

  let generateSummary = currentTaskState?.taskGroup?.tasks.map((task, i) => {
    totalTimeSavedorWasted += task.savedOrWastedTime || -task.timer * 60;
    return (
      <>
        <li key={i}>
          {task.task}{" "}
          {task.timeTookInSeconds ? (
            <>
              <span className="saved">Completed</span>
              <span> in {task.timeTookInSeconds} Seconds </span>
            </>
          ) : (
            <span className="wasted">Not Completed </span>
          )}
          {task.savedOrWastedTime >= 0 && (
            <span className="saved">
              -- {task.savedOrWastedTime} Seconds Saved
            </span>
          )}
          {task.savedOrWastedTime <= 0 && (
            <span className="wasted">
              -- {Math.abs(task.savedOrWastedTime)} Seconds Wasted
            </span>
          )}
          {isNaN(task.savedOrWastedTime) && (
            <span className="wasted">
              -- {Math.abs(task.timer * 60)} Seconds Wasted
            </span>
          )}
        </li>
      </>
    );
  });

  return (
    <div>
      {generateSummary}
      {totalTimeSavedorWasted >= 0 ? (
        <li className="saved">Total {totalTimeSavedorWasted} seconds saved</li>
      ) : (
        <li className="wasted">
          Total {Math.abs(totalTimeSavedorWasted)} seconds wasted
        </li>
      )}
    </div>
  );
};

export default Summary;
