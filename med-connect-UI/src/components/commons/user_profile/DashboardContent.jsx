import React, { useState, useEffect, useMemo } from "react";
import { styled } from "@mui/system";
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditIcon from "@mui/icons-material/Edit";
import MessageIcon from "@mui/icons-material/Message";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";

const CustomCard = styled(Card)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  overflow: "hidden",
});

const CardHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  borderBottom: "3px solid #2cb2b5",
  paddingBottom: "8px",
});

const BadgeStyled = styled(Badge)(({ theme }) => ({
  ".MuiBadge-badge": {
    backgroundColor: "#2cb2b5",
    color: "#fff",
  },
}));

const InfoText = styled(Typography)({
  fontSize: "14px",
  marginBottom: "4px",
});

const Heading = styled(Typography)({
  fontSize: "20px",
});

const DashboardContent = () => {
  const theme = useTheme();
  const [profileData, setProfileData] = useState({});
  const [generalInfo, setGeneralInfo] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const apiUrl = "http://localhost:5000/api/auth";

  const messages = useMemo(
    () => [
      {
        from: "Dr. Nithya",
        text: "Lorem Ipsum is simply dummy text.",
        date: "Nov 05, 2017",
      },
      {
        from: "Dr. Sudhakaran",
        text: "Lorem Ipsum is simply dummy text.",
        date: "Nov 02, 2017",
      },
      {
        from: "Dr. Albert",
        text: "Lorem Ipsum is simply dummy text.",
        date: "Nov 01, 2017",
      },
    ],
    []
  );

  // const fetchProfileData = async () => {
  //   const token = localStorage.getItem("data");
  //   if (token) {
  //     try {
  //       const res = await axios.get(`${apiUrl}/profile`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       const currentAppointments = res.data.doctor_appointments.filter(
  //         (appointment) => {
  //           const appointmentDate = moment(appointment.slotDate);
  //           const oneDayAfter = moment(appointment.slotDate).add(1, "days");
  //           return oneDayAfter.isAfter(moment());
  //         }
  //       );

  //       setProfileData(res.data);
  //       setGeneralInfo(res.data.user_details);
  //       setAppointments(currentAppointments);
  //     } catch (err) {
  //       console.error("API Error:", err);
  //     }
  //   }
  // };


  const fetchProfileData = async () => {
    const token = localStorage.getItem("data");
    if (token) {
      try {
        const res = await axios.get(`${apiUrl}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log(res.data);
        const currentAppointments = res.data.doctor_appointments.filter(
          (appointment) => {
            const appointmentDateTime = moment(
              `${appointment.slotDate} ${appointment.timeSlot}`,
              "ddd-MMM-DD-YYYY hh:mm A"
            );
            return appointmentDateTime.isAfter(moment());
          }
        );
  
        setProfileData(res.data);
        setGeneralInfo(res.data.user_details);
        setAppointments(currentAppointments);
      } catch (err) {
        console.error("API Error:", err);
      }
    }
  };
  

  
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

  const sortedAppointments = useMemo(() => {
    return appointments.sort((a, b) =>
      moment(a.slotDate).diff(moment(b.slotDate))
    );
  }, [appointments]);

  const handleRemoveExpiredAppointments = async () => {
    const token = localStorage.getItem("data");
    if (token) {
      const expiredAppointments = appointments.filter((appointment) => {
        const oneDayAfter = moment(appointment.slotDate).add(1, "days");
        return oneDayAfter.isBefore(moment());
      });

      for (const appointment of expiredAppointments) {
        await axios.delete(`${apiUrl}/appointments/${appointment.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      fetchProfileData();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleRemoveExpiredAppointments();
    }, 86400000); // 24 hours in milliseconds

    return () => clearInterval(interval);
  }, [appointments]);

  return (
    <Grid container spacing={3}>
        {/* ----------------------------------------Clinical Information section starts here------------------------------------ */}
      <Grid item xs={12} display="flex" alignItems="center">
        <Typography variant="h4" style={{ marginLeft: "10px" }}>
          Clinical Information
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ borderBottom: "2px solid #2cb2b5" }} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CustomCard>
          <CardHeader>
            <Box display="flex" alignItems="center">
              <InfoOutlinedIcon color="primary" sx={{ ml: 1 }} />
              <Heading variant="h6" ml={1}>
                General Information
              </Heading>
            </Box>
            <EditIcon
              style={{
                color: "#fff",
                backgroundColor: "#3AA6B9",
                borderRadius: "50%",
                padding: "4px",
                marginLeft: "4px",
              }}
            />
          </CardHeader>
          <CardContent>
            <Box
              display="flex"
              flexDirection={"column"}
              sx={{ marginBottom: "14px" }}
            >
              <InfoText>Name: {generalInfo.name}</InfoText>
              <InfoText>Email: {generalInfo.email}</InfoText>
              <InfoText>Age: {generalInfo.age}</InfoText>
              <InfoText>Gender: {generalInfo.gender}</InfoText>
              <InfoText>Height: {generalInfo.height}</InfoText>
              <InfoText>Weight: {generalInfo.weight}</InfoText>
              <InfoText>Phone: {generalInfo.phone}</InfoText>
              <InfoText>
                Address: {generalInfo.address_line1}, {generalInfo.address_line2},{" "}
                {generalInfo.city}, {generalInfo.state}, {generalInfo.zip}
              </InfoText>
            </Box>
          </CardContent>
        </CustomCard>
      </Grid>
      {/* --------------------------------------------------Appointment section starts here-------------------------------------------------- */}
      <Grid item xs={12} sm={12} md={9}>
        <CustomCard>
          <CardHeader>
            <Box display="flex" alignItems="center">
              <CalendarTodayIcon color="primary" sx={{ ml: 1 }} />
              <Heading variant="h6" ml={1} mr={2}>
                Appointments
              </Heading>
              <BadgeStyled badgeContent={appointments.length} />
            </Box>
          </CardHeader>
          <CardContent>
            <TableContainer component={Paper}>
              <Table aria-label="appointments table">
                <TableHead
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#000" : "#2cb2b5",
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ fontSize: "14px", color: "#fff" }}>
                      ID#
                    </TableCell>
                    <TableCell sx={{ fontSize: "14px", color: "#fff" }}>
                      Doctor's Name
                    </TableCell>
                    <TableCell sx={{ fontSize: "14px", color: "#fff" }}>
                      Visit Type
                    </TableCell>
                    <TableCell sx={{ fontSize: "14px", color: "#fff" }}>
                      Date/Time
                    </TableCell>
                    <TableCell sx={{ fontSize: "14px", color: "#fff" }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No appointments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedAppointments.slice(0, 3).map((appointment) => (
                      <TableRow
                        key={appointment.id}
                        sx={{
                          backgroundColor: moment(appointment.slotDate).isBefore(moment())
                            ? theme.palette.mode === "dark" ? "#a9a9a9c9" : "#83e0b7a8"
                            : theme.palette.mode === "dark" ? "#000" : "#f5f5f5",
                        }}
                      >
                        <TableCell>{appointment.id}</TableCell>
                        <TableCell>{getDoctorName(appointment.doctor_id)}</TableCell>
                        <TableCell>{appointment.reasonForAppointment}</TableCell>
                        <TableCell>{`${appointment.slotDate} / ${appointment.timeSlot}`}</TableCell>
                        <TableCell>Confirmed</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
          {appointments.length > 1 && (
            <Box textAlign="center" my={1}>
              <Button
                variant="contained"
                color="info"
                component={Link}
                to="/userdashboard/appointments"
              >
                View All
              </Button>
            </Box>
          )}
        </CustomCard>
      </Grid>

      {/* --------------------------------------------------Message section starts here-------------------------------------------------- */}
      <Grid item xs={12} sm={12} md={12}>
        <CustomCard>
          <CardHeader>
            <Box display="flex" alignItems="center">
              <MessageIcon color="primary" sx={{ ml: 1 }} />
              <Heading variant="h6" ml={1} mr={2}>
                Messages
              </Heading>
              <BadgeStyled badgeContent={messages.length} />
            </Box>
          </CardHeader>
          <CardContent>
            <TableContainer component={Paper}>
              <Table aria-label="messages table">
                <TableHead
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#000" : "#2cb2b5",
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ fontSize: "14px", color: "#fff" }}>
                      From
                    </TableCell>
                    <TableCell sx={{ fontSize: "14px", color: "#fff" }}>
                      Date
                    </TableCell>
                    <TableCell sx={{ fontSize: "14px", color: "#fff" }}>
                      Message
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {messages.map((message, index) => (
                    <TableRow key={index}>
                      <TableCell>{message.from}</TableCell>
                      <TableCell>{message.date}</TableCell>
                      <TableCell>{message.text}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </CustomCard>
      </Grid>
    </Grid>
  );
};

export default DashboardContent;
