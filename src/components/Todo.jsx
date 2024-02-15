import "./Todo.css";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Task from "./Task";

const Form = ({ onRemove, tasksSubmit, setActiveTabToDefault }) => {
  const [currentTask, setCurrentTask] = useState("");
  const [tasks, setTaskGroup] = useState([]);

  const mode = useSelector((state) => state.settings.mode);
  const user = useSelector((state) => state.settings.user);

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
      userId: user.id,
      title: data.title,
      desc: data.desc,
      breakTime: data.breakTime,
      tasks: tasks.map((task, i) => {
        return {
          timer: Number(data["timer" + (i + 1)]),
          task,
        };
      }),
    };

    async function updateTasks() {
      const res = await axios({
        method: "POST",
        url: "http://localhost:5000/api/taskGroups",
        data: {
          allTasks,
        },
      });
      console.log(res.data);
      tasksSubmit(res.data);
    }
    updateTasks();
    onRemove();
    setActiveTabToDefault();
  };

  console.log(tasks);

  return (
    <>
      <div
        className={`todo modal ${mode === "dark" ? "mode2-modal" : undefined}`}
      >
        <form onSubmit={submitHandler}>
          <h2 className="add-task-group-btn">Add Task Group</h2>
          <div className="task-title">
            <h4>Title</h4>
            <input
              name="title"
              required
              className="add-task-title"
              type="text"
            />
          </div>

          <div className="task-desc">
            <h4>Description</h4>
            <textarea required name="desc" rows="3"></textarea>
            {/* <input className="add-task-desc" type="text" /> */}
          </div>

          <div className="task-break-time">
            <h4>Break Time</h4>
            <input
              name="breakTime"
              required
              className="break-time"
              type="number"
              min="1"
              max="100"
            />{" "}
            <p className="tiny-text">mins</p>
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
                <Task
                  onClick={() => {
                    console.log("clicking");

                    const filteredTasks = tasks.filter((t) => {
                      console.log(t, task);
                      return t !== task;
                    });

                    setTaskGroup(filteredTasks);
                  }}
                  task={task}
                  i={i}
                  key={i}
                />
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
