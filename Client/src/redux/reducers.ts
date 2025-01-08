import { authSlice, goalsSlice } from "./slices";

const rootReducer = {
  auth: authSlice.reducer,
  goals: goalsSlice.reducer,
};

export default rootReducer;
