import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import Slider from "react-slick";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
} from "@mui/material";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Trainer data
const services = [
  {
    name: "Hospitals",
    title: "Number of hospitals connected to the platform",
    image: "/hopital_img/image-K_8iKhxZB-transformed.png",
    social: [
      { icon: <FaFacebook />, link: "https://facebook.com" },
      { icon: <FaInstagram />, link: "https://instagram.com" },
      { icon: <FaTwitter />, link: "https://twitter.com" },
    ],
  },
  {
    name: "Doctors",
    title: "Number of doctors connected to the platform",
    image: "/hopital_img/image-dN5DJSOQM-transformed.png",
    social: [
      { icon: <FaFacebook />, link: "https://facebook.com" },
      { icon: <FaInstagram />, link: "https://instagram.com" },
      { icon: <FaTwitter />, link: "https://twitter.com" },
    ],
  },
  {
    name: "Medicines",
    title: "All kinds of medicines available",
    image: "/hopital_img/image.png",
    social: [
      { icon: <FaFacebook />, link: "https://facebook.com" },
      { icon: <FaInstagram />, link: "https://instagram.com" },
      { icon: <FaTwitter />, link: "https://twitter.com" },
    ],
  },
];

// Custom Arrow component for Slider
const Arrow = ({ className, style, onClick, icon }) => {
  const theme = useTheme();
  
  return (
  <div
    className={className}
    style={{
      ...style,
      display: "block",
      color: theme.palette.mode === "dark" ? "#00ffea" : "#000",
      fontSize: "3rem",
      zIndex: 2,
    }}
    onClick={onClick}
  >
    {icon}
  </div>

)
};


const List = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    beforeChange: (oldIndex, newIndex) => setCurrentIndex(newIndex),
    nextArrow: <Arrow icon={<ArrowForwardIosIcon />} />,
    prevArrow: <Arrow icon={<ArrowBackIosIcon />} />,
    appendArrows: (arrows) => (
      <div
        style={{
          position: "absolute",
          top: "50%",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          zIndex: 1,
        }}
      >
        {arrows}
      </div>
    ),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
    ],
    customPaging: (i) => (
      <div
        style={{
          width: "10px",
          height: "10px",
          background: i === currentIndex ? "#00ffea" : "#4d4d4d",
          borderRadius: "50%",
          display: "inline-block",
          margin: "0 5px",
          opacity: 1,
        }}
      ></div>
    ),
  };

  // Style for the active card
  const getCardStyle = (index) => {
    const centerIndex =
      (Math.floor(settings.slidesToShow / 2) + currentIndex) % services.length;
    return {
      border: index === centerIndex ? "3px solid #00ffea" : "none",
      marginTop: index === centerIndex ? "0px" : "40px",
      transition: "margin-top 0.4s",
      boxShadow:
        index === centerIndex ? "0 20px 30px rgba(0, 0, 0, 0.3)" : "none",
    };
  };

  return (
    <Box
     id = "Services"
      sx={{
        pt: 10,
        pb: 10,
        textAlign: "center",
        minHeight: "104vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.mode === 'dark' 
      ? colors.grey[900] 
      : '#e9e9e9e1',
  }}
    >
      {/* Hide the default arrow of slick slider */}
      <style>
        {`
          .slick-prev:before, .slick-next:before {
            content: '' !important;
          }
        `}
      </style>
      <Container maxWidth="xl" sx={{ width: "100%", boxSizing: "border-box" }}>
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
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  border: "1px solid ",
                  width: "100px",
                  display: "block",
                  marginRight: "10px",
                 borderColor: theme.palette.mode === "dark" ? "#00ffea" : "#00a698",
                  // marginTop: "200px",
                }}
              ></span>
              <span style={{ padding: "0px 10px" , fontSize: 32,
              
              }}>Our services</span>
              <span
                style={{
                  border: "1px solid ",
                  width: "100px",
                  display: "block",
                  marginLeft: "10px",
                  borderColor: theme.palette.mode === "dark" ? "#00ffea" : "#00a698",
                }}
              ></span>
            </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{
            color: theme.palette.mode === "dark" ? "#fff" : "#000",
            marginBottom: 6,
            marginTop: 0,
            fontSize: "1.2rem",
          }}
        >
          Our services are designed to help you achieve your fitness goals
        </Typography>
        <Box sx={{ margin: "0 auto", width: "100%", maxWidth: "80%" }}>
          <Slider {...settings}>
            {services.map((service, index) => (
              <Box
                key={index}
                sx={{ padding: "0 20px", outline: "none", width: "100%" }}
              >
                <Card
                  sx={{
                    backgroundColor: theme.palette.mode === "dark" ? colors.grey[900] : '#fff',
                    borderRadius: "10px",
                    overflow: "hidden",
                    height: "450px",
                    ...getCardStyle(index),
                  }}
                >
                  <CardMedia
                    component="img"
                    image={service.image}
                    alt={service.title}
                    sx={{ height: "300px" }}
                  />
                  <CardContent
                    sx={{
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        color:
                          theme.palette.mode === "dark" ? "#00ffea" : "#000",
                        fontWeight: "bold",
                      }}
                    >
                      {service.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        color:
                          theme.palette.mode === "dark"
                            ? "#fff"
                            : "rgba(0, 30, 60, 0.9)",
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 2,
                      }}
                    >
                      {service.social.map((social, idx) => (
                        <Button
                          key={idx}
                          sx={{
                            minWidth: "auto",
                            margin: "0 5px",
                            fontSize: "2em",
                          }}
                          href={social.link}
                          target="_blank"
                        >
                          {social.icon}
                        </Button>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Slider>
        </Box>
      </Container>
    </Box>
  );
};

export default List;