import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../assets/human6.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import AdminSidebar from "./AdminSidebar";

function AdminNurse() {
  const [nurses, setNurses] = useState([]);

  const [nurname, setNurName] = useState("");
  const [nurdept, setNurDept] = useState("");
  const [nuremail, setNurEmail] = useState("");

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4451/admin/get-department"
        );
        setDepartments(response.data);
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

  useEffect(() => {
    const getNurses = async () => {
      const data = await axios
        .get("http://localhost:4451/nurse/get-nurses")
        .then((response) => {
          setNurses(response.data);
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
          });
        });
    };

    getNurses();
  }, []);

  const handleAddNurse = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:4451/nurse/add-nurse", {
        name: nurname,
        email: nuremail,
        department: nurdept,
      })
      .then((res) => {
        if (res.data.message === "Success") {
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Nurse Added Successfully!",
          });
        }
      })
      .catch((e) => {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: e,
        });
      });
  };

  const deleteNurse = async (id) => {
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
          .delete(`http://localhost:4451/admin/delete-nurse/${id}`)
          .then((res) => {
            Swal.fire({
              title: "Success",
              icon: "success",
              text: "Nurse Deleted Successfully!",
            });
            window.location.reload();
          })
          .catch((err) => {
            Swal.fire({
              title: "Error",
              icon: "error",
              text: "Error Deleting Nurse!",
            });
          });
      }
      // If result.isConfirmed is false, user clicked "Cancel"
    });
  };

  const [isCreate, setIsCreate] = useState(false);

  const handleCreate = () => {
    setIsCreate(!isCreate);
  };

  const handleGoBack = () => {
    setIsCreate(!isCreate);
  };

  return (
    <section className="bg-slate-300 flex justify-center items-center">
      <div className="h-[80%] w-[80%] bg-white shadow-xl p-2 flex">
        <AdminSidebar userName={"Admin"} profiePic={profiePic} />
        <div className=" w-[70%] ms-24 p-4 flex flex-col justify-start gap-5 ">
          <p className="font-semibold text-3xl">Nurses</p>
          <div className="w-full">
            <div className="relative overflow-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      S No
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Nurse Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Ward
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {nurses &&
                    nurses.map((item, index) => (
                      <tr key={item._id} className="text-black">
                        <td scope="col" className="px-6 py-3">
                          {index + 1}
                        </td>
                        <td scope="col" className="px-6 py-3">
                          {item.name}
                        </td>
                        <td scope="col" className="px-6 py-3">
                          {item.ward}
                        </td>
                        <td scope="col" className="px-6 py-3">
                          {item.department?.name}
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
                                deleteNurse(item._id);
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
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <button
            onClick={handleCreate}
            className="bg-slate-900 p-2 w-[10%] rounded-full hover:scale-110 duration-200 active:scale-90  text-white"
          >
            Create
          </button>
        </div>
        {isCreate && (
          <div className="absolute h-[78%] w-[79%] z-50 bg-white">
            <form className="flex flex-col w-full h-full justify-center gap-4 items-center">
              <div className="flex flex-col w-[40%] items-center ">
                <p className="">Enter Nurse Name:</p>
                <input
                  onChange={(e) => setNurName(e.target.value)}
                  className="flex h-10  w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  type="text"
                  placeholder="Nurse Name"
                ></input>
              </div>
              <div className="flex flex-col w-[40%] items-center ">
                <p className="">Enter Nurse Email:</p>
                <input
                  onChange={(e) => setNurEmail(e.target.value)}
                  className="flex h-10  w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  type="text"
                  placeholder="Email"
                ></input>
              </div>
              <div className="flex flex-col w-[40%] items-center ">
                <p className="">Enter Nurse Department:</p>
                <select
                  onChange={(e) => setNurDept(e.target.value)}
                  className="flex h-10  w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  id="departmentSelect"
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddNurse}
                className=" w-[35%] bg-black text-white rounded-full text-md font-medium p-2 cursor-pointer hover:scale-110 duration-200 active:scale-90"
              >
                Add Nurse
              </button>

              <button
                onClick={handleGoBack}
                className="bg-black text-white rounded-full text-md font-medium p-2 cursor-pointer hover:scale-105 duration-200 active:scale-90"
              >
                {"<- Go back"}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminNurse;
