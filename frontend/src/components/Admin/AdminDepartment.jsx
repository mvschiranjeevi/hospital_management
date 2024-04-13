import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../assets/human6.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "../Shared/Loader";
import AdminSidebar from "./AdminSidebar";

function AdminDepartment() {
    const [departments, setDepartments] = useState([]);
    const [nurses, setNurses] = useState([])

    const userString = localStorage.getItem("user");


    const [deptName, setDeptName] = useState("");
    const [deptDesc, setDeptDesc] = useState("");
    const [deptHead, setDeptHead] = useState("");
    const [deptStaff, setDeptStaff] = useState([]);

    useEffect(() => {
        const getNurses = async () => {
            await axios
                .get("http://localhost:4451/nurse/get-allNurses")
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
    const fetchData = async () => {
        try {
            const response = await axios.get(
                "http://localhost:4451/admin/get-department"
            );
            console.log(response.data)
            setDepartments(response.data);
        } catch (error) {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: "Error Fetching Data!",
            });
        }
    };

    useEffect(() => {
        fetchData();

    }, []);

    if (!departments) {
        return <Loader />;
    }

    const handleAddDepartment = async (e) => {
        e.preventDefault();

        await axios
            .post("http://localhost:4451/admin/add-department", {
                name: deptName,
                description: deptDesc,
                head: deptHead,
                staff: deptStaff
            })
            .then((res) => {
                console.log(res.data.message)

                if (res.data.message === "Success") {
                    console.log('passing-1')
                    Swal.fire({
                        title: "Success",
                        icon: "success",
                        text: "Department Added Successfully!",
                    });
                }
            })
            .catch((e) => {
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: "Error Adding Department!",
                });
            });
    };

    const [isCreate, setIsCreate] = useState(false);

    const editPatient = async (id) => {
        await axios
            .put(`http://localhost:4451/doctor/update-doctor/${id}`, {})
            .then((res) => {
                Swal.fire({
                    title: "Success",
                    icon: "success",
                    text: "Doctor Updated Successfully!",
                });
            })
            .catch((err) => {
                Swal.fire({
                    title: "Error",
                    icon: "warning",
                    text: "Could not update Doctor!",
                });
            });
    };

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
                    .delete(`http://localhost:4451/admin/delete-department/${id}`)
                    .then((res) => {
                        Swal.fire({
                            title: "Success",
                            icon: "success",
                            text: "Department Deleted Successfully!",
                        });
                        window.location.reload();
                    })
                    .catch((err) => {
                        Swal.fire({
                            title: "Error",
                            icon: "error",
                            text: "Error Deleting Department!",
                        });
                    });
            }
            // If result.isConfirmed is false, user clicked "Cancel"
        });
    };

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
                    <p className="font-semibold text-3xl">Departments</p>
                    <div className="w-full">
                        <div className="relative overflow-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            #
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Department Name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Description
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Department Head
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Department Staff
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {departments &&
                                        departments.map((item, index) => (
                                            <tr key={item._id} className="text-black">
                                                <td scope="col" className="px-6 py-3">
                                                    {index + 1}
                                                </td>
                                                <td scope="col" className="px-6 py-3">
                                                    {item.name}
                                                </td>
                                                <td scope="col" className="px-6 py-3">
                                                    {item.description}
                                                </td>
                                                <td scope="col" className="px-6 py-3">
                                                    {item.head}
                                                </td>
                                                <td scope="col" className="px-6 py-3">
                                                    {item.staff}
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
                                <p className="">Enter Department Name:</p>
                                <input
                                    onChange={(e) => setDeptName(e.target.value)}
                                    className="flex h-10  w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                    type="text"
                                    placeholder="Name"
                                ></input>
                            </div>

                            <div className="flex flex-col w-[40%] items-center ">
                                <p className="">Enter Department Description:</p>
                                <textarea
                                    onChange={(e) => setDeptDesc(e.target.value)}
                                    className="flex h-10  w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                    type="text"
                                    placeholder="Description"
                                ></textarea>
                            </div>
                            <div className="flex flex-col w-[40%] items-center ">
                                <p className="">Enter Department Head</p>
                                <input
                                    onChange={(e) => setDeptHead(e.target.value)}
                                    className="flex h-10  w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                    type="text"
                                    placeholder="Specialization"
                                ></input>
                            </div>
                            <div className="flex flex-col w-[40%] items-center ">
                                <p className="">Enter Department staff</p>
                                <select
                                    id="doctors"
                                    onChange={(e) => setDeptStaff([e.target.value])}
                                    className="flex h-10 w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {nurses.map((value, index) => {
                                        return <option value={value.name}>{value.name}</option>;
                                    })}
                                </select>
                            </div>

                            <button
                                onClick={handleAddDepartment}
                                className=" w-[35%] bg-black text-white rounded-full text-md font-medium p-2 cursor-pointer hover:scale-110 duration-200 active:scale-90"
                            >
                                Add Department
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

export default AdminDepartment;
