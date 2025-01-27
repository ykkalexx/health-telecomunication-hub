import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/root";
import { selectUserUsername } from "../redux/selectors";
import { BiLogOut } from "react-icons/bi";
import { IoMdNotificationsOutline } from "react-icons/io";
import Logout from "./Logout";
import { useNavigate } from "react-router-dom";
const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const username = useSelector(selectUserUsername);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex flex-row justify-between w-full">
        <h1 className="text-lg font-semibold">Welcome, {username}</h1>
        <div className="flex flex-row items-center justify-center gap-5">
          <IoMdNotificationsOutline
            onClick={() => {
              navigate("/settings");
            }}
            className="cursor-pointer"
            size={20}
          />
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default Profile;
