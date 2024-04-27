import axios from "axios";
import React from "react";
import { NavLink } from "react-router-dom";
import adminProfile from "../../assets/human6.jpg";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/UserSlice.js";

const AdminSidebar = ({ profilePic, userName }) => {
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
    await axios.get("http://localhost:4451/auth/logout").then((res) => {
      if (res.data.message === "User Logged Out") {
        localStorage.removeItem("user");
        dispatch(logout());
        window.location.href = "/";
      }
    });
  };

  return (
    <div className="bg-slate- h-full w-[18%] flex flex-col justify-between p-2 ">
      <div className="flex flex-col gap-6">
        <div className="w-full flex flex-col items-center ">
          <img
            src={adminProfile}
            className="size-24 rounded-full"
            alt="profile"
          />
          <p className="font-semibold text-xl">{userName}</p>
        </div>
        <div className="flex flex-col items-start w-full gap-3 ">
          <NavLink
            style={navLinkStyle}
            className={"w-full   p-2 h-[40px] rounded"}
            to="/admin-dashboard"
          >
            Dashboard
          </NavLink>
          <NavLink
            style={navLinkStyle}
            className={"w-full  p-2 h-[40px] rounded"}
            to="/admin-doctor"
          >
            Doctor
          </NavLink>
          <NavLink
            style={navLinkStyle}
            className={"w-full p-2 h-[40px] rounded"}
            to="/admin-nurse"
          >
            Nurse
          </NavLink>
          <NavLink
            style={navLinkStyle}
            className={"w-full p-2 h-[40px] rounded"}
            to="/admin-patient"
          >
            Patient
          </NavLink>
          <NavLink
            style={navLinkStyle}
            className={"w-full p-2 h-[40px] rounded"}
            to="/admin-department"
          >
            Department
          </NavLink>

          <NavLink
            style={navLinkStyle}
            className={"w-full p-2 h-[40px] rounded"}
            to="/admin-query"
          >
            Query
          </NavLink>
        </div>
        <div className="w-full text-center mt-10">
          <button
            onClick={handleSignOut}
            className="bg-black text-white rounded-full text-md font-medium p-2 w-full cursor-pointer hover:bg-gray-800 transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
