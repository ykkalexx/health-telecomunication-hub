import { authSlice, goalsSlice, medicineSlice } from "./slices";

const rootReducer = {
  auth: authSlice.reducer,
  goals: goalsSlice.reducer,
  medicine: medicineSlice.reducer,
};

export default rootReducer;
