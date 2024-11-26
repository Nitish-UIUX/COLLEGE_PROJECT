import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, Divider, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import moment from "moment";

const Appointments = () => {
  const theme = useTheme();
  const [appointments, setAppointments] = useState([]);
  const [hospitalappoimtments, setHospitalappoimtments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const apiUrl = "http://localhost:5000/api/auth";

  // ----------------------------------------------------all appointments ---------------------------------------------
  const fetchProfileData = async () => {
    const token = localStorage.getItem("data");
    if (token) {
      try {
        const res = await axios.get(`${apiUrl}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(res.data.doctor_appointments);
        setHospitalappoimtments(res.data.hospital_treatment_bookings);
        console.log(res.data.hospital_treatment_bookings);
      } catch (err) {
        console.error("API Error:", err);
      }
    }
  };

  // ----------------------------------------------------all doctors ---------------------------------------------
  const fetchDoctorsData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchDoctorsData();
  }, []);

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find((doc) => doc.id === doctorId);
    return doctor ? doctor.name : "Unknown Doctor";
  };

  // --------------------------------------sort appointments based on date and time -----------------------------------
  const sortedAppointments = useMemo(() => {
    const currentAndFutureAppointments = appointments
      .filter((appointment) =>
        moment(
          `${appointment.slotDate} ${appointment.timeSlot}`,
          "ddd-MMM-DD-YYYY hh:mm A"
        ).isSameOrAfter(moment())
      )
      .sort((a, b) => moment(a.slotDate).diff(moment(b.slotDate)));


    const pastAppointments = appointments
      .filter((appointment) =>
        moment(
          `${appointment.slotDate} ${appointment.timeSlot}`,
          "ddd-MMM-DD-YYYY hh:mm A"
        ).isBefore(moment())
      )
      .sort((a, b) => moment(b.slotDate).diff(moment(a.slotDate)));

    return [...currentAndFutureAppointments, ...pastAppointments];
  }, [appointments]);


  // --------------------------------------render status button -----------------------------------------------------

  const renderStatusButton = (appointment) => {
    const appointmentDateTime = moment(
      `${appointment.slotDate} ${appointment.timeSlot}`,
      "ddd-MMM-DD-YYYY hh:mm A"
    );
    if (appointmentDateTime.isBefore(moment())) {
      return (
        <Button variant="contained" sx={{ width: "100%" }} color="success">
          Visited
        </Button>
      );
    } else {
      return (
        <Button variant="outlined" sx={{ width: "100%" }} color="info">
          Confirm
        </Button>
      );
    }
  };

  // --------------------------------------table columns and rows --------------------------------------------------
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "doctorName",
      headerName: "Doctor's Name",
      flex: 1,
      minWidth: 150,
    },
    { field: "visitType", headerName: "Visit Type", flex: 1, minWidth: 150 },
    { field: "dateTime", headerName: "Date/Time", flex: 1, minWidth: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => params.value, // Render the button
    },
  ];

  const rows = sortedAppointments.map((appointment) => ({
    id: appointment.id,
    doctorName: getDoctorName(appointment.doctor_id),
    visitType: appointment.reasonForAppointment,
    dateTime: `${appointment.slotDate} / ${appointment.timeSlot}`,
    status: renderStatusButton(appointment), // Add status button based on appointment time
  }));

  // ----------------------------------------end of table columns and rows ---------------------------------------------

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        All Appointments
      </Typography>
      <Divider
        sx={{ borderBottom: "2px solid #2cb2b5" }}
      />
      <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor:
                theme.palette.mode === "dark" ? "#000" : "#f4f4f4",
              // color: '#fff',
              fontSize: "1rem",
              fontWeight: "bold",
              boxShadow: "0px 0px 2px 0px rgba(0,0,0,0.2)",
            },
            "& .MuiDataGrid-cell": {
              fontSize: 14,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
            "& .MuiDataGrid-row": {
              fontSize: 14,
            },
          }}
        />
      </div>
    </Box>
  );
};

export default Appointments;
