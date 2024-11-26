import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import {
  Typography,
  Box,
  Container,
  InputBase,
  Button,
  MenuItem,
  Select,
  Avatar,
  Chip,
  Paper,
  IconButton,
  Divider,
  ListItemAvatar,
  ListItemText,
  ListItem,
} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { styled } from "@mui/system";

const SearchBarContainer = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "2px 4px",
  borderRadius: "50px",
  width: "100%",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.5)"
      : "rgba(255, 255, 255, 0.5)",
  border: "1px solid",
  borderColor: theme.palette.mode === "dark" ? "#00ffea" : "#0065ca",
  marginBottom: theme.spacing(2),
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  flex: 1,
  color: "inherit",
}));

const IconButtons = styled(IconButton)(({ theme }) => ({
  padding: 10,
  color: theme.palette.mode === "dark" ? "#fff" : "#000",
}));

const suggestions = [
  {
    name: "Dr. Rajeev Rajan",
    role: "Neurologist",
    avatar: "/images/doctors_images/doc6.jpg",
  },
  {
    name: "Dr. Arvind Mishra",
    role: "Pediatrician",
    avatar: "/images/doctors_images/doc2.jpg",
  },
  {
    name: "Dr. Ashish Joy",
    role: "Gynecologist",
    avatar: "/images/doctors_images/doc4.jpg",
  },
  {
    name: "Dr. Indu Rani Minz",
    role: "Psychiatrist",
    avatar: "/images/doctors_images/doc3.jpg",
  },
  {
    name: "Dr. Parladh jha",
    role: "Radiologist",
    avatar: "/images/doctors_images/doc1.jpg",
  },
];

const images = [
  "/images/cover.jpg",
  "/images/cover1.jpg",
  "/images/cover2.jpg",
  "/images/cover3.jpg",
  "/images/cover4.jpg",
  "/images/cover5.jpg",
  "/images/cover6.jpg",
  "/images/cover7.jpg",
];

