import axios from "axios";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";

const Login = () => {
  const userRef = useRef();
  const passRef = useRef();
  const navigate = useNavigate();

  const submitHandler = async function (e) {
    e.preventDefault();
    try {
      const res = await axios({
        method: "post",
        url: "http://localhost:5000/api/login",
        data: {
          user: userRef.current.value,
          password: passRef.current.value,
        },
      });
      console.log(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      console.log("user not found", err);
      alert("user not found");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="username">Username</label>
          <input ref={userRef} type="text" name="username" id="username" />
        </div>
        <br />
        <div>
          <label htmlFor="password">Password</label>
          <input ref={passRef} type="password" name="password" id="password" />
        </div>
        <button className="login-btn">Login</button>
        <Link className="sign-up-btn" to="/signup">
          Not a user ? Sign Up
        </Link>
      </form>
    </div>
  );
};

export default Login;
