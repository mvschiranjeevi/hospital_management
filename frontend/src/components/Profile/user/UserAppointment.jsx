import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../../assets/human6.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import UserSidebar from "./UserSidebar";

function UserAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [userData, setUserData] = useState([]);

  const colorForStatus = (status) => {
    switch (status) {
      case "scheduled":
        return "text-orange-300";
      case "inProgress":
        return "text-blue-300";
      case "completed":
        return "text-green-300";
      case "cancelled":
        return "text-red-300";
      default:
        return "text-green-300";
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    setUserData(user);
    const id = user._id;
    const fetchAppointments = async (id) => {
      try {
        const res = await axios.get(
          `http://localhost:4451/appointment/get-appointments/${id}`
        );
        setAppointments(res.data);
        console.log(res.data);
      } catch (error) {
        Swal.fire({
          title: "Error",
          icon: "error",
          confirmButtonText: "Ok",
          text: "Error Fetching Appointments! Please Try Again!",
        });
      }
    };

    fetchAppointments(id);
  }, []);

  return (
    <section className="bg-slate-300 flex justify-center items-center">
      <div className="h-[80%] w-[80%] bg-white shadow-xl p-2 flex">
        <UserSidebar profiePic={profiePic} userName={userData.userName} />
        <div
          className=" w-[70%] ms-24 p-4  flex flex-col justify-start gap-5 "
          style={{ alignItems: "center", paddingTop: "4rem" }}
        >
          <p className="font-semibold text-3xl">Appointmnets</p>
          <div className="w-full">
            <div className="relative overflow-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Doctor Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Appointment Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Reason
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!appointments.length > 0 ? (
                    <tr>
                      <td colSpan="6">
                        <div style={{ padding: "1rem" }}>
                          <p style={{ alignItems: "center" }}>
                            Appointments are not scheduled
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appointment, index) => {
                      const appointmentDate = new Date(
                        appointment.appointmentDate
                      );
                      const formattedDate = appointmentDate.toLocaleString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric",
                        }
                      );
                      return (
                        <tr key={index}>
                          <td scope="col" className="px-6 py-3">
                            {index + 1}
                          </td>
                          <td scope="col" className="px-6 py-3">
                            {appointment.doctorName}
                          </td>
                          <td scope="col" className="px-6 py-3">
                            {formattedDate}
                          </td>
                          <td scope="col" className="px-6 py-3">
                            {appointment.reason}
                          </td>
                          <td scope="col" className="px-6 py-3">
                            {appointment.status}
                          </td>
                        </tr>
                      );
                    })
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

export default UserAppointment;
