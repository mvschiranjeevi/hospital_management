import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../assets/human6.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import AdminSidebar from "./AdminSidebar";

function AdminPatient() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4451/admin/get-users"
        );
        setUsers(response.data);
      } catch (error) {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "Error Fetching Data!",
        });
      }
    };

    fetchData();
  }, []);

  const deletePatient = async (id) => {
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
          .delete(`http://localhost:4451/user/delete-patient/${id}`)
          .then((res) => {
            Swal.fire({
              title: "Success",
              icon: "success",
              text: "Patient Deleted Successfully!",
            });
            setUsers(users.filter((user) => user._id !== id));
          })
          .catch((err) => {
            Swal.fire({
              title: "Error",
              icon: "error",
              text: "Error Deleting Patient!",
            });
          });
      }
      // If result.isConfirmed is false, user clicked "Cancel"
    });
  };
  if (!users) {
    return <Loader />;
  }

  return (
    <section className="bg-slate-300 flex justify-center items-center">
      <div className="h-[80%] w-[80%] bg-white shadow-xl p-2 flex">
        <AdminSidebar userName={"Admin"} profiePic={profiePic} />
        <div className=" w-[70%] ms-24 p-4 flex flex-col justify-start gap-5 ">
          <p className="font-semibold text-3xl">Patient</p>
          <div className="w-full overflow-y-auto">
            <div className="relative overflow-auto shadow-md sm:rounded-lg">
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
                      Patient Email
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users &&
                    users.map((item, index) => (
                      <tr key={item._id} className="text-black">
                        <td scope="col" className="px-3 py-4">
                          {index + 1}
                        </td>
                        <td scope="col" className="px-6 py-3">
                          {item.userName}
                        </td>
                        <td scope="col" className="px-6 py-3">
                          {item.email}
                        </td>
                        <td scope="col" className="px-6 py-3">
                          {item.role}
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
                                deletePatient(item._id);
                              }}
                              className="btn btn-danger"
                              style={{
                                backgroundColor: "red",
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
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminPatient;
