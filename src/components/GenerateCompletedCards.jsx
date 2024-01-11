const GenerateCompletedCards = ({ activeTabContent, playTimer }) => {
  // console.log(activeTabContent);
  return (
    <div className="all-tasks">
      {activeTabContent?.map((taskGroup) => {
        let totalTimer = 0;
        let totalTimeTook = 0;

        return (
          <div
            key={taskGroup.title}
            className="task-1 card completed-tasks-group"
          >
            <h5 className="task-title">{taskGroup.title}</h5>
            <p>{taskGroup.desc}</p>
            <hr className="card-sep" />
            <h5>Tasks</h5>
            {taskGroup?.tasks?.map((task) => {
              totalTimeTook += task.timeTookInSeconds;
              totalTimer = totalTimer + task.timer;
              return (
                <li key={task.task}>
                  {task.task}
                  <span className="timer-span">({task.timer} min)</span>
                  <span className="completed-task">
                    -- completed in {task.timeTookInSeconds} seconds
                  </span>
                </li>
              );
            })}
            <hr className="card-sep" />
            <div className="total-time">{totalTimer} min</div>
            <div className="completed-tasks">
              All tasks completed in {totalTimeTook} Seconds
            </div>
            {/* {totalTimeTook} */}
          </div>
        );
      })}
      {activeTabContent.length === 0 && (
        <div className="task-1 no-task-card">No tasks here</div>
      )}
    </div>
  );
};

export default GenerateCompletedCards;
