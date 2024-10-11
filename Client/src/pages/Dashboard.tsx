import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/root";
import { logout } from "../redux/slices";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      <button onSubmit={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
