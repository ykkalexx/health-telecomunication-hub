import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Login, Register } from "../types/types";
import { HealthInfo, User } from "./slices";
import { CreateGoalRequest } from "../types/goals";
import { GoalType } from "../types/goals";
import { selectAuthToken, selectUserId } from "./selectors";
import { RootState } from "./root";

const API_URL = "https://localhost:7214/api";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Interceptor token:", token); // Debug token

  if (token) {
    if (!config.headers) config.headers = {};
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

interface LoginResponse {
  user: User;
  token: string;
}

export const login = createAsyncThunk<
  LoginResponse,
  Login,
  { rejectValue: string }
>("Auth/login", async (credentials: Login, { rejectWithValue }) => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/Auth/login`,
      credentials
    );
    localStorage.setItem("token", response.data.token);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to login:", error);
    return rejectWithValue("Login failed. Please check your credentials.");
  }
});

export const register = createAsyncThunk(
  "Auth/register",
  async (credentials: Register, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/Auth/register`,
        credentials
      );
      return response.data;
    } catch (error) {
      console.error("Failed to register:", error);
      return rejectWithValue("Registration failed. Please try again.");
    }
  }
);

export const fetchGoals = createAsyncThunk(
  "goals/fetchGoals",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/Goals/${userId}`);
      console.log("Fetched goals:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching goals"
      );
    }
  }
);

export const createGoal = createAsyncThunk(
  "goals/createGoal",
  async (goalData: CreateGoalRequest, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = selectUserId(state); // Use your existing selector

      if (!userId) {
        return rejectWithValue("User ID not found");
      }

      const formattedData = {
        userId: userId, // Add userId to the request
        type: Number(goalData.type),
        currentValue: Number(goalData.currentValue),
        targetValue: Number(goalData.targetValue),
        targetDate: new Date(goalData.targetDate).toISOString(),
      };

      const response = await axios.post(`${API_URL}/Goals`, formattedData);
      return response.data;
    } catch (error: any) {
      console.error("Error creating goal:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create goal"
      );
    }
  }
);
//export const deleteGoal = createAsyncThunk();
