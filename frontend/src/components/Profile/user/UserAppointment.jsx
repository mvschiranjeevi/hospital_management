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
  function convertTo12Hour(timeString) {
    const [hours24, minutes] = timeString.split(":");
    const hours = parseInt(hours24, 10);
    const suffix = hours >= 12 ? "PM" : "AM";
    const hours12 = ((hours + 11) % 12) + 1; // Convert 24-hour time to 12-hour time
    return `${hours12}:${minutes} ${suffix}`;
  }

  const deleteAppointment = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed deletion
        axios
          .delete(`http://localhost:4451/appointment/delete-appointment/${id}`)
          .then((res) => {
            Swal.fire({
              title: "Success",
              icon: "success",
              text: "Appointment Deleted Successfully!",
            });
            window.location.reload();
          })
          .catch((err) => {
            Swal.fire({
              title: "Error",
              icon: "error",
              text: "Error Deleting Appointment!",
            });
          });
      }
      // window.location.reload();
    });
  };

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
                      Appointment Time
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Reason
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
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
                        appointment.timeDetails.date
                      );
                      const formattedDate = appointmentDate.toLocaleString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
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
                            {convertTo12Hour(appointment.timeDetails.time)}
                          </td>
                          <td scope="col" className="px-6 py-3">
                            {appointment.reason}
                          </td>
                          <td scope="col" className="px-6 py-3">
                            {appointment.status}
                          </td>
                          <td scope="col" className="d-flex gap-3 ">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <button
                                as="link"
                                onClick={() => {
                                  deleteAppointment(appointment._id);
                                }}
                                className="btn btn-danger"
                                style={{
                                  backgroundColor: "#FF7F7F",
                                  color: "white",
                                  padding: "0.5rem",
                                  borderRadius: "1rem",
                                }}
                              >
                                Remove
                              </button>
                            </div>
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
