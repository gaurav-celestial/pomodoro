import axios from "axios";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const submitHandler = async function (e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    console.log(data);
    try {
      const res = await axios({
        method: "post",
        url: "http://localhost:5000/api/signup",
        data,
      });
      navigate("/login");
      console.log(res.data);
    } catch (err) {
      alert("error creating");
    }
  };

  return (
    <div className="form-container signup-form">
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
      </form>
    </div>
  );
};

export default Signup;
