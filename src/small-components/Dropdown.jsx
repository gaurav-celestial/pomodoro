import { useEffect, useState } from "react";
import "./Dropdown.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Dropdown = ({ user, logout }) => {
  const [open, setOpen] = useState(false);

  const mode = useSelector((state) => state.settings.mode);

  const handleClick = function () {
    setOpen((prev) => !prev);
  };

  return (
    <div className="dropdown">
      <nav>
        <div className="menu-toggle"></div>
        <div className="profile" onClick={handleClick}>
          <div className="user">
            <h3>{user.user}</h3>
            <p>@{user.profession}</p>
          </div>

          <div className="img-box">
            <img src={`/src/assets/${user.image}.jpg`} alt="some user image" />
          </div>
        </div>
        <div className={`menu ${open ? "active" : undefined}`}>
          <ul>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
            <li>
              {user.user === "Guest" ? (
                <Link
                  onClick={() => {
                    setOpen(false);
                  }}
                  to={"/login"}
                  className={` ${mode === "dark" ? "mode2-login-btn" : ""}`}
                >
                  Login
                </Link>
              ) : (
                <Link
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className={`${mode === "dark" ? "mode2-login-btn" : ""}`}
                >
                  Logout
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Dropdown;
