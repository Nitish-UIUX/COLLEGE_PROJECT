import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Update the image paths according to your project's structure
const imageMapping = [
  { src: "/images/hospital.jpg", route: "/hospitals", hoverText: "Top Hospitals" },
  { src: "/images/doctors.jpg", route: "/doctor", hoverText: "Find Doctors" },
  // { src: "/images/clinic.jpg", route: "/clinic", hoverText: "Nearest Clinic" },
  { src: "/images/medicine.jpg", route: "/medicine", hoverText: "Order Medicines" },
  // { src: "/images/pharmacy.jpeg", route: "/pharmacy", hoverText: "Locate Pharmacies" },
  // { src: "path/to/image6.jpg", route: "/path/to/Vaccines", hoverText: "Vaccines" },
  // { src: "path/to/image7.jpg", route: "/path/to/Colorize", hoverText: "Colorize" },
];

function MedOption() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [hoverIndex, setHoverIndex] = useState(null);

  const buttonStyle = {
    height: "7.5rem",
    width: "16%",
    borderRadius: "10px",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  };

  const imageStyle = {
    width: "110%",
    height: "auto",
    objectFit: "cover",
    borderRadius: "10px",
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)",
  };

  const hoverTextStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: '0.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: '1rem',
    borderRadius: '10px',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
  };

  const renderButtons = () => {
    return imageMapping.map(({ src, route, hoverText }, index) => (
      <Button
        key={index}
        style={buttonStyle}
        onClick={() => route && navigate(route)}
        onMouseEnter={() => setHoverIndex(index)}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <img src={src} alt={`Option ${index + 1}`} style={imageStyle} />
        <div style={{ ...hoverTextStyle, opacity: hoverIndex === index ? 1 : 0 }}>
          {hoverText}
        </div>
      </Button>
    ));
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === "dark" ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)',
        color: colors.grey[100],
        textAlign: "center",
        position: "relative",
        minHeight: "10vh",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Box
        sx={{
          // backgroundColor: theme.palette.mode === "dark" ? "rgba(0,0,0, 0.2)" : "rgba(255,255,255, 0.2 )",
          // backdropFilter: "blur(20px)",
          padding: "1rem 0rem",
          // boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
          borderRadius: "20px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "75%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: 'wrap',
          gap: "1.7rem",
        }}
      >
        {renderButtons()}
      </Box>
    </Box>
  );
}

export default MedOption;
