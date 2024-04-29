import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../assets/human6.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import AdminSidebar from "./AdminSidebar";

function AdminQuery() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4451/admin/get-contacts"
        );
        setContacts(response.data);
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

  if (!contacts) {
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
                      Message
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Phone No
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length === 0 ? (
                    <div style={{ padding: "0.5rem" }}>
                      <p>No Queries available !!</p>
                    </div>
                  ) : (
                    contacts &&
                    contacts.map((item, index) => (
                      <tr key={item._id} className="text-black">
                        <td scope="col" className="px-3 py-4">
                          {index + 1}
                        </td>
                        <td scope="col" className="px-6 py-3">
                          {item.name}
                        </td>
                        <td scope="col" className="px-6 py-3">
                          {item.email}
                        </td>
                        <td scope="col" className="px-6 py-3">
                          {item.message}
                        </td>
                        <td scope="col" className="px-6 py-3">
                          {item.phone}
                        </td>
                        <td scope="col" className="d-flex gap-3 ">
                          <button
                            onClick={() => {
                              deletePatient(item._id);
                            }}
                            className="btn btn-danger"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
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

export default AdminQuery;