function Hero() {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchValue, setSearchValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("doctor");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSearch = () => {
    navigate(`/${selectedOption}${searchValue ? `/${searchValue}` : ""}`);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 60000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  const nextSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <Box
      id="Home"
      sx={{
        backgroundImage:
          theme.palette.mode === "dark"
            ? `linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.9)), url(${images[currentImageIndex]})`
            : `linear-gradient(180deg, rgba(0,0,0,0.1), rgba(255,255,255,0.5),rgba(255,255,255,0.9),rgba(255,255,255,0.5), rgba(0,0,0,0.2)), url(${images[currentImageIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "102vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "20px",
        position: "relative",
      }}
    >
      <div
        className="image-slider-left"
        style={{
          position: "absolute",
          top: "50%",
          left: "2%",
          transform: "translateY(-50%)",
        }}
      >
        <IconButton
          onClick={prevSlide}
          style={{ marginRight: "10px" }}
        >
          <NavigateBeforeIcon fontSize="large" />
        </IconButton>
      </div>

      <div
        className="image-slider-right"
        style={{
          position: "absolute",
          top: "50%",
          right: "2%",
          transform: "translateY(-50%)",
        }}
      >
        <IconButton
          onClick={nextSlide}
          style={{ marginLeft: "10px" }}
        >
          <NavigateNextIcon fontSize="large" />
        </IconButton>
      </div>

      <Container
        maxWidth="lg"
        sx={{
          borderRadius: "20px",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Box className="container">
          <Typography
            style={{
              fontSize: "1.2rem",
              lineHeight: "30px",
              textTransform: "uppercase",
              letterSpacing: "1.4px",
              fontWeight: 400,
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <span
              style={{
                border: "1px solid",
                width: "100px",
                marginRight: "10px",
                borderColor: "#00ffea",
              }}
            ></span>
            
          <Typography
            style={{
              fontSize: "60px",
              lineHeight: "60px",
              fontWeight: 700,
              textAlign: "center",
              letterSpacing: "1.4px",
              padding: "10px 0px 20px",
            }}
          >
           Med Connect
          </Typography>
            <span
              style={{
                border: "1px solid",
                width: "100px",
                marginLeft: "10px",
                borderColor: "#00ffea",
              }}
            ></span>
          </Typography>
          <Typography
            style={{
              fontSize: 20,
              lineHeight: "24px",
              padding: "10px 0px 20px",
              textAlign: "center",
              wordSpacing: "1px",
            }}
          >
            We are here to help you find the best healthcare services in your area.
            <br />
            We offer a wide range of services to meet your needs.
          </Typography>
        </Box>
      </Container>

      <Container maxWidth="lg">
        <SearchBarContainer onSubmit={handleSearch} component="form">
          <Select
            variant="standard"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            sx={{
              borderRadius: "50px",
              "&:before, &:after": {
                display: "none",
              },
            }}
          >
            <MenuItem value="doctor" sx={{ padding: 1 }}>
              <ListItem sx={{ padding: 0 }}>
                <ListItemAvatar sx={{ minWidth: "32px" }}>
                  <Avatar sx={{ width: 24, height: 24, marginLeft: 1 }}>
                    <img
                      src="/images/HeroOptions/doctor.png"
                      alt="Doctor"
                      style={{ width: "100%" }}
                    />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Doctor" sx={{ marginLeft: 1 }} />
              </ListItem>
            </MenuItem>
            <MenuItem value="hospitals" sx={{ padding: 1 }}>
              <ListItem sx={{ padding: 0 }}>
                <ListItemAvatar sx={{ minWidth: "32px" }}>
                  <Avatar sx={{ width: 24, height: 24, marginLeft: 1 }}>
                    <img
                      src="/images/HeroOptions/hospital.png"
                      alt="Hospital"
                      style={{ width: "100%" }}
                    />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Hospital" sx={{ marginLeft: 1 }} />
              </ListItem>
            </MenuItem>
            {/* <MenuItem value="clinic" sx={{ padding: 1 }}>
              <ListItem sx={{ padding: 0 }}>
                <ListItemAvatar sx={{ minWidth: "32px" }}>
                  <Avatar sx={{ width: 24, height: 24, marginLeft: 1 }}>
                    <img
                      src="/images/HeroOptions/clinic.png"
                      alt="Clinic"
                      style={{ width: "100%" }}
                    />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Clinic" sx={{ marginLeft: 1 }} />
              </ListItem>
            </MenuItem> */}
            <MenuItem value="pharmacy" sx={{ padding: 1 }}>
              <ListItem sx={{ padding: 0 }}>
                <ListItemAvatar sx={{ minWidth: "32px" }}>
                  <Avatar sx={{ width: 24, height: 24, marginLeft: 1 }}>
                    <img
                      src="/images/HeroOptions/pharmacy.png"
                      alt="Pharmacy"
                      style={{ width: "100%" }}
                    />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Medicine" sx={{ marginLeft: 1 }} />
              </ListItem>
            </MenuItem>
          </Select>

          <Divider
            orientation="vertical"
            style={{ height: "30px", marginLeft: "10px", marginRight: "10px" }}
          />

          <SearchInput
            placeholder="Search for Doctors, Hospitals, Clinics, Medicines..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            inputProps={{ "aria-label": "search" }}
          />
          <IconButton
            style={{ padding: 10 }}
            disabled={searchValue === ""}
            onClick={() => setSearchValue("")}
          >
            <ClearIcon />
          </IconButton>

          <Button
          type="submit"
            onClick={handleSearch}
            variant="contained"
            sx={{
              borderRadius: "50px",
              marginLeft: "10px",
              marginRight: "2px",
              width: "10rem",
              backgroundColor:
                theme.palette.mode === "dark" ? "#00ffea" : "#333",
              color: theme.palette.mode === "dark" ? "#000" : "#fff",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#00ffeaad" : "#000",
                color: theme.palette.mode === "dark" ? "#000" : "#fff",
              },
            }}
          >
            <SearchIcon /> <span style={{ fontSize: "0.8rem" }}>Search</span>
          </Button>
        </SearchBarContainer>

        <Box mt={2} display="flex" flexWrap="wrap" justifyContent="center">
          {suggestions.map((item, index) => (
            <Chip
              key={index}
              avatar={<Avatar src={item.avatar} />}
              label={`${item.name} (${item.role})`}
              style={{ margin: 4 }}
              onClick={() => setSearchValue(item.name)}
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(0,0,0,0.5)"
                    : "rgba(255,255,255,0.5)",
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default Hero;
