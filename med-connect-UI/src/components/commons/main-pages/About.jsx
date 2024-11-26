import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import { Box, Typography, Grid } from "@mui/material";

function About() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const borderColor = theme.palette.mode === "dark" ? "#00ffea" : "#00a698";

  return (
    <Box
      id="About"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        padding: "2rem",
        marginBottom: "10vh",
        minHeight: "102vh",
      }}
    >
      <Typography
        sx={{
          fontSize: "1.2rem",
          lineHeight: "30px",
          textTransform: "uppercase",
          letterSpacing: "1.4px",
          fontWeight: 400,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span
          style={{
            border: "1px solid",
            width: "100px",
            marginRight: "10px",
            borderColor: borderColor,
          }}
        ></span>
        <span style={{ padding: "0 10px", fontSize: 32 }}>What Are We About</span>
        <span
          style={{
            border: "1px solid",
            width: "100px",
            marginLeft: "10px",
            borderColor: borderColor,
          }}
        ></span>
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "80%",
          height: "70vh",
        }}
      >
        <Grid
          container
          spacing={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
            width: "50%",
            height: "100%",
          }}
        >
          <Typography
            sx={{
              color: colors.grey[200],
              textAlign: "justify",
              textJustify: "inter-word",
              marginBottom: "1rem",
              fontSize: "1.3rem",
            }}
          >
            We are a team who are passionate about providing the best healthcare services to our
            patients. We are dedicated to providing the best care and treatment to our patients. We
            are committed to providing the best care and treatment to our patients.
          </Typography>
        </Grid>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "80%",
            padding: "0.5rem",
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "10px",
            marginRight: "1rem",
          }}
        >
          <img
            src="./images/doct1.jpg"
            alt="contact"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            width: "25%",
            height: "50%",
            padding: "0.5rem",
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "10px",
            top: "190%",
            left: "73%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <img
            src="./images/doct2.jpg"
            alt="contact"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default About;
