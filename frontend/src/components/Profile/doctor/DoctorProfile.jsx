import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../../assets/doct2.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import DoctorSidebar from "./DoctorSidebar";

function DoctorProfile() {
  const [userData, setuserData] = useState([]);
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [dateOfBirth, setdateofBirth] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.name = name ? "" : "Name is required.";
    tempErrors.email = email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
      ? ""
      : "Email is not valid.";
    tempErrors.mobileNumber = mobileNumber.match(/^\d{10}$/)
      ? ""
      : "Phone number is not valid.";
    tempErrors.dateOfBirth = dateOfBirth ? "" : "Date of Birth is required.";
    tempErrors.gender = gender ? "" : "Gender is required.";
    tempErrors.city = city ? "" : "City is required.";
    tempErrors.state = state ? "" : "State is required.";
    tempErrors.address = address ? "" : "Address is required.";
    tempErrors.description = description ? "" : "Description is required.";

    // Add other validations as needed

    setErrors({ ...tempErrors });
    return Object.values(tempErrors).every((x) => x === "");
  };

  useEffect(() => {
    const fetchInfo = async (e) => {
      const user = JSON.parse(localStorage.getItem("user"));
      setuserData(user);
      setName(user.name || "");
      setMobileNumber(user.phoneno || "");
      setAddress(user.address ? user.address.street || "" : "");
      setCity(user.address ? user.address.city || "" : "");
      setState(user.address ? user.address.state || "" : "");
      const formattedDateOfBirth = user.dob ? user.dob.split("T")[0] : "";
      setdateofBirth(formattedDateOfBirth);
      setGender(user.gender || "");
      setEmail(user.email || "");
      setDescription(user.description || "");
    };

    fetchInfo();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        axios
          .put("http://18.117.148.157:4451/doctor/profile-update", {
            userId: userData._id,
            updatedProfile: {
              description: description,
              email: email,
              name: name,
              phoneno: mobileNumber,
              address: {
                street: address,
                city: city,
                state: state,
              },
              gender: gender,
              dob: dateOfBirth,
            },
          })
          .then((res) => {
            if (res.data.status === "Success") {
              Swal.fire({
                title: "Success",
                icon: "success",
                confirmButtonText: "Ok",
                text: "Profile Updated Successfully!",
              });
              const user = res.data.user;
              localStorage.setItem("user", JSON.stringify(user));
              window.location.href = "/doctor-profile";
            }
          });
      } catch (err) {
        Swal.fire({
          title: "Error",
          icon: "error",
          confirmButtonText: "Ok",
          text: "Error Updating Profile! Please Try Again!",
        });
      }
    } else {
      Swal.fire({
        title: "Error",
        icon: "error",
        confirmButtonText: "Ok",
        text: "Please fix the errors in the form before submitting.",
      });
    }
  };

  return (
    <section className="bg-slate-300 flex justify-center items-center">
      <div className="h-[100%] w-[100%] bg-white shadow-xl p-2 flex">
        <DoctorSidebar userName={userData.name} profilePic={profiePic} />
        <div className=" w-[70%] ms-24 p-4 flex flex-col justify-around ">
          <p className="font-semibold text-3xl">Account Settings</p>
          <form action="" className="flex flex-col h-[80%] justify-between">
            <div className="w-full flex justify-between">
              <div className="flex flex-col w-[50%] justify-start">
                <p>Enter Your Name:</p>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex h-10 w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  type="text"
                  placeholder="Name"
                ></input>
                <ErrorMessage>{errors.name}</ErrorMessage>
              </div>
              <div className="flex flex-col w-[50%] justify-start">
                <p>Enter Your Email:</p>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-10  w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  type="email"
                  placeholder="Email"
                ></input>
                <ErrorMessage>{errors.email}</ErrorMessage>
              </div>
            </div>
            <div className="w-full justify-between">
              <p>Enter your Description</p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex h-20 w-[95%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Description"
              />
              <ErrorMessage>{errors.description}</ErrorMessage>
            </div>
            <div className="w-full flex justify-between">
              <div className="flex flex-col w-[50%] justify-start">
                <p>Enter Your Phone:</p>
                <input
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="flex h-10 w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  type="text"
                  placeholder="Phone"
                ></input>
                <ErrorMessage>{errors.mobileNumber}</ErrorMessage>
              </div>
              <div className="flex flex-col w-[50%] justify-start">
                <p>Enter Your DOB:</p>
                <input
                  value={dateOfBirth}
                  onChange={(e) => setdateofBirth(e.target.value)}
                  className="flex h-10  w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  type="date"
                  placeholder="Name"
                ></input>
                <ErrorMessage>{errors.dateOfBirth}</ErrorMessage>
              </div>
            </div>

            <div className="w-full flex justify-between">
              <div className="flex flex-col w-[50%] justify-start">
                <p>Enter Your Gender:</p>
                <input
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="flex h-10 w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  type="text"
                  placeholder="Male/Female/Others"
                ></input>
                <ErrorMessage>{errors.gender}</ErrorMessage>
              </div>
              <div className="flex flex-col w-[50%] justify-start">
                <p>Enter Your City:</p>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="flex h-10  w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  type="text"
                  placeholder="City"
                ></input>
                <ErrorMessage>{errors.city}</ErrorMessage>
              </div>
            </div>
            <div className="w-full flex justify-between">
              <div className="flex flex-col w-[50%] justify-start">
                <p>Enter Your State:</p>
                <input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="flex h-10 w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  type="text"
                  placeholder="State"
                ></input>
                <ErrorMessage>{errors.state}</ErrorMessage>
              </div>
              <div className="flex flex-col w-[50%] justify-start">
                <p>Enter Your Address:</p>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="flex h-10  w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  type="text"
                  placeholder="Address"
                ></input>
                <ErrorMessage>{errors.address}</ErrorMessage>
              </div>
            </div>

            <button
              onClick={handleUpdate}
              className="bg-black w-[95%] text-white p-2 rounded-full"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
const ErrorMessage = ({ children }) => {
  return <div className="text-red-500 text-xs">{children}</div>;
};
export default DoctorProfile;
