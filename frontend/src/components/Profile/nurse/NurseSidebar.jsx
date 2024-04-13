import axios from "axios";
import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/UserSlice.js";
const NurseSidebar = ({ profilePic, userName }) => {
  const navLinkStyle = ({ isActive }) => {
    return {
      fontWeight: isActive ? "600" : "400",
      color: isActive ? "white" : "black",
      backgroundColor: isActive ? "black" : "white",
    };
  };

  const dispatch = useDispatch();

  const handleSignOut = async (e) => {
    e.preventDefault();
    await axios.get("http://18.117.148.157:4451/auth/logout").then((res) => {
      if (res.data.message === "User Logged Out") {
        localStorage.removeItem("user");
        dispatch(logout());
        window.location.href = "/";
      }
    });
  };

  return (
    <div className="bg-slate- h-full w-[18%] flex flex-col justify-between p-2 ">
      <div className="flex flex-col gap-16">
        <div className="w-full flex flex-col items-center gap-3">
          <img
            src={profilePic}
            className="size-24 rounded-full"
            alt="profile"
          />
          <p>{userName}</p>
        </div>
        <div className="flex flex-col items-start w-full gap-4 ">
          <NavLink
            style={navLinkStyle}
            className={"w-full  p-2 h-[40px] rounded "}
            to="/nurse-profile"
          >
            Settings
          </NavLink>
          <NavLink
            style={navLinkStyle}
            className={"w-full  p-2 h-[40px] rounded"}
            to="/nurse-medication"
          >
            Medication
          </NavLink>
          <NavLink
            style={navLinkStyle}
            className={"w-full p-2 h-[40px] rounded"}
            to="/nurse-bed"
          >
            Messages
          </NavLink>
        </div>
      </div>
      <div className="w-full text-center">
        <button
          onClick={handleSignOut}
          className="bg-black text-white rounded-full text-md font-medium p-2 w-full cursor-pointer hover:bg-gray-800 transition-colors duration-200"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default NurseSidebar;
