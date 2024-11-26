// src/ShoppingCart.js

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Checkbox,
  Alert,
} from "@mui/material";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import Clear from "@mui/icons-material/Clear";
import KeyboardArrowLeftIcon  from "@mui/icons-material/KeyboardArrowLeft";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import { useNavigate } from "react-router-dom";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Confetti from "react-confetti";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import swal from "sweetalert2";
import axios from "axios";

const ShoppingCart = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [cartItems, setCartItems] = useState([]);
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [custID, setCustID] = useState("");
  const [errorField, setErrorField] = useState(false);
  const [orderIDs, setOrderIDs] = useState({});

  const [useShippingAddressForBilling, setUseShippingAddressForBilling] =
    useState(false);

  //  -------------------all field are required for the shipping / billing address---------------------

  // Billing Address State
  const [billingAddressLine1, setBillingAddressLine1] = useState("");
  const [billingAddressLine2, setBillingAddressLine2] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingPostalCode, setBillingPostalCode] = useState("");
  const [billingCountry, setBillingCountry] = useState("");
  const [billingPhoneNumber, setBillingPhoneNumber] = useState("");
  const [confirmOrderPopup, setConfirmOrderPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  //scroll to top on page load smoothly
  useEffect(() => {
    //scroll to top
    window.scrollTo(0, 0);
  }, []);


  const [step, setStep] = useState(1);
  const [coupon, setCoupon] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardType: "",
    cardNumber: "",
    upiId: "",
    expiryDate: "",
    cvv: "",
  });

  








  const [expanded, setExpanded] = useState("creditCard");
  const localStorageCart = JSON.parse(localStorage.getItem("cartItems")) || [];
  const goToPharmacy = () => {
  
      localStorage.removeItem("cartItems");
    
    navigate("/pharmacy");
  };

  const handleViewOrderProductsDetails = () => {
   
      localStorage.removeItem("cartItems");
 
    console.log("orderIDs", orderIDs);
    navigate("/order-details", { state: { orderIDs: orderIDs } });
  };

  const fetchItems = async () => {
    try {
      // ----------------------------------------------fetch products by array of product_ids---------------------------------------------
      const response = await axios.post(
        "http://localhost:5000/api/productbyarray",
        {
          product_ids: localStorageCart,
        }
      );
      // console.log(response.data);
      setCartItems(response.data);

      //------------------------------------------------fetch user profile with the token-----------------------

      const profileResponse = await axios.get(
        "http://localhost:5000/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("data")}`,
          },
        }
      );
      console.log("profileResponse", profileResponse.data.user_details);
      const userProfile = profileResponse.data.user_details;
      setAddressLine1(userProfile.address_line1 || "");
      setAddressLine2(userProfile.address_line2 || "");
      setCity(userProfile.city || "");
      setState(userProfile.state || "");
      setPostalCode(userProfile.postal_code || "");
      setCountry(userProfile.country || "");
      setPhoneNumber(userProfile.phone || "");
      // i need to console the only id of the userprofile
      console.log("userProfile", userProfile);
      setCustID(userProfile.id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const handleproduct_quantityChange = (product_id, delta) => {
    setCartItems(
      cartItems.map((item) =>
        item.product_id === product_id
          ? { ...item, product_quantity: item.product_quantity + delta }
          : item
      )
    );
  };

  const handleRemoveItem = (product_id) => {
    // console.log(product_id);
    setCartItems(cartItems.filter((item) => item.product_id !== product_id));
    // Remove item from localStorage
    const updatedCartItems = cartItems.filter(
      (item) => item.product_id !== product_id
    );
    // extrat the product_id from the updatedCartItems
    const product_ids = updatedCartItems.map((item) => item.product_id);
    // console.log("product_ids", product_ids);
    // console.log("updatedCartItems", updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(product_ids));
  };
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product_quantity * item.product_price,
    0
  );
  const freeDelivery = 1; // Example free delivery
  const deliveryproduct_price = 29; // Example delivery product_price
  const location = "Lagos, Nigeria"; // Example location
  const shippingCompany = "DHL"; // Example shipping company
  const taxRate = 0.057; // Example tax rate
  const tax = subtotal * taxRate;
  const orderTotal =
    subtotal + (subtotal > 499 ? freeDelivery : deliveryproduct_price) + tax;

  const handleNextStep = () => {
    // const OrderDetailData = {
    //   ShippingAddress: `${addressLine1}, ${addressLine2}, ${city}, ${state}, ${postalCode}, ${country}, ${phoneNumber}`,
    //   BillingAddress: `${billingAddressLine1}, ${billingAddressLine2}, ${billingCity}, ${billingState}, ${billingPostalCode}, ${billingCountry}, ${billingPhoneNumber}`,
    // }

    if (step < 3) {
      setStep(step + 1);
      window.scrollTo(0, 0);
      if (step === 2) {
        // check if address fields are empty or not and alos check the billing address fields

        if (
          addressLine1 === "" ||
          addressLine2 === "" ||
          city === "" ||
          state === "" ||
          postalCode === "" ||
          country === "" ||
          phoneNumber === "" ||
          billingAddressLine1 === "" ||
          billingAddressLine2 === "" ||
          billingCity === "" ||
          billingState === "" ||
          billingPostalCode === "" ||
          billingCountry === "" ||
          billingPhoneNumber === ""
        ) {
          setErrorField(true);
          setSnackbarMessage("Please fill all the fields");
          setSnackbarSeverity("warning");
          setSnackbarOpen(true);
          setStep(2);

          return;
        }
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };












































  const formatCardNumber = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Limit to 16 digits
    const limited = cleaned.slice(0, 16);
    // Add spaces after every 4 digits
    const formatted = limited.replace(/(\d{4})(?=\d)/g, '$1 ');

    return formatted;
  };

  const formatExpiry = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Limit to 4 digits (MMYY)
    const limited = cleaned.slice(0, 4);
    // Add slash after 2 digits
    const formatted = limited.replace(/(\d{2})(?=\d)/, '$1/');

    return formatted;
  };







  const handleInputChangeCC = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiry(value);
    } else if (name === 'cvv') {
      // Ensure CVV is numeric and up to 4 digits
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardDetails((prevState) => ({
      ...prevState,
      [name]: formattedValue,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiry(value);
    } else if (name === 'cvv') {
      // Ensure CVV is numeric and up to 4 digits
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardDetails((prevState) => ({
      ...prevState,
      [name]: formattedValue,
    }));
  };

  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  //                                                  order methods
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  const handlePlaceOrder = async () => {
    const Order_details_data = {
      ProductID: JSON.parse(localStorage.getItem("cartItems")),
      CustomerID: custID.toString(),
      Quantity: cartItems.map((item) => item.product_quantity),
      ShippingAddress: `${addressLine1}, ${addressLine2}, ${city}, ${state}, ${postalCode}, ${country}, ${phoneNumber}`,
      BillingAddress: `${billingAddressLine1}, ${billingAddressLine2}, ${billingCity}, ${billingState}, ${billingPostalCode}, ${billingCountry}, ${billingPhoneNumber}`,
      PaymentMethod: cardDetails.cardType,
      TotalPrice: orderTotal.toFixed(2).toString(),
      TaxAmount: tax.toFixed(2).toString(),
      ShippingCost: (subtotal > 499 ? 0 : deliveryproduct_price)
        .toFixed(2)
        .toString(),
    };


    console.log("Order_details_data", Order_details_data);
    if (localStorage.getItem("data") !== null) {
      if (cardDetails.cardType === "") {
        setSnackbarMessage("Please select a payment method");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      } else if (
        cardDetails.cardType === "Credit Card mastercard" ||
        cardDetails.cardType === "Credit Card visa" ||
        cardDetails.cardType === "Credit Card Rupay"
      ) {
        if (
          cardDetails.cardNumber === "" ||
          cardDetails.expiryDate === "" ||
          cardDetails.cvv === ""
        ) {
          setSnackbarMessage("Please Enter Credit Card Details");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return;
        } else {
          try {
            const token = localStorage.getItem("data");
            if (token) {
              const response = await axios.post(
                "http://localhost:5000/api/ordered-products",
                Order_details_data,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              setConfirmOrderPopup(true);
              setShowConfetti(true);
              // console.log("Order placed successfully:", response.data);
              //remove the cart items from the local storage
              //localStorage.removeItem("cartItems");
              setOrderIDs(response.data);
            }
          } catch (error) {
            console.error("Error placing order:", error);
          }

          return;
        }
      } else if (
        cardDetails.cardType === "Debit Card mastercard" ||
        cardDetails.cardType === "Debit Card visa" ||
        cardDetails.cardType === "Debit Card Rupay"
      ) {
        if (
          cardDetails.cardNumber === "" ||
          cardDetails.expiryDate === "" ||
          cardDetails.cvv === ""
        ) {
          setSnackbarMessage("Please Enter Debit Card Details");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return;
        } else {
          try {
            const token = localStorage.getItem("data");
            if (token) {
              const response = await axios.post(
                "http://localhost:5000/api/ordered-products",
                Order_details_data,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              setConfirmOrderPopup(true);
              setShowConfetti(true);
              // console.log("Order placed successfully:", response.data);
              //localStorage.removeItem("cartItems");
              setOrderIDs(response.data);
            }
          } catch (error) {
            console.error("Error placing order:", error);
          }

          return;
        }
      } else if (
        cardDetails.cardType === "GooglePay Upi" ||
        cardDetails.cardType === "phonePe Upi" ||
        cardDetails.cardType === "BharatPay Upi"
      ) {
        if (cardDetails.upiId === "") {
          setSnackbarMessage("Please Enter UPI ID");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return;
        } else {
          try {
            const token = localStorage.getItem("data");
            if (token) {
              const response = await axios.post(
                "http://localhost:5000/api/ordered-products",
                Order_details_data,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              setConfirmOrderPopup(true);
              setShowConfetti(true);
              // console.log("Order placed successfully:", response.data);
              //localStorage.removeItem("cartItems");
              setOrderIDs(response.data);
            }
          } catch (error) {
            console.error("Error placing order:", error);
          }

          return;
        }
      } else if (cardDetails.cardType === "COD") {
        try {
          const token = localStorage.getItem("data");
          if (token) {
            const response = await axios.post(
              "http://localhost:5000/api/ordered-products",
              Order_details_data,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
            
            setConfirmOrderPopup(true);
            setShowConfetti(true);
            // console.log("Order placed successfully:", response.data);
            //localStorage.removeItem("cartItems");
            setOrderIDs(response.data);
          }
        } catch (error) {
          console.error("Error placing order:", error);
        }

        return;
      }

      // Clear cart items
      // setCartItems([]);
      // //localStorage.removeItem("cartItems");
    } else {
      // in the alert give the message to login and navigate to the login page button

      swal
        .fire({
          title: "Please Login to Place Order",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Login",
          cancelButtonText: "Cancel",
          customClass: {
            confirmButton: "custom-confirm-button",
            cancelButton: "custom-cancel-button",
          },
          willOpen: () => {
            const popup = document.querySelector(".swal2-popup");
            if (popup) {
              popup.style.backgroundColor =
                theme.palette.mode === "light" ? "#fff" : "#333";
              popup.style.color =
                theme.palette.mode === "light" ? "#000" : "#fff";
            }
            const title = document.querySelector(".swal2-title");
            if (title) {
              title.style.color =
                theme.palette.mode === "light" ? "#000" : "#fff";
            }
            const icon = document.querySelector(".swal2-icon");
            if (icon) {
              icon.style.color = "#9de0f6";
            }
            const confirmButton = document.querySelector(
              ".swal2-confirm.custom-confirm-button"
            );
            if (confirmButton) {
              confirmButton.style.backgroundColor =
                theme.palette.mode === "dark" ? "#fff" : "#000";
              confirmButton.style.color =
                theme.palette.mode === "dark" ? "#000" : "#fff";
            }
            const cancelButton = document.querySelector(
              ".swal2-cancel.custom-cancel-button"
            );
            if (cancelButton) {
              cancelButton.style.backgroundColor =
                theme.palette.mode === "dark" ? "#333" : "#fff";
              cancelButton.style.border = "1px solid";
              cancelButton.style.borderColor =
                theme.palette.mode === "dark" ? "#808080" : "#444";
              cancelButton.style.color =
                theme.palette.mode === "dark" ? "#fff" : "#444";
            }
          },
        })
        .then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
            console.log("Navigating to login page"); // Replace this with your actual navigation logic
          }
        });
    }

   
    // navigate("/app/checkout/success");
  };

  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  //                                                  End - order methods
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------

  const handleCheckboxChange = (event) => {
    setUseShippingAddressForBilling(event.target.checked);
    if (event.target.checked) {
      // Copy shipping address to billing address fields
      setBillingAddressLine1(addressLine1);
      setBillingAddressLine2(addressLine2);
      setBillingCity(city);
      setBillingState(state);
      setBillingPostalCode(postalCode);
      setBillingCountry(country);
      setBillingPhoneNumber(phoneNumber);
    } else {
      // Clear billing address fields if not using shipping address
      setBillingAddressLine1("");
      setBillingAddressLine2("");
      setBillingCity("");
      setBillingState("");
      setBillingPostalCode("");
      setBillingCountry("");
      setBillingPhoneNumber("");
    }
  };

  const handleRemoveAllItems = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };


  // ----------------------------------------------your Shopping cart---------------------------------------------
  const renderCartItems = () => (
    <Box
      sx={{
        zIndex: 5,
        position: "relative",
        padding: "20px",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.5)",
        borderRadius: "8px",
        background: theme.palette.mode === "light" ? "#fff" : "#333",
      }}
    >
    <Box  sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="h3" sx={{ marginBottom: "1rem" }}>
        Your Shopping Cart
      </Typography>
      <Button variant="secondary"
        onClick={handleRemoveAllItems}>
        
        Remove All Items
        &nbsp; 
        <Clear/>
      </Button>
    </Box>

      <Divider sx={{ margin: "5px 0 10px 0" }} />
      {cartItems.map((item) => (
        <Box
          key={item.product_id}
          sx={{
            marginBottom: "10px",
            padding: "10px",
            borderBottom:
              theme.palette.mode === "dark"
                ? "2px solid rgba( 255, 255, 255, 0.2)"
                : "2px solid rgba( 0, 0, 0, 0.1)",
          }}
        >
          <Grid container  sx={{ display: "flex", alignItems: "flex-start" }}>
            <Grid item xs={3} md={1} mr={1} onClick = {() => navigate(`/essential/${item.product_id}`)} style={{cursor: "pointer"}}>
              <img
                src={item.product_image}
                alt={item.product_name}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "4px",
                }}
              />
            </Grid>
            <Grid item xs={9} md={4} sx={{ paddingRight: "1rem" }} onClick = {() => navigate(`/essential/${item.product_id}`)} style={{cursor: "pointer"}}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {item.product_name}
              </Typography>
              <Box
                sx={{
                  backgroundColor: "rgb(0,128,0 ,0.5)",
                  p: "1px 9px",
                  mt: 0.5,
                  mb: 0.5,
                  width: "fit-content",
                  borderRadius: 5,
                  color: "#fff",
                }}
              >
                <Typography>{item.product_category}</Typography>
              </Box>
              <Typography variant="h5" color="textSecondary">
                ₹ {item.product_price.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {item.product_description}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                mktd by: {item.product_manufacturer}
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  background:
                    theme.palette.mode === "light"
                      ? colors.grey[9100]
                      : colors.grey[800],
                  borderRadius: "8px",
                  padding: "5px",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <IconButton
                  onClick={() =>
                    handleproduct_quantityChange(item.product_id, -1)
                  }
                  disabled={item.product_quantity === 1}
                  sx={{ padding: "6px" }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography variant="body1">{item.product_quantity}</Typography>
                <IconButton
                  onClick={() =>
                    handleproduct_quantityChange(item.product_id, 1)
                  }
                  sx={{ padding: "6px" }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={6} md={2} sx={{ mt: "10px" }}>
              <Typography variant="body1" sx={{ textAlign: "right" }}>
                ₹{" "}
                {(item.product_price * item.product_quantity).toLocaleString()}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={2}
              sx={{ display: "flex", alignItems: "flex-end" }}
            >
              <IconButton
                onClick={() => handleRemoveItem(item.product_id)}
                color="error"
                sx={{ marginLeft: "auto" }}
              >
                 <Clear/>
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  );

  // -----------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------
  //                                                  Order Summary - Cart section
  // -----------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------

  const renderSummary = () => (
    <Box
      sx={{
        background: theme.palette.mode === "light" ? "#fff" : "#333",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.5)",
        zIndex: 5,
        position: "relative",
      }}
    >
      <Typography variant="h4" sx={{ mb: "10px" }}>
        Order Summary{" "}
      </Typography>
      {cartItems.map((item) => (
        <Box
          key={item.product_id}
          sx={{ display: "flex", justifyContent: "space-between", pt: "10px" }}
        >
          <Typography color="textSecondary">
            {item.product_name} (x{item.product_quantity})
          </Typography>
          <Typography color="textSecondary">
            ₹ {(item.product_price * item.product_quantity).toLocaleString()}{" "}
          </Typography>
        </Box>
      ))}

      <Divider sx={{ margin: "20px 0" }} />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4">Delivery Charge:</Typography>
        {orderTotal > 499 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              background: "rgba(28, 139, 11, 0.427)",
              color: "#fff",
              padding: "1px 10px",
              borderRadius: "50px",
              // width: "100px",
              justifyContent: "center",
            }}
          >
            <Typography>Free Delivery Available</Typography>
          </Box>
        ) : (
          <Typography>₹ {deliveryproduct_price.toLocaleString()} </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", margin: "10px 0" }}>
        <Typography
          color="textSecondary"
          style={{ display: "flex", alignItems: "center" }}
        >
          <LocalShippingRoundedIcon /> &nbsp;:&nbsp;
        </Typography>
        <Typography color="textSecondary">{shippingCompany}</Typography>
      </Box>
      <Box sx={{ margin: "10px 0", display: "flex", alignItems: "center" }}>
        <Typography
          color="textSecondary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <LocationOnRoundedIcon />
          &nbsp;: Deliver to &nbsp;
        </Typography>
        <Typography
          color="textPrimary"
          style={{ display: "flex", alignItems: "center" }}
        >
          {location}
        </Typography>
      </Box>

      {/* <Divider sx={{ margin: "10px 0" }} /> */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "3rem",
          borderRadius: "10px",
          mt: "20px",
          mb: "20px",
          p: "0.625rem",
          background: theme.palette.mode === "light" ? "#f5f5f5" : "#252525",
        }}
      >
        <TextField
          label="Coupon Code"
          variant="standard"
          size="small" // Use 'small' size variant
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          sx={{ width: "70%" }}
        />
        <Button
          variant="contained"
          sx={{
            background: "yellow",
            color: "#000",
            borderRadius: "5px",
            padding: "10px",
            fontWeight: "bold",
            height: "100%",
            "&:hover": { background: "orange", color: "#000" },
          }}
        >
          Apply Coupon
        </Button>
      </Box>

      {/* <Divider sx={{ margin: "10px 0" }} /> */}

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography color="textSecondary">Subtotal:</Typography>
        <Typography color="textSecondary">
          ₹ {subtotal.toLocaleString()}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography color="textSecondary">Tax:</Typography>
        <Typography color="textSecondary">₹ {tax.toLocaleString()} </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "end" , mt: "20px"}}>
      <Typography color="textSecondary" >Free delivery on orders over ₹499</Typography>
      </Box>
      <Divider sx={{ margin: "0 0 20px 0" }} />
      
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "bold",
        }}
      >
        <Typography sx={{ fontSize: "1.5rem" }}>Order Total:</Typography>
        <Typography sx={{ fontSize: "1.5rem" }}>
          ₹ {orderTotal.toLocaleString()}{" "}
        </Typography>
      </Box>
      
      <Divider sx={{ margin: "20px 0" }} /> 

      <Button
        fullWidth
        onClick={handleNextStep}
        variant="contained"
        sx={{
          borderRadius: "5px",
          fontSize: "1rem",
          padding: "5px 0px",
          color: "#000",
          background: "orange",
          "&:hover": { background: "#fecb00", color: "#000" },
        }}
      >
        Proceed
      </Button>
    </Box>
  );
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  //                                                  End - Order Summary - Cart section
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  //                                                  Order Summary1 - shipping address form
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  const renderSummary1 = () => (
    <Box
      sx={{
        background: theme.palette.mode === "light" ? "#fff" : "#333",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.5)",
        zIndex: 5,
        position: "relative",
      }}
    >
      <Typography variant="h4" sx={{ mb: "10px" }}>
        Order Summary{" "}
      </Typography>
      {cartItems.map((item) => (
        <Box
          key={item.product_id}
          sx={{ display: "flex", justifyContent: "space-between", pt: "10px" }}
        >
          <Typography color="textSecondary">
            {item.product_name} (x{item.product_quantity})
          </Typography>
          <Typography color="textSecondary">
            ₹ {(item.product_price * item.product_quantity).toLocaleString()}{" "}
          </Typography>
        </Box>
      ))}

      <Divider sx={{ margin: "20px 0" }} />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4">Delivery Charge:</Typography>
        {orderTotal > 499 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              background: "rgba(28, 139, 11, 0.427)",
              color: "#fff",
              padding: "1px 10px",
              borderRadius: "50px",
              // width: "100px",
              justifyContent: "center",
            }}
          >
            <Typography>Free Delivery Available</Typography>
          </Box>
        ) : (
          <Typography>₹ {deliveryproduct_price.toLocaleString()} </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", margin: "10px 0" }}>
        <Typography
          color="textSecondary"
          style={{ display: "flex", alignItems: "center" }}
        >
          <LocalShippingRoundedIcon /> &nbsp;:&nbsp;
        </Typography>
        <Typography color="textSecondary">{shippingCompany}</Typography>
      </Box>
      <Box sx={{ margin: "10px 0", display: "flex", alignItems: "center" }}>
        <Typography
          color="textSecondary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <LocationOnRoundedIcon />
          &nbsp;: Deliver to &nbsp;
        </Typography>
        <Typography
          color="textPrimary"
          style={{ display: "flex", alignItems: "center" }}
        >
          {location}
        </Typography>
      </Box>

      <Divider sx={{ margin: "20px 0" }} />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography color="textSecondary">Subtotal:</Typography>
        <Typography color="textSecondary">
          ₹ {subtotal.toLocaleString()}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography color="textSecondary">Tax:</Typography>
        <Typography color="textSecondary">₹ {tax.toLocaleString()} </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "end" , mt: "20px"}}>
      <Typography color="textSecondary" >Free delivery on orders over ₹499</Typography>
      </Box>
      <Divider sx={{ margin: "0 0 20px 0" }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "bold",
        }}
      >
        <Typography sx={{ fontSize: "1.5rem" }}>Order Total:</Typography>
        <Typography sx={{ fontSize: "1.5rem" }}>
          ₹ {orderTotal.toLocaleString()}{" "}
        </Typography>
      </Box>

      <Divider sx={{ margin: "20px 0" }} />

      <Button
        fullWidth
        onClick={handleNextStep}
        variant="contained"
        sx={{
          //   background: "yellow",
          //   color: "#000",
          borderRadius: "5px",
          fontSize: "1rem",
          padding: "5px 0px",
          color: "#000",
          background: "orange",
          "&:hover": { background: "#fecb00", color: "#000" },
        }}
      >
        Proceed to Checkout
      </Button>
    </Box>
  );

  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  //                                                  End - Order Summary1- shipping address form
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  //                                                  Order Summary2--payment options
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  const renderSummary2 = () => (
    <Box
      sx={{
        background: theme.palette.mode === "light" ? "#fff" : "#333",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.5)",
        zIndex: 1,
        position: "relative",
      }}
    >
      <Typography variant="h4" sx={{ mb: "10px" }}>
        Order Summary{" "}
      </Typography>
      {cartItems.map((item) => (
        <Box
          key={item.product_id}
          sx={{ display: "flex", justifyContent: "space-between", pt: "10px" }}
        >
          <Typography color="textSecondary">
            {item.product_name} (x{item.product_quantity})
          </Typography>
          <Typography color="textSecondary">
            ₹ {(item.product_price * item.product_quantity).toLocaleString()}{" "}
          </Typography>
        </Box>
      ))}

      <Divider sx={{ margin: "20px 0" }} />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4">Delivery Charge:</Typography>
        {orderTotal > 499 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              background: "rgba(28, 139, 11, 0.427)",
              color: "#fff",
              padding: "1px 10px",
              borderRadius: "50px",
              // width: "100px",
              justifyContent: "center",
            }}
          >
            <Typography>Free Delivery Available</Typography>
          </Box>
        ) : (
          <Typography>₹ {deliveryproduct_price.toLocaleString()} </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", margin: "10px 0" }}>
        <Typography
          color="textSecondary"
          style={{ display: "flex", alignItems: "center" }}
        >
          <LocalShippingRoundedIcon /> &nbsp;:&nbsp;
        </Typography>
        <Typography color="textSecondary">{shippingCompany}</Typography>
      </Box>
      <Box sx={{ margin: "10px 0", display: "flex", alignItems: "center" }}>
        <Typography
          color="textSecondary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <LocationOnRoundedIcon />
          &nbsp;: Deliver to &nbsp;
        </Typography>
        <Typography
          color="textPrimary"
          style={{ display: "flex", alignItems: "center" }}
        >
          {location}
        </Typography>
      </Box>
      <Divider sx={{ margin: "20px 0" }} />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography color="textSecondary">Subtotal:</Typography>
        <Typography color="textSecondary">
          ₹ {subtotal.toLocaleString()}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography color="textSecondary">Tax:</Typography>
        <Typography color="textSecondary">₹ {tax.toLocaleString()} </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "end" , mt: "20px"}}>
      <Typography color="textSecondary" >Free delivery on orders over ₹499</Typography>
      </Box>
      <Divider sx={{ margin: "0 0 20px 0" }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "bold",
        }}
      >
        <Typography sx={{ fontSize: "1.5rem" }}>Order Total:</Typography>
        <Typography sx={{ fontSize: "1.5rem" }}>
          ₹ {orderTotal.toLocaleString()}{" "}
        </Typography>
      </Box>
    </Box>
  );

  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  //                                                  End - Order Summary2-- payment options
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------------------------------------------------
  //                                                  Shipping address
  // ------------------------------------------------------------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------------------------------------------------

  const renderAddressForm = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.5)",
        padding: "20px",
        background: theme.palette.mode === "light" ? "#fff" : "#333",
        zIndex: 5,
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          justifyContent: "center",
        }}
      >
        <IconButton
          onClick={handlePreviousStep}
          variant="contained"
          sx={{
            background: theme.palette.mode === "light" ? "#000" : "#fff",
            boxShadow: "0 5px 10px rgba(0, 0, 0, 0.5)",
          }}
        >
          <ArrowBackIosNewIcon
            sx={{
              color: theme.palette.mode === "light" ? "#fff" : "#000",
              "&:hover": {
                color: theme.palette.mode === "light" ? "#000" : "#fff",
              },
            }}
          />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Shipping Address
        </Typography>
      </Box>
      <Divider sx={{ margin: "20px 0" }} />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ flex: "1 1 100%" }}>
          <TextField
            fullWidth
            label="Address Line 1"
            required
            variant="outlined"
            sx={{ marginBottom: "5px" }}
            value={addressLine1}
            error={errorField && addressLine1 === ""}
            helperText={
              errorField && addressLine1 === "" ? "This field is required" : ""
            }
            onChange={(e) => setAddressLine1(e.target.value)}
          />
        </Box>
        <Box sx={{ flex: "1 1 100%" }}>
          <TextField
            fullWidth
            required
            label="Address Line 2"
            variant="outlined"
            sx={{ marginBottom: "5px" }}
            value={addressLine2}
            error={errorField && addressLine2 === ""}
            helperText={
              errorField && addressLine2 === "" ? "This field is required" : ""
            }
            onChange={(e) => setAddressLine2(e.target.value)}
          />
        </Box>
        <Box sx={{ flex: "1 1 45%" }}>
          <TextField
            fullWidth
            required
            label="City"
            variant="outlined"
            sx={{ marginBottom: "5px" }}
            value={city}
            error={errorField && city === ""}
            helperText={
              errorField && city === "" ? "This field is required" : ""
            }
            onChange={(e) => setCity(e.target.value)}
          />
        </Box>
        <Box sx={{ flex: "1 1 45%" }}>
          <TextField
            fullWidth
            required
            label="State/Province"
            variant="outlined"
            sx={{ marginBottom: "5px" }}
            value={state}
            error={errorField && state === ""}
            helperText={
              errorField && state === "" ? "This field is required" : ""
            }
            onChange={(e) => setState(e.target.value)}
          />
        </Box>
        <Box sx={{ flex: "1 1 45%" }}>
          <TextField
            fullWidth
            required
            label="Postal Code"
            type="number"
            variant="outlined"
            sx={{ marginBottom: "20px" }}
            value={postalCode}
            error={errorField && postalCode === ""}
            helperText={
              errorField && postalCode === "" ? "This field is required" : ""
            }
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </Box>
        <Box sx={{ flex: "1 1 45%" }}>
          <TextField
            fullWidth
            required
            label="Country"
            variant="outlined"
            sx={{ marginBottom: "5px" }}
            value={country}
            error={errorField && country === ""}
            helperText={
              errorField && country === "" ? "This field is required" : ""
            }
            onChange={(e) => setCountry(e.target.value)}
          />
        </Box>
        <Box sx={{ flex: "1 1 45%" }}>
          <TextField
            fullWidth
            required
            name="phoneNumber"
            type="number"
            label="Phone Number"
            variant="outlined"
            sx={{ marginBottom: "5px" }}
            value={phoneNumber}
            error={errorField && phoneNumber === ""}
            helperText={
              errorField && phoneNumber === "" ? "This field is required" : ""
            }
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          width: "100%",
        }}
      >
        <Typography variant="h4">Billing Address</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={useShippingAddressForBilling}
              onChange={handleCheckboxChange}
            />
          }
          label="Same as Shipping Address"
        />
      </Box>
      {/* ------------------------------------------------------------------------------------------------------------------------------------------------
                                                   Billing Address 
------------------------------------------------------------------------------------------------------------------------------------------------ */}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, width: "100%" }}>
        <Box sx={{ flex: "1 1 100%" }}>
          <TextField
            fullWidth
            label="Billing Address Line 1"
            variant="outlined"
            sx={{ marginBottom: "5px" }}
            value={billingAddressLine1}
            error={errorField && billingAddressLine1 === ""}
            helperText={
              errorField && billingAddressLine1 === ""
                ? "This field is required"
                : ""
            }
            required
            onChange={(e) => setBillingAddressLine1(e.target.value)}
            disabled={useShippingAddressForBilling}
          />
        </Box>
        <Box sx={{ flex: "1 1 100%" }}>
          <TextField
            fullWidth
            label="Billing Address Line 2"
            variant="outlined"
            sx={{ marginBottom: "5px" }}
            value={billingAddressLine2}
            error={errorField && billingAddressLine2 === ""}
            helperText={
              errorField && billingAddressLine2 === ""
                ? "This field is required"
                : ""
            }
            required
            onChange={(e) => setBillingAddressLine2(e.target.value)}
            disabled={useShippingAddressForBilling}
          />
        </Box>
        <Box sx={{ flex: "1 1 45%" }}>
          <TextField
            fullWidth
            label="Billing City"
            variant="outlined"
            sx={{ marginBottom: "5px" }}
            value={billingCity}
            error={errorField && billingCity === ""}
            helperText={
              errorField && billingCity === "" ? "This field is required" : ""
            }
            required
            onChange={(e) => setBillingCity(e.target.value)}
            disabled={useShippingAddressForBilling}
          />
        </Box>
        <Box sx={{ flex: "1 1 45%" }}>
          <TextField
            fullWidth
            label="Billing State/Province"
            variant="outlined"
            sx={{ marginBottom: "5px" }}
            value={billingState}
            error={errorField && billingState === ""}
            helperText={
              errorField && billingState === "" ? "This field is required" : ""
            }
            required
            onChange={(e) => setBillingState(e.target.value)}
            disabled={useShippingAddressForBilling}
          />
        </Box>
        <Box sx={{ flex: "1 1 45%" }}>
          <TextField
            fullWidth
            label="Billing Postal Code"
            type="number"
            variant="outlined"
            sx={{ marginBottom: "20px" }}
            value={billingPostalCode}
            error={errorField && billingPostalCode === ""}
            helperText={
              errorField && billingPostalCode === ""
                ? "This field is required"
                : ""
            }
            required
            onChange={(e) => setBillingPostalCode(e.target.value)}
            disabled={useShippingAddressForBilling}
          />
        </Box>
        <Box sx={{ flex: "1 1 45%" }}>
          <TextField
            fullWidth
            label="Billing Country"
            variant="outlined"
            sx={{ marginBottom: "5px" }}
            value={billingCountry}
            error={errorField && billingCountry === ""}
            helperText={
              errorField && billingCountry === ""
                ? "This field is required"
                : ""
            }
            required
            onChange={(e) => setBillingCountry(e.target.value)}
            disabled={useShippingAddressForBilling}
          />
        </Box>
        <Box sx={{ flex: "1 1 45%" }}>
          <TextField
            fullWidth
            label="Billing Phone Number"
            variant="outlined"
            type="number"
            sx={{ marginBottom: "5px" }}
            value={billingPhoneNumber}
            error={errorField && billingPhoneNumber === ""}
            helperText={
              errorField && billingPhoneNumber === ""
                ? "This field is required"
                : ""
            }
            required
            onChange={(e) => setBillingPhoneNumber(e.target.value)}
            disabled={useShippingAddressForBilling}
          />
        </Box>
      </Box>
    </Box>
  );

  //  ---------------------------------------------------------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------------------------------------------------
  //                                                 End - Shipping address form  140 lines of code
  // ------------------------------------------------------------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  //                                                                 Payment options
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  const renderPaymentForm = () => (
    <Box
      sx={{
        padding: "20px",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.5)",
        borderRadius: "8px",
        background: theme.palette.mode === "light" ? "#fff" : "#333",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          marginBottom: "20px",
          justifyContent: "center",
        }}
      >
        <IconButton
          onClick={handlePreviousStep}
          variant="contained"
          sx={{
            background: theme.palette.mode === "light" ? "#000" : "#fff",
            boxShadow: "0 5px 10px rgba(0, 0, 0, 0.5)",
          }}
        >
          <ArrowBackIosNewIcon
            sx={{
              color: theme.palette.mode === "light" ? "#fff" : "#000",
              "&:hover": {
                color: theme.palette.mode === "light" ? "#000" : "#fff",
              },
            }}
          />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Payment Options
        </Typography>
      </Box>
      <Divider sx={{ margin: "20px 0" }} />
      {/* <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Payment Options
      </Typography> */}
      <Accordion
        expanded={expanded === "creditCard"}
        onChange={handleAccordionChange("creditCard")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="creditCard-content"
          id="creditCard-header"
          sx={{
            background:
              theme.palette.mode === "light"
                ? colors.grey[9100]
                : colors.grey[800],
          }}
        >
          <Typography variant="h5">Credit Card</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form>
            <FormControl component="fieldset" sx={{ marginBottom: "20px" }}>
              <Typography>Select Card Type</Typography>
              <RadioGroup
                row
                value={cardDetails.cardType}
                onChange={handleInputChangeCC}
                name="cardType"
              >
                <FormControlLabel
                  value="Credit Card mastercard"
                  control={<Radio />}
                  label="Mastercard"
                />
                <FormControlLabel
                  value="Credit Card visa"
                  control={<Radio />}
                  label="Visa"
                />
                <FormControlLabel
                  value="Credit Card Rupay"
                  control={<Radio />}
                  label="Rupay"
                />
              </RadioGroup>
            </FormControl>
            <TextField
              fullWidth
              label="Card Number"
              variant="outlined"
              type="text" // Change to text to allow spaces
              sx={{ marginBottom: "20px", borderRadius: "5px" }}
              value={cardDetails.cardNumber}
              onChange={handleInputChangeCC}
              name="cardNumber"
              inputProps={{ maxLength: 19 }} // 16 digits + 3 spaces
              disabled={cardDetails.cardType === "Credit Card mastercard" || cardDetails.cardType === "Credit Card visa" || cardDetails.cardType === "Credit Card Rupay" ? false : true}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <TextField
                label="Expiry Date"
                placeholder="MM / YY"
                type="text"
                variant="outlined"
                sx={{ flex: 2, marginRight: "10px", borderRadius: "5px" , appearance: "none"}}
                value={cardDetails.expiryDate}
                disabled={cardDetails.cardType === "Credit Card mastercard" || cardDetails.cardType === "Credit Card visa" || cardDetails.cardType === "Credit Card Rupay" ? false : true}
                onChange={handleInputChangeCC}
                name="expiryDate"
              />
              <TextField
                type="password"
                label="CVV"
                variant="outlined"
                sx={{ flex: 1, borderRadius: "5px" }}
                value={cardDetails.cvv}
                disabled={cardDetails.cardType === "Credit Card mastercard" || cardDetails.cardType === "Credit Card visa" || cardDetails.cardType === "Credit Card Rupay" ? false : true}
                onChange={handleInputChangeCC}
                name="cvv"
              />
            </Box>
            <Button
              fullWidth
              onClick={handlePlaceOrder}
              variant="contained"
              disabled={cardDetails.cardType === "Credit Card mastercard" || cardDetails.cardType === "Credit Card visa" || cardDetails.cardType === "Credit Card Rupay" ? false : true}
              sx={{
                borderRadius: "5px",
                fontSize: "1rem",
                padding: "5px 0px",
                color: "#000",
                background: "orange",
                "&:hover": { background: "#fecb00", color: "#000" },
              }}
            >
              Place Order
            </Button>
          </form>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "debitCard"}
        onChange={handleAccordionChange("debitCard")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="debitCard-content"
          id="debitCard-header"
          sx={{
            background:
              theme.palette.mode === "light"
                ? colors.grey[9100]
                : colors.grey[800],
          }}
        >
          <Typography variant="h5">Debit Card</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form>
            <FormControl component="fieldset" sx={{ marginBottom: "20px" }}>
              <Typography>Select Card Type</Typography>
              <RadioGroup
                row
                value={cardDetails.cardType}
                onChange={handleInputChange}
                name="cardType"
              >
                <FormControlLabel
                  value="Debit Card mastercard"
                  control={<Radio />}
                  label="Mastercard"
                />
                <FormControlLabel
                  value="Debit Card visa"
                  control={<Radio />}
                  label="Visa"
                />
                <FormControlLabel
                  value="Debit Card Rupay"
                  control={<Radio />}
                  label="Rupay"
                />
              </RadioGroup>
            </FormControl>
            <TextField
              fullWidth
              label="Card Number"
              variant="outlined"
              type="text" // Change to text to allow spaces
              sx={{ marginBottom: "20px", borderRadius: "5px" }}
              value={cardDetails.cardNumber}
              disabled={cardDetails.cardType === "Debit Card mastercard" || cardDetails.cardType === "Debit Card visa" || cardDetails.cardType === "Debit Card Rupay" ? false : true}
              onChange={handleInputChange}
              name="cardNumber"
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <TextField
                label="Expiry Date"
                placeholder="MM / YY"
                variant="outlined"
                sx={{ flex: 2, marginRight: "10px", borderRadius: "5px" }}
                value={cardDetails.expiryDate}
              disabled={cardDetails.cardType === "Debit Card mastercard" || cardDetails.cardType === "Debit Card visa" || cardDetails.cardType === "Debit Card Rupay" ? false : true}
                onChange={handleInputChange}
                name="expiryDate"
              />
              <TextField
                type="password"
                label="CVV"
                variant="outlined"
                sx={{ flex: 1, borderRadius: "5px" }}
                value={cardDetails.cvv}
              disabled={cardDetails.cardType === "Debit Card mastercard" || cardDetails.cardType === "Debit Card visa" || cardDetails.cardType === "Debit Card Rupay" ? false : true}
                onChange={handleInputChange}
                name="cvv"
              />
            </Box>
            <Button
              fullWidth
              onClick={handlePlaceOrder}
              variant="contained"
              disabled={cardDetails.cardType === "Debit Card mastercard" || cardDetails.cardType === "Debit Card visa" || cardDetails.cardType === "Debit Card Rupay" ? false : true}
              sx={{
                borderRadius: "5px",
                fontSize: "1rem",
                padding: "5px 0px",
                color: "#000",
                background: "orange",
                "&:hover": { background: "#fecb00", color: "#000" },
              }}
            >
              Place Order
            </Button>
          </form>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "upi"}
        onChange={handleAccordionChange("upi")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="upi-content"
          id="upi-header"
          sx={{
            background:
              theme.palette.mode === "light"
                ? colors.grey[9100]
                : colors.grey[800],
          }}
        >
          <Typography variant="h5">UPI</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form>
            {/* <Typography>Select UPI</Typography> */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: "4rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  width: "50%",
                }}
              >
                <FormControl component="fieldset" sx={{ marginBottom: "20px" }}>
                  <RadioGroup
                    row
                    value={cardDetails.cardType}
                    onChange={handleInputChange}
                    name="cardType"
                  >
                    <FormControlLabel
                      value="GooglePay Upi"
                      control={<Radio />}
                      label="Google Pay"
                    />
                    <FormControlLabel
                      value="phonePe Upi"
                      control={<Radio />}
                      label="PhonePe"
                    />
                    <FormControlLabel
                      value="BharatPay Upi"
                      control={<Radio />}
                      label="BharatPay"
                    />
                  </RadioGroup>
                </FormControl>
                <TextField
                  fullWidth
                  // label="example@upi"
                  placeholder="example@upi"
                  variant="outlined"
                  sx={{ marginBottom: "20px", borderRadius: "5px" }}
                  value={cardDetails.upiId}
                  disabled={cardDetails.cardType === "GooglePay Upi" || cardDetails.cardType === "phonePe Upi" || cardDetails.cardType === "BharatPay Upi" ? false : true}
                  onChange={handleInputChange}
                  name="upiId"
                />
              </Box>
              <Divider
                orientation="vertical"
                sx={{ height: "8rem", margin: "0px 20px" }}
              >
                or
              </Divider>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "20px",
                  alignItems: "center",
                  marginTop: "10px",
                  
                }}
              >
                <img
                  src="/images/paymentQR/Payment to medConnect.png"
                  alt="UPI"
                  style={{ width: "120px" }}
                />
              </Box>
            </Box>

            <Button
              fullWidth
              onClick={handlePlaceOrder}
              variant="contained"
              sx={{
                borderRadius: "5px",
                fontSize: "1rem",
                padding: "5px 0px",
                color: "#000",
                background: "orange",
                "&:hover": { background: "#fecb00", color: "#000" },
              }}
              disabled={cardDetails.cardType === "GooglePay Upi" || cardDetails.cardType === "phonePe Upi" || cardDetails.cardType === "BharatPay Upi" ? false : true}
            >
              Place Order
            </Button>
          </form>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "cod"}
        onChange={handleAccordionChange("cod")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="cod-content"
          id="cod-header"
          sx={{
            background:
              theme.palette.mode === "light"
                ? colors.grey[9100]
                : colors.grey[800],
          }}
        >
          <Typography variant="h5">Cash on Delivery (COD)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form>
            <FormControl component="fieldset" sx={{ marginBottom: "20px" }}>
              <Typography>Cash on Delivery</Typography>
              <RadioGroup
                row
                value={cardDetails.cardType}
                onChange={handleInputChange}
                name="cardType"
              >
                <FormControlLabel value="COD" control={<Radio />} label="Yes" />
              </RadioGroup>
            </FormControl>
            <Button
              fullWidth
              onClick={handlePlaceOrder}
              variant="contained"
              sx={{
                borderRadius: "5px",
                fontSize: "1rem",
                padding: "5px 0px",
                color: "#000",
                background: "orange",
                "&:hover": { background: "#fecb00", color: "#000" },
              }}
              disabled={cardDetails.cardType === "COD" ? false : true}
            >
              Place Order
            </Button>
          </form>
        </AccordionDetails>
      </Accordion>
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <Button onClick={handlePreviousStep} variant="contained">
          Back
        </Button>
      </Box> */}
    </Box>
  );
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  //                                                                 End - Payment options
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  //                                                                 Confirm order popup
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------------

  const confirmOrder = () => {
    return (
      <>
        <Dialog
          open={confirmOrderPopup}
          // onClose={() => setConfirmOrderPopup(false)}
          aria-labelledby="draggable-dialog-title"
          disableEscapeKeyDown
          PaperProps={{
            style: {
              borderRadius: "12px",
              padding: "16px",
            },
          }}
        >
          <DialogContent
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
            <lottie-player
              src="https://lottie.host/66f18fff-f7d8-46ff-81f5-f385199316cd/twzC6FfuZO.json"
              background="transparent"
              style={{ width: "250px", height: "250px" }}
              loop
              autoplay
            ></lottie-player>
            <DialogTitle
              style={{
                cursor: "move",
                fontSize: "1.5rem",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "8px",
              }}
              id="draggable-dialog-title"
            >
              Order Placed Successfully!
            </DialogTitle>
            <DialogContentText
              id="alert-dialog-description"
              style={{ textAlign: "center" }}
            >
              Your order has been placed successfully. You will receive a
              confirmation <br /> email shortly. Thank you for shopping with us.
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{ justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={goToPharmacy}
              sx={{
                fontSize: "0.9rem",
                marginRight: "8px",
                color: theme.palette.mode === "light" ? "#000" : "#fff",
                backgroundColor: theme.palette.mode === "light" ? "#F9F9F9" : "#454545",
                "&:hover": {
                  backgroundColor: "#00ffea",
                  color: "#000",
                },
              }}
            >
              Continue Shopping
            </Button>
            <Button
              variant="standard"
              onClick={handleViewOrderProductsDetails}
              sx={{
                fontSize: "0.9rem",
                color: theme.palette.mode === "light" ? "#000" : "#fff",
                backgroundColor: theme.palette.mode === "light" ? "#fff" : "#383838",
                border : "1px solid ",
                borderColor: theme.palette.mode === "light" ? "#777777" : "#777777",
                "&:hover": {
                  backgroundColor: theme.palette.mode === "light" ? "#000" : "#000",
                  color: theme.palette.mode === "light" ? "#fff" : "#fff",
                    border : "1px solid ",
                borderColor: theme.palette.mode === "light" ? "#000" : "#000",
                },
              }}
            >
              View Order
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  // -------------------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  //                                                                 End - Confirm order popup
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  //                                                                 End - ShoppingCart
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------------

  return (
    <Container
      maxWidth="xl"
      sx={{
        minHeight: "100vh",
        paddingTop: "10vh",
        display: "flex",
        justifyContent: "start",
        marginBottom: "10rem",
        flexDirection: "column",
      }}
    >
        <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          mb: 2,
          borderRadius: 5,
          width: "10%",
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
          onClick={() => navigate("/medicine")}
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
        <Typography sx={{ ml: 0.5, textAlign: "center" , fontSize: "0.8rem" , color: theme.palette.mode === "dark" ? "#939393" : "#6E6E6E" , cursor: "pointer" ,"&:hover": { color: "#00A799" }}}
        onClick={() => navigate("/medicine")}>
           Products 
          </Typography>
          <Typography sx={{ ml: 0.5, textAlign: "center" , fontSize: "0.8rem" , color: theme.palette.mode === "dark" ? "#939393" : "#6E6E6E" }}>
          / 
          </Typography>
          <Typography sx={{ml:0.5, textAlign: "center" , fontSize: "0.8rem" , color: "#00A799" }}>
           Cart
          </Typography>
      </Box>
      {localStorageCart.length !== 0 ? (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {step === 1 && renderCartItems()}
            {step === 2 && renderAddressForm()}
            {step === 3 && renderPaymentForm()}
          </Grid>
          <Grid item xs={12} md={4}>
            {step === 1 && renderSummary()}
            {step === 2 && renderSummary1()}
            {step === 3 && renderSummary2()}
          </Grid>
          {confirmOrder()}
          {showConfetti && <Confetti />}
        </Grid>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "85vh",
            textAlign: "center",
            flexDirection: "column",
          }}
        >
          <Box sx={{ marginBottom: "10px" }}>
            <img
              src="/images/cart/emptyCart2.png"
              alt="Empty Cart"
              style={{ width: "100%" }}
            />
          </Box>
          <Typography variant="h3" gutterBottom>
            Your Cart is Empty!
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Must add items to the cart before you proceed to check out.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ marginTop: "20px" }}
            onClick={() => navigate("/pharmacy")}
          >
            Return to Shop
          </Button>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          // sx={{ marginTop: "3rem", fontSize: "1rem" }}
          sx={{ fontSize: "1rem", backgroundColor: "#000", color: "#fff" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ShoppingCart;

// -------------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                 End - ShoppingCart
// -------------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------------
