import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../../assets/human6.jpg";
import UserSidebar from "./UserSidebar";
import axios from "axios";

function UserMedication() {
    const userData = JSON.parse(localStorage.getItem("user"));




    const [appointments, setAppointments] = useState([]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:4451/appointment/get-appointments/${userData._id}`
                );

                const data = response.data;
                setAppointments(data)
                comsole.log(data, "data")

                // const medicationsArray = data.map(({ medications }) => medications);

                // const detailsArray = medicationsArray.map((medications) =>
                //     medications.map(({ name, dosage, frequency }) => ({
                //         name,
                //         dosage,
                //         frequency,
                //     }))
                // );

                // setMedicines(detailsArray);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        console.log(appointments, "appointments")
    }, [appointments])

    return (
        <section className="bg-slate-300 flex justify-center items-center">
            <div className="h-[80%] w-[80%] bg-white shadow-xl p-2 flex">
                <UserSidebar profiePic={profiePic} userName={userData.userName} />
                <div className=" w-[70%] ms-24 p-4 flex flex-col justify-start gap-5 ">
                    <p className="font-semibold text-3xl">Billing</p>
                    {/* <select
                        id="doctors"
                        onChange={(e) => setDeptStaff([e.target.value])}
                        className="flex h-10 w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {nurses.map((value, index) => {
                            return <option value={value.name}>{value.name}</option>;
                        })}
                    </select> */}
                    <div className="w-full">
                        {!appointments ? (
                            <p>No Previous Appointments</p>
                        ) : (
                            <div className="relative overflow-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                #
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Doctor
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Appointment Date & Time
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Price
                                            </th>
                                            {/* <th scope="col" className="px-6 py-3">
                                                Insurance
                                            </th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map((appointment, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td scope="col" className="px-6 py-3">
                                                        {index + 1}
                                                    </td>
                                                    <td scope="col" className="px-6 py-3">
                                                        {appointment.doctorName}
                                                    </td>
                                                    <td scope="col" className="px-6 py-3">
                                                        {appointment.timeDetails.date}, {appointment.timeDetails.time}
                                                    </td>
                                                    <td scope="col" className="px-6 py-3">
                                                        {appointment.timeDetails.fee}
                                                    </td>
                                                    {/* <td scope="col" className="px-6 py-3">
                                                        <div className="flex">
                                                            <select
                                                                id="insurance-type"
                                                                // onChange={(e) => setDeptStaff([e.target.value])}
                                                                className="flex h-10 w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >

                                                                <option value={'dental'}>{'Dental'}</option>;
                                                                <option value={'vision'}>{'Vision'}</option>;
                                                                <option value={'health'}>{'Health'}</option>;

                                                            </select>
                                                            <button

                                                                className=" ml-2 w-full bg-black text-white rounded-full text-md font-medium p-2 cursor-pointer hover:scale-110 duration-200 active:scale-90"
                                                            >
                                                                Apply
                                                            </button>
                                                        </div>
                                                    </td> */}

                                                </tr>
                                            );
                                        })} *
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default UserMedication;
