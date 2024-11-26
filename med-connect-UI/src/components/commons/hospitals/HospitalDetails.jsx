import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Divider,
  TextField,
  Card,
  Container,
  IconButton,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Snackbar,
  Alert,
  TableRow,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import BiotechIcon from "@mui/icons-material/Biotech";
import ChatIcon from "@mui/icons-material/Chat";
import DirectionsIcon from "@mui/icons-material/Directions";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EmailIcon from "@mui/icons-material/Email";
import SmsIcon from "@mui/icons-material/Sms";
import ShareIcon from "@mui/icons-material/Share";
import StarIcon from "@mui/icons-material/Star";
import LanguageIcon from "@mui/icons-material/Language";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

//-----------------------------------main component begins-----------------------------------
const HospitalCard = () => {
  const navigate = useNavigate();
  const { hospital_id } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchTerm, setSearchTerm] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [cardData, setcardData] = useState([]);
  const [doctorsData, setDoctorsData] = useState([]);

  // console.log("hospital_name", hospitals.hospital_treatments);
  //const token1 = req.headers.authorization?.split(' ')[1];

  // const ttreatments = hospitals.hospital_treatments;
  const ttreatmentsq = hospitals.hospital_treatments?.split(",") || [];
  // console.log("hospital_namcccc ccccccce",ttreatmentsq);

  const facilitieses = hospitals.hospital_facilities?.split(",") || [];
  // console.log("hccccccce",facilitieses);

  useEffect(() => {
    fetchHospitals();
    window.scrollTo(0, 0);
  }, []);

  const fetchHospitals = () => {
    axios
      .get(`http://localhost:5000/api/hospital/${hospital_id}`) //`http://localhost:5000/hospitals/${id}
      .then((response) => {
        setDoctorsData(response.data.doctors);
        setHospitals(response.data.hospital);
        setcardData(
          response.data.treatments.map((treatment) => ({
            treatment_id: treatment.treatment_id,
            title: treatment.title,
            originalPrice: treatment.originalPrice,
            price: treatment.price,
            tests: treatment.tests,
            features: treatment.features,
          }))
        );
        // console.log(
        //   response.data.treatments.map((treatment) => ({
        //     title: treatment.title,
        //     originalPrice: treatment.originalPrice,
        //     price: treatment.price,
        //     tests: treatment.tests,
        //     features: treatment.features,
        //   }))
        // );
        // console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //------------------------------------------Card Component Begins------------------------------------------

  //------------------------------------------Card Component Ends------------------------------------------

  const Arrow = ({ className, style, onClick, icon }) => {
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          color: theme.palette.mode === "dark" ? "#00ffea" : "#000",
          // fontSize: "3rem",
          zIndex: 2,
        }}
        onClick={onClick}
      >
        {icon}
      </div>
    );
  };

  const sliderSettings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    // beforeChange: (oldIndex, newIndex) => setCurrentIndex(newIndex),
    nextArrow: (
      <Arrow icon={<NavigateNextIcon style={{ fontSize: "2rem" }} />} />
    ),
    prevArrow: (
      <Arrow icon={<NavigateBeforeIcon style={{ fontSize: "2rem" }} />} />
    ),
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const filteredCards = cardData.filter((card) =>
    // card.title.toLowerCase().includes(searchTerm.toLowerCase())
    card.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCards = filteredCards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const pageCount = Math.ceil(filteredCards.length / itemsPerPage);

  const copyToClipboard = (text) => {
    // Attempt to use the modern Clipboard API
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert("Copied to clipboard!");
        })
        .catch((error) => {
          alert(`Copy failed! ${error}`);
        });
    } else {
      // Fallback: use textarea to copy the text
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("Copied to clipboard!");
    }
  };

  const handleSearchOnMaps = (location) => {
    // Construct the Google Maps search URL
    const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location
    )}`;

    // Open a new tab or window with the Google Maps URL
    window.open(searchUrl, "_blank");
  };

  const [formDialog, setformDialog] = useState(false);
  const [treatment_idss, settreatment_idss] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const bookNow = (treatment_id) => {
    //get the treatment id
    if (localStorage.getItem("data") === null) {
      // console.log(treatment_id);

      setSnackbarMessage("Please login to book treatment");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } else {
      // setName("");
      // setEmail("");
      // setPhone("");
      // setAge("");
      // setGender("");
      // setMessage("");
      // setAadharNumber("");
      // setSurname("");
      // setGuardianName("");
      // setEmail("");
      // setDateOfBirth("");
      // setDisability("");
      // setPlaceOfBirth("");
      // setCity("");
      // setDistrict("");
      // setState("");
      seterror(false);

      setformDialog(true);
      settreatment_idss(treatment_id);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [message, setMessage] = useState("");
  const [form2Dialog, setform2Dialog] = useState(false);
  const [surname, setSurname] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [disability, setDisability] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [state, setState] = useState("");
  const [error, seterror] = useState(false);

  // const [formData, setformData] = useState({});

  const handleChange = (event) => {
    setGender(event.target.value);
  };

  const handleSubmit = () => {
    if (
      surname === "" ||
      name === "" ||
      guardianName === "" ||
      aadharNumber === "" ||
      dateOfBirth === "" ||
      phone === "" ||
      gender === "" ||
      placeOfBirth === "" ||
      city === "" ||
      district === "" ||
      state === "" ||
      disability === "" ||
      email === "" ||
      bookingDate === "" ||
      age === ""
    ) {
      seterror(true);
      return;
    }

    setformDialog(false);
    setform2Dialog(true);
  };

  const setformDialogClose = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAge("");
    setGender("");
    setMessage("");
    setSurname("");
    setGuardianName("");
    setAadharNumber("");
    setDateOfBirth("");
    setDisability("");
    setPlaceOfBirth("");
    setCity("");
    setDistrict("");
    setState("");
    setBookingDate("");
    setformDialog(false);
  };

  const formRef = useRef();
  //current date
  const datee = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const formData = {
    firstName: name,
    surname: surname,
    guardianName: guardianName,
    aadharNumber: aadharNumber,
    dateOfBirth: dateOfBirth,
    age: age,
    gender: gender,
    email: email,
    phone: phone,
    placeOfBirth: placeOfBirth,
    city: city,
    district: district,
    state: state,
    disability: disability,
    dateOfBooking: datee,
    appointmentDate: bookingDate,
  };

  const sendPrint = async () => {
    const AuthToken = localStorage.getItem("data");
    console.log("formData", formData);
    // console.log("treatment_idss", treatment_idss);
    // console.log("hospital_id", hospital_id);
    // console.log("token", localStorage.getItem("data"));
    // if (!AuthToken) {
    //   setError("No authentication token found");
    //   setLoading(false);
    //   return;
    // }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/treatment/${treatment_idss}/hospital/${hospital_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${AuthToken}`,
          },
        }
      );
      console.log(response);
      setSnackbarMessage("Treatment Booked Successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      //time delay
      setTimeout(() => {
        setform2Dialog(false);
      }, 2000);
      handlePrint();
    } catch (error) {
      console.error("Error in booking treatment", error.response.data.error);
      setSnackbarMessage(
        error.response.data.error === "Internal server error"
          ? "treatment already booked"
          : error.response.data.error
      );
      setSnackbarSeverity(
        error.response.data.error === "Internal server error" ? "info" : "error"
      );
      setSnackbarOpen(true);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => formRef.current,
    documentTitle: "Admission_Form",
  });

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const formattedDate = date.split("/").map((part, index, arr) => (
    <React.Fragment key={index}>
      <span style={{ textDecoration: "underline" }}>{part}</span>
      {index < arr.length - 1 && (
        <span style={{ fontWeight: "bold" }}> / </span>
      )}
    </React.Fragment>
  ));

  const half = Math.ceil(Object.keys(formData).length / 2);
  const firstHalf = Object.entries(formData).slice(0, half);
  const secondHalf = Object.entries(formData).slice(half);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        pt: 10,
        pb: 5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          mb: 3,
          borderRadius: 5,
          width: "86.8%",
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
          onClick={() => navigate("/hospitals")}
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
        ></Typography>
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
            color: theme.palette.mode === "dark" ? "#939393" : "#6E6E6E",
            cursor: "pointer",
            "&:hover": { color: "#00A799" },
          }}
          onClick={() => navigate("/hospitals")}
        >
          Hospitals
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
          Hospital Details
        </Typography>
      </Box>

      <Box sx={{ maxWidth: "85%" }}>
        {/*-------------------------------------------------------------Main outer grid container ----------------------------------------------------------------------------------------------------------------------------------*/}
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          sx={{ borderRadius: "8px", gap: 1 }}
        >
          {/*-------------------------------------------------------------Left side 70% grid container Begins ----------------------------------------------------------------------------------------------------------------------------------*/}
          <Grid
            item
            xs={9.3}
            sx={{
              borderRadius: 2,
              p: 2,
              backgroundColor:
                theme.palette.mode === "light" ? "#fff" : colors.grey[900],
            }}
          >
            {/*-------------------------------------------------------------left Main grid container Begins ----------------------------------------------------------------------------------------------------------------------------------*/}
            <Grid container spacing={2}>
              {/*-------------------------------------------------------------left Main grid left side grid container Begins ----------------------------------------------------------------------------------------------------------------------------------*/}
              <Grid item xs={5}>
                <img
                  src={`/images/HospitalImages/${hospitals.hospital_images}.jpg`}
                  // src="/images/HospitalImages/hospital-building-modern-parking-lot-59693686.jpg"
                  alt="Hospital Logo"
                  style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                    gap: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<PhoneIcon />}
                    fullWidth
                  >
                    {hospitals.hospital_phone}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<WhatsAppIcon />}
                    fullWidth
                    sx={{ backgroundColor: "#25d366" }}
                    onClick={() => {
                      window.open(`https://wa.me/${hospitals.hospital_phone}`);
                    }}
                  >
                    WhatsApp
                  </Button>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<ChatIcon />}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Chat
                </Button>
              </Grid>
              {/*-------------------------------------------------------------left Main grid left side grid container Ends ----------------------------------------------------------------------------------------------------------------------------------*/}
              {/*-------------------------------------------------------------left Main grid right side grid container Begins ----------------------------------------------------------------------------------------------------------------------------------*/}
              <Grid item xs={7}>
                <Typography variant="h2">{hospitals.hospital_name}</Typography>
                <Typography variant="body1">
                  {hospitals.hospital_description}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {renderStars(hospitals.hospital_rating)}
                  </Box>
                  {/* <Rating
                    value= {hospitals.hospital_rating}
                    precision={0.1}
                    readOnly
                  /> */}
                  <Typography
                    variant="body1"
                    sx={{ ml: 1, color: "text.secondary" }}
                  >
                    {hospitals.hospital_rating} Ratings •{" "}
                    <span style={{ color: "green" }}>Verified</span>
                  </Typography>
                </Box>
                {/* <Typography variant="body1">{hospitalData.location}</Typography> */}
                <Typography variant="body1">
                  {hospitals.hospital_availability}
                </Typography>
                <Typography variant="body1">
                  {hospitals.hospital_recentEnquiries} people recently enquired
                </Typography>

                <Divider sx={{ p: 1 }} />

                {/* <Divider sx={{ p: 1 }} /> */}
                {/* <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mt: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Treatments
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    {hospitalData.treatments.map((treatment, index) => (
                      <Box
                        key={index}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CheckCircleIcon sx={{ color: "green" }} />
                        <Typography
                          variant="body1"
                          sx={{ wordBreak: "break-word" }}
                        >
                          {treatment}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  
                  
                </Box> */}

                {/* <Divider sx={{ p: 1 }} /> */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mt: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Treatments
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    {ttreatmentsq.map((treatment, index) => (
                      <Box
                        key={index}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CheckCircleIcon sx={{ color: "green" }} />
                        <Typography
                          variant="body1"
                          sx={{ wordBreak: "break-word" }}
                        >
                          {treatment}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mt: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Facilities
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    {facilitieses.map((facility, index) => (
                      <Box
                        key={index}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CheckCircleIcon sx={{ color: "green" }} />
                        <Typography
                          variant="body1"
                          sx={{ wordBreak: "break-word" }}
                        >
                          {facility}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
              {/*-------------------------------------------------------------left Main grid right side grid container Ends ----------------------------------------------------------------------------------------------------------------------------------*/}
            </Grid>
            {/*-------------------------------------------------------------left Main grid container Ends ----------------------------------------------------------------------------------------------------------------------------------*/}
            <Divider sx={{ p: 1 }} />
            {/* add image slider of doctors */}
            {/*-------------------------------------------------------------Left side 70% slider grid container Ends ----------------------------------------------------------------------------------------------------------------------------------*/}
            <Grid container spacing={2} sx={{ pt: 3.5, pl: 2.5, pr: 2.5 }}>
              <Grid xs={12}>
                <style>
                  {`
                    .slick-prev:before, .slick-next:before {
                        content: '' !important;
                    }
                    `}
                </style>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? "#f5f5f5"
                        : colors.grey[800],
                    borderRadius: "8px",
                    p: 2,
                  }}
                >
                  <Typography variant="h3">
                    Doctors at {hospitals.hospital_name}
                  </Typography>
                </Box>
                <Slider {...sliderSettings}>
                  {doctorsData.map((doctor, index) => (
                    <Box key={index} sx={{ p: "1.5rem" }}>
                      <Box
                        component="img"
                        sx={{
                          height: "28vh",
                          display: "block",
                          overflow: "hidden",
                          width: "100%",
                          borderRadius: "8px",
                          objectFit: "cover",
                          border: "1px solid #000",
                          backgroundColor:
                            theme.palette.mode === "light"
                              ? colors.grey[900]
                              : colors.grey[800],
                        }}
                        src={doctor.image}
                        alt={doctor.name}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <Typography variant="h6" sx={{ mt: 1 }}>
                          {doctor.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {doctor.speciality}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Slider>
              </Grid>
            </Grid>
            {/*-------------------------------------------------------------Left side 70% slider grid container Ends ----------------------------------------------------------------------------------------------------------------------------------*/}

            <Divider sx={{ p: 1 }} />
            {/*-------------------------------------------------------------Left side 70% Card grid container Begins ----------------------------------------------------------------------------------------------------------------------------------*/}

            <Container>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px 0 10px 0",
                }}
              >
                <Typography variant="h4">Book Your Treatment</Typography>
                <Typography variant="body1" color="textSecondary">
                  Showing{" "}
                  {currentPage === 1 ? 1 : (currentPage - 1) * itemsPerPage + 1}
                  -{" "}
                  {currentPage * itemsPerPage > filteredCards.length
                    ? filteredCards.length
                    : currentPage * itemsPerPage}{" "}
                  of {filteredCards.length} results
                </Typography>
              </Box>
              <TextField
                label="Search Treatment"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      position="end"
                      onClick={() => setSearchTerm("")}
                      disabled={searchTerm === ""}
                    >
                      <ClearIcon />
                    </IconButton>
                  ),
                }}
              />

              <Grid container spacing={3}>
                {paginatedCards.map((treat, treatment_id) => (
                  <Grid item xs={12} sm={6} md={4}>
                    {/* {cardData.map((treat, treatment_id) => ( */}
                    <Card
                      sx={{
                        maxWidth: 345,
                        margin: "20px auto",
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? colors.grey[9100]
                            : "#fff",
                        borderRadius: "10px",
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? colors.grey[800]
                              : "#f5f5f5",
                          padding: "10px",
                        }}
                      >
                        <Typography
                          variant="h5"
                          component="div"
                          color="primary"
                        >
                          {treat.title}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          flexDirection: "row",
                          gap: 1,
                          padding: "10px",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="h6">Tests :</Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "row",
                            gap: 1,
                            padding: "10px",
                            alignItems: "center",
                          }}
                        >
                          <BiotechIcon sx={{ fontSize: 20 }} /> {treat.tests}
                        </Typography>
                      </Box>

                      {/* <Grid container spacing={2} sx={{ p: "5px 10px" }}>
                        <Grid item xs={6}>
                        </Grid>
                      </Grid> */}

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px",
                          mt: "5px",
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? colors.grey[800]
                              : "#f5f5f5",
                        }}
                      >
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography variant="h4" color="green">
                            Rs. {treat.price}
                          </Typography>
                          <Typography
                            variant="h5"
                            color="textSecondary"
                            sx={{ textDecoration: "line-through" }}
                          >
                            Rs. {treat.originalPrice}
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ fontWeight: "bold" }}
                          onClick={() => bookNow(treat.treatment_id)}
                        >
                          Book Now
                        </Button>
                      </Box>
                      <Grid container spacing={1} sx={{ padding: "10px" }}>
                        <Grid item xs={4}>
                          <Typography variant="caption" display="block">
                            {treat.features}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Card>
                    {/* ))} */}
                  </Grid>
                ))}
              </Grid>
              {pageCount > 1 && (
                <Pagination
                  count={pageCount}
                  page={currentPage}
                  onChange={handleChangePage}
                  color="primary"
                  sx={{
                    marginTop: "20px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                />
              )}
            </Container>
          </Grid>

          {/*-------------------------------------------------------------Left side 70% grid container Ends ----------------------------------------------------------------------------------------------------------------------------------*/}

          <Grid xs={2.5}>
            <Box
              sx={{
                p: 2,
                backgroundColor:
                  theme.palette.mode === "light" ? "#fff" : colors.grey[900],
                borderRadius: 2,
                mb: 2,
              }}
            >
              <Typography variant="h5">Address</Typography>
              <Divider sx={{ pt: 1 }} />
              <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>
                {hospitals.hospital_address}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 1 }}
                  startIcon={<DirectionsIcon />}
                  onClick={() => handleSearchOnMaps(hospitals.hospital_address)}
                >
                  direction
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 1 }}
                  startIcon={<ContentCopyIcon />}
                  onClick={() => copyToClipboard(hospitals.hospital_address)}
                >
                  Copy
                </Button>
              </Box>

              <Button variant="body1" sx={{ mt: 2 }} startIcon={<EmailIcon />}>
                <a
                  href="mailto:info@hospital.com"
                  style={{
                    textDecoration: "none",
                    color: theme.palette.mode === "dark" ? "#fff" : "#000",
                  }}
                >
                  Send Enquiry by Email
                </a>
              </Button>
              <Divider sx={{ pt: 1 }} />
              <Button variant="body1" sx={{ mt: 1 }} startIcon={<SmsIcon />}>
                Get info via SMS/Email
              </Button>
              <Divider sx={{ pt: 1 }} />
              <Button variant="body1" sx={{ mt: 1 }} startIcon={<ShareIcon />}>
                Share this
              </Button>
              <Divider sx={{ pt: 1 }} />
              <Button variant="body1" sx={{ mt: 1 }} startIcon={<StarIcon />}>
                Tap to rate
              </Button>
              <Divider sx={{ pt: 1 }} />
              <Button
                variant="body1"
                sx={{ mt: 1 }}
                startIcon={<LanguageIcon />}
              >
                Visit our Website
              </Button>
              <Divider sx={{ pt: 1 }} />
              <Button
                variant="body1"
                sx={{ mt: 1 }}
                startIcon={<FacebookIcon />}
              >
                Facebook
              </Button>
              <Divider sx={{ pt: 1 }} />
              <Button
                variant="body1"
                sx={{ mt: 1 }}
                startIcon={<TwitterIcon />}
              >
                Twitter
              </Button>
              <Divider sx={{ pt: 1 }} />
              <Button
                variant="body1"
                sx={{ mt: 1, cursor: "pointer" }}
                startIcon={<YouTubeIcon />}
              >
                Youtube
              </Button>
              <Divider sx={{ pt: 1 }} />
              <Button variant="body1" sx={{ mt: 1 }}>
                GSTIN : 20AACCG2681C1Z9
              </Button>
            </Box>

            <Box
              sx={{
                p: 2,
                backgroundColor:
                  theme.palette.mode === "light" ? "#fff" : colors.grey[900],
                borderRadius: 2,
              }}
            >
              <Typography variant="h6">
                Get in Touch with {hospitals.hospital_name}
              </Typography>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
              />
              <TextField
                label="Message"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                sx={{ mt: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, fontWeight: "bold", fontSize: "0.8rem" }}
              >
                Submit
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* form dialog box ----------------------------------------------------------------------------------------------------------------*/}

      <Dialog
        open={formDialog}
        onClose={setformDialogClose}
        aria-labelledby="form-dialog-title"
        sx={{
          backdropFilter: "blur(5px)",
        }}
      >
        {cardData
          .filter((treat) => treat.treatment_id === treatment_idss)
          .map((treat) => (
            <Box key={treatment_idss}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor:
                    theme.palette.mode === "light"
                      ? "#f3f3f3"
                      : colors.grey[800],
                }}
              >
                <DialogTitle id="form-dialog-title" variant="h4">
                  Book Treatment
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={setformDialogClose}
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
              <DialogContent>
                <DialogContentText variant="h5" sx={{ marginBottom: "1rem" }}>
                  Please fill the form below to book your treatment.
                </DialogContentText>
                <TextField
                  margin="dense"
                  id="treatmentType"
                  label="Treatment Type"
                  type="text"
                  fullWidth
                  value={treat.title}
                  disabled
                />
                <TextField
                  sx={{ mt: 2 }}
                  id="bookingDate"
                  label="Visiting Date"
                  error={bookingDate === "" && error}
                  helperText={
                    bookingDate === "" && error
                      ? "Booking Date is required"
                      : ""
                  }
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
                <Divider sx={{ mt: 2, mb: 1 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="dense"
                      id="name"
                      required
                      error={name === "" && error}
                      helperText={
                        name === "" && error ? "Name is required" : ""
                      }
                      label="Patient Name"
                      type="text"
                      fullWidth
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="surname"
                      label="Surname"
                      required
                      error={surname === "" && error}
                      helperText={
                        surname === "" && error ? "Surname is required" : ""
                      }
                      type="text"
                      fullWidth
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="dense"
                      id="guardianName"
                      label="Guardian's Name"
                      error={guardianName === "" && error}
                      helperText={
                        guardianName === "" && error
                          ? "Guardian's Name is required"
                          : ""
                      }
                      type="text"
                      fullWidth
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="dense"
                      id="email"
                      label="Email Address"
                      error={email === "" && error}
                      helperText={
                        email === "" && error ? "Email Address is required" : ""
                      }
                      type="text"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>
                  {/* <Grid item xs={12} sm={6}>
                    <TextField
                      margin="dense"
                      id="motherName"
                      label="Mother's Name"
                      error={motherName === "" && error}
                      helperText={
                        motherName === "" && error
                          ? "Mother's Name is required"
                          : ""
                      }
                      type="text"
                      fullWidth
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                    />
                  </Grid> */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="dense"
                      id="age"
                      label="Age"
                      error={age === "" && error}
                      helperText={age === "" && error ? "Age is required" : ""}
                      type="number"
                      fullWidth
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="dense"
                      id="aadharNumber"
                      error={aadharNumber === "" && error}
                      helperText={
                        aadharNumber === "" && error
                          ? "Aadhar Number is required"
                          : ""
                      }
                      label="Aadhar Number"
                      type="text"
                      fullWidth
                      value={aadharNumber}
                      onChange={(e) => setAadharNumber(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="dense"
                      id="dateOfBirth"
                      label="Date of Birth"
                      error={dateOfBirth === "" && error}
                      helperText={
                        dateOfBirth === "" && error
                          ? "Date of Birth is required"
                          : ""
                      }
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="dense"
                      id="phone"
                      label="Whatsapp Number"
                      error={phone === "" && error}
                      helperText={
                        phone === "" && error
                          ? "Whatsapp Number is required"
                          : ""
                      }
                      type="tel"
                      fullWidth
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl margin="dense" fullWidth required>
                      <InputLabel id="gender-label">Gender</InputLabel>
                      <Select
                        labelId="gender-label"
                        id="gender"
                        value={gender}
                        error={gender === "" && error}
                        helperText={
                          gender === "" && error ? "gender is required" : ""
                        }
                        onChange={handleChange}
                        label="Gender"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="dense"
                      id="placeOfBirth"
                      label="Place of Birth"
                      error={placeOfBirth === "" && error}
                      helperText={
                        placeOfBirth === "" && error
                          ? "Place of Birth is required"
                          : ""
                      }
                      type="text"
                      fullWidth
                      value={placeOfBirth}
                      onChange={(e) => setPlaceOfBirth(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="dense"
                      id="city"
                      label="City"
                      error={city === "" && error}
                      helperText={
                        city === "" && error ? "City is required" : ""
                      }
                      type="text"
                      fullWidth
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="dense"
                      id="district"
                      error={district === "" && error}
                      helperText={
                        district === "" && error ? "District is required" : ""
                      }
                      label="District"
                      type="text"
                      fullWidth
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="dense"
                      id="state"
                      label="State"
                      type="text"
                      error={state === "" && error}
                      helperText={
                        state === "" && error ? "State is required" : ""
                      }
                      fullWidth
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="dense"
                      id="disability"
                      label="Disability"
                      type="text"
                      error={disability === "" && error}
                      helperText={
                        disability === "" && error
                          ? "Disability is required"
                          : ""
                      }
                      fullWidth
                      value={disability}
                      onChange={(e) => setDisability(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin="dense"
                      id="message"
                      label="Message"
                      type="text"
                      fullWidth
                      multiline
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Next
                </Button>
              </DialogActions>
            </Box>
          ))}
      </Dialog>

      {/* form dialog box ----------------------------------------------------------------------------------------------------------------*/}

      {/* form dialog box 2 ----------------------------------------------------------------------------------------------------------------*/}
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
            Book Treatment
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setform2Dialog(false) && setformDialogClose()}
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
        <Box ref={formRef} sx={{ padding: 2 }}>
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
              Date of Issue: {formattedDate}
            </Typography>
            <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
              ADMISSION FORM
            </Typography>
            <Divider sx={{ backgroundColor: "black" }} />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1">
                Hospital Name: {hospitals.hospital_name}
              </Typography>
              <Typography variant="body1">
                Hospital Address: {hospitals.hospital_address}
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
                <Grid item xs={5.4}>
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
                  flexItem
                  sx={{ backgroundColor: "black", margin: "0 1.5rem" }}
                />
                <Grid item xs={5.4}>
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

            {cardData
              .filter((treat) => treat.treatment_id === treatment_idss)
              .map((treat) => (
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">
                    Treatment Of : {treat.title}
                  </Typography>
                  <Typography variant="body1">
                    Treatment Cost: Rs. {treat.price}
                  </Typography>
                </Box>
              ))}
            <Divider sx={{ backgroundColor: "black" }} />
            <Box mt={2}>
              <DialogContentText sx={{ color: "black" }}>
                <strong>Undertaking</strong>
                <br />
                I hereby declare that the information furnished above is true
                <br />
                A. i understand that the hospital will take all necessary
                precautions to ensure my safety during my stay at the hospital.
                <br />
                B. Non-refundable deposit of Rs. 5000/- is required to book the
                treatment.
                <br />
                C. I Will be responsible for any damage caused to the hospital
                property during my stay.
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
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              setform2Dialog(false);
              setformDialog(true);
            }}
            //onClick={() => { handlePrint(); sendPrint(); }}>
          >
            Go Back and Edit
          </Button>
          <Button color="primary" variant="contained" onClick={sendPrint}>
            Save & Print
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
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

export default HospitalCard;
