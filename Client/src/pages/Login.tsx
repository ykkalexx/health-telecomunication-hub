import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAuthError, selectAuthLoading } from "../redux/selectors";
import { login } from "../redux/thunks";
import { AppDispatch } from "../redux/root";
import Input from "../components/Input";
import Button from "../components/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
      navigate("/dashboard");
      toast.success("Logged in Successfully!");
    } catch (err) {
      console.error("Failed to login:", err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleNavigateToRegister = () => {
    navigate("/register");
  };

  return (
    <form
      className="flex flex-col items-center justify-center space-y-4 w-[350px]"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-semibold">
        Login to use HealthTracker Today!
      </h2>
      <p className="text-sm font-light">
        Don't have an account?{" "}
        <button
          type="button"
          className="text-indigo-400"
          onClick={handleNavigateToRegister}
        >
          Create One
        </button>
      </p>
      <Input
        type="email"
        id="email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your Email"
      />
      <div className="relative w-full">
        <Input
          type={showPassword ? "text" : "password"}
          id="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your Password"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <Button type="submit" disabled={loading} className="w-[200px]">
        {loading ? "Logging in...." : "Login"}
      </Button>
      <div className="p-4 mt-6 border border-blue-200 rounded-lg bg-blue-50">
        <h3 className="font-medium text-blue-800">Need Test Data?</h3>
        <p className="mt-1 text-sm text-blue-700">
          To get sample data, go to the Github Repository and run the
          data/generate_data.py script or use generated examples from the
          results folder in the source code files.
        </p>
        <p>
          You can also use this account for testing: test12345678@test.com /
          password: test123{" "}
        </p>
      </div>
    </form>
  );
};

export default Login;
