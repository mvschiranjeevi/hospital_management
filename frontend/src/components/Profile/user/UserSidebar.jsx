import axios from "axios";
import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/UserSlice.js";

const UserSidebar = ({ profiePic, userName }) => {
  const navLinkStyle = ({ isActive }) => {
    return {
      fontWeight: isActive ? "600" : "400",
      color: isActive ? "white" : "black",
      backgroundColor: isActive ? "black" : "white",
      borderRadius: "8px",
      padding: "10px",
      textDecoration: "none",
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
    <div className="bg-slate h-full w-[18%] flex flex-col justify-between p-2">
      <div className="flex flex-col gap-4">
        <div className="w-full flex flex-col items-center ">
          <img src={profiePic} className="size-24 rounded-full" alt="profile" />
          <p className="text-white">{userName}</p>
        </div>
        <div className="flex flex-col items-start w-full gap-2">
          <NavLink
            style={navLinkStyle}
            className={"w-full p-2"}
            to="/user-profile"
            activeClassName="bg-black text-white"
          >
            Settings
          </NavLink>
          <NavLink
            style={navLinkStyle}
            className={"w-full p-2"}
            to="/user-appointments"
            activeClassName="bg-black text-white"
          >
            History
          </NavLink>
          <NavLink
            style={navLinkStyle}
            className={"w-full p-2"}
            to="/user-book-appointment"
            activeClassName="bg-black text-white"
          >
            Book Appointment
          </NavLink>
          <NavLink
            style={navLinkStyle}
            className={"w-full p-2"}
            to="/user-medication"
            activeClassName="bg-black text-white"
          >
            Medications
          </NavLink>
          <NavLink
            style={navLinkStyle}
            className={"w-full p-2"}
            to="/user-billing"
            activeClassName="bg-black text-white"
          >
            Billing
          </NavLink>
          <NavLink
            style={navLinkStyle}
            className={"w-full p-2"}
            to="/user-insurance"
            activeClassName="bg-black text-white"
          >
            Insurance
          </NavLink>
        </div>
      </div>
      <div className="w-full text-center p-2">
        <button
          onClick={handleSignOut}
          className="bg-black text-white rounded-full text-md font-medium p-2 cursor-pointer hover:bg-gray-900 hover:text-white transition duration-300"
          style={{ width: "100%", borderRadius: "20px" }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
