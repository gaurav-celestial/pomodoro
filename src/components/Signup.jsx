import axios from "axios";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Signup = () => {
  const navigate = useNavigate();
  const mode = useSelector((state) => state.settings.mode);

  const isUserNameError = function (user) {
    if (user.length < 5) {
      return "Minimum 5 characters required in username";
    }
    if (user.includes(" ")) {
      return "Username must not contain spaces";
    }
    return false;
  };

  const isPasswordError = function (password) {
    if (password.length < 6) {
      return "Minimum 6 characters required in password";
    }
    if (password.includes(" ")) {
      return "Password must not contain spaces";
    }
    if (
      !(
        password.includes("!") ||
        password.includes("@") ||
        password.includes("$") ||
        password.includes("%") ||
        password.includes("&")
      )
    ) {
      return "Password Must contain alphanumeric values";
    }
    return false;
  };

  const isConfirmPasswordError = function (password, confirmPassword) {
    if (password !== confirmPassword) {
      return "Passwords must match";
    }
    return false;
  };

  const submitHandler = async function (e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    try {
      const userNameError = isUserNameError(data.user);
      const passwordError = isPasswordError(data.password);
      const confirmPasswordError = isConfirmPasswordError(
        data.password,
        data.confirmPassword
      );

      if (userNameError) {
        throw new Error(userNameError);
      }

      if (passwordError) {
        throw new Error(passwordError);
      }

      if (confirmPasswordError) {
        throw new Error(confirmPasswordError);
      }

      await axios({
        method: "post",
        url: "http://localhost:5000/api/signup",
        data,
      });
      navigate("/login");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div
      className={`login-container ${
        mode === "dark" ? "mode2-login-container" : undefined
      }`}
    >
      <div
        className={`form-container  signup-form ${
          mode === "dark" ? "mode2-form-container" : undefined
        }`}
      >
        <form onSubmit={submitHandler}>
          <div>
            <label htmlFor="username">Username</label>
            <input type="text" name="user" id="username" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" />
          </div>
          <div>
            <label htmlFor="confirmPassword">confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
            />
          </div>
          <div>
            <label htmlFor="profession">Profession</label>
            <input type="text" name="profession" id="profession" />
          </div>
          <div>
            {/*
          <input type="text" name="image" id="imageName" /> */}
            <label htmlFor="image">Image Name</label>
            <select
              onChange={() => {
                // setMode(selectRef.current.value);
              }}
              name="image"
              id="image"
            >
              <option value="batman">batman</option>
              <option value="kakashi">kakashi</option>
              <option value="athlete">athlete</option>
              <option value="default">default</option>
            </select>
          </div>
          <button className="sign-up-btn login-btn">Signup</button>
          <Link className="sign-up-btn" to="/login">
            Already a user ? Log in
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Signup;
