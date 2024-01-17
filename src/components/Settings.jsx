import { useState } from "react";
import "./Settings.css";
import { useSelector } from "react-redux";

const Settings = () => {
  const user = useSelector((state) => state.settings.user);
  const mode = useSelector((state) => state.settings.mode);

  const [editMode, setEditMode] = useState();

  const submitHandler = function (e) {
    e.preventDefault();
    alert("updating user");
    console.log("updating user");
  };

  return (
    <div
      className={`settingsForm-container ${
        mode === "dark" ? "mode2-settingsForm-container" : undefined
      }`}
    >
      <form className="settingsForm" action="" onSubmit={submitHandler}>
        <h3>Update User Details</h3>
        <div>
          <label className="setting-label" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={user.user}
            disabled={editMode !== "username"}
            onChange={(e) => {
              setUser((prev) => {
                return { ...prev, user: e.target.value };
              });
            }}
          />
          {editMode === "username" ? (
            <button
              type="button"
              onClick={() => {
                setEditMode(undefined);
              }}
            >
              Save
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditMode("username");
              }}
            >
              Edit
            </button>
          )}{" "}
        </div>
        <div>
          <label className="setting-label" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={user.password}
            disabled={editMode !== "password"}
            onChange={(e) => {
              setUser((prev) => {
                return { ...prev, password: e.target.value };
              });
            }}
          />
          {editMode === "password" ? (
            <button
              type="button"
              onClick={() => {
                setEditMode(undefined);
              }}
            >
              Save
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditMode("password");
              }}
            >
              Edit
            </button>
          )}{" "}
        </div>
        <div>
          <label className="setting-label" htmlFor="image">
            Image
          </label>
          {editMode === "image" ? (
            <select
              name="image"
              id="image"
              onChange={(e) => {
                setUser((prev) => {
                  return { ...prev, image: e.target.value };
                });
              }}
            >
              <option value="batman">batman</option>
              <option value="kakashi">kakashi</option>
              <option value="athlete">athlete</option>
              <option value="default">default</option>
            </select>
          ) : (
            <input
              type="text"
              name="image"
              id="image"
              value={user.image}
              disabled={editMode !== "image"}
            />
          )}

          {editMode === "image" ? (
            <button
              type="button"
              onClick={() => {
                setEditMode(undefined);
              }}
            >
              Save
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditMode("image");
              }}
            >
              Edit
            </button>
          )}

          {}
          {/* <input type="text" name="image" id="image" /> */}
        </div>
        <div>
          <label className="setting-label" htmlFor="profession">
            Profession
          </label>
          <input
            type="text"
            name="profession"
            id="profession"
            value={user.profession}
            disabled={editMode !== "profession"}
            onChange={(e) => {
              setUser((prev) => {
                return { ...prev, profession: e.target.value };
              });
            }}
          />

          {editMode === "profession" ? (
            <button
              type="button"
              onClick={() => {
                setEditMode(undefined);
              }}
            >
              Save
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditMode("profession");
              }}
            >
              Edit
            </button>
          )}
        </div>
        <button className="settings-submit-btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Settings;
