import DeleteIcon from "@mui/icons-material/Delete";

const Task = ({ task, i, onClick }) => {
  return (
    <div className="list-item">
      <div>
        <li>
          {task}
          <DeleteIcon onClick={onClick} className="delete-icon" />
        </li>
      </div>
      <input
        name={`timer` + (i + 1)}
        className="timer-input"
        type="number"
        min="1"
        required
      />
    </div>
  );
};

export default Task;
