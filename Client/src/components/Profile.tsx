import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/root";
import { selectUserUsername } from "../redux/selectors";
import { BiLogOut } from "react-icons/bi";
import { IoMdNotificationsOutline } from "react-icons/io";

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const username = useSelector(selectUserUsername);

  return (
    <div className="flex flex-col p-4 items-center justify-center">
      <div className="w-full flex flex-row justify-between">
        <h1 className="text-lg font-semibold">Welcome, {username}</h1>
        <div className="flex flex-row items-center justify-center gap-5">
          <IoMdNotificationsOutline className="cursor-pointer" size={20} />
          <BiLogOut className="cursor-pointer" size={20} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
