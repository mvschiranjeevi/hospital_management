import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../../assets/doctor.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import DoctorSidebar from "./DoctorSidebar";
import AppointmentConfig from "./DoctorAppiontmentTime";
import { useSelector } from "react-redux";

function DoctorAppointmen() {
  const [appointments, setAppointments] = useState([]);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4451/appointment/get-appointment/${currentUser._id}`
        );
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);
  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(":");
    const hours = parseInt(hour, 10);
    const suffix = hours >= 12 ? "PM" : "AM";
    const formattedHour = ((hours + 11) % 12) + 1;
    return `${formattedHour}:${minute} ${suffix}`;
  };

  const formatDate = (dateString) => {
    // Split the dateString into components. Expected format: "YYYY-MM-DD"
    const [year, month, day] = dateString
      .split("-")
      .map((num) => parseInt(num, 10));

    // Create a new Date object from the components. Note: month is 0-indexed.
    const date = new Date(year, month - 1, day);

    const options = {
      weekday: "long", // e.g., Monday
      year: "numeric", // e.g., 2023
      month: "long", // e.g., March
      day: "numeric", // e.g., 30
    };

    // Return the formatted string in the "en-US" locale
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <section className="bg-slate-300 flex justify-center items-center">
      <div className="h-[100%] w-[100%] bg-white shadow-xl p-2 flex">
        <DoctorSidebar userName={currentUser.name} profiePic={profiePic} />
        <div className=" w-[70%] ms-24 p-4 flex flex-col justify-start gap-5 ">
          <p className="font-semibold text-3xl">Appointments</p>
          <div className="w-full">
            <AppointmentConfig doctorId={currentUser._id} />
            <div className="relative overflow-auto shadow-md sm:rounded-lg">
              <p style={{ fontWeight: "bold", fontSize: "20px" }}>
                My Booked Appiontmentns
              </p>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Patient Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Appointment Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Appointment Time
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appointments &&
                  Array.isArray(appointments) &&
                  appointments.length > 0 ? (
                    appointments.map((item, index) => (
                      <tr key={item._id} className="text-black">
                        <td scope="col" className="px-6 py-3">
                          {index + 1}
                        </td>
                        <td scope="col" className="px-6 py-3">
                          {item.patientName}
                        </td>
                        <td scope="col" className="px-6 py-3">
                          {formatDate(item.appointmentDate)}
                        </td>
                        <td scope="col" className="px-6 py-3">
                          {formatTime(item.time)}
                        </td>
                        <td scope="col" className="px-6 py-3">
                          {item.status}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-6 py-3" colSpan="5">
                        <p>Sorry, You have No appointments !!</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DoctorAppointmen;
