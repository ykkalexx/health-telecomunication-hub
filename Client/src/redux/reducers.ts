import { combineReducers } from "@reduxjs/toolkit";
import {
  authSlice,
  goalsSlice,
  medicineSlice,
  notificationSlice,
} from "./slices";

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  goals: goalsSlice.reducer,
  medicine: medicineSlice.reducer,
  notifications: notificationSlice.reducer,
});

export default rootReducer;
