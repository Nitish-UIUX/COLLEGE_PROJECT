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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import ClearIcon from "@mui/icons-material/Clear";
import TuneIcon from "@mui/icons-material/Tune";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";

import axios from "axios";

const Hospital = () => {
  const navigate = useNavigate();
  const { searchValue } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [hospitals, setHospitals] = useState([]);
  const [filters, setFilters] = useState({
    name: searchValue || "",
    rating: "",
    address: "", // Single selected address
    services: "", // New filter for services
  });
  const [currentPage, setCurrentPage] = useState(1);
  const hospitalsPerPage = 5;

  const [isLoaded, setIsLoaded] = useState(false);


  const handleImageLoad = () => {
      setIsLoaded(true);
    };



  useEffect(() => {
    //scroll to top
    window.scrollTo(0, 0);
  }, []);


  const fetchHospitals = () => {
    axios
      .get("http://localhost:5000/api/hospitals")
      .then((response) => {
        const hospitalsWithFavorite = response.data.map((hospital) => ({
          ...hospital,
          isFavorite: false,
        }));
        setHospitals(hospitalsWithFavorite);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const toggleFavorite = (index) => {
    const updatedHospitals = [...hospitals];
    updatedHospitals[index].isFavorite = !updatedHospitals[index].isFavorite;
    setHospitals(updatedHospitals);
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

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setCurrentPage(1);
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      rating: "",
      address: "",
      services: "",
    });
  };

  const servicesOptions = [
    { label: "Any Service", value: "" },
    { label: "Emergency", value: "Emergency" },
    { label: "Cardiology", value: "Cardiology" },
    { label: "Orthopedics", value: "Orthopedics" },

  ]; // Add more options as needed

  const locationOptions = [
    { label: "Any Location", value: ""},
    { label: "Ranchi", value: "Ranchi" },
    { label: "Lalpur", value: "Lalpur" },
    { label: "Hinoo", value: "Hinoo" },
    { label: "Hatia", value: "Hatia" },
    { label: "Harmu", value: "Harmu" },
  ]; // Add more options as needed


  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesName = hospital.hospital_name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesRating = !filters.rating || hospital.hospital_rating >= parseInt(filters.rating);
    const matchesAddress = !filters.address || hospital.hospital_address.toLowerCase().includes(filters.address.toLowerCase());
    const matchesServices = !filters.services || hospital.hospital_services.toLowerCase().includes(filters.services.toLowerCase());
    //rest the page to 1 
    
    return matchesName && matchesRating && matchesAddress && matchesServices;
  });

  // Pagination logic
  const indexOfLastHospital = currentPage * hospitalsPerPage;
  const indexOfFirstHospital = indexOfLastHospital - hospitalsPerPage;
  const currentHospitals = filteredHospitals.slice(indexOfFirstHospital, indexOfLastHospital);
  const totalPages = Math.ceil(filteredHospitals.length / hospitalsPerPage);

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
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
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
              bgcolor: currentPage === number ? theme.palette.mode === "dark" ?   "#000"  : "#00ffea" : "transparent",
            }}
          >
          <Typography variant="h5" sx={{ color: currentPage === number ? theme.palette.mode === "dark" ? '#fff' : '#000' : theme.palette.text.secondary }}>

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

  return (
    <Box
      sx={{
        flexGrow: 1,
        pt: 10,
        pb: 4,
        maxWidth: "90%",
        margin: "0 auto",
      }}
    >
      <Box sx={{ width: "100%", px: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          mb: 1,
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
          onClick={() => navigate("/")}
        >
          <KeyboardArrowLeftIcon sx={{ fontSize: 30 }} />

          <Typography variant="h6" sx={{ display: "inline-block" }}>
            Back
          </Typography>
        </Button>
        <Typography sx={{ ml: 0.5, textAlign: "center" , fontSize: "0.8rem" , color: theme.palette.mode === "dark" ? "#939393" : "#6E6E6E" }}>
          / 
          </Typography>
        <Typography sx={{ ml: 0.5, textAlign: "center" , fontSize: "0.8rem" , color: theme.palette.mode === "dark" ? "#939393" : "#6E6E6E" , cursor: "pointer" ,"&:hover": { color: "#00A799" }}}
        onClick={() => navigate("/")}>
           Home 
          </Typography>
          <Typography sx={{ ml: 0.5, textAlign: "center" , fontSize: "0.8rem" , color: theme.palette.mode === "dark" ? "#939393" : "#6E6E6E" }}>
          / 
          </Typography>
        <Typography sx={{ ml: 0.5, textAlign: "center" , fontSize: "0.8rem" , color: "#00A799"}}>
          Hospitals
          </Typography>
      </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={2} sx={{ pb: 3 }}>
            <Box sx={{ p: '1rem 1.5rem', bgcolor: theme.palette.mode === "dark" ? colors.grey[900] : '#fff', boxShadow: '0 10px 20px rgba(0,0,0,0.2)', borderRadius: 1 }}>
              <Typography variant="h4" sx={{ mb: 2, color: theme.palette.mode === "dark" ? '#fff' : '#000' , display: 'flex', alignItems: 'center'}}>
                Filters &nbsp; <TuneIcon />
              </Typography>
              {/* <Divider sx={{ m : '1rem 0'}} /> */}
              
              
              <Divider sx={{ m : '1rem 0'}} />
              <FormLabel component="legend" sx={{ mb: 2}}>Rating</FormLabel>
              <RadioGroup
                aria-label="rating"
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                sx={{ mb: 3, color: theme.palette.mode === "dark" ? '#fff' : '#000' }}
              >
                <FormControlLabel
                  value=""
                  control={<Radio />}
                  label="Any rating"
                />
                <FormControlLabel
                  value="4"
                  control={<Radio />}
                  label="4 stars & above"
                />
                <FormControlLabel
                  value="3"
                  control={<Radio />}
                  label="3 stars & above"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label="2 stars & above"
                />
              </RadioGroup>
              <Divider sx={{ m : '1rem 0'}} />
              <FormLabel component="legend" sx={{ mb: 2}}>Location</FormLabel>
              <RadioGroup
                aria-label="address"
                name="address"
                value={filters.address}
                onChange={handleFilterChange}
                sx={{ mb: 3, color: theme.palette.mode === "dark" ? '#fff' : '#000' }}
              >
                {locationOptions.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
              <Divider sx={{ m : '1rem 0'}} />
              <FormLabel component="legend" sx={{ mb: 2}}>Services</FormLabel>
              <RadioGroup
                aria-label="services"
                name="services"
                value={filters.services}
                onChange={handleFilterChange}
                sx={{ mb: 3, color: theme.palette.mode === "dark" ? '#fff' : '#000' }}
              >
               {servicesOptions.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
              <Divider sx={{ m : '1rem 0'}} />
              <Button
                variant="contained"
                color="primary"
                startIcon={<ClearIcon />}
                fullWidth
                onClick={clearFilters}
                sx={{ bgcolor: "#00ffea", color: "#000" , "&:hover": {bgcolor: theme.palette.mode === "dark" ? "#fff" : "#000" , color: theme.palette.mode === "dark" ? "#000" : "#fff" }}}
              >
               <Typography variant="body1" >Clear Filter</Typography>

              </Button>
            </Box>
          </Grid>












          <Grid item xs={12} md={10} sx={{ pb: 10 }}>
          {/* ---------------------create the search bar here--------------------- */}
          <Box sx={{ position: 'relative' , mb: 2}}>
             
                <TextField
                label="Search hospitals"
                  name="name"
                  variant="outlined"
                  fullWidth
                  value={filters.name}
                  onChange={handleFilterChange}
                  InputProps={{
                    endAdornment: (
                      <IconButton 
                      size="small"
                      onClick={clearFilters} 
                      disabled={!filters.name && !filters.rating && !filters.address && !filters.services}
                      >
                        <ClearIcon />
                      </IconButton>
                    ),
                  }}
                  
                />
              </Box>
          
              <Typography variant="subtitle1" sx={{ color: theme.palette.mode === "dark" ? '#fff' : '#000' , mb: 2}}>
                Showing {indexOfFirstHospital + 1} - {Math.min(indexOfLastHospital, filteredHospitals.length)} of {filteredHospitals.length} results
              </Typography>
              {currentHospitals.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column'}}>
                  <img src="/images/search not found.png" alt="Description"  style={{ width: '34%', height: '45%'}} />
                  <Typography variant="h3" sx={{ color: theme.palette.mode === "dark" ? '#fff' : '#000' , mt: 3}}>
                    No Search Results Found
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: theme.palette.mode === "dark" ? '#fff' : '#000' , mt: 2}}>
                    Try adjusting your search filters
                  </Typography>
                </Box>
            ) : null}
              
            {currentHospitals.map((hospital, index) => (
              <Card
                key={hospital._id}
                sx={{
                  display: "flex",
                  mb: 3,
                  position: "relative",
                  bgcolor: theme.palette.mode === "dark" ? colors.dark : colors.light,
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                }}
              >
              <Box>
              {!isLoaded && (
                        <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bgcolor= {theme.palette.mode === "dark" ? "#000" : "#c6c6c6"}
                        width="100%"
                        height="100%"
                        color="white"
                        zIndex="10"
                        >
                        <Typography  sx={{ textTransform: 'none', fontWeight: 'bold' , color: "grey" }}>
                      {hospital.hospital_images}
                        </Typography>
                        </Box>
                    )}
                <CardMedia
                   component="img"
                  sx={{ width: 170, height: 170, borderRadius: 1, margin: 2 , cursor: "pointer"}}
                  image={`/images/HospitalImages/${hospital.hospital_images}.jpg`}

                  // image= {`images/HospitalImages/${hospital.hospital_images}`}
                  // image={hospital.hospital_images}
                  alt={`${hospital.hospital_images}`}
                  onLoad={handleImageLoad}
                  onClick={() => navigate(`/hospital/${hospital.hospital_id}`)}
                />
                </Box>
                <CardContent>
                  <Typography component="div" variant="h4" sx={{ cursor: "pointer" }}  onClick={() => navigate(`/hospital/${hospital.hospital_id}`)}>
                    {hospital.hospital_name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  {renderStars(hospital.hospital_rating)}&nbsp;
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      component="div"
                    >
                      
                      <Typography variant="text secondary" color= "green" >
                     {hospital.hospital_rating}&nbsp; Rating
                      </Typography>
                    </Typography>
                  </Box>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    component="div"
                  >
                    {hospital.hospital_address}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    component="div"
                  >
                    <strong>Services:</strong> {hospital.hospital_services}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    component="div"
                  >
                    <strong>Recent Enquiries:</strong> {hospital.hospital_recentEnquiries}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      href={`tel:${hospital.hospital_phone}`}
                      sx={{  "&:hover": {bgcolor: theme.palette.mode === "dark" ? "#00ffea": "#00ffea" , color: "#000" }}}
                      >
                     <CallIcon /> &nbsp; {hospital.hospital_phone}    
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      href={`mailto:${hospital.hospital_email}`}
                      sx={{  "&:hover": {bgcolor: theme.palette.mode === "dark" ? "#00ffea": "#00ffea" , color: "#000" }}}
                      >
                      <EmailIcon /> &nbsp; {hospital.hospital_email}
                    </Button>
                  </Box>
                </CardContent>
               
                <IconButton
                  onClick={() => toggleFavorite(index)}
                  sx={{ position: "absolute", top: 8, right: 8, color: hospital.isFavorite ? "red" : "grey"}}
                >
                  {hospital.isFavorite ? (
                    <FavoriteIcon  />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
              </Card>
            ))}

            {currentHospitals.length !== 0 ? (
            renderPagination()
            ) : null}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Hospital;























// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Grid,
//   TextField,
//   Card,
//   CardMedia,
//   CardContent,
//   Typography,
//   Button,
//   IconButton,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   FormLabel,
// } from "@mui/material";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import StarIcon from "@mui/icons-material/Star";
// import StarBorderIcon from "@mui/icons-material/StarBorder";
// import StarHalfIcon from "@mui/icons-material/StarHalf";
// import SearchIcon from "@mui/icons-material/Search";
// import ClearIcon from "@mui/icons-material/Clear";
// import { useTheme } from "@mui/material/styles";
// import { tokens } from "../../../theme";
// import axios from "axios";

// const Hospital = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const [hospitals, setHospitals] = useState([]);
//   const [filters, setFilters] = useState({
//     name: "",
//     rating: "",
//     address: "", // Single selected address
//     services: "", // New filter for services
//   });

//   const fetchHospitals = () => {
//     axios
//       .get("http://localhost:5000/api/hospitals")
//       .then((response) => {
//         const hospitalsWithFavorite = response.data.map((hospital) => ({
//           ...hospital,
//           isFavorite: false,
//         }));
//         setHospitals(hospitalsWithFavorite);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };

//   useEffect(() => {
//     fetchHospitals();
//   }, []);

//   const toggleFavorite = (index) => {
//     const updatedHospitals = [...hospitals];
//     updatedHospitals[index].isFavorite = !updatedHospitals[index].isFavorite;
//     setHospitals(updatedHospitals);
//   };

//   const renderStars = (rating) => {
//     const stars = [];
//     const integerPart = Math.floor(rating);
//     const decimalPart = rating - integerPart;

//     for (let i = 1; i <= 5; i++) {
//       if (i <= integerPart) {
//         stars.push(<StarIcon key={i} sx={{ color: "#FFA500" }} />);
//       } else if (i === integerPart + 1 && decimalPart >= 0.5) {
//         stars.push(<StarHalfIcon key={i} sx={{ color: "#FFA500" }} />);
//       } else {
//         stars.push(<StarBorderIcon key={i} sx={{ color: "#FFA500" }} />);
//       }
//     }

//     return stars;
//   };

//   const handleFilterChange = (event) => {
//     const { name, value } = event.target;

//     setFilters({
//       ...filters,
//       [name]: value,
//     });
//   };

//   const clearFilters = () => {
//     setFilters({
//       name: "",
//       rating: "",
//       address: "",
//       services: "",
//     });
//   };

//   const addressOptions = [
//     { label: "USA", value: "USA" },
//     { label: "Canada", value: "Canada" },
//     { label: "UK", value: "UK" },
//     { label: "India", value: "India" },
//     { label: "Australia", value: "Australia" },
//   ]; // Add more options as needed

//   const filteredHospitals = hospitals.filter((hospital) => {
//     const matchesName = hospital.hospital_name.toLowerCase().includes(filters.name.toLowerCase());
//     const matchesRating = !filters.rating || hospital.hospital_rating >= parseInt(filters.rating);
//     const matchesAddress = !filters.address || hospital.hospital_address.toLowerCase().includes(filters.address.toLowerCase());
//     const matchesServices = !filters.services || hospital.hospital_services.toLowerCase().includes(filters.services.toLowerCase());

//     return matchesName && matchesRating && matchesAddress && matchesServices;
//   });

//   return (
//     <Box
//       sx={{
//         color: "#fff",
//         minHeight: "100vh",
//         pt: "5rem",
//         display: "flex",
//         justifyContent: "center",
//       }}
//     >
//       <Box sx={{ width: "90%", px: 3 }}>
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={3}>
//             <Box sx={{ p: '1rem 1.5rem', bgcolor: theme.palette.mode === "dark" ? colors.grey[900] : '#fff', boxShadow: '0 10px 20px rgba(0,0,0,0.2)', borderRadius: 1 }}>
//               <Typography variant="h6" sx={{ mb: 2, color: theme.palette.mode === "dark" ? '#fff' : '#000' }}>
//                 Filters
//               </Typography>
//               <Box sx={{ position: 'relative' }}>
//                 <TextField
//                   name="name"
//                   variant="outlined"
//                   placeholder="Search by name"
//                   fullWidth
//                   value={filters.name}
//                   onChange={handleFilterChange}
//                   sx={{ mb: 3, borderRadius: '50px' }}
//                   InputProps={{
//                     // startAdornment: (
//                     //   <IconButton disabled>
//                     //     <SearchIcon />
//                     //   </IconButton>
//                     // ),
//                     endAdornment: (
//                       <IconButton onClick={clearFilters} disabled={!filters.name && !filters.rating && !filters.address && !filters.services}>
//                         <ClearIcon />
//                       </IconButton>
//                     ),
//                   }}
//                 />
//               </Box>
//               <FormLabel component="legend">Rating</FormLabel>
//               <RadioGroup
//                 aria-label="rating"
//                 name="rating"
//                 value={filters.rating}
//                 onChange={handleFilterChange}
//                 sx={{ mb: 3, color: theme.palette.mode === "dark" ? '#fff' : '#000' }}
//               >
//                 <FormControlLabel
//                   value="4"
//                   control={<Radio />}
//                   label="4 stars & above"
//                 />
//                 <FormControlLabel
//                   value="3"
//                   control={<Radio />}
//                   label="3 stars & above"
//                 />
//                 <FormControlLabel
//                   value="2"
//                   control={<Radio />}
//                   label="2 stars & above"
//                 />
//                 <FormControlLabel
//                   value=""
//                   control={<Radio />}
//                   label="Any rating"
//                 />
//               </RadioGroup>
//               <FormLabel component="legend">Address</FormLabel>
//               <RadioGroup
//                 aria-label="address"
//                 name="address"
//                 value={filters.address}
//                 onChange={handleFilterChange}
//                 sx={{ mb: 3, color: theme.palette.mode === "dark" ? '#fff' : '#000' }}
//               >
//                 {addressOptions.map((option, index) => (
//                   <FormControlLabel
//                     key={index}
//                     value={option.value}
//                     control={<Radio />}
//                     label={option.label}
//                   />
//                 ))}
//               </RadioGroup>
//               <FormLabel component="legend">Services</FormLabel>
// <RadioGroup
//   aria-label="services"
//   name="services"
//   value={filters.services}
//   onChange={handleFilterChange}
//   sx={{ mb: 3, color: theme.palette.mode === "dark" ? '#fff' : '#000' }}
// >
//   <FormControlLabel
//     value="Emergency"
//     control={<Radio />}
//     label="Emergency"
//   />
//   <FormControlLabel
//     value="Cardiology"
//     control={<Radio />}
//     label="Cardiology"
//   />
//   <FormControlLabel
//     value="Orthopedics"
//     control={<Radio />}
//     label="Orthopedics"
//   />
//   {/* Add more services as needed */}
// </RadioGroup>
//             </Box>
//           </Grid>
//           <Grid item xs={12} md={9}>
//             {filteredHospitals.map((hospital, index) => (
//               <Card
//                 key={index}
//                 sx={{
//                   display: "flex",
//                   mb: 3,
//                   position: "relative",
//                   bgcolor: theme.palette.mode === "dark" ? colors.dark : colors.light,
//                   boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
//                 }}
//               >
//                 <CardMedia
//                   component="img"
//                   sx={{ width: 190, height: 190, borderRadius: 1, margin: 2 }}
//                   image={hospital.hospital_images}
//                   alt={`${hospital.hospital_name}`}
//                 />
//                 <CardContent sx={{ flex: "1 0 auto" }}>
//                   <Typography component="div" variant="h5">
//                     {hospital.hospital_name}
//                   </Typography>
//                   <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                     {renderStars(hospital.hospital_rating)}
//                     <Typography
//                       variant="subtitle1"
//                       color="text.secondary"
//                       component="div"
//                       sx={{ marginLeft: 1 }}
//                     >
//                       {hospital.hospital_rating}
//                     </Typography>
//                   </Box>
//                   <Typography
//                     variant="subtitle1"
//                     color="text.secondary"
//                     component="div"
//                   >
//                     {hospital.hospital_address}
//                   </Typography>
//                   <Typography
//                     variant="subtitle1"
//                     color="text.secondary"
//                     component="div"
//                   >
//                     <strong>Services:</strong> {hospital.hospital_services}
//                   </Typography>
//                   <Typography
//                     variant="subtitle1"
//                     color="text.secondary"
//                     component="div"
//                   >
//                     <strong>Recent Enquiries:</strong> {hospital.hospital_enquiries}
//                   </Typography>
//                   <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       href={`tel:${hospital.hospital_phone}`}
//                       sx={{ bgcolor: "#4CAF50" }}
//                     >
//                       {hospital.hospital_phone}
//                     </Button>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       href={`mailto:${hospital.hospital_email}`}
//                       sx={{ bgcolor: "#4CAF50" }}
//                     >
//                       {hospital.hospital_email}
//                     </Button>
//                   </Box>
//                 </CardContent>
//                 <IconButton
//                   onClick={() => toggleFavorite(index)}
//                   sx={{ position: "absolute", top: 8, right: 8, color: "#ff0000" }}
//                 >
//                   {hospital.isFavorite ? (
//                     <FavoriteIcon />
//                   ) : (
//                     <FavoriteBorderIcon />
//                   )}
//                 </IconButton>
//               </Card>
//             ))}
//           </Grid>
//         </Grid>
//       </Box>
//     </Box>
//   );
// };


// export default Hospital;
