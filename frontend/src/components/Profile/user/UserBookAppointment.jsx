import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../../assets/human6.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import UserSidebar from "./UserSidebar";

function UserBookAppointment() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [userData, setuserData] = useState([]);
  const [userName, setName] = useState("");
  const [doctor, setDoctor] = useState("");
  const [reason, setReason] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [time, setTime] = useState("");
  const [fee, setFee] = useState(0)
  const [doctors, setDoctors] = useState([]);
  const [errors, setErrors] = useState({
    doctor: "",
    appiontmentTimeId: "",
    reason: "",
    time: "",
  });
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTimeId, setSelectedTimeId] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);
  const [searchFlag, setSearchFlag] = useState(false);

  const handleTimeSelect = (e, timeId, time, fee) => {
    e.preventDefault();
    setSelectedTimeId(timeId);
    console.log(selectedTimeId);
    setTime(time);
    setFee(fee)
  };

  const getDay = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  const fetchInfo = async () => {

    try {
      const token = localStorage.getItem("token");

      await axios.get("http://18.117.148.157:4451/auth/loggedIn", {
        headers: {
          "x-access-token": token,
        },
      }).then((res) => {
        console.log(res, "hello")
      });
      const user = res.data.user;
      setuserData(user);

      setName(user.userName);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDoctors = async () => {
    const res = await axios.get("http://18.117.148.157:4451/doctor/get-doctors");
    setDoctors(res.data);
  };

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://18.117.148.157:4451/auth/loggedIn", {
          headers: {
            "x-access-token": token,
          },
        });
        const user = res.data.user;
        setuserData(user);
        setName(user.userName);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDoctors = async () => {
      const res = await axios.get("http://18.117.148.157:4451/doctor/get-doctors");
      setDoctors(res.data);
    };

    fetchDoctors();
    fetchInfo();
  }, []);

  useEffect(() => {
    // Adjust this effect to respond to searchClicked as well as doctor and appointmentDate changes
    if (doctor && appointmentDate && searchClicked) {
      fetchDoctorDetailsAndTimes(doctor);
      setSearchClicked(false);
      setSearchFlag(true); // Reset searchClicked after fetching
    }
  }, [doctor, appointmentDate, searchClicked]);

  const fetchDoctorDetailsAndTimes = async (doctorId) => {
    try {
      const doctorDetailsRes = await axios.get(
        `http://18.117.148.157:4451/doctor/doctor-details/${doctorId}`
      );
      setDoctorDetails(doctorDetailsRes.data);

      const availableTimesRes = await axios.get(
        `http://18.117.148.157:4451/appointment/available-times/${doctorId}?date=${appointmentDate}`
      );
      setAvailableTimes(availableTimesRes.data);
      console.log(availableTimes.length);
    } catch (error) {
      Swal.fire(
        "Error",
        error.message || "Failed to fetch doctor details or available times",
        "error"
      );
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!doctor || !appointmentDate) {
      Swal.fire("Error", "Please select both a doctor and a date.", "error");
      return;
    }
    setSearchClicked(true); // Trigger search
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      doctor: "",
      appointmentDate: "",
      reason: "",
      appointmentTimeId: "",
    };

    // Doctor validation
    if (!appointmentDate) {
      newErrors.appointmentDate = "Date is required";
      isValid = false;
    }
    if (!doctor) {
      newErrors.doctor = "Doctor name is required";
      isValid = false;
    }

    // Reason validation
    if (!reason) {
      newErrors.reason = "Reason is required";
      isValid = false;
    }
    if (!time) {
      newErrors.appointmentTimeId = "Timeslot is required";
      isValid = false;
    }

    setErrors(newErrors);
    console.log(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await axios.post("http://18.117.148.157:4451/appointment/add-appointment", {
        patient: userData._id,
        doctor: doctor,
        appointmentTimeId: selectedTimeId,
        reason: reason,

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
      setDoctorDetails(null);
      setAvailableTimes([]);
      setSelectedTimeId();
      setReason("");
      setTime("");
      setErrors({
        doctor: "",
        appointmentDate: "",
        reason: "",
        appointmentTimeId: "",
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
  function convertTo12Hour(timeString) {
    const [hours24, minutes] = timeString.split(":");
    const hours = parseInt(hours24, 10);
    const suffix = hours >= 12 ? "PM" : "AM";
    const hours12 = ((hours + 11) % 12) + 1; // Convert 24-hour time to 12-hour time
    return `${hours12}:${minutes} ${suffix}`;
  }

  return (
    <section className="bg-slate-300 flex justify-center items-center">
      <div className="h-[90%] w-[90%] bg-white shadow-xl p-2 flex">
        <UserSidebar userName={userName} profiePic={profiePic} />
        <div className="w-[70%] ms-24 p-4 flex flex-col justify-around">
          <p className="font-semibold text-3xl">Book Appointment</p>
          <form className="flex flex-col h-[80%] gap-12">
            <div className="w-full flex justify-between">
              <div className="flex flex-col w-[50%]">
                <label htmlFor="doctors">Enter Doctor Name:</label>
                <select
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  id="doctors"
                  className="h-10 w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                >
                  <option value="">Choose Your Consultant</option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      {doc.name}
                    </option>
                  ))}
                </select>
                {errors.doctor && (
                  <p className="text-red-500 mt-2">{errors.doctor}</p>
                )}
              </div>
              <div className="flex flex-col w-[50%]">
                <label htmlFor="appointmentDate">Appointment Date:</label>
                <input
                  id="appointmentDate"
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="h-10 w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                />
                {errors.appointmentDate && (
                  <p className="text-red-500 mt-2">{errors.appointmentDate}</p>
                )}
              </div>
              <div className="flex justify-between items-end">
                {/* Doctor and date selection UI remains unchanged */}
                {/* Search Button */}
                <button
                  onClick={(e) => handleSearch(e)}
                  className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Search
                </button>
              </div>
            </div>
            {doctorDetails && (
              <div className="p-5 bg-gray-100 rounded-lg my-1">
                <h4 className="font-semibold text-lg mb-2">Doctor Details:</h4>
                <p>
                  <strong>Description:</strong> {doctorDetails?.description}
                </p>
                <p>
                  <strong>Specialization:</strong>{" "}
                  {doctorDetails.specialization}
                </p>
                <p>
                  <strong>Address:</strong> {doctorDetails?.address?.street}
                  {", "}
                  {doctorDetails.address?.city} {", "}
                  {doctorDetails.address?.state}
                </p>
              </div>
            )}
            {availableTimes.length > 0 && (
              <>
                <div className="grid grid-cols-3 gap-4 mt-0">
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">Available Times:</h3>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      {availableTimes.map((availableTime, index) => {
                        const formattedTime = convertTo12Hour(
                          availableTime.time
                        );

                        return (
                          <button
                            key={index}
                            className={`p-4 rounded-lg text-center cursor-pointer ${selectedTimeId === availableTime._id
                              ? "bg-blue-500 text-white"
                              : "bg-blue-200 hover:bg-blue-300"
                              }`}
                            onClick={(e) => {
                              console.log(availableTime, "available time");
                              handleTimeSelect(
                                e,
                                availableTime._id,
                                availableTime.time,
                                availableTime.fee
                              )
                            }
                            }
                          >
                            {formattedTime}
                          </button>
                        );
                      })}
                    </div>
                    {errors.appointmentTimeId && (
                      <p className="text-red-500 mt-2">
                        {errors.appointmentTimeId}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <p>Enter Reason:</p>
                  <textarea
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      setErrors({ ...errors, reason: "" });
                    }}
                    className="flex h-20 w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="text"
                    placeholder="Reason"
                  ></textarea>
                  {errors.reason && (
                    <p className="text-red-500">{errors.reason}</p>
                  )}
                </div>
              </>
            )}
            {availableTimes.length === 0 && searchFlag && (
              <p>
                No available times found for this doctor on the specified date
              </p>
            )}
            {/* Additional form fields */}
            {availableTimes.length > 0 && (
              <button
                onClick={handleSubmit}
                className="bg-black w-[95%] text-white p-2 rounded-full"
              >
                Book Now
              </button>
            )}
          </form>
          {/* Display Doctor Details and Available Times */}
        </div>
      </div>
    </section>
  );
}

export default UserBookAppointment;
