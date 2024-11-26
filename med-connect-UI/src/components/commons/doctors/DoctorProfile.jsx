import React, { useState, useEffect , useRef} from "react";
import jsPDF from "jspdf";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import {
  Box,
  Grid,
  Typography,
  Button,
  Divider,
  IconButton,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import PersonPinCircleOutlinedIcon from "@mui/icons-material/PersonPinCircleOutlined";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import { useParams } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CallIcon from '@mui/icons-material/Call';

const genders = [
  {
    value: "male",
    label: "Male",
  },
  {
    value: "female",
    label: "Female",
  },
  {
    value: "other",
    label: "Other",
  },
];

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [visibleDates, setVisibleDates] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    gender: "",
    pastTreatmentFiles: [],
    reasonForAppointment: "",
  });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { doctor_id } = useParams();
  const navigate = useNavigate();
  const api_url = "http://localhost:5000/api";

  useEffect(() => {
    //scroll to top
    window.scrollTo(0, 0);
  }, []);


  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(`${api_url}/doctors/${doctor_id}`);
        const doctorData = response.data;

        // console.log(doctorData);
        const slotsData = generateSlots();
        setDoctor(doctorData);
        setSlots(slotsData);
        setSelectedDate(slotsData[0].date);
        setVisibleDates(slotsData.map((slot) => slot.date));
      } catch (error) {
        // console.error("Error fetching doctor details:", error);
      }
    };

    fetchDoctorDetails();
  }, [doctor_id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "short", day: "numeric", month: "short" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null); // reset selected slot when date changes
    setShowForm(false); // hide the form when a new date is selected
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleNext = () => {
    if (startIndex < visibleDates.length - 5) {
      setStartIndex(startIndex + 1);
    }
  };

  const generateSlots = () => {
    const slotsData = [];
    const currentDate = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      const dateString = date.toDateString();
      slotsData.push({
        date: dateString,
        times: [
          "10:00 AM",
          "10:30 AM",
          "11:00 AM",
          "11:30 AM",
          "12:00 PM",
          "12:30 PM",
          "1:00 PM",
          "3:00 PM",
          "3:30 PM",
          "4:00 PM",
          "4:30 PM",
          "5:00 PM",
          "5:30 PM",
          "6:00 PM",
        ],
      });
    }

    return slotsData;
  };

  const renderStars = (rating) => {
    const stars = [];
    const integerPart = Math.floor(rating);
    const decimalPart = rating - integerPart;

    for (let i = 1; i <= 5; i++) {
      if (i <= integerPart) {
        stars.push(<StarIcon key={i} sx={{ color: "#FFA500" }} />);
      } else if (i === integerPart + 1 && decimalPart >= 0.5) {
        stars.push(<StarHalfIcon key={i} sx={{ color: "#FFA500" }} />);
      } else {
        stars.push(<StarBorderIcon key={i} sx={{ color: "#FFA500" }} />);
      }
    }

    return stars;
  };

  const handleSlotClick = (time) => {
    if (selectedSlot === time) {
      setSelectedSlot(null); // Deselect if the same slot is clicked again
      // setShowForm(false); // Hide form if the slot is deselected
    } else {
      setSelectedSlot(time); // Select the clicked slot
      // setShowForm(false); // Hide form if a new slot is selected
    }
  };

  const handleBookNow = () => {
    setShowForm(true); // Show the form when Book Now is clicked
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, pastTreatmentFiles: e.target.files });
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [form2Dialog, setform2Dialog] = useState(false);
 

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add booking logic here, e.g., send formData to the server
    const dataToSubmit = new FormData();
    for (const key in formData) {
      if (key === "pastTreatmentFiles") {
        for (const file of formData.pastTreatmentFiles) {
          dataToSubmit.append("pastTreatmentFiles", file);
        }
      } else {
        dataToSubmit.append(key, formData[key]);
      }
    }
    dataToSubmit.append("preferredTime", selectedSlot);
    dataToSubmit.append("preferredDate", selectedDate);
    
    // You can now send dataToSubmit to your backend
    // console.log(dataToSubmit);

    //formate the date and time remove spaces and add - and change it to the number from the selectedDate
    const selectedDatee = selectedDate.replace(/\s/g, '-');
    
  
    // console.log("selectedDate:", selectedDatee);
    
    console.log("formDate:", formData);
    const patient_data = {
      city: formData.city,
      dateOfBirth: formData.dateOfBirth,
      email: formData.email,
      fullName: formData.fullName,
      gender: formData.gender,
      phoneNumber: formData.phoneNumber,
      reasonForAppointment: formData.reasonForAppointment,
      state: formData.state,
      streetAddress: formData.streetAddress,
      zipCode: formData.zipCode,
      timeSlot: selectedSlot,
      slotDate: selectedDatee,
      pastTreatmentFiles: formData.pastTreatmentFiles.name || null,
    };

    console.log("Patient Data:", patient_data);
    console.log("Doctor ID:", doctor_id);
   
    if(localStorage.getItem("data") === null){
      
      setSnackbarMessage("Please login to book treatment");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    else{
    const options = {
      method: 'POST',
      url: `http://localhost:5000/api/docAppointment/${doctor_id}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("data")}`
      },
      data: patient_data
    };
    
    axios.request(options).then(function (response) {
      // console.log(response.data);
      setSnackbarMessage("Appointment Booked Successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setform2Dialog(true);

    }).catch(function (error) {
      // console.error(error);
    });
  }

  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  //-----------------------------------print function----------------------------------------------

  const firstHalf = [
    ["full name", formData.fullName],
    ["date of birth", formData.dateOfBirth],
    ["phone number", formData.phoneNumber],
    ["email", formData.email],
    

  ];

  const secondHalf = [
    ["gender", formData.gender],
    ["street address", formData.streetAddress],
    ["city", formData.city],
    ["state", formData.state],
    ["zip code", formData.zipCode],
  ];


  const handleClear = () => {
    setFormData({
      fullName: "",
      dateOfBirth: "",
      phoneNumber: "",
      email: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      gender: "",
      pastTreatmentFiles: [],
      reasonForAppointment: "",
    });
    setSelectedSlot(null);
    setSelectedDate(null);
    setShowForm(false);
  };



  const formRef = useRef();
   const handlePrint = useReactToPrint({
    content: () => formRef.current,
    documentTitle: "Admission_Form",
  });

  if (!doctor) return <div>Loading...</div>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 10,
        maxWidth: "90%",
        margin: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          mb: 1,
          ml: 3,
          borderRadius: 5,
          width: "90%",
        }}
      >
        <Button
          sx={{
            textTransform: "none",
            display: "flex",
            alignItems: "center",
            p: "0.2rem 0.8rem 0.2rem 0rem",
            color: theme.palette.mode === "dark" ? "#fff" : "#000",
            borderRadius: 5,
          }}
          onClick={() => navigate("/doctor")}
        >
          <KeyboardArrowLeftIcon sx={{ fontSize: 30 }} />
          <Typography variant="h6" sx={{ display: "inline-block" }}>
            Back
          </Typography>
        </Button>
        <Typography
          sx={{
            ml: 0.5,
            textAlign: "center",
            fontSize: "0.8rem",
            color: theme.palette.mode === "dark" ? "#939393" : "#6E6E6E",
          }}
        >
          /
        </Typography>
        <Typography
          sx={{
            ml: 0.5,
            textAlign: "center",
            fontSize: "0.8rem",
            color: theme.palette.mode === "dark" ? "#939393" : "#6E6E6E",
            cursor: "pointer",
            "&:hover": { color: "#00A799" },
          }}
          onClick={() => navigate("/doctor")}
        >
          Doctors
        </Typography>
        <Typography
          sx={{
            ml: 0.5,
            textAlign: "center",
            fontSize: "0.8rem",
            color: theme.palette.mode === "dark" ? "#939393" : "#6E6E6E",
          }}
        >
          /
        </Typography>
        <Typography
          sx={{
            ml: 0.5,
            textAlign: "center",
            fontSize: "0.8rem",
            color: "#00A799",
          }}
        >
          Appointment
        </Typography>
      </Box>

      <Box
        sx={{
          backgroundColor: theme.palette.mode === "light" ? "white" : "#191919",
          maxWidth: "90%",
          borderRadius: 2,
          width: "90%",
          height: "auto",
          boxShadow: "0px 10px 20px rgba(0,0,0,0.5)",
          p: 5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
            gap: 0,
           
            backgroundColor:
              theme.palette.mode === "light" ? "#f4f4f4" : "#292929",
            borderRadius: 2,
            boxShadow: "0px 10px 5px rgba(0, 0, 0, 0.1)",
            width: "100%",
            margin: "0 auto",
            padding: 1,
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              width: "100%  ",
              height: 250,
              backgroundColor:
              theme.palette.mode === "light" ? "#f4f4f4" : "#000",
             overflow: "hidden",
              borderRadius: 2,
            }}
          >
            <img
              alt={doctor.name}
              src={`/images/doctors_images/${doctor.doctor_image_url}.jpg`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
              }}
            />
          </Box>
         
         
         
         
         
         
         
         
         
         
         
         
          <Box
            sx={{
              width: "100%  ",
              height: 250,
              backgroundColor:
                theme.palette.mode === "light" ? "#f4f4f4" : "#000",
              padding: 2,
              display: "flex",
              flexDirection: "column",
             justifyContent: "start",
            }}
          >
            <Typography variant="h2" textAlign="left">
              {doctor.name}
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ display: "flex", alignItems: "center", fontSize: "1rem" }}
            >
              {doctor.doctor_specialty} | {doctor.doctor_experience} years exp
            </Typography>

            <Typography variant="body2" sx={{ mt: 0.2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, fontSize: "1rem" }}>
                {renderStars(doctor.doctor_rating)}&nbsp;
                <Typography variant="subtitle1"  component="div">
                  <Typography variant="text secondary" color="green">
                    {doctor.doctor_rating}&nbsp; Rating
                  </Typography>
                </Typography>
              </Box>
            </Typography>

            <Typography variant="body2" sx={{ mt: 0.2, display: "flex", alignItems: "start" , fontSize: "0.8rem", flexDirection: "column"}}>
              Institute of Medical Sciences, 
              <br />
             verified by Med Connect
              <br />
              <span style={{ color: "#00A799" }}>View Certificate</span>
              <br />
              100% Positive Reviews 


            </Typography>


          </Box>












