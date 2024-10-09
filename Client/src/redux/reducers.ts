import { authSlice } from "./slices";

const rootReducer = {
  auth: authSlice.reducer,
};

export default rootReducer;
