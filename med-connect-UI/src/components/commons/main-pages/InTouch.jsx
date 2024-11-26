import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme.js";
import { Box, Typography, Grid, TextField, Button } from "@mui/material";

function InTouch() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted", formData);
  };

  return (
    <Box
      id="InTouch"
      sx={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "3rem",
        backgroundImage: `
          linear-gradient(
            ${theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.1)"},
            ${theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.9)"}
          ),
          url('./images/ContactCover.jpg')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        overflow: "hidden",
        "::before": {
          content: '""',
          position: "absolute",
          top: -75,
          left: 0,
          width: "100%",
          height: "20vh",
          backgroundColor: theme.palette.mode === "dark" ? colors.grey[800] : "#efefef",
          borderBottomRightRadius: "50%",
          borderBottomLeftRadius: "50%",
          boxShadow: 20,
          border: `1px solid ${colors.grey[900]}`,
        },
      }}
    >
      <Typography
        sx={{
          color: colors.primary.main,
          marginTop: "8rem",
          marginBottom: "3rem",
          textTransform: "uppercase",
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
            borderColor: theme.palette.mode === "dark" ? "#00ffea" : "#00a698",
          }}
        ></span>
        <span style={{ padding: "0px 10px", fontSize: 36 }}>Get in Touch</span>
        <span
          style={{
            border: "1px solid",
            width: "100px",
            marginLeft: "10px",
            borderColor: theme.palette.mode === "dark" ? "#00ffea" : "#00a698",
          }}
        ></span>
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
          maxWidth: "1200px",
          margin: "auto",
          gap: "2rem",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: { xs: "100%", md: "46%" },
            height: { xs: "50vh", md: "70vh" },
            padding: "0.5rem",
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "10px",
            border: `1px solid ${colors.grey[700]}`,
          }}
        >
          <img
            src="./images/contact2.jpg"
            alt="contact"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "10%",
              transform: "translate(-50%, -50%)",
              width: { xs: "60%", md: "50%" },
              height: "50%",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "10px 10px 10px rgba(0,0,0,0.6)",
              padding: "0.5rem",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <img
              src="./images/contact1.jpg"
              alt="contact"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            padding: { xs: "1.5rem", md: "2.5rem" },
            backgroundColor: theme.palette.mode === "dark" ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)",
            borderRadius: "10px",
            boxShadow: 3,
            border: `1px solid ${colors.grey[700]}`,
          }}
        >
          <Typography variant="h5" sx={{ color: colors.grey[200], marginBottom: "1.5rem" }}>
            Contact Us
          </Typography>
          <Typography
            sx={{
              color: colors.grey[100],
              marginBottom: "2rem",
              fontSize: "1rem",
              textAlign: "justify",
              textJustify: "inter-word",
            }}
          >
            We are here to assist you with any questions or concerns you may have. Feel free to reach out to us via the contact form below, or give us a call. Our dedicated team is available to provide support and guidance.
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: colors.grey[400] } }}
                  InputProps={{ style: { color: colors.grey[300] }, "aria-label": "Full Name" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: colors.grey[400] } }}
                  InputProps={{ style: { color: colors.grey[300] }, "aria-label": "Email" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: colors.grey[400] } }}
                  InputProps={{ style: { color: colors.grey[300] }, "aria-label": "Phone Number" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Message"
                  variant="outlined"
                  required
                  multiline
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: colors.grey[400] } }}
                  InputProps={{ style: { color: colors.grey[300] }, "aria-label": "Message" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ fontSize: "1rem", fontWeight: "bold" }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default InTouch;