<Divider  orientation="vertical" flexItem sx={{ mt: 2, mb: 2}} />

          <Box
            sx={{
              width: "110%  ",
              backgroundColor:
                theme.palette.mode === "light" ? "#f4f4f4" : "#000",
              padding: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              gap: 1,
            }}
          >
          <Typography variant="subtitle1" sx={{ fontSize: "1.3rem"}}

          >
              QUALIFICATION
            </Typography>
            {/* bold Divider */}

            <Divider sx={{ mt: 0.5, mb: 1}} />
             

           
            <Typography
              variant="body2"
              sx={{ mt: 1, display: "flex", alignItems: "center" , fontSize: "1rem"}}
            >
              <TranslateOutlinedIcon />
              &nbsp;&nbsp;&nbsp;{doctor.doctor_language}
            </Typography>
            <Typography
              variant="body2"
              sx={{ mt: 0.2, display: "flex", alignItems: "center" , fontSize: "1rem"}}
            >
              <SchoolOutlinedIcon />
              &nbsp;&nbsp;&nbsp;{doctor.doctor_qualification}
            </Typography>

            <Typography
                          variant="body2"
                          sx={{ mt: 0.2, display: "flex", alignItems: "center" , fontSize: "1rem"}}
                        >
                          <span
                            role="img"
                            aria-label="schedule"
                            style={{
                              display: "inline-block",
                              verticalAlign: "middle",
                            }}
                          >
                            <AccessTimeOutlinedIcon />
                          </span>
                          &nbsp;&nbsp;&nbsp;MON-SAT (
                          {doctor.doctor_schedule.length === 0
                            ? "24/7"
                            : doctor.doctor_schedule}
                          )
                        </Typography>
            

            </Box>


















            <Box
            sx={{
              width: "100%  ",
              backgroundColor:
              theme.palette.mode === "light" ? "#f4f4f4" : "#000",
              padding: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              gap: 1,
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
            }}
          >
          
          <Typography variant="subtitle1" sx={{ fontSize: "1.3rem"}}>
              ADDRESS
            </Typography>
            <Divider sx={{ mt: 0.5, mb: 1}} />
            <Typography
              variant="body2"
              sx={{ mt: 1, display: "flex", alignItems: "center" , fontSize: "1rem"}}
            >
              <PersonPinCircleOutlinedIcon />
              &nbsp;&nbsp;&nbsp;{doctor.doctor_address}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "1rem"}}>
              Street: 123, XYZ Road
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{
                borderRadius: "4px",
                fontSize: "0.8rem",
                mt: 1,
              }}
            >
             <CallIcon />&nbsp;&nbsp;
             +91 897 8546 521
            </Button>


            </Box>
        </Box>



      {/* --------------------------date and time selection ----------------------*/}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: 4,
            padding: 1,
            borderRadius: 2,
            color: theme.palette.mode === "light" ? "black" : "white",
            backgroundColor:
              theme.palette.mode === "light" ? "#4cd3da" : "black",
          }}
        >
          <IconButton onClick={handlePrev} disabled={startIndex === 0}>
            <ArrowBackIosIcon />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "space-around",
            }}
          >
            {visibleDates
              .slice(startIndex, startIndex + 5)
              .map((date, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    textAlign: "center",
                    position: "relative",
                    backgroundColor: selectedDate === date ? "#fff" : "inherit",
                    color: selectedDate === date ? "#000" : "inherit",
                    borderRadius: selectedDate === date ? "8px" : "inherit",
                    "&:hover::after": {
                      content: '""',
                      position: "absolute",
                      width: "100%",
                      transform: "scaleX(1)",
                      height: "2px",
                      bottom: 0,
                      left: 0,
                      backgroundColor: "white",
                      transformOrigin: "bottom left",
                      transition: "transform 0.25s ease-out",
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      width: "100%",
                      transform: "scaleX(0)",
                      height: "2px",
                      bottom: 0,
                      left: 0,
                      backgroundColor: "white",
                      transformOrigin: "bottom right",
                      transition: "transform 0.25s ease-out",
                    },
                  }}
                  onClick={() => handleDateClick(date)}
                >
                  <Typography variant="h6">{formatDate(date)}</Typography>
                </Box>
              ))}
          </Box>
          <IconButton
            onClick={handleNext}
            disabled={startIndex >= visibleDates.length - 5}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>


        

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Available Slots</Typography>
          {slots
            .filter((slot) => slot.date === selectedDate)
            .map((slot, index) => (
              <Box key={index} sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  {slot.times.map((time, idx) => (
                    <Grid item xs={6} md={3} key={idx}>
                      <Button
                        variant={selectedSlot === time ? "contained" : "outlined"}
                        fullWidth
                        onClick={() => handleSlotClick(time)}
                        // sx={{
                        //   backgroundColor:
                        //     selectedSlot === time
                        //       ? colors.primary[500]
                        //       : "inherit",
                        //   color: selectedSlot === time ? "white" : "inherit",
                        // }}
                      >
                        {time}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
        </Box>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          {!showForm && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleBookNow}
              disabled={!selectedSlot}
              sx={{
                
                padding: "10px 20px",
                borderRadius: "4px",
              }}
            >
              Book Now
            </Button>
          )}
        </Box>
        <Divider sx={{ mt: 4 , mb: 3}} />
        {showForm && (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 4,  margin: "auto" }}
          >
            <Typography variant="h4" sx={{ marginBottom: 3 }}>
              Book an Appointment
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Street Address"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Zip Code"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  {genders.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h6" gutterBottom>
                  Upload Previous Treatment Details
                </Typography>
                <input
                  accept=".pdf,image/*"
                  type="file"
                  name="pastTreatmentFiles"
                  multiple
                  onChange={handleFileChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reason for Appointment"
                  name="reasonForAppointment"
                  multiline
                  rows={4}
                  value={formData.reasonForAppointment}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Appointment Time: {selectedSlot}
                </Typography>
              </Grid>
              <Grid item xs={3} sx={{ margin: "auto" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Book Appointment
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
{/* --------------------------dialog box ----------------------*/}
<Dialog
        maxWidth="lg"
        open={form2Dialog}
        //onClose={() => setform2Dialog(false) && setformDialogClose()}
        aria-labelledby="form-dialog-title"
        sx={{
          backdropFilter: "blur(5px)",
          // backgroundColor: 'rgba(0,0,30,0.4)',
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor:
              theme.palette.mode === "light" ? "#f3f3f3" : colors.grey[800],
          }}
        >
          <DialogTitle id="form-dialog-title" variant="h4">
            Appointment Booking Receipt
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => {setform2Dialog(false); handleClear();}}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <ClearIcon />
          </IconButton>
        </Box>
        <DialogActions sx={{ display: "flex", justifyContent: "center" ,mt: 2}}>
          
          <Button  variant="contained" onClick={handlePrint} sx={{backgroundColor: "#000", color: "#fff", "&:hover": {backgroundColor: "#00ffea", color: "#000"} , width: "20%", borderRadius: "5px",  fontSize: "1rem"}}>
            Print
          </Button>
        </DialogActions>
        <Box  ref={formRef} sx={{ padding: 2 }}>
          <Paper
            elevation={0}
            sx={{
              padding: 5,
              backgroundColor: "white",
              color: "black",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ marginBottom: 2 }}
            >
              <Typography variant="h6">Med Connect</Typography>
              <Typography variant="h6">Reg. No.: 123456789</Typography>
            </Box>
            <Typography variant="h6" align="right">
              Date of Issue: {new Date().toDateString()}
            </Typography>
            <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
              Appointment Receipt
            </Typography>
            <Divider sx={{ backgroundColor: "black" }} />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1">
                Doctor Name: {doctor.name}
              </Typography>
              <Typography variant="body1">
                Address: {doctor.doctor_address}
              </Typography>
            </Box>
            <Divider sx={{ backgroundColor: "black" }} />
            <Box
              display="flex"
              justifyContent="start"
              alignItems="center"
              mt={2}
            >
              <Typography variant="body1">Patient Details</Typography>
            </Box>
            <DialogContent sx={{ backgroundColor: "white" }}>
              <Grid
                container
                spacing={2}
                sx={{ border: "1px solid black", pb: 4 }}
              >
                <Grid item xs={6}>
                  <TableContainer sx={{ backgroundColor: "white" }}>
                    <Table>
                      <TableBody>
                        {firstHalf.map(([key, value], index) => (
                          <TableRow
                            key={key}
                            sx={{
                              backgroundColor:
                                index % 2 === 0 ? "#f9f9f9" : "white",
                            }}
                          >
                            <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
                              <Typography
                                variant="body1"
                                component="span"
                                sx={{ fontWeight: "bold", color: "black" }}
                              >
                                {key.charAt(0).toUpperCase() +
                                  key.slice(1).replace(/([A-Z])/g, " $1")}
                                :
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
                              <Typography
                                variant="body1"
                                component="span"
                                sx={{ color: "black" }}
                              >
                                {value}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Divider
                  orientation="vertical"
                  sx={{ backgroundColor: "black", margin: "0 1rem" }}
                />
                <Grid item xs={5}>
                  <TableContainer sx={{ backgroundColor: "white" }}>
                    <Table>
                      <TableBody>
                        {secondHalf.map(([key, value], index) => (
                          <TableRow
                            key={key}
                            sx={{
                              backgroundColor:
                                index % 2 === 0 ? "#f9f9f9" : "white",
                            }}
                          >
                            <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
                              <Typography
                                variant="body1"
                                component="span"
                                sx={{ fontWeight: "bold", color: "black" }}
                              >
                                {key.charAt(0).toUpperCase() +
                                  key.slice(1).replace(/([A-Z])/g, " $1")}
                                :
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
                              <Typography
                                variant="body1"
                                component="span"
                                sx={{ color: "black" }}
                              >
                                {value}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider sx={{ backgroundColor: "black" }} />

            <Box
              display="flex"
              justifyContent="start"
              alignItems="center"
              mt={2}
            >
              <Typography variant="body1">Reason for Appointment</Typography>
            </Box>
            <DialogContent sx={{ backgroundColor: "white" }}>
              <Typography variant="body1" sx={{ color: "black" }}>
                {formData.reasonForAppointment}
              </Typography>
            </DialogContent>


            <Divider sx={{ backgroundColor: "black" }} />
            <Box mt={2}>
              <DialogContentText sx={{ color: "black" }}>
                <strong>Undertaking</strong>
                <br />
                I hereby declare that the information furnished above is true
                <br />
                A. i understand that the treatment cost may vary depending on
                the treatment provided.
                <br />
                B. Non-refundable deposit of Rs. 5000/- is required to book the
                treatment.
                <br />
                C. I Will be responsible for any damage caused to the property
                of the clinic during the treatment.
                <br />
                C. Cancellation of the treatment should be done 24 hours prior
              </DialogContentText>
            </Box>

            <Box display="flex" justifyContent="space-between" mt={2}>
              <Typography variant="body1">Signature:</Typography>
              <Typography variant="body1">
                This is a computer generated document and does not require a
                signature.
              </Typography>
            </Box>
            <Divider sx={{ backgroundColor: "black", mt: 2 }} />

            <Box display="flex" justifyContent="end" alignItems="center" mt={2}>
              <Typography variant="h6">
                For any queries, please contact us at
              </Typography>
            </Box>
            <Box display="flex" justifyContent="end" alignItems="center">
              <Typography variant="body1"></Typography>
              <Typography variant="body1" sx={{ ml: 1 }}>
                medconnect.query@info.com
              </Typography>
            </Box>
            <Box display="flex" justifyContent="end" alignItems="center">
              <Typography variant="body1">Phone:</Typography>
              <Typography variant="body1" sx={{ ml: 1 }}>
                1234567890
              </Typography>
            </Box>

            <Divider sx={{ backgroundColor: "black" }} />

            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={2}
            >
              <Typography variant="body1">
                Thank you for choosing Med Connect
              </Typography>
            </Box>
          </Paper>
        </Box>
        
      </Dialog>


      {/* --------------------------Snackbar ----------------------*/}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={8000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ marginTop: "3rem", fontSize: "1rem" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DoctorProfile;
