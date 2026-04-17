import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { userReducer } from "./slice/userSlice";

const rootPersistConfig = {
  key: "root",
  storage: storage,
  whiteList: ["user"],
  // blacklist: ["activeSemester"],
};

const rootReducer = combineReducers({
  user: userReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export type AppDispatch = typeof store.dispatch;
