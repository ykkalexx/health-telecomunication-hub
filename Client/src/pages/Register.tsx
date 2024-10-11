import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAuthError, selectAuthLoading } from "../redux/selectors";
import { register } from "../redux/thunks";
import { AppDispatch } from "../redux/root";
import Input from "../components/Input";
import Button from "../components/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(register({ username, email, password })).unwrap();
      navigate("/login");
      toast.success("Account Created Successfully!");
    } catch (err) {
      console.error("Failed to login:", err);
    }
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form
      className="flex flex-col items-center justify-center space-y-4 w-[350px]"
      onSubmit={handleSubmit}
    >
      <h2 className="font-semibold text-2xl">
        Create an Account to use HealthTracker Today!
      </h2>
      <p className="font-light text-sm">
        Have an account?{" "}
        <button
          type="button"
          className="text-indigo-400"
          onClick={handleNavigateToLogin}
        >
          Login
        </button>
      </p>
      <Input
        type="username"
        id="username"
        value={username}
        required
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your Username"
      />
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
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <Button type="submit" disabled={loading} className="w-[200px]">
        {loading ? "Creating Account...." : "Create Account"}
      </Button>
    </form>
  );
};

export default Register;
