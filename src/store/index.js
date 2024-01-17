import { configureStore, createSlice } from "@reduxjs/toolkit";

import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import persistStore from "redux-persist/es/persistStore";

const persistConfig = {
  key: "counter",
  storage,
};

const initialSettingsState = { mode: "light", user: null };
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
    setUser(state, action) {
      state.user = action.payload;
    },
    removeUser(state) {
      state.user = null;
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

const reducers = combineReducers({
  settings: settingsSlice.reducer,
  timer: timerSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [PERSIST, FLUSH, REGISTER, REHYDRATE, PAUSE, PURGE],
      },
    }),
});

// const store = configureStore({
//   reducer: { settings: settingsSlice.reducer, timer: timerSlice.reducer },
// });

export const settingsActions = settingsSlice.actions;
export const timerActions = timerSlice.actions;
export const persistor = persistStore(store);

export default store;
