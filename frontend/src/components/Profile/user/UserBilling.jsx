import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../../assets/human6.jpg";
import UserSidebar from "./UserSidebar";
import axios from "axios";

function UserMedication() {
    const userData = JSON.parse(localStorage.getItem("user"));

    const [insurances, setInsurances] = useState();

    const [appointments, setAppointments] = useState([]);
    const [selectedType, setSelectedType] = useState("dental");

    const getUpdatedBilling = (insuranceType, appointmentId) => {
        let tempCoverage = 0;
        let tempOutOfThePocket;
        insurances.map((insurance) => {
            // const detailsArray = medicationsArray.map((medications) =>
            //     medications.map(({ name, dosage, frequency }) => ({
            //         name,
            //         dosage,
            //         frequency,
            //     }))
            // );

            if (insurance.type === insuranceType) {
                tempCoverage = insurance.coverage;
                tempOutOfThePocket = insurance.outOfThePocket;
            }
        });
        const updatedAppointments = appointments.map((appointment) => {
            if (appointment._id === appointmentId) {
                console.log("hi");
                let newPrice = appointment.timeDetails.fee; // Start with current price

                if (
                    appointment.timeDetails.fee > tempOutOfThePocket &&
                    appointment.timeDetails.fee < tempCoverage
                ) {
                    newPrice = tempOutOfThePocket;
                } else if (appointment.timeDetails.fee > tempCoverage) {
                    newPrice = tempCoverage - appointment.timeDetails.fee;
                }

                // Return a new object with the updated price, or the original if no change
                return {
                    ...appointment,
                    timeDetails: { ...appointment.timeDetails, fee: newPrice },
                };
            }
            return appointment; // Return the unchanged appointment if not the target
        });

        setAppointments(updatedAppointments);
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:4451/appointment/get-appointments/${userData._id}`
            );

            const data = response.data;
            setAppointments(data);
            comsole.log(data, "data");
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [selectedType]);

    useEffect(() => {
        console.log(appointments, "appointments");
    }, [appointments]);

    function getMaxCoverageByType(policies) {
        const maxCoverage = {};
        const typesOfInterest = ["health", "vision", "dental"];

        policies.forEach((policy) => {
            const { type, coverage } = policy;
            if (typesOfInterest.includes(type)) {
                // Check if this type has not been added yet or if the current policy has higher coverage
                if (!maxCoverage[type] || coverage > maxCoverage[type].coverage) {
                    maxCoverage[type] = policy;
                }
            }
        });

        // Convert the maxCoverage object's values to an array
        return Object.values(maxCoverage);
    }

    const getInsurance = async () => {
        try {
            const response = await axios.get(
                `http://localhost:4451/insurance/get-insurance/${userData._id}`
            );

            const data = response.data;
            console.log(data, "insurances");
            let filteredInsurances = getMaxCoverageByType(data);
            console.log(filteredInsurances, "filtered insurances");
            setInsurances(filteredInsurances);
        } catch (err) {
            Swal.fire({
                title: "Error",
                icon: "error",
                confirmButtonText: "Ok",
                text: "Error adding Insurance! Please Try Again!",
            });
        }
    };

    useEffect(() => {
        getInsurance();
    }, []);

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
                        {appointments.message === "No Appointments Booked!" ? (
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
                                            <th scope="col" className="px-6 py-3">
                                                Insurance
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments?.map((appointment, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td scope="col" className="px-6 py-3">
                                                        {index + 1}
                                                    </td>
                                                    <td scope="col" className="px-6 py-3">
                                                        {appointment.doctorName}
                                                    </td>
                                                    <td scope="col" className="px-6 py-3">
                                                        {appointment.timeDetails.date},{" "}
                                                        {appointment.timeDetails.time}
                                                    </td>
                                                    <td scope="col" className="px-6 py-3">
                                                        {appointment.timeDetails.fee}
                                                    </td>

                                                    <td scope="col" className="px-6 py-3">
                                                        <div className="flex">
                                                            <select
                                                                id="insurance-type"
                                                                defaultValue={"dental"}
                                                                onChange={(e) => {
                                                                    setSelectedType(e.target.value);
                                                                }}
                                                                className="flex h-10 w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                <option value={"dental"}>{"Dental"}</option>;
                                                                <option value={"vision"}>{"Vision"}</option>;
                                                                <option value={"health"}>{"Health"}</option>;
                                                            </select>
                                                            <button
                                                                className=" ml-2 w-full bg-black text-white rounded-full text-md font-medium p-2 cursor-pointer hover:scale-110 duration-200 active:scale-90"
                                                                onClick={() => {
                                                                    getUpdatedBilling(
                                                                        selectedType,
                                                                        appointment._id
                                                                    );
                                                                }}
                                                            >
                                                                Apply
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}{" "}
                                        *
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
