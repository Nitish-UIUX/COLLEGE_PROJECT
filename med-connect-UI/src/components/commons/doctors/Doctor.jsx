import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";
import ClearIcon from "@mui/icons-material/Clear";
import TuneIcon from "@mui/icons-material/Tune";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import PersonPinCircleOutlinedIcon from "@mui/icons-material/PersonPinCircleOutlined";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import axios from "axios";

const Doctor = () => {
  const navigate = useNavigate();
  const { searchValue } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [doctors, setDoctors] = useState([]);
  const [filters, setFilters] = useState({
    name: searchValue || "",
    specialty: "",
    address: "",
    time: "",
    language: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 6;

  useEffect(() => {
    //scroll to top
    window.scrollTo(0, 0);
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/doctors");
      const doctorsWithFavorite = response.data.map((doctor) => ({
        ...doctor,
        isFavorite: false,
      }));
      setDoctors(doctorsWithFavorite);
      console.log("Doctors fetched successfully:", doctorsWithFavorite);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const toggleFavorite = (index) => {
    const updatedDoctors = [...doctors];
    updatedDoctors[index].isFavorite = !updatedDoctors[index].isFavorite;
    setDoctors(updatedDoctors);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setCurrentPage(1);
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      specialty: "",
      address: "",
      time: "",
      language: "",
    });
  };

  const specialtyOptions = [
    { label: "Any Specialty", value: "" },
    { label: "Cardiologist", value: "Cardiologist" },
    { label: "Neurologist", value: "Neurologist" },
    { label: "Pediatrician", value: "Pediatrician" },
  ];

  const locationOptions = [
    { label: "Any Location", value: "" },
    { label: "Ranchi", value: "Ranchi" },
    { label: "Lalpur", value: "Lalpur" },
    { label: "Hinoo", value: "Hinoo" },
    { label: "Hatia", value: "Hatia" },
    { label: "Harmu", value: "Harmu" },
  ];

  const timeOptions = [
    { label: "Any Time", value: "" },
    { label: "Morning", value: "10:00 AM - 12:00 PM" },
    { label: "Afternoon", value: "12:00 PM - 4:00 PM" },
    { label: "Evening", value: "4:00 PM - 8:00 PM" },
  ];

  const languageOptions = [
    { label: "Any Language", value: "" },
    { label: "English", value: "English" },
    { label: "Hindi", value: "Hindi" },
    { label: "Bengali", value: "Bengali" },
    { label: "Odia", value: "Odia" },
    { label: "Punjabi", value: "Punjabi" },
    { label: "Gujarati", value: "Gujarati" },
  ];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesName = doctor.name
      ?.toLowerCase()
      .includes(filters.name?.toLowerCase() ?? "");
    const matchesSpecialty =
      !filters.specialty || doctor.doctor_specialty === filters.specialty;
    const matchesAddress =
      !filters.address ||
      doctor.doctor_address
        ?.toLowerCase()
        .includes(filters.address?.toLowerCase() ?? "");
    const matchesTime =
      !filters.time || doctor.doctor_schedule?.includes(filters.time);
    const matchesLanguage =
      !filters.language || doctor.doctor_language?.includes(filters.language);
    return (
      matchesName &&
      matchesSpecialty &&
      matchesAddress &&
      matchesTime &&
      matchesLanguage
    );
  });
  console.log("filteredDoctors", filteredDoctors);

  // Pagination logic
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <Button
          variant="contained"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          sx={{ mr: 2 }}
        >
          Previous
        </Button>
        {pageNumbers.map((number) => (
          <IconButton
            key={number}
            variant="contained"
            onClick={() => handlePageClick(number)}
            sx={{
              mx: 1,
              minWidth: 36,
              bgcolor:
                currentPage === number
                  ? theme.palette.mode === "dark"
                    ? "#000"
                    : "#00ffea"
                  : "transparent",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color:
                  currentPage === number
                    ? theme.palette.mode === "dark"
                      ? "#fff"
                      : "#000"
                    : theme.palette.text.secondary,
              }}
            >
              {number}
            </Typography>
          </IconButton>
        ))}
        <Button
          variant="contained"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          sx={{ ml: 2 }}
        >
          Next
        </Button>
      </Box>
    );
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

  const handleBookAppointment = (doctorId) => {
    // navigate(`/doctor-profile/${doctorId}`);
    if (localStorage.getItem("data") === null) {
      setSnackbarMessage("Please login to Add Doctor to the List");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);

      //  navigate(`/doctor-profile/${doctorId}`);
      return;
    } else {
      // navigate(`/doctor-profile/${doctorId}`);
      if (localStorage.getItem("doc_appointment") === null) {
        localStorage.setItem("doc_appointment", JSON.stringify([doctorId]));
        setSnackbarMessage("Add Doctor to the List");
        setSnackbarSeverity("success");
        // navigate(`/doctor-profile/${doctorId}`);
        setSnackbarOpen(true);
      } else {
        const appointments = JSON.parse(
          localStorage.getItem("doc_appointment")
        );
        if (appointments.includes(doctorId)) {
          setSnackbarMessage("You have already Added this Doctor to the List");
          setSnackbarSeverity("warning");
          setSnackbarOpen(true);
        } else {
          appointments.push(doctorId);
          localStorage.setItem("doc_appointment", JSON.stringify(appointments));
          setSnackbarMessage("Doctor Added to the List");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        }
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <Box sx={{ flexGrow: 1, pt: 10, pb: 4, maxWidth: "90%", margin: "0 auto" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          mb: 1,
          borderRadius: 5,
          width: "90%",
          ml: "2%",
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
          onClick={() => navigate("/")}
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
          onClick={() => navigate("/")}
        >
          Home
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
          Doctors
        </Typography>
      </Box>
      <Box sx={{ width: "100%", px: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={2} sx={{ pb: 3 }}>
            <Box
              sx={{
                p: "1rem 1.5rem",
                bgcolor:
                  theme.palette.mode === "dark" ? colors.grey[900] : "#fff",
                boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                borderRadius: 1,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                  color: theme.palette.mode === "dark" ? "#fff" : "#000",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Filters &nbsp; <TuneIcon />
              </Typography>
              <Divider sx={{ m: "1rem 0" }} />
              <FormLabel component="legend" sx={{ mb: 2 }}>
                Specialty
              </FormLabel>
              <RadioGroup
                aria-label="specialty"
                name="specialty"
                value={filters.specialty}
                onChange={handleFilterChange}
                sx={{
                  mb: 3,
                  color: theme.palette.mode === "dark" ? "#fff" : "#000",
                }}
              >
                {specialtyOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
              <Divider sx={{ m: "1rem 0" }} />
              <FormLabel component="legend" sx={{ mb: 2 }}>
                Location
              </FormLabel>
              <RadioGroup
                aria-label="address"
                name="address"
                value={filters.address}
                onChange={handleFilterChange}
                sx={{
                  mb: 3,
                  color: theme.palette.mode === "dark" ? "#fff" : "#000",
                }}
              >
                {locationOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
              <Divider sx={{ m: "1rem 0" }} />
              <FormLabel component="legend" sx={{ mb: 2 }}>
                Available Time
              </FormLabel>
              <RadioGroup
                aria-label="time"
                name="time"
                value={filters.time}
                onChange={handleFilterChange}
                sx={{
                  mb: 3,
                  color: theme.palette.mode === "dark" ? "#fff" : "#000",
                }}
              >
                {timeOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
              <Divider sx={{ m: "1rem 0" }} />
              <FormLabel component="legend" sx={{ mb: 2 }}>
                Language
              </FormLabel>
              <RadioGroup
                aria-label="language"
                name="language"
                value={filters.language}
                onChange={handleFilterChange}
                sx={{
                  mb: 3,
                  color: theme.palette.mode === "dark" ? "#fff" : "#000",
                }}
              >
                {languageOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
              <Divider sx={{ m: "1rem 0" }} />
              <Button
                variant="contained"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                sx={{
                  bgcolor: "#00ffea",
                  color: "#000",
                  "&:hover": {
                    bgcolor: theme.palette.mode === "dark" ? "#fff" : "#000",
                    color: theme.palette.mode === "dark" ? "#000" : "#fff",
                  },
                }}
                fullWidth
              >
                Clear Filters
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={10}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <TextField
                label="Search Doctors"
                variant="outlined"
                name="name"
                value={filters.name || ""}
                onChange={handleFilterChange}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <IconButton
                      position="end"
                      onClick={clearFilters}
                      disabled={filters.name === ""}
                    >
                      <ClearIcon />
                    </IconButton>
                  ),
                }}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: theme.palette.mode === "dark" ? "#fff" : "#000",
              }}
            >
              {/* showing ___ - ___ of ___ doctors */}
              showing {indexOfFirstDoctor + 1} - {indexOfLastDoctor} of{" "}
              {doctors.length} doctors
            </Typography>

            <Grid container spacing={2}>
              {currentDoctors.map((doctor, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card
                    // onClick={() =>
                    //   navigate(`/doctor-profile/${doctor.doctor_id}`)
                    // }
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      //   cursor: "pointer",
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? colors.grey[900]
                          : "#fff",
                      color: theme.palette.mode === "dark" ? "#fff" : "#000",
                      position: "relative",
                      marginBottom: "20px",
                    }}
                  >
                    <Box>
                      {!isLoaded && (
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          bgcolor={
                            theme.palette.mode === "dark" ? "#000" : "#c6c6c6"
                          }
                          width="100%"
                          height="100%"
                          color="white"
                          zIndex="10"
                        >
                          <Typography
                            sx={{
                              textTransform: "none",
                              fontWeight: "bold",
                              color: "grey",
                            }}
                          >
                            Loading...
                          </Typography>
                        </Box>
                      )}
                      <CardMedia
                        component="img"
                        sx={{ width: 210 }}
                        image={`/images/doctors_images/${doctor.doctor_image_url}.jpg`}
                        alt={doctor.name}
                        style={{ objectFit: "cover", cursor: "pointer" }}
                        onLoad={handleImageLoad}
                        onClick={() =>
                          navigate(`/doctor-profile/${doctor.doctor_id}`)
                        }
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                      }}
                    >
                      <CardContent
                        sx={{ flex: "1 0 auto", cursor: "pointer" }}
                        onClick={() =>
                          navigate(`/doctor-profile/${doctor.doctor_id}`)
                        }
                      >
                        <Typography component="div" variant="h3">
                          {doctor.name}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          component="div"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          {doctor.doctor_specialty} | {doctor.doctor_experience}
                          &nbsp; years exp
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.2 }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            {renderStars(doctor.doctor_rating)}&nbsp;
                            <Typography
                              variant="subtitle1"
                              color="text.secondary"
                              component="div"
                            >
                              <Typography
                                variant="text secondary"
                                color="green"
                              >
                                {doctor.doctor_rating}&nbsp; Rating
                              </Typography>
                            </Typography>
                          </Box>
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 2 }}
                        >
                          <span
                            role="img"
                            aria-label="location"
                            style={{
                              display: "inline-block",
                              verticalAlign: "middle",
                            }}
                          >
                            <PersonPinCircleOutlinedIcon />
                          </span>
                          &nbsp;&nbsp;&nbsp;{doctor.doctor_address}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.2 }}
                        >
                          <span
                            role="img"
                            aria-label="language"
                            style={{
                              display: "inline-block",
                              verticalAlign: "middle",
                            }}
                          >
                            <TranslateOutlinedIcon />
                          </span>
                          &nbsp;&nbsp;&nbsp;
                          {doctor.doctor_language}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.2 }}
                        >
                          <span
                            role="img"
                            aria-label="education"
                            style={{
                              display: "inline-block",
                              verticalAlign: "middle",
                            }}
                          >
                            <SchoolOutlinedIcon />
                          </span>
                          &nbsp;&nbsp;&nbsp;
                          {doctor.doctor_qualification}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
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
                      </CardContent>
                      <Box
                        sx={{
                          padding: "0.1rem 1rem",
                          display: "flex",
                          justifyContent: "space-between",
                          borderTop: `1px solid ${colors.grey[800]}`,
                        }}
                      >
                        <Button
                          size="small"
                          color="primary"
                          startIcon={<EmailIcon />}
                          href={`mailto:${doctor.doctor_email}`}
                          sx={{ textTransform: "none" }}
                        >
                          {doctor.doctor_email}
                        </Button>
                        <Button
                          size="small"
                          color="primary"
                          startIcon={<CallIcon />}
                          href={`tel:${doctor.doctor_phone}`}
                          sx={{ textTransform: "none" }}
                        >
                          {doctor.doctor_phone}
                        </Button>
                      </Box>
                      <Box
                        sx={{
                          padding: "0.5rem 1rem",
                          display: "flex",
                          justifyContent: "center",
                          borderTop: `1px solid ${colors.grey[800]}`,
                        }}
                      >
                        <Button
                          variant="contained"
                          fullWidth
                          color="primary"
                          //   startIcon={<BookOnlineIcon />}
                          sx={{
                            "&:hover": {
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? "#00ffea"
                                  : "#00ffea",
                              color: "#000",
                            },
                          }}
                          onClick={() => handleBookAppointment(doctor.id)}
                        >
                          <Typography
                            variant="h6"
                            sx={{ textTransform: "none" }}
                          >
                            Add to List
                          </Typography>
                        </Button>
                      </Box>
                    </Box>
                    <IconButton
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleFavorite(index);
                      }}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: doctor.isFavorite ? "red" : "grey",
                      }}
                    >
                      {doctor.isFavorite ? (
                        // test
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {renderPagination()}
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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

export default Doctor;
