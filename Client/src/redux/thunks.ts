import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Login, Register } from "../types/types";
import { HealthInfo, User } from "./slices";
import { CreateGoalRequest } from "../types/goals";

const API_URL = "https://localhost:7214/api";

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
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/Goals`);
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
  async (goalData: CreateGoalRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/Goals`, goalData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error creating goal"
      );
    }
  }
);
