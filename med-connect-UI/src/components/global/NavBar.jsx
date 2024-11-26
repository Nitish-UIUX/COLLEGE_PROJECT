import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  Avatar,
  Badge,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import axios from "axios";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SettingsIcon from "@mui/icons-material/Settings";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function NavBar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const apiUrl = "http://localhost:5000/api/auth";
  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );
  const profileRef = useRef();
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");

  localStorage.setItem("mode", theme.palette.mode);

  useEffect(() => {
    const handleStorageChange = () => {
      setCartItems(JSON.parse(localStorage.getItem("cartItems")) || []);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCartItems(JSON.parse(localStorage.getItem("cartItems")) || []);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchProfile = () => {
    const token = localStorage.getItem("data");
    //timedelay
    setTimeout(() => {
      if (token) {
        axios
          .get(`${apiUrl}/userById`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            console.log(res.data);
            setProfileName(res.data.user);
            setProfileEmail(res.data.email);
            setProfileImage(res.data.profile_image);
            // setAppointments(res.data.doctor_appointments);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }, 1000);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogin = () => {
    const token = localStorage.getItem("data");

    if (token) {
      setOpen(!open);
    } else {
      navigate("/login");
    }
  };

  const Logout = () => {
    const token = localStorage.getItem("data");
    if (token) {
      axios
        .post(
          `${apiUrl}/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          localStorage.removeItem("data");
          navigate("/");
          window.location.reload();
          setOpen(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const profile = () => {
    navigate("/userdashboard");
    setOpen(false);
  };

  const scrollToSection = (sectionId) => {
    navigate("/");
    setTimeout(() => {
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop,
          behavior: "smooth",
        });
      }
    }, 80);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box
      sx={{
        top: 0,
        zIndex: 1000,
        width: "100%",
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(0, 0, 0, 0.52)"
            : "rgba(255, 255, 255, 0.52)",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.25)",
        backdropFilter: "blur(10px)",
        position: "fixed",
        padding: "0px 40px",
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid #00ffea42",
      }}
    >
      {/* Logo */}
      <Box
        display="flex"
        alignItems="center"
        onClick={() => navigate("/")}
        sx={{
          cursor: "pointer",
          height: "2.8rem",
          width: "8rem",
          borderRadius: "50%",
          pt: "0.5rem",
        }}
      >
        <img
          src={
            theme.palette.mode === "dark" ? "/logoDark.png" : "/logoLight.png"
          }
          alt="Logo"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
      </Box>

      {/* Navigation Links */}
      <Box display="flex" alignItems="center">
        {["Home", "About", "InTouch", "Services", "FAQ"].map(
          (section, index) => (
            <Link
              key={index}
              to={`/${section === "Home" ? "" : "#" + section}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                backgroundColor: "transparent",
                transition: "background-color 0.3s",
              }}
              onClick={() => scrollToSection(section)}
            >
              <Typography
                variant="body1"
                sx={{
                  padding: "1rem 0.5rem",
                  fontSize: "1.1rem",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: 0,
                    height: theme.palette.mode === "dark" ? "2px" : "3px",
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#00ffea" : "#00afa1",
                    transition: "width 0.3s ease-in-out",
                  },
                  "&:hover": {
                    color:
                      theme.palette.mode === "dark" ? "#00ffea" : "#00887c",
                  },
                  "&:hover::after": {
                    width: "100%",
                  },
                }}
              >
                {section}
              </Typography>
            </Link>
          )
        )}

        <div
          style={{
            height: "20px",
            width: "1px",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.5)"
                : "rgba(0, 0, 0, 0.3)",
            margin: "0 20px",
          }}
        />

        {cartItems.length > 0 && (
          <>
            <IconButton
              onClick={() => navigate("/cart")}
              sx={{
                "&:hover": {
                  background:
                    theme.palette.mode === "dark" ? "transparent" : "#00ffea",
                },
              }}
            >
              <Badge badgeContent={cartItems.length} color="secondary">
                <ShoppingCartOutlinedIcon
                  sx={{
                    "&:hover": {
                      color: theme.palette.mode === "dark" ? "#00ffea" : "#000",
                    },
                  }}
                />
              </Badge>
            </IconButton>
            <div
              style={{
                height: "20px",
                width: "1px",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.5)"
                    : "rgba(0, 0, 0, 0.3)",
                margin: "0 20px",
              }}
            />
          </>
        )}

        <IconButton
          onClick={colorMode.toggleColorMode}
          sx={{
            "&:hover": {
              background:
                theme.palette.mode === "dark" ? "transparent" : "#00ffea",
            },
          }}
        >
          {theme.palette.mode === "dark" ? (
            <LightModeOutlinedIcon
              sx={{
                color: colors.grey[100],
                "&:hover": { color: "#00ffea" },
                fontSize: "1.5rem",
              }}
            />
          ) : (
            <DarkModeOutlinedIcon
              sx={{
                "&:hover": { color: colors.grey[100] },
                fontSize: "1.5rem",
              }}
            />
          )}
        </IconButton>

        <IconButton
          onClick={handleLogin}
          sx={{
            "&:hover": {
              background:
                theme.palette.mode === "dark" ? "transparent" : "#00ffea",
            },
          }}
        >
          {localStorage.getItem("data") === null ? (
            <PersonOutlinedIcon
              sx={{
                "&:hover": {
                  color: theme.palette.mode === "dark" ? "#00ffea" : "#000",
                },
                fontSize: "1.5rem",
              }}
            />
          ) : (
            <Avatar
              sx={{ width: 23, height: 23 }}
              src={`/images/profile_pic/${profileImage}`}
            />
          )}
        </IconButton>

        {open && (
          <Box
            ref={profileRef}
            id="profile"
            sx={{
              position: "absolute",
              top: "60px",
              right: "20px",

              borderRadius: "8px",
              // boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              width: "250px",
              zIndex: 1000,
            }}
          >
            <Box
              sx={{
                zIndex: 1000,
                flexDirection: "row",
                display: "flex",
                mt: "5px",
                backgroundColor:
                  theme.palette.mode === "dark" ? "#000" : "#fff",
                borderTopLeftRadius: "50px",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
                borderBottomLeftRadius: "50px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.5)",
                border: "1px solid",
                borderColor: theme.palette.mode === "dark" ? "#333" : "#f5f5f5",
              }}
            >
              <Avatar
                sx={{ marginRight: "8px", width: 60, height: 60 }}
                src={`/images/profile_pic/${profileImage}`}
              />
              <Box sx={{ mt: "8px" }}>
                <Typography variant="h4" fontWeight="bold">
                  {profileName}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {profileEmail}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                zIndex: 1000,
                mt: "5px",
                backgroundColor:
                  theme.palette.mode === "dark" ? "#000" : "#fff",
                borderRadius: "7px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.5)",
                border: "1px solid",
                borderColor: theme.palette.mode === "dark" ? "#333" : "#f5f5f5",
              }}
            >
              <List>
                <ListItem button onClick={profile}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <RadioButtonUncheckedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Notifications" />
                  <ArrowForwardIosIcon fontSize="small" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <StarIcon />
                  </ListItemIcon>
                  <ListItemText primary="Orders" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItem>
              </List>
              <Divider />
              <Box sx={{ p: 0.5 }}>
                <ListItem button onClick={Logout}>
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="Log Out" />
                </ListItem>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default NavBar;
