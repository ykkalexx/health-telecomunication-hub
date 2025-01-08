import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login, register } from "./thunks";

export interface HealthInfo {
  Date: string;
  Weight: number;
  HeartRate: number;
  BloodPressure: string;
}

interface Goal {
  id: string;
  type:
    | "Weight"
    | "HeartRate"
    | "BloodPressureSystolic"
    | "BloodPressureDiastolic";
  currentValue: number;
  targetValue: number;
  startDate: string;
  targetDate: string;
  isCompleted: boolean;
  aiGeneratedAdvice: string;
  progressPercentage: number;
}

interface GoalsState {
  goals: Goal[];
  loading: boolean;
  error: string | null;
}

const goalsInitialState: GoalsState = {
  goals: [],
  loading: false,
  error: null,
};

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  healthInfo: HealthInfo[];
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: User | null;
}

const initialAuthState: AuthState = {
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.loading = false;
          state.error = null;
          state.user = action.payload.user;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const goalsSlice = createSlice({
  name: "goals",
  initialState: goalsInitialState,
  reducers: {
    setGoals: (state, action: PayloadAction<Goal[]>) => {
      state.goals = action.payload;
    },
    addGoal: (state, action: PayloadAction<Goal>) => {
      state.goals.push(action.payload);
    },
    updateGoal: (state, action: PayloadAction<Goal>) => {
      const index = state.goals.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) {
        state.goals[index] = action.payload;
      }
    },
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
