import React from "react";
import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Link,
  IconButton,
  Container,
  TextField,
  Button,
} from "@mui/material";
import { Facebook, Instagram, LinkedIn, YouTube } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import XIcon from "@mui/icons-material/X";

const Footer = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [email, setEmail] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = () => {
    // Handle newsletter signup here, e.g., send email to backend
    console.log("Newsletter signup submitted with email:", email);
    // Clear email input after submission
    setEmail("");
  };

  return (
    <Box
      sx={{
        pt: 6,
        pb: 2,
        px: 3,
        bgcolor:
          theme.palette.mode === "dark"
            ? "rgba(0, 0, 0, 0.8)"
            : "rgba(240, 255, 255, 0.9)",
        color: colors.grey[100],
        // borderTop: `1px solid #00ffea`,
        borderTopLeftRadius: "10rem",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* First Column: Popular Features */}
          <Grid item xs={12} sm={2}>
            <Box>
              <Typography variant="h2" gutterBottom>
                Popular Features
              </Typography>
              <Box>
                <Link
                  href="#"
                  color="inherit"
                  display="block"
                  sx={{
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": {
                      color:
                        theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                    },
                  }}
                >
                  All Products and Features
                </Link>
                <Link
                  href="#"
                  color="inherit"
                  display="block"
                  sx={{
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": {
                      color:
                        theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                    },
                  }}
                >
                  Free Meeting Scheduler App
                </Link>
                <Link
                  href="#"
                  color="inherit"
                  display="block"
                  sx={{
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": {
                      color:
                        theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                    },
                  }}
                >
                  Social Media Tools
                </Link>
                <Link
                  href="#"
                  color="inherit"
                  display="block"
                  sx={{
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": {
                      color:
                        theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                    },
                  }}
                >
                  Email Tracking Software
                </Link>
                <Link
                  href="#"
                  color="inherit"
                  display="block"
                  sx={{
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": {
                      color:
                        theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                    },
                  }}
                >
                  Sales Email Automation
                </Link>
                
              </Box>
            </Box>
          </Grid>

         

          {/* Third Column: Company */}
          <Grid item xs={12} sm={2}>
            <Box>
              <Typography variant="h2" gutterBottom>
                Company
              </Typography>
              <Box>
                <Link
                  href="#"
                  color="inherit"
                  display="block"
                  sx={{
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": {
                      color:
                        theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                    },
                  }}
                >
                  About Us
                </Link>
                <Link
                  href="#"
                  color="inherit"
                  display="block"
                  sx={{
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": {
                      color:
                        theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                    },
                  }}
                >
                  Careers
                </Link>
                <Link
                  href="#"
                  color="inherit"
                  display="block"
                  sx={{
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": {
                      color:
                        theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                    },
                  }}
                >
                  Management Team
                </Link>
                <Link
                  href="#"
                  color="inherit"
                  display="block"
                  sx={{
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": {
                      color:
                        theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                    },
                  }}
                >
                  Board of Directors
                </Link>
                <Link
                  href="#"
                  color="inherit"
                  display="block"
                  sx={{
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": {
                      color:
                        theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                    },
                  }}
                >
                  Investor Relations
                </Link>
                <Link
                  href="#"
                  color="inherit"
                  display="block"
                  sx={{
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": {
                      color:
                        theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                    },
                  }}
                >
                  Blog
                </Link>
                <Link
                  href="#"
                  color="inherit"
                  display="block"
                  sx={{
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": {
                      color:
                        theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                    },
                  }}
                >
                  Contact Us
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Fourth Column: Customers */}
          <Grid item xs={12} sm={2}>
            <Box>
              <Typography variant="h2" gutterBottom>
                Customers
              </Typography>
              <Box>
                <Link
                  href="#"
                  color="inherit"
                  display="block"
                  sx={{
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": {
                      color:
                        theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                    },
                  }}
                >
                  Customer Support
                </Link>
                <Link
                  href="#"
                  color="inherit"
                  display="block"
                  sx={{
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": {
                      color:
                        theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                    },
                  }}
                >
                  Join a Local User Group
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Fifth Column: Partners */}
          <Grid item xs={12} sm={2.2}>
            <Box>
              <Typography variant="h2" gutterBottom>
                Partners
              </Typography>
              <Box>
                <Link
                  href="#"
                  color="inherit"
                  display="block"
                  sx={{
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": {
                      color:
                        theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                    },
                  }}
                >
                  Shashank Shekhar Bhagat<br/> (backend & UI/UX designer)
                </Link>
                <Link
                  href="#"
                  color="inherit"
                  display="block"
                  sx={{
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": {
                      color:
                        theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                    },
                  }}
                >
                  Nitish Kumar<br/> (frontend & UI/UX designer)
                </Link>
                <Link
                  href="#"
                  color="inherit"
                  display="block"
                  sx={{
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": {
                      color:
                        theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                    },
                  }}
                >
                  Priyanshu Kailash Gupta<br/> (frontend & search engine optimization)
                </Link>
                {/* <Link
                  href="#"
                  color="inherit"
                  display="block"
                  sx={{
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": {
                      color:
                        theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                    },
                  }}
                >
                  HubSpot for Startups
                </Link>
                <Link
                  href="#"
                  color="inherit"
                  display="block"
                  sx={{
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": {
                      color:
                        theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                    },
                  }}
                >
                  Affiliate Program
                </Link> */}
              </Box>
            </Box>
          </Grid>
          <Grid item>
            {/* Newsletter Signup */}
            <Box textAlign="center">
              <Typography variant="h2" gutterBottom>
                Newsletter
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Stay updated with our latest news and updates.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                  flexDirection: "column",
                }}
              >
                <TextField
                  type="email"
                  label=" Your Email...."
                  variant="outlined"
                  value={email}
                  onChange={handleEmailChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "50px",
                      backgroundColor: theme.palette.mode === "dark" ? "#000" : "#fff",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                          padding: "7px 30px",
                          borderRadius: "50px",
                          backgroundColor: "#00ffea",
                          color: "#000",
                          "&:hover": { backgroundColor: "#00ff8c" },
                        }}
                      >
                        Subscribe
                      </Button>
                    ),
                  }}
                />
                <Typography variant="body2" color="textSecondary">
                  By submitting your email, 
              
                  you agree to our Terms <br />of     Service and Privacy Policy.
               
                  and to receive   <br /> marketing emails from MedConnect.
                  <br />
                  You can unsubscribe at any time.
                  <br />
                  we promise not to spam you.
                </Typography>

              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box mt={4} textAlign="center">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              mb: 3,
            }}
          >
            <hr
              style={{
                flexGrow: 1,
                border: 0,
                borderTop: '1px solid ',
                borderColor: theme.palette.mode === "dark" ? "#00ffea" : colors.grey[300],
                margin: "0.5rem 0",
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
              <IconButton
                href="https://facebook.com"
                sx={{
                  backgroundColor: "inherit",
                  border: "3px solid transparent",
                  color: "inherit",
                  "&:hover": {
                    color: "#0866FF",
                    backgroundColor: "transparent",
                    border: "3px solid #0866FF",
                  },
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                href="https://twitter.com"
                sx={{
                  backgroundColor: "inherit",
                  border: "3px solid transparent",
                  color: "inherit",
                  "&:hover": {
                    color: "#fff",
                    backgroundColor: "#000",
                    border:
                      theme.palette.mode === "dark"
                        ? "3px solid #fff"
                        : "3px solid #000",
                  },
                }}
              >
                <XIcon />
              </IconButton>
              <IconButton
                href="https://instagram.com"
                sx={{
                  backgroundColor: "inherit",
                  border: "3px solid transparent",
                  color: "inherit",
                  "&:hover": {
                    color: "#E1306C",
                    backgroundColor: "transparent",
                    border: "3px solid #E1306C",
                  },
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                href="https://linkedin.com"
                sx={{
                  backgroundColor: "inherit",
                  border: "3px solid transparent",
                  color: "inherit",
                  "&:hover": {
                    color: "#0A66C2",
                    backgroundColor: "transparent",
                    border: "3px solid #0A66C2",
                  },
                }}
              >
                <LinkedIn />
              </IconButton>
              <IconButton
                href="https://youtube.com"
                sx={{
                  backgroundColor: "inherit",
                  border: "3px solid transparent",
                  color: "inherit",
                  "&:hover": {
                    color: "#FF0000",
                    backgroundColor: "transparent",
                    border: "3px solid #FF0000",
                  },
                }}
              >
                <YouTube />
              </IconButton>
            </Box>
            <hr
              style={{
                flexGrow: 1,
                border: 0,
                borderTop: '1px solid ',
                borderColor: theme.palette.mode === "dark" ? "#00ffea" : colors.grey[300],
                margin: "0.5rem 0",
              }}
            />
          </Box>

          <Box mb={1}>
            {theme.palette.mode === "dark" ? (
              <img src="/logoDark.png" alt="Logo" style={{ width: "12rem" }} />
            ) : (
              <img
                src="/logoLight.png"
                alt="Logo"
                style={{ width: "12rem" }}
              />
            )}
          </Box>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            &copy; {new Date().getFullYear()} MedConnect. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Link
              href="#"
              color="inherit"
              sx={{
                textDecoration: "none",
                "&:hover": {
                  color: theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                },
                mr: 2,
              }}
            >
              Legal Stuff
            </Link>
            <span sx={{ color: "inherit" }}>&bull;</span>
            <Link
              href="#"
              color="inherit"
              sx={{
                textDecoration: "none",
                "&:hover": {
                  color: theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                },
                mr: 2,
              }}
            >
              Privacy Policy
            </Link>
            <span sx={{ color: "inherit" }}>&bull;</span>
            <Link
              href="#"
              color="inherit"
              sx={{
                textDecoration: "none",
                "&:hover": {
                  color: theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                },
                mr: 2,
              }}
            >
              Security
            </Link>
            <span sx={{ color: "inherit" }}>&bull;</span>
            <Link
              href="#"
              color="inherit"
              sx={{
                textDecoration: "none",
                "&:hover": {
                  color: theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                },
                mr: 2,
              }}
            >
              Website Accessibility
            </Link>
            <span sx={{ color: "inherit" }}>&bull;</span>
            <Link
              href="#"
              color="inherit"
              sx={{
                textDecoration: "none",
                "&:hover": {
                  color: theme.palette.mode === "dark" ? "#00ffea" : "#0048ff",
                },
              }}
            >
              Sitemap
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
