import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../../assets/human6.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import UserSidebar from "./UserSidebar";

function UserBookAppointment() {
  const [userData, setuserData] = useState([]);
  const [userName, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [doctor, setDoctor] = useState("");
  const [reason, setReason] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [errors, setErrors] = useState({
    doctor: "",
    appointmentDate: "",
    reason: "",
    time: "",
  });

  const getDay = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4451/auth/loggedIn", {
          headers: {
            "x-access-token": token,
          },
        });
        const user = res.data.user;
        setuserData(user);
        setName(user.userName);
        setMobileNumber(user.phoneNumber);
        setGender(user.gender);
        setEmail(user.email);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDoctors = async () => {
      const res = await axios.get("http://localhost:4451/doctor/get-doctors");
      setDoctors(res.data);
    };

    fetchDoctors();
    fetchInfo();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      doctor: "",
      appointmentDate: "",
      reason: "",
      time: "",
    };

    // Doctor validation
    if (!doctor) {
      newErrors.doctor = "Doctor name is required";
      isValid = false;
    }

    // Appointment date validation
    if (!appointmentDate) {
      newErrors.appointmentDate = "Appointment date is required";
      isValid = false;
    } else {
      const today = new Date();
      const selectedDate = new Date(appointmentDate);
      if (selectedDate < today) {
        newErrors.appointmentDate = "Appointment date cannot be in the past";
        isValid = false;
      }
    }
    // Reason validation
    if (!reason) {
      newErrors.reason = "Reason is required";
      isValid = false;
    }

    // Time validation
    if (!time) {
      newErrors.time = "Appointment time is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await axios.post("http://localhost:4451/appointment/add-appointment", {
        patient: userData._id,
        phone: mobileNumber,
        doctor: doctor,
        appointmentDate: appointmentDate,
        reason: reason,
        email: email,
        time: time,
        gender: gender,
      });
      Swal.fire({
        title: "Success",
        icon: "success",
        confirmButtonText: "Ok",
        text: "Appointment Request Sent Successfully! We will get back to you soon!",
      });
      // Clear input fields after successful submission
      setDoctor("");
      setAppointmentDate("");
      setReason("");
      setTime("");
      setErrors({
        doctor: "",
        appointmentDate: "",
        reason: "",
        time: "",
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        icon: "error",
        confirmButtonText: "Ok",
        text: "Error Sending Appointment Request! Please Try Again!",
      });
    }
  };

  return (
    <section className="bg-slate-300 flex justify-center items-center">
      <div className="h-[80%] w-[80%] bg-white shadow-xl p-2 flex">
        <UserSidebar profiePic={profiePic} userName={userData.userName} />
        <div className=" w-[70%] ms-24 p-4 flex flex-col justify-around ">
          <p className="font-semibold text-3xl">Book Appointment</p>
          <form action="" className="flex flex-col h-[80%] justify-between">
            <div className="w-full flex justify-between"></div>

            <div className="w-full flex justify-between">
              <div className="flex flex-col w-[50%] justify-start">
                <p>Enter Doctor Name:</p>
                <select
                  value={doctor}
                  onChange={(e) => {
                    setDoctor(e.target.value);
                    setErrors({ ...errors, doctor: "" }); // Clear error message
                  }}
                  id="doctors"
                  className="flex h-10 w-[90%] rounded-md border border
                  -gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Choose you Consultant">
                    Choose you Consultant
                  </option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
                {errors.doctor && (
                  <p className="text-red-500">{errors.doctor}</p>
                )}
              </div>
              <div className="flex flex-col w-[50%] justify-start">
                <p>Appointment Date:</p>
                <input
                  value={appointmentDate}
                  onChange={(e) => {
                    setAppointmentDate(e.target.value);
                    setErrors({ ...errors, appointmentDate: "" }); // Clear error message
                  }}
                  className="flex h-10  w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  type="date"
                  min={getDay()}
                  placeholder="Date Of Appointment"
                ></input>
                {errors.appointmentDate && (
                  <p className="text-red-500">{errors.appointmentDate}</p>
                )}
              </div>
            </div>
            <div className="w-full flex justify-between">
              <div className="flex flex-col w-[50%] justify-start">
                <p>Enter Reason:</p>
                <input
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    setErrors({ ...errors, reason: "" }); // Clear error message
                  }}
                  className="flex h-10 w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  type="text"
                  placeholder="Reason"
                ></input>
                {errors.reason && (
                  <p className="text-red-500">{errors.reason}</p>
                )}
              </div>
              <div className="flex flex-col w-[50%] justify-start">
                <p>Enter Appointment Time:</p>
                <input
                  onChange={(e) => {
                    setTime(e.target.value);
                    setErrors({ ...errors, time: "" }); // Clear error message
                  }}
                  className="flex h-10  w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  type="time"
                  placeholder="Time"
                ></input>
                {errors.time && <p className="text-red-500">{errors.time}</p>}
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="bg-black w-[95%] text-white p-2 rounded-full"
            >
              Book Now
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default UserBookAppointment;
