import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../../assets/human6.jpg";
import UserSidebar from "./UserSidebar";
import axios from "axios";
import Swal from "sweetalert2";

function UserMedication() {
  const userData = JSON.parse(localStorage.getItem("user"));

  const [insurances, setInsurances] = useState([]);
  const [company, setCompany] = useState("");
  const [type, setType] = useState("dental");
  const [validity, setValidity] = useState();
  const [outOfThePocket, setOutOfThePocket] = useState(0);
  const [coverage, setCoverage] = useState();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     console.log(userData.email)
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:4451/user/get-medications/${userData.email}`
  //       );

  //       const data = response.data;

  //       const medicationsArray = data.map(({ medications }) => medications);

  //       const detailsArray = medicationsArray.map((medications) =>
  //         medications.map(({ name, dosage, frequency }) => ({
  //           name,
  //           dosage,
  //           frequency,
  //         }))
  //       );

  //       setInsurances(detailsArray);
  //       console.log(insurances, detailsArray)
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const addInsurance = async () => {
    try {
      console.log("test");
      await axios
        .post(`http://localhost:4451/insurance/add-insurance/${userData._id}`, {
          patientId: userData._id,
          company: company,
          type: type,
          validity: validity,
          outOfThePocket: outOfThePocket,
          coverage: coverage,
        })
        .then(() => {
          getInsurance();
          setCompany("");
          setType("");
          setValidity("");
          setOutOfThePocket(0);
          setCoverage(0);
        });
      Swal.fire({
        title: "Success",
        icon: "success",
        confirmButtonText: "Ok",
        text: "Insurance Added Successfully!",
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        icon: "error",
        confirmButtonText: "Ok",
        text: "Error adding Insurance! Please Try Again!",
      });
    }
  };

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
  console.log(insurances)
  return (
    <section className="bg-slate-300 flex justify-center items-center">
      <div className="h-[80%] w-[80%] bg-white shadow-xl p-2 flex">
        <UserSidebar profiePic={profiePic} userName={userData.userName} />
        <div className=" w-[70%] ms-24 p-4 flex flex-col justify-start gap-5 ">
          <p className="font-semibold text-3xl">Insurance</p>
          <div className="w-full flex">
            <div className="flex flex-col w-[50%]  ">
              <p className="">Enter Insurance Company</p>
              <input
                onChange={(e) => setCompany(e.target.value)}
                className="flex h-10  w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                type="text"
                placeholder="Insurance Company"
                value={company}
              ></input>
            </div>
            <div className="flex flex-col w-[50%]  ml-2">
              <p className="">Enter Insurance Type</p>
              <select
                id="insurance-type"
                onChange={(e) => setType(e.target.value)}
                value={type}
                className="flex h-10 w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value={"dental"}>{"Dental"}</option>;
                <option value={"vision"}>{"Vision"}</option>;
                <option value={"health"}>{"Health"}</option>;
              </select>
            </div>
          </div>
          <div className="w-full flex">
            <div className="flex flex-col w-full  ">
              <p className="">Insurance Validity</p>
              <input
                onChange={(e) => setValidity(e.target.value)}
                value={validity}
                className="flex h-10  w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                type="date"
                placeholder="Validity"
              ></input>
            </div>
            <div className="flex flex-col w-full  ml-2">
              <p className="">Out of the pocket</p>
              <input
                onChange={(e) => setOutOfThePocket(e.target.value)}
                value={outOfThePocket}
                className="flex h-10  w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                type="number"
                placeholder="Out of the pocket"
              ></input>
            </div>
            <div className="flex flex-col w-full  ml-2">
              <p className="">Max Coverage</p>
              <input
                onChange={(e) => setCoverage(e.target.value)}
                value={coverage}
                className="flex h-10  w-[90%] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                type="number"
                placeholder="Max Coverage"
              ></input>
            </div>
          </div>
          <div className="flex w-full">
            <button
              // onClick={handleAddDepartment}
              className=" w-full bg-black text-white rounded-full text-md font-medium p-2 cursor-pointer hover:scale-110 duration-200 active:scale-90"
              onClick={() => addInsurance()}
            >
              Add Insurance
            </button>
          </div>
          <div className="w-full">
            {!insurances ? (
              <p>No Insurance</p>
            ) : (
              <div className="relative overflow-y-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      {/* <th scope="col" className="px-6 py-3">
                                                #
                                            </th> */}
                      <th scope="col" className="px-6 py-3">
                        Insurance Company
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Coverage Type
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Validity
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Out of the pocket
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Max coverage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {insurances?.map((insurance, index) => {
                      return (
                        <tr key={index}>
                          <td scope="col" className="px-6 py-3">
                            {insurance.company}
                          </td>
                          <td scope="col" className="px-6 py-3">
                            {insurance.type}
                          </td>
                          <td scope="col" className="px-6 py-3">
                            {insurance.validity}
                          </td>
                          <td scope="col" className="px-6 py-3">
                            {insurance.outOfThePocket}
                          </td>
                          <td scope="col" className="px-6 py-3">
                            {insurance.coverage}
                          </td>
                        </tr>
                      );
                    })}
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
