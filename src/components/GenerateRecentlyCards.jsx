import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const GenerateRecentlyCards = ({ playTimer, activeTabContent, onClick }) => {
  return (
    <div className="all-tasks">
      {activeTabContent?.map((taskGroup) => {
        let totalTimer = 0;
        return (
          <div
            key={taskGroup.title}
            className={`task-1 card remaining-tasks-group`}
          >
            <h5 className="task-title">{taskGroup.title}</h5>
            <p>{taskGroup.desc}</p>
            <hr className="card-sep" />
            <h5>Tasks</h5>
            {taskGroup?.tasks?.map((task) => {
              totalTimer = totalTimer + task.timer;
              return (
                <li key={task.task}>
                  {task.task} -
                  <span className="timer-span">{task.timer} min</span>
                </li>
              );
            })}

            <div className="total-time">{totalTimer} min</div>
            <div
              className="start-timer"
              onClick={() => playTimer({ taskGroup, totalTimer })}
            >
              {/* <p> Start Timer {totalTimer} min </p> */}
              <button className={`play-btn`}>
                <div className="time">{totalTimer} min</div>
                <PlayArrowIcon />
              </button>
            </div>
          </div>
        );
      })}
      <div onClick={onClick} className={`card add-card-btn `}>
        + Add Task
      </div>
    </div>
  );
};

export default GenerateRecentlyCards;
