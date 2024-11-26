import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useReactToPrint } from "react-to-print";

import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  styled,
  IconButton,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TableRow,
  TableCell,
  Table,
  TableBody,
  TableContainer,
  DialogTitle,
} from "@mui/material";
import PropTypes from "prop-types";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import Check from "@mui/icons-material/Check";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import ClearIcon from "@mui/icons-material/Clear";
import { Navigate, useNavigate } from "react-router-dom";

const Orders = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [orderData, setOrderData] = useState([]);
  const [order, setOrder] = useState([]);
  const [orderedProductIds, setOrderedProductIds] = useState([]);
  const [displayProductData, setDisplayProductData] = useState([]);
  const Navigate = useNavigate();

  useEffect(() => {
    const options = {
      method: "GET",
      url: "http://localhost:5000/api/auth/profile",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("data")}`,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data.ordered_products);
        setOrderData(response.data.ordered_products);
        setOrderedProductIds(
          response.data.ordered_products.map((order) => order.ProductID)
        );
      })
      .catch(function (error) {
        console.error(error);
        Navigate("/login");
      });
  }, []);

  useEffect(() => {
    if (orderedProductIds.length === 0) return;

    const options = {
      method: "POST",
      url: "http://localhost:5000/api/productbyarray",
      data: { product_ids: orderedProductIds },
    };

    axios
      .request(options)
      .then(function (response) {
        setDisplayProductData(response.data);
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [orderedProductIds]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isExpiredOrCurrentDate = (dateString) => {
    const currentDate = new Date();
    return new Date(dateString) <= currentDate;
  };

  const getActiveStep = (order) => {
    const steps = [
      { label: "Order date", date: order.OrderDate },
      { label: "Order Confirmed", date: order.OrderConfirmationDate },
      { label: "Shipping Date", date: order.ShippingDate },
      { label: "Estimated Delivery Date", date: order.EstimatedDeliveryDate },
      { label: "Actual Delivery Date", date: order.ActualDeliveryDate },
    ];

    for (let i = 0; i < steps.length; i++) {
      if (!steps[i].date || new Date(steps[i].date) > new Date()) {
        return i;
      }
    }

    return steps.length;
  };

  const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
      left: "calc(-50% + 16px)",
      right: "calc(50% + 16px)",
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: "green",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: "green",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "grey",
      borderTopWidth: 3,
      borderRadius: 1,
    },
  }));

  const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
    color:
      theme.palette.mode === "dark"
        ? theme.palette.grey[700]
        : theme.palette.grey[700],
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: "grey",
    }),
    "& .QontoStepIcon-completedIcon": {
      color: "green",
      zIndex: 1,
      fontSize: 22,
      border: "2px solid green",
      borderRadius: "50%" /* Makes the border round */,
      padding: "2px" /* Optional: Provides spacing around the tick */,
    },

    "& .QontoStepIcon-circle": {
      width: 10,
      height: 10,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
  }));

  const QontoStepIcon = (props) => {
    const { active, completed, className } = props;

    return (
      <QontoStepIconRoot ownerState={{ active }} className={className}>
        {completed ? (
          <Check className="QontoStepIcon-completedIcon" />
        ) : (
          <div className="QontoStepIcon-circle" />
        )}
      </QontoStepIconRoot>
    );
  };

  QontoStepIcon.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    completed: PropTypes.bool,
  };

  const LineLabel = styled("div")(({ theme }) => ({
    position: "absolute",
    top: -28,
    width: "100%",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "12px",
  }));

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    ActualDeliveryDate: "",
    BillingAddress: "",
    CouponID: "",
    CustomerComments: "",
    CustomerID: "",
    DiscountCode: "",
    EstimatedDeliveryDate: "",
    InternalComments: "",
    Notes: "",
    OrderConfirmationDate: "",
    OrderDate: "",
    OrderID: "",
    OrderStatus: "",
    PaymentMethod: "",
    PaymentStatus: "",
    ProductID: "",
    Quantity: "",
    ReturnStatus: "",
    ShippingAddress: "",
    ShippingCost: "",
    ShippingMethod: "",
    TaxAmount: "",
    TotalPrice: "",
    TrackingNumber: "",
  });

  const [form2Dialog, setform2Dialog] = useState(false);
  const [productImage, setProductImage] = useState("");

  const handleOrderInvoice = (order) => {
    setform2Dialog(true);
    setOrder(order);
    const product = displayProductData.filter(
      (product) => product.product_id === order.ProductID
    );
    setProductImage(product[0]);
    console.log(product);
    console.log(order);
    // setFormData({
    //   ActualDeliveryDate: order.ActualDeliveryDate,
    //   BillingAddress: order.BillingAddress,
    //   CouponID: order.CouponID,
    //   CustomerComments  : order.CustomerComments,
    //   CustomerID: order.CustomerID,
    //   DiscountCode: order.DiscountCode,
    //   EstimatedDeliveryDate: order.EstimatedDeliveryDate,
    //   InternalComments: order.InternalComments,
    //   Notes: order.Notes,
    //   OrderConfirmationDate: order.OrderConfirmationDate,
    //   OrderDate: order.OrderDate,
    //   OrderID: order.OrderID,
    //   OrderStatus: order.OrderStatus,
    //   PaymentMethod: order.PaymentMethod,
    //   PaymentStatus: order.PaymentStatus,
    //   ProductID: order.ProductID,
    //   Quantity: order.Quantity,
    //   ReturnStatus: order.ReturnStatus,
    //   ShippingAddress: order.ShippingAddress,
    //   ShippingCost: order.ShippingCost,
    //   ShippingMethod: order.ShippingMethod,
    //   TaxAmount: order.TaxAmount,
    //   TotalPrice: order.TotalPrice,
    //   TrackingNumber: order.TrackingNumber,

    //     }
    // );
  };

  const firstHalf = [
    ["TrackingNumber", order.TrackingNumber],
    ["EstimatedDeliveryDate", order.EstimatedDeliveryDate],
    ["OrderConfirmationDate", order.OrderConfirmationDate],
    ["OrderDate", order.OrderDate],
    ["PaymentMethod", order.PaymentMethod],
  ];

  const secondHalf = [
    ["OrderID", order.OrderID],

    ["BillingAddress", order.BillingAddress],
    ["ActualDeliveryDate", order.ActualDeliveryDate],
    ["Quantity", order.Quantity],
  ];

  const handleClear = () => {
    setFormData({
      fullName: "",
      dateOfBirth: "",
      phoneNumber: "",
      email: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      gender: "",
      pastTreatmentFiles: [],
      reasonForAppointment: "",
    });

    // setShowForm(false);
  };

  const formRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => formRef.current,
    documentTitle: "Admission_Form",
  });

  return (
    <Box>
      <Box sx={{ fontSize: 20 }}>#Order Details</Box>
      <Box
        sx={{
          /* The above code appears to be a comment in a JavaScript React file. It is specifying a
          background color using the `backgroundColor` property with a value of
          "background.default". The comment format used seems to be a mix of different comment
          styles (// and */

          minHeight: "100%",
        }}
      >
        <Grid spacing={3}>
          <Grid item lg={8} md={6} xs={12}>
            <Box>
              {/* <CardHeader title="Orders" /> */}
              {/* <Divider /> */}
              <Box>
                <Grid spacing={3}>
                  {orderData.map((order) => (
                    <Grid
                      item
                      key={order.id}
                      lg={12}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          flexGrow: 1,
                          border: "1px solid ",
                          borderRadius: "5px",
                          backgroundColor:
                            theme.palette.mode === "light" ? "#fff" : "#1c1c1c",
                          borderColor:
                            theme.palette.mode === "light" ? "#fff" : "#1c1c1c",
                          mt: 2,
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography variant="h6" color="primary">
                              Order ID: {order.OrderID}
                            </Typography>

                            <Typography variant="body2">
                              Tracking Number : {order.TrackingNumber}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              gap: "10px",
                            }}
                          >
                            <IconButton
                              aria-label="delete"
                              style={{ float: "right" }}
                              onClick={() => handleOrderInvoice(order)}
                            >
                              <LocalPrintshopIcon />
                            </IconButton>

                          </Box>
                        </Box>

                        <Divider />
                        <CardContent
                          // sx={{ mt: 2, }}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor:
                              theme.palette.mode === "light" ? "#fff" : "#000",
                          }}
                        >
                          {displayProductData
                            .filter(
                              (product) =>
                                product.product_id === order.ProductID
                            )
                            .map((product) => (
                              <Box key={product.product_id} pr={2}>
                                <Box
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: "10px",
                                  }}
                                >
                                  <Box>
                                    <img
                                      src={product.product_image}
                                      alt="product"
                                      style={{
                                        width: "100px",
                                        height: "100px",
                                        borderRadius: "5px",
                                      }}
                                    />
                                  </Box>
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Typography
                                      variant="body1"
                                      fontWeight="bold"
                                    >
                                      {product.product_name}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      {product.product_manufacturer}
                                    </Typography>
                                    <Box
                                      sx={{
                                        backgroundColor: "green",
                                        p: "1px 9px",
                                        mt: 0.5,
                                        mb: 0.5,
                                        width: "fit-content",
                                        borderRadius: 5,
                                        color: "#fff",
                                      }}
                                    >
                                      <Typography>
                                        {product.product_category}
                                      </Typography>
                                    </Box>
                                    <Typography variant="h4" color="primary">
                                      ₹{product.product_price}
                                    </Typography>
                                    <Typography variant="body2">
                                      Quantities ordered:
                                      {product.product_quantity}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="rgb(0,128,0 , 0.9)"
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <LocalOfferIcon />
                                      &nbsp; 2 Offers & 1 Coupon Applied
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            ))}
                          <Divider orientation="vertical" flexItem />

                          {/* <Box
                          id="delivery details"
                            style={{
                              padding: "10px",
                              backgroundColor:
                                theme.palette.mode === "light"
                                  ? "#f5f5f5"
                                  : "#303030",
                            }}
                          >
                            <Typography variant="body2">
                              ordered Date: {order.OrderDate}
                            </Typography>
                            <Typography variant="body2">
                              Date of confirmation: {order.OrderConfirmationDate}
                            </Typography>
                            <Typography variant="body2">
                              Expected Delivery Date: {order.EstimatedDeliveryDate}
                            </Typography>
                            <Typography variant="body2">
                              Actual Delivery Date: {order.ActualDeliveryDate}
                            </Typography>
                          </Box> */}

                          <Box sx={{ minWidth: "65%", mt: 4 }}>
                            <Stepper
                              alternativeLabel
                              activeStep={getActiveStep(order)}
                              connector={<QontoConnector />}
                            >
                              {[
                                { label: "Order date", date: order.OrderDate },
                                {
                                  label: "Order Confirmed",
                                  date: order.OrderConfirmationDate,
                                },
                                {
                                  label: "Shipping Date",
                                  date: order.ShippingDate,
                                },
                                {
                                  label: "Estimated Delivery",
                                  date: order.EstimatedDeliveryDate,
                                },
                                {
                                  label: "Expected Delivery",
                                  date: order.ActualDeliveryDate,
                                },
                              ].map((step, idx) => (
                                <Step key={idx}>
                                  <StepLabel StepIconComponent={QontoStepIcon}>
                                    <Typography
                                      variant="h6"
                                      color={
                                        step.date &&
                                        isExpiredOrCurrentDate(step.date)
                                          ? theme.palette.mode === "light"
                                            ? "black"
                                            : "white"
                                          : "grey"
                                      }
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        flexDirection: "column",
                                      }}
                                    >
                                      {step.date && formatDate(step.date)}
                                    </Typography>
                                  </StepLabel>

                                  <LineLabel>{step.label}</LineLabel>
                                </Step>
                              ))}
                              {/* <Step key={idx}>
                        <StepLabel StepIconComponent={QontoStepIcon}>
                          {step.label} <br />{" "}
                          {step.date && formatDate(step.date)}
                        </StepLabel>
                      </Step> */}
                            </Stepper>
                            <Divider sx={{ m: 2 }} />
                            <Box  sx={{ display: "flex", justifyContent: "flex-end" }}>
                              
                              <Typography variant="body1">
                              Shipping Address: &nbsp;
                               {order.ShippingAddress}
                              </Typography>
                              </Box>
                          </Box>
                          
                        </CardContent>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Dialog
        maxWidth="lg"
        open={form2Dialog}
        //onClose={() => setform2Dialog(false) && setformDialogClose()}
        aria-labelledby="form-dialog-title"
        sx={{
          backdropFilter: "blur(5px)",
          // backgroundColor: 'rgba(0,0,30,0.4)',
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor:
              theme.palette.mode === "light" ? "#f3f3f3" : colors.grey[800],
          }}
        >
          <DialogTitle id="form-dialog-title" variant="h4">
            Order Invoice
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => {
              setform2Dialog(false);
              handleClear();
            }}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <ClearIcon />
          </IconButton>
        </Box>
        <DialogActions
          sx={{ display: "flex", justifyContent: "center", mt: 2 }}
        >
          <Button
            variant="contained"
            onClick={handlePrint}
            sx={{
              backgroundColor: "#000",
              color: "#fff",
              "&:hover": { backgroundColor: "#00ffea", color: "#000" },
              width: "20%",
              borderRadius: "5px",
              fontSize: "1rem",
            }}
          >
            Print
          </Button>
        </DialogActions>
        <Box ref={formRef} sx={{ padding: 2 }}>
          <Paper
            elevation={0}
            sx={{
              padding: 5,
              backgroundColor: "white",
              color: "black",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ marginBottom: 2 }}
            >
              <Typography variant="h6">Med Connect</Typography>
              <Typography variant="h6">Reg. No.: 123456789</Typography>
            </Box>
            <Typography variant="h6" align="right">
              Date of Issue: {new Date().toDateString()}
            </Typography>
            <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
              Order Invoice
            </Typography>
            <Divider sx={{ backgroundColor: "black" }} />

            <Divider />
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                <Box>
                  <img
                    src={productImage.product_image}
                    alt="product"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "5px",
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="h5">
                    {productImage.product_name}
                  </Typography>
                  <Typography variant="body1">
                    {productImage.product_manufacturer}
                  </Typography>
                  <Typography variant="body1">
                    {productImage.product_category}
                  </Typography>
                  <Typography variant="body1">
                    ₹{productImage.product_price}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  width: "25%",
                }}
              >
                <Typography variant="h5">Shipping Address :</Typography>
                <Typography variant="body1">
                  {order.ShippingAddress}{" "}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ backgroundColor: "black" }} />
            {/* <Box
              display="flex"
              justifyContent="start"
              alignItems="center"
              mt={2}
            >
              <Typography variant="body1">Order Details</Typography>
            </Box> */}
            <DialogContent sx={{ backgroundColor: "white" }}>
              <Grid
                container
                spacing={2}
                sx={{ border: "1px solid black", pb: 4 }}
              >
                <Grid item xs={6}>
                  <TableContainer sx={{ backgroundColor: "white" }}>
                    <Table>
                      <TableBody>
                        {firstHalf.map(([key, value], index) => (
                          <TableRow
                            key={key}
                            sx={{
                              backgroundColor:
                                index % 2 === 0 ? "#f9f9f9" : "white",
                            }}
                          >
                            <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
                              <Typography
                                variant="body1"
                                component="span"
                                sx={{ fontWeight: "bold", color: "black" }}
                              >
                                {key.charAt(0).toUpperCase() +
                                  key.slice(1).replace(/([A-Z])/g, " $1")}
                                :
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
                              <Typography
                                variant="body1"
                                component="span"
                                sx={{ color: "black" }}
                              >
                                {value}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Divider
                  orientation="vertical"
                  sx={{ backgroundColor: "black", margin: "0 1rem" }}
                />
                <Grid item xs={5}>
                  <TableContainer sx={{ backgroundColor: "white" }}>
                    <Table>
                      <TableBody>
                        {secondHalf.map(([key, value], index) => (
                          <TableRow
                            key={key}
                            sx={{
                              backgroundColor:
                                index % 2 === 0 ? "#f9f9f9" : "white",
                            }}
                          >
                            <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
                              <Typography
                                variant="body1"
                                component="span"
                                sx={{ fontWeight: "bold", color: "black" }}
                              >
                                {key.charAt(0).toUpperCase() +
                                  key.slice(1).replace(/([A-Z])/g, " $1")}
                                :
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
                              <Typography
                                variant="body1"
                                component="span"
                                sx={{ color: "black" }}
                              >
                                {value}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider sx={{ backgroundColor: "black" }} />

            {/* <Box
              display="flex"
              justifyContent="start"
              alignItems="center"
              mt={2}
            >
              <Typography variant="body1">Price Details</Typography>
            </Box> */}
            <Box
              sx={{
                backgroundColor: "white",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body1" sx={{ color: "black" }}>
                TaxAmount : {order.TaxAmount}
              </Typography>
              <Typography variant="body1" sx={{ color: "black" }}>
                Shipping Cost :{" "}
                {order.ShippingCost === 0 ? "Free" : order.ShippingCost}
              </Typography>
              <Typography variant="h4" sx={{ color: "black" }}>
                Total Price : {order.TotalPrice}
              </Typography>
            </Box>

            <Divider sx={{ backgroundColor: "black" }} />
            <Box mt={2}>
              <DialogContentText sx={{ color: "black" }}>
                <strong>Undertaking</strong>
                <br />
                I hereby undertake that I have read and understood the terms and
                conditions of the {productImage.product_name} and agree to abide
                by them. 
                <br />
                A. I understand that the cost of the {productImage.product_name} is
                inclusive of all taxes and shipping charges.
                <br />
                B. I also understand that the cost may vary depending on
                the product-specific details. 
                <br />
                C. Cancellation should be done 24 hours prior to the {productImage.product_name}.


                
              </DialogContentText>
            </Box>

            <Box display="flex" justifyContent="space-between" mt={2}>
              <Typography variant="body1">Signature:</Typography>
              <Typography variant="body1">
                This is a computer generated document and does not require a
                signature.
              </Typography>
            </Box>
            <Divider sx={{ backgroundColor: "black", mt: 2 }} />

            <Box display="flex" justifyContent="end" alignItems="center" mt={2}>
              <Typography variant="h6">
                For any queries, please contact us at
              </Typography>
            </Box>
            <Box display="flex" justifyContent="end" alignItems="center">
              <Typography variant="body1"></Typography>
              <Typography variant="body1" sx={{ ml: 1 }}>
                medconnect.query@info.com
              </Typography>
            </Box>
            <Box display="flex" justifyContent="end" alignItems="center">
              <Typography variant="body1">Phone:</Typography>
              <Typography variant="body1" sx={{ ml: 1 }}>
                1234567890
              </Typography>
            </Box>

            <Divider sx={{ backgroundColor: "black" }} />

            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={2}
            >
              <Typography variant="body1">
                Thank you for choosing Med Connect
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Orders;
