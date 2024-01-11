import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialSettingsState = { mode: "light" };
const settingsSlice = createSlice({
  name: "settings",
  initialState: initialSettingsState,
  reducers: {
    changeModeToDark(state) {
      state.mode = "dark";
    },
    changeModeToLight(state) {
      state.mode = "light";
    },
  },
});

const initialTimerState = {};
const timerSlice = createSlice({
  name: "timer",
  initialState: initialTimerState,
  reducers: {
    updateState(state, { payload }) {
      state.timerStatus = payload;
    },

    clearState(state) {
      state.timerStatus = undefined;
    },
  },
});

const store = configureStore({
  reducer: { settings: settingsSlice.reducer, timer: timerSlice.reducer },
});

export const settingsActions = settingsSlice.actions;
export const timerActions = timerSlice.actions;

export default store;
