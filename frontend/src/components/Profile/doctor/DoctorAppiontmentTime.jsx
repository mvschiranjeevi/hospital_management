import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { MdAddCircleOutline, MdSend, MdEdit, MdDelete } from "react-icons/md";
import styled from "styled-components";

const Container = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  margin: 20px auto;
  margin-bottom: 5rem;
`;

const Header = styled.h2`
  color: #333;
  //   text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  gap: 5rem;
`;

const InputContainer = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  background: #374151;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #0056b3;
  }

  svg {
    margin-right: 5px;
  }
`;

const AppointmentList = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;

const AppointmentItem = styled.div`
  background: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #374151;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  span {
    margin-right: 10px;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 4px; // Ensures there's a little space between the input and the error message
`;

const AppointmentConfig = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [fee, setFee] = useState("");
  const [errors, setErrors] = useState({});

  const handleDeleteAppointment = async (appointmentId, isNew = false) => {
    // If the appointment is locally added and not saved yet, simply remove it from state
    if (isNew) {
      setAppointments((prevAppointments) =>
        prevAppointments.filter(
          (appointment) =>
            !(appointment.id === appointmentId && appointment.isNew)
        )
      );
      return;
    }

    // For saved appointments, call the backend to delete
    try {
      const response = await axios.delete(
        `http://18.117.148.157:4451/appointment/delete-appointment/${appointmentId}`
      );
      if (response.status === 200 || response.status === 204) {
        // Assuming 200 OK or 204 No Content for successful deletion
        Swal.fire("Deleted!", "Your appointment has been deleted.", "success");
        // Remove the appointment from local state
        fetchAppointments();
        setAppointments((prevAppointments) =>
          prevAppointments.filter(
            (appointment) => appointment.id !== appointmentId
          )
        );
      } else {
        Swal.fire("Error", "Failed to delete appointment", "error");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.message || "Failed to delete appointment",
        "error"
      );
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `http://18.117.148.157:4451/appointment/get-appointment-time/${doctorId}`
      );
      if (response.status === 200 && response.data.appointments) {
        setAppointments(response.data.appointments);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.message || "Failed to fetch appointments",
        "error"
      );
    }
  };

  // Use fetchAppointments inside useEffect
  useEffect(() => {
    fetchAppointments();
  }, [doctorId]);

  const getCurrentLocalDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  const validateAppointment = () => {
    let tempErrors = {};
    const currentDate = getCurrentLocalDate();
    const inputDate = new Date(date + "T00:00:00"); // Ensuring the input date is treated as local time zone

    // Date Validation
    if (!date) {
      tempErrors.date = "Date is required";
    } else if (inputDate < currentDate) {
      tempErrors.date = "Date cannot be in the past";
    }

    // Time Validation (only if the date is today)
    if (!time) {
      tempErrors.time = "Time is required";
    } else if (
      inputDate.toISOString().slice(0, 10) ===
      currentDate.toISOString().slice(0, 10)
    ) {
      const currentTime = new Date();
      const inputDateTime = new Date(date + "T" + time); // Combining date and time as local
      if (inputDateTime <= currentTime) {
        tempErrors.time = "Time cannot be in the past";
      }
    }

    // Fee Validation
    if (!fee) tempErrors.fee = "Fee is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleAddAppointment = () => {
    if (validateAppointment()) {
      const newAppointment = {
        date,
        time,
        fee: parseFloat(fee),
        isNew: true, // Flag indicating this appointment is newly added and not saved yet
      };
      setAppointments([...appointments, newAppointment]);
      // Reset fields
      setDate("");
      setTime("");
      setFee("");
    } else {
      Swal.fire("Error", "Please fill in all the fields.", "error");
    }
  };

  const handleSubmit = async () => {
    console.log(appointments);
    const newAppointments = appointments.filter(
      (appointment) => appointment.isNew
    );
    if (!newAppointments.length) {
      Swal.fire("Error", "No new appointments to submit.", "error");
      return;
    }

    // Format the data for submission
    const formattedAppointments = newAppointments.map(
      ({ date, time, fee }) => ({
        doctor: doctorId,
        date,
        time,
        fee,
      })
    );

    try {
      const response = await axios.post(
        "http://18.117.148.157:4451/appointment/add-appointment-time",
        {
          appointments: formattedAppointments,
        }
      );

      if (response.status === 200) {
        console.log("hhhoihoh");

        Swal.fire(
          "Success",
          "New appointment times added successfully",
          "success"
        );
        fetchAppointments();
      } else {
        console.log("12121");
        Swal.fire("Error", "Failed to add new appointment times", "error");
      }
    } catch (error) {
      console.log(error);

      Swal.fire(
        "Error",
        error.response?.data?.error || "Failed to add new appointment times",
        "error"
      );
    }
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

  // Function to format time in 12-hour format with AM/PM
  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(":");
    const hours = parseInt(hour, 10);
    const suffix = hours >= 12 ? "PM" : "AM";
    const formattedHour = ((hours + 11) % 12) + 1;
    return `${formattedHour}:${minute} ${suffix}`;
  };

  // Combine formatDate and formatTime for full dateTime string
  const formatDateTime = (date, time) => {
    return `${formatDate(date)} at ${formatTime(time)}`;
  };

  return (
    <Container>
      <Header>Configure Doctor's Appointments</Header>
      <InputGroup>
        <InputContainer>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Date"
          />
          <ErrorMessage>{errors.date}</ErrorMessage>
        </InputContainer>
        <InputContainer>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="Time"
          />
          <ErrorMessage>{errors.time}</ErrorMessage>
        </InputContainer>

        <InputContainer>
          <Input
            type="number"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            placeholder="Fee in $"
          />
          <ErrorMessage>{errors.fee}</ErrorMessage>
        </InputContainer>

        <Button onClick={handleAddAppointment} style={{ height: "3rem" }}>
          <MdAddCircleOutline /> Add
        </Button>
      </InputGroup>
      <AppointmentList>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                #
              </th>
              <th scope="col" className="px-6 py-3">
                Appointment Date
              </th>
              <th scope="col" className="px-6 py-3">
                Appointment Time
              </th>
              <th scope="col" className="px-6 py-3">
                Fee
              </th>
              <th scope="col" className="px-6 py-3">
                Delete
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
                    <td>{formatDate(item.date)}</td>
                  </td>

                  <td scope="col" className="px-6 py-3">
                    <td>{formatTime(item.time)}</td>
                  </td>
                  <td scope="col" className="px-6 py-3">
                    ${item.fee.toFixed(2)}
                  </td>

                  <td scope="col" className="px-6 py-3">
                    <button
                      onClick={() =>
                        handleDeleteAppointment(item._id, item.isNew)
                      }
                    >
                      <MdDelete size={"1.2rem"} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-6 py-3" colSpan="5">
                  <p>Please select the appiontments above to view here !!</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </AppointmentList>
      <Button onClick={handleSubmit}>
        <MdSend /> Submit All Appointments
      </Button>
    </Container>
  );
};

export default AppointmentConfig;
