import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Paper,
  Grid,
  Avatar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

function AuthPage() {
  useEffect(() => {
    //scroll to top
    window.scrollTo(0, 0);
  }, []);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const apiUrl = "http://localhost:5000/api/auth";
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [registrationType, setRegistrationType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const [response, setResponse] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    "/images/clinic.jpg",
    "/images/hospital.jpg",
    "/images/pharmacy.jpeg",
    "/images/doctors.jpg",
    "/images/medicine.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const toggleForm = () => {
    setIsLogin((prevState) => !prevState);
    setRegistrationType("");
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setResponse("");
    if (isLogin && registrationType) {
      navigate(`/register/${registrationType}`);
    } else {
      navigate("/login");
    }
  };

  const backToRegisterType = () => {
    setRegistrationType("");
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setResponse("");
    navigate(`/register/${registrationType}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      axios
        .post(`${apiUrl}/login`, {
          email: formData.email,
          password: formData.password,
        })
        .then((res) => {
          localStorage.setItem("data", JSON.stringify(res.data.accessToken));
          localStorage.setItem("id", JSON.stringify(res.data.userData.id));
          if (res.data.userData.role === 0) {
            window.location.href = "/";
            // navigate("/");
          } else if (res.data.userData.role === 2) {
            window.location.href = "/";
            // navigate("/");
          } else {
            navigate("/admin");
          }
        })
        .catch((err) => {
          setResponse("Invalid email or password");
        });
    } else {
      let role;
      if (registrationType === "patient") {
        role = "0";
      } else if (registrationType === "doctor") {
        role = 1;
      } else if (registrationType === "hospital") {
        role = 3;
      } else {
        role = "5"; // Default role, if none of the above match
      }

      if (formData.password !== formData.confirmPassword) {
        setResponse("Passwords do not match");
        setTimeout(() => {
          setResponse("");
        }, 5000);
      } else {
        // console.log(role);
        // console.log(formData);
        console.log("name: ", formData.name);
        console.log("email: ", formData.email);
        console.log("password: ", formData.password);
        console.log("role: ", role);

        // const stringiformData = JSON.stringify(formData);

        // console.log("stringiformData: ", stringiformData);

        if (role) {
          axios
            .post(`${apiUrl}/register`, {
              name: formData.name,
              email: formData.email,
              password: formData.password,
              role: role,
            })
            .then((res) => {
              // console.log("res: ", res.data.message);
              setResponse(res.data.message);
              // Uncomment if you want to clear the form and reload the page after successful registration
              setFormData({ name: "", email: "", password: "", confirmPassword: "", role: "" });
              setTimeout(() => {
                setResponse("");
                window.location.reload();
              }, 2000);
            })
            .catch((res) => {
              //console.log("reseeee: ", res.response.data.message);
              setResponse(res.response.data.message);
              setTimeout(() => {
                setResponse("");
              }, 5000);
            });
        }
      }
    }
  };

  const handleSelectType = (type) => {
    setRegistrationType(type);
    if (type === "patient") {
      navigate("/register/patient");
    } else if (type === "doctor") {
      navigate("/register/doctor");
    
    } else if (type === "hospital") {
      navigate("/register/hospital");
    } 
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "4rem 0 0 0",
      }}
    >
      <Container >
        <Paper
          elevation={20}
          sx={{
            borderRadius: 2,
            minHeight: "70vh",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(0,0,0,0.9)"
                : "rgba(255,255,255,0.8)",
          }}
        >
          <Grid container sx={{ minHeight: "70vh" }}>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                position: "relative",
                overflow: "hidden",
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
                boxShadow: "10px 10px 20px 5px rgba(0,0,0,0.3)",
              }}
            >
              {images.map((image, index) => (
                <Box
                  key={index}
                  component="img"
                  src={image}
                  sx={{
                    position: index === currentImage ? "absolute" : "absolute",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "opacity 2s ease-in-out",
                    opacity: index === currentImage ? 1 : 0,
                    zIndex: index === currentImage ? 1 : 0,
                  }}
                />
              ))}
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    padding: 4,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgb(41,41,41,0.8)"
                        : "rgba(255,255,255,0.9)",
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "25%",
                    width: "100%",
                  }}
                >
                  <Typography variant="h2" gutterBottom>
                    Welcome to MedConnect
                  </Typography>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Your health is our priority
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                // justifyContent: isLogin ? "top" : "center",
                justifyContent: "center",
                padding: "0.8rem  2rem 2rem 2rem" ,
                minHeight: "70vh",
              }}
            >
              {isLogin && (
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mb: 2,
                    backgroundColor: colors.primary[100],
                  }}
                ></Avatar>
              )}
              {!isLogin && registrationType && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 5,
                    width: "100%",
                  }}
                >
                  <Button onClick={backToRegisterType} sx={{ p : "0 0.7rem 0 0" , borderRadius: 5 }}>
                    <KeyboardArrowLeftIcon
                      sx={{ fontSize: 30 }}
                    />
                    <Typography variant="h6">Back</Typography>
                  </Button>
                </Box>
              )}

              <Typography variant="h2" align="center" sx={{ marginBottom: 2 }}>
                {isLogin ? "Login" : "Register"}{" "}
                {registrationType &&
                  `as (${
                    registrationType === "patient" ? "User" : registrationType
                  })`}
              </Typography>
              {!isLogin && !registrationType && (
                <Box sx={{ textAlign: "center", marginBottom: 2 }}>
                  <Typography variant="h4" sx={{ marginBottom: 4 }}>
                    Select Registration Type:
                  </Typography>
                  <Button
                    onClick={() => handleSelectType("patient")}
                    variant="contained"
                    sx={{
                      margin: 1,
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      "&:hover": { backgroundColor: "#00ffea", color: "black" },
                    }}
                  >
                    User
                  </Button>
                  <Button
                    onClick={() => handleSelectType("doctor")}
                    variant="contained"
                    sx={{
                      margin: 1,
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      "&:hover": { backgroundColor: "#00ffea", color: "black" },
                    }}
                  >
                    Doctor
                  </Button>
                
                  <Button
                    onClick={() => handleSelectType("hospital")}
                    variant="contained"
                    sx={{
                      margin: 1,
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      "&:hover": { backgroundColor: "#00ffea", color: "black" },
                    }}
                  >
                    Hospital
                  </Button>
                 
                </Box>
              )}
              {(isLogin || registrationType) && (
                <form onSubmit={handleSubmit}>
                  {!isLogin && (
                    <TextField
                      label="Name"
                      variant="standard"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      fullWidth
                      required
                      sx={{ marginBottom: 2 }}
                    />
                  )}
                  <TextField
                    label="Email"
                    variant="standard"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    autoFocus={isLogin}
                    required
                    sx={{ marginBottom: 2 }}
                  />
                  <TextField
                    label="Password"
                    variant="standard"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ marginBottom: 2 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {!isLogin && (
                    <TextField
                      label="Confirm Password"
                      variant="standard"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      fullWidth
                      required
                      sx={{ marginBottom: 1 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowConfirmPassword}
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  {response && (
                    <Box
                      sx={{
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(0,0,0,0.9)"
                            : "rgba(255,255,255,0.8)",
                        padding: 1,
                        borderRadius: 5,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color:
                            response ===
                            "User registered successfully, Please login."
                              ? "green"
                              : "red",

                          fontSize: 16,
                          borderRadius: 5,
                        }}
                      >
                        {response}
                      </Typography>
                    </Box>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                      fontSize: 16,
                      fontWeight: 600,
                      marginTop: 1,
                      "&:hover": { backgroundColor: "#00ffea", color: "black" },
                    }}
                  >
                    {isLogin ? "Login" : "Register"}
                  </Button>
                </form>
              )}
              <Typography
                variant="body1"
                align="center"
                sx={{ marginTop: 2, fontSize: 14 }}
              >
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <Link
                  onClick={toggleForm}
                  sx={{ cursor: "pointer", color: "primary.main" }}
                >
                  {isLogin ? "Register here" : "Login here"}
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default AuthPage;
