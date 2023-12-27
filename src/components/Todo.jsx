import "./Todo.css";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

const Form = ({ onRemove, tasksSubmit }) => {
  const [currentTask, setCurrentTask] = useState("");
  const [tasks, setTaskGroup] = useState([]);

  const handleCurrentTask = function (e) {
    setCurrentTask(e.target.value);
  };

  const addToTasks = function () {
    setTaskGroup((prev) => {
      return [...prev, currentTask];
    });

    setCurrentTask("");
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());

    const allTasks = {
      title: data.title,
      desc: data.desc,
      tasks: tasks.map((task, i) => {
        return {
          timer: Number(data["timer" + (i + 1)]),
          task,
        };
      }),
    };
    console.log(allTasks);
    onRemove();
    tasksSubmit(allTasks);
  };

  return (
    <>
      <div className="todo modal">
        <form onSubmit={submitHandler}>
          <h2>Add Task Group</h2>
          <div className="task-title">
            <h4>Title</h4>
            <input name="title" className="add-task-title" type="text" />
          </div>

          <div className="task-desc">
            <h4>Description</h4>
            <textarea name="desc" rows="3"></textarea>
            {/* <input className="add-task-desc" type="text" /> */}
          </div>

          <hr />
          <h4 className="todos">Add tasks</h4>
          <div className="add-task-container">
            <input
              className="add-task-input"
              type="text"
              value={currentTask}
              onChange={handleCurrentTask}
            />
            <button type="button" onClick={addToTasks}>
              Add
            </button>

            <h5>
              Timer
              <br /> (in mins)
            </h5>
          </div>
          <ul className="todo-ul">
            {tasks.map((task, i) => {
              return (
                <div className="list-item" key={i}>
                  <div>
                    <li>
                      {task}
                      <DeleteIcon className="delete-icon" />
                    </li>
                  </div>
                  <input
                    name={`timer` + (i + 1)}
                    className="timer-input"
                    type="number"
                    placeholder="5"
                  />
                </div>
              );
            })}
          </ul>

          {tasks.length >= 1 && (
            <div className="submit-btn-container">
              <button>Submit</button>
            </div>
          )}
        </form>
      </div>
      <div onClick={onRemove} className="overlay"></div>
    </>
  );
};

export default Form;
