import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Container,
  IconButton,
  Typography,
  Box,
  Divider,
  Avatar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import axios from "axios";
import editOutlined from "@mui/icons-material/EditOutlined";
import EditIcon from '@mui/icons-material/Edit';

const Settings = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    weight: "",
    age: "",
    height: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    phone: "",
    profile_image: "",
  });
  const [response, setResponse] = useState("");

  const fetchProfileData = async () => {
    const token = localStorage.getItem("data");
    const options = {
      method: "GET",
      url: "http://localhost:5000/api/auth/profile",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data.user_details);
        setFormData({
          name: response.data.user_details.name,
          email: response.data.user_details.email,
          gender: response.data.user_details.gender,
          weight: response.data.user_details.weight,
          age: response.data.user_details.age,
          height: response.data.user_details.height,
          address_line1: response.data.user_details.address_line1,
          address_line2: response.data.user_details.address_line2,
          city: response.data.user_details.city,
          state: response.data.user_details.state,
          postal_code: response.data.user_details.postal_code,
          country: response.data.user_details.country,
          phone: response.data.user_details.phone,
          profile_image: response.data.user_details.profile_image,
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    const options = {
      method: "PUT",
      url: "http://localhost:5000/api/auth/profile-edit",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("data"),
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data);
        fetchProfileData();
        setResponse(response.data.message);
        setTimeout(() => {
          setResponse("");
        }, 3000);
      })
      .catch(function (error) {
        console.error(error);
        setResponse("Profile update failed");
        setTimeout(() => {
          setResponse("");
        }, 3000);
      });
  };

  const [profileImagePreview, setProfileImagePreview] = useState("");

  const handleImageChange = (e) => { 
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setProfileImagePreview(reader.result);
    };
  };



  return (
    <Box>
      <Box sx={{ fontSize: 20, marginBottom: "20px" }}>User Profile</Box>
      <Grid item xs={12}>
              <Box
                sx={{
                  
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  gap: 2,
                  marginBottom: "20px",
                }}
              >
                <Avatar
                  alt="Profile Image"
                  src={profileImagePreview}
                  sx={{ width: 150, height: 150 }}
                />
                <Button
                  variant="standard"
                  component="label"
                  color="primary"
                >
                  <EditIcon />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>
            </Grid>
      <Box
        sx={{
          border: "1px solid ",
          borderColor: colors.grey[600],
          padding: "20px",
          borderRadius: "5px",
          backgroundColor: theme.palette.mode === "light" ? "#f5f5f5" : "#333",
        }}
      >
      
        <form onSubmit={handleSubmit}>
          <Grid container spacing={1} gap={1.5}>
         
            <Grid container item spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="medium"
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="medium"
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Grid container item spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  size="medium"
                  select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                  <MenuItem value="O">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  size="medium"
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  size="medium"
                  label="Weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Grid container item spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  size="medium"
                  label="Age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  size="medium"
                  label="Height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  size="medium"
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Grid container item spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  size="medium"
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  size="medium"
                  label="Postal Code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  size="medium"
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Grid container item spacing={1}></Grid>

            <Grid item xs={12}>
              <TextField
                size="medium"
                label="Address Line 1"
                name="address_line1"
                value={formData.address_line1}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="medium"
                label="Address Line 2"
                name="address_line2"
                value={formData.address_line2}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid
              container
              item
              spacing={1}
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid item xs={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Submit
                </Button>
              </Grid>
              <Grid
                item
                xs={10}
                sx={{ display: "flex", justifyContent: "center" }}
              >
              {response && (
                <Box
                  sx={{
                    width: "100%",
                    backgroundColor: colors.grey[900],
                    padding: "6px",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "center",
                    
                  }}
                >
                  {" "}
                  <Typography
                    variant="body1"
                    color={
                      response === "Profile updated successfully"
                        ? "green"
                        : "red"
                    }
                  >
                    {response}
                  </Typography>
                </Box>
              )}
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default Settings;
