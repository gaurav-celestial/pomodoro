import "./Switch.css";
const Switch = ({ onClick }) => {
  return (
    <div className="switch-container">
      <input
        onClick={onClick}
        type="checkbox"
        className="switch-input"
        id="switch"
      />
      <label className="switch-slider" htmlFor="switch"></label>
    </div>
  );
};

export default Switch;
