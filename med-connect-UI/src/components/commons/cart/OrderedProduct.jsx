import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Button,
  styled,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import PropTypes from "prop-types";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import Check from "@mui/icons-material/Check";

const OrderDetailsPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [orderIDs, setOrderIDs] = useState([]);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
//Refresh after 5 minutes


//scroll to top
useEffect(() => {
  //scroll to top
  window.scrollTo(0, 0);
}, []);


setTimeout(function() {
  fetchOrders();
}, 1 * 60 * 1000 + 30 * 1000); 


  useEffect(() => {
    const allOrderIDs = location.state?.orderIDs.orderIDs || [];
    setOrderIDs(allOrderIDs);
    setLoading(false);
  }, [location.state?.orderIDs.orderIDs]);

  const fetchOrders = async () => {
    const AuthToken = localStorage.getItem("data");
    const orderIdsArray = orderIDs.map((order) => order.orderId);

    const orderIds = {
      orderIDs: orderIdsArray,
    };

    if (!AuthToken) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/orderId",
        orderIds,
        {
          headers: {
            Authorization: `Bearer ${AuthToken}`,
          },
        }
      );
      setOrders(response.data);
      console.log("Orders: ", response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [orderIDs]);

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
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
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

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        p: "5rem 0rem",
      }}
    >
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" , height: "100vh", flexDirection: "column"}}>
        
        <CircularProgress />
        <Typography variant="h4" color="textSecondary" sx={{ mt: 2}}>
          Fetching Order Details...
        </Typography>
        </Box>
      ) : (
        <Box width="90%" >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.2,
            }}
          >
            <Typography variant="h2"># Order Details</Typography>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Button
              variant="outlined"
             
              href="/"
              underline="none"
              sx={{ mr: 2 , color: theme.palette.mode === "light" ? "#000" : "#fff"  }}
            >
               Back to Home
            </Button>
            <Button
              variant="contained"
              color="primary"
              href="/medicine"
              underline="none"
              
            >
            Continue Shopping
             
            </Button>
            </Box>
          </Box>
          <Box sx={{}}>
            <Typography variant="body1" color="textSecondary">
              Order ID: {orderIDs.map((order) => order.orderId).join(", ")}
            </Typography>
          </Box>
          <Box
            sx={{
              mb: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
           <Box
  component="img"
  src="/images/cart/image-removebg-preview.png"
  alt="Profile Picture"
  style={{ width: 300, height: 250, borderRadius: "50%" , objectFit: "contain"}}
/>
            <Typography variant="h1" color="primary">
              Order Successfully Placed
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ textAlign: "center" }}
            >
              Thank You for Shopping with us <br />
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ textAlign: "center" }}
            >
              Your order is confirmed and will be delivered soon
            </Typography>
          </Box>

          {orders.map((order, index) => (
            <Card
              key={index}
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 1,
                border: "1px solid",
                borderColor: theme.palette.mode === "light" ? "#fff" : "#333",
                backgroundColor:
                  theme.palette.mode === "light" ? "#f5f5f5" : "#1E1E1E",
                boxShadow:
                  theme.palette.mode === "light"
                    ? "0px 0px 10px 0px rgba(0,0,0,0.2)"
                    : "0px 0px 10px 0px rgba(0,0,0,0.7) !important",
              }}
            >
              <Typography variant="body1" color="textSecondary">
                Order ID: {order.OrderID}
              </Typography>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 100, height: 100, mr: 2 }}
                    image={order.product_image}
                    alt="Product Image"
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" fontWeight="bold">
                      {order.product_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {order.product_manufacturer}
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
                      <Typography>{order.product_category}</Typography>
                    </Box>
                    <Typography variant="h4" color="primary">
                      ₹{order.product_price}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="rgb(0,128,0 , 0.9)"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <LocalOfferIcon />
                      &nbsp; 2 Offers & 1 Coupon Applied
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ minWidth: "75%", mt: 4 }}>
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
                      { label: "Shipping Date", date: order.ShippingDate },
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
                              step.date && isExpiredOrCurrentDate(step.date)
                                ? "green"
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
                </Box>
                {/* <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                     Deliver to: {order.ShippingAddress}
                    </Typography>
                    </Box> */}
              </CardContent>
              <Divider />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Typography variant="h6" color="textSecondary">
                  Shipping Address : &nbsp;
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {order.ShippingAddress}
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default OrderDetailsPage;

// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Stepper,
//   Step,
//   StepLabel,
//   CircularProgress,
//   Card,
//   CardContent,
//   CardMedia,
//   Divider,
//   Button,
//   StepConnector,
//   styled,
// } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import { tokens } from "../../../theme";
// import LocalOfferIcon from "@mui/icons-material/LocalOffer";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import axios from "axios";

// const OrderDetailsPage = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const location = useLocation();
//   const [loading, setLoading] = useState(true);
//   const [orderIDs, setOrderIDs] = useState([]);
//   const [error, setError] = useState(null);
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     const allOrderIDs = location.state?.orderIDs.orderIDs || [];
//     setOrderIDs(allOrderIDs);
//     setLoading(false);
//   }, [location.state?.orderIDs.orderIDs]);

//   const fetchOrders = async () => {
//     const AuthToken = localStorage.getItem("data");
//     const orderIdsArray = orderIDs.map((order) => order.orderId);

//     const orderIds = {
//       orderIDs: orderIdsArray,
//     };

//     if (!AuthToken) {
//       setError("No authentication token found");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/orderId",
//         orderIds,
//         {
//           headers: {
//             Authorization: `Bearer ${AuthToken}`,
//           },
//         }
//       );
//       setOrders(response.data);
//       console.log("Orders: ", response.data);
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       setError(err.message || "Failed to fetch orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [orderIDs]);

//   const formatDate = (dateString) => {
//     const options = { year: "numeric", month: "short", day: "numeric" };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const isExpiredOrCurrentDate = (dateString) => {
//     const currentDate = new Date();
//     return new Date(dateString) <= currentDate;
//   };

//   const getActiveStep = (order) => {
//     const steps = [
//       { label: "Order date", date: order.OrderDate },
//       { label: "Order Confirmed", date: order.OrderConfirmationDate },
//       { label: "Shipping Date", date: order.ShippingDate },
//       { label: "Estimated Delivery Date", date: order.EstimatedDeliveryDate },
//       { label: "Actual Delivery Date", date: order.ActualDeliveryDate },
//     ];

//     for (let i = 0; i < steps.length; i++) {
//       if (!steps[i].date || new Date(steps[i].date) > new Date()) {
//         return i;
//       }
//     }

//     return steps.length;
//   };

//   const CustomStepIcon = (props) => {
//     const { active, completed, icon } = props;
//     const isExpired = isExpiredOrCurrentDate(icon);
//     const color = completed || active || isExpired ? "green" : "grey";

//     return (
//       <Box
//         sx={{
//           color: color,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         {completed ? (
//           <CheckCircleIcon sx={{ fontSize: 30 }} />
//         ) : (
//           <Box
//             sx={{
//               width: 24,
//               height: 24,
//               borderRadius: "50%",
//               border: `1px solid ${color}`,
//               backgroundColor: color,
//             }}
//           />
//         )}
//       </Box>
//     );
//   };

//   const CustomStepConnector = styled(StepConnector)(({ theme, active, completed }) => ({
//     [`& .${StepConnector.line}`]: {
//       borderColor: completed ? "green" : "grey",
//       borderWidth: 2,
//     },
//   }));

//   const LineLabel = styled('div')(({ theme }) => ({
//     position: 'absolute',
//     top: -28,
//     width: '100%',
//     textAlign: 'center',
//     fontWeight: 'bold',
//     fontSize: '12px',
//   }));

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         flexDirection: "column",
//         p: "5rem 0rem",
//       }}
//     >
//       {loading ? (
//         <CircularProgress />
//       ) : (
//         <Box width="90%">
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               mb: 1.2,
//             }}
//           >
//             <Typography variant="h2"># Order Details</Typography>
//             <Button
//               variant="contained"
//               color="primary"
//               href="/"
//               underline="none"
//             >
//               Back to Home
//             </Button>
//           </Box>
//           <Box sx={{ }} >
//             <Typography variant="body1" color="textSecondary">
//               Order ID: {orderIDs.map((order) => order.orderId).join(", ")}
//             </Typography>
//           </Box>
//           <Box sx={{ mb: 3  , display: "flex", flexDirection: "column" , alignItems: "center"}}>

//           <img
//   src="/images/cart/image-removebg-preview.png"
//   alt="Profile Picture"
//   style={{ width: 300, height: 250, borderRadius: "50%" }}
// />

//             <Typography variant="h1" color="primary" >
//               Order Successfully Placed
//             </Typography>

//             <Typography variant="body1" color="textSecondary"  sx={{ textAlign: "center"}}>
//               Thank You for Shopping with us <br />

//             </Typography>
//             <Typography variant="body1" color="textSecondary" sx={{ textAlign: "center"}}>
//               Your order is confirmed and will be delivered soon
//             </Typography>

//           </Box>

//           {orders.map((order, index) => (
//             <Card
//               key={index}
//               sx={{
//                 mb: 3,
//                 p: 2,
//                 borderRadius: 1,
//                 border: "1px solid",
//                 borderColor: theme.palette.mode === "light" ? "#fff": "#333",
//                 backgroundColor:
//                   theme.palette.mode === "light" ? "#f5f5f5" : "#1E1E1E",
//                 boxShadow:
//                   theme.palette.mode === "light"
//                     ? "0px 0px 10px 0px rgba(0,0,0,0.2)"
//                     : "0px 0px 10px 0px rgba(0,0,0,0.7) !important",
//               }}
//             >
//              <Typography variant="body1" color="textSecondary">
//                   Order ID: {order.OrderID}
//                 </Typography>
//               <CardContent sx={{ display: "flex", flexDirection: "row" , justifyContent: "space-between"}}>

//                 <Box sx={{ display: "flex", alignItems: "center" }}>
//                   <CardMedia
//                     component="img"
//                     sx={{ width: 100, height: 100, mr: 2 }}
//                     image={order.product_image}
//                     alt="Product Image"
//                   />
//                   <Box sx={{ flexGrow: 1 }}>
//                   <Typography variant="body1" color="textSecondary">
//                   Order ID: {order.OrderID}
//                 </Typography>
//                     <Typography variant="body1" fontWeight="bold">
//                       {order.product_name}
//                     </Typography>
//                     <Typography variant="body2" color="textSecondary">
//                       {order.product_manufacturer}
//                     </Typography>
//                     <Box
//                       sx={{
//                         backgroundColor: "green",
//                         p: "1px 9px",
//                         mt: 0.5,
//                         mb: 0.5,
//                         width: "fit-content",
//                         borderRadius: 5,
//                         color: "#fff",
//                       }}
//                     >
//                       <Typography>{order.product_category}</Typography>
//                     </Box>
//                     <Typography variant="h4" color="primary">
//                       ₹{order.product_price}
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       color="rgb(0,128,0 , 0.9)"
//                       sx={{ display: "flex", alignItems: "center" }}
//                     >
//                       <LocalOfferIcon />
//                       &nbsp; 2 Offers & 1 Coupon Applied
//                     </Typography>
//                   </Box>
//                 </Box>
//                 <Box sx={{ mt: 4 , width: "80%"}}>
//                   <Stepper
//                     alternativeLabel
//                     activeStep={getActiveStep(order)}
//                     connector={<CustomStepConnector />}
//                     sx={{ mb: 5 }}
//                   >
//                     {[
//                       {
//                         label: "Order date",
//                         date: order.OrderDate,
//                       },
//                       {
//                         label: "Order Confirmed",
//                         date: order.OrderConfirmationDate,
//                       },
//                       {
//                         label: "Shipping Date",
//                         date: order.ShippingDate,
//                       },
//                       {
//                         label: "Estimated Delivery Date",
//                         date: order.EstimatedDeliveryDate,
//                       },
//                       {
//                         label: "Actual Delivery Date",
//                         date: order.ActualDeliveryDate,
//                       },
//                     ].map((step, idx) => (
//                       <Step key={idx}>
//                         <StepLabel
//                           StepIconComponent={(props) => (
//                             <CustomStepIcon {...props} icon={step.date} />
//                           )}
//                         >
//                           <Typography
//                             variant="h6"
//                             color={
//                               step.date && isExpiredOrCurrentDate(step.date)
//                                 ? "green"
//                                 : "grey"
//                             }
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               flexDirection: "column",
//                             }}
//                           >
//                        {step.date && formatDate(step.date)}
//                           </Typography>
//                         </StepLabel>

//                           <LineLabel>
//                             {step.label}
//                           </LineLabel>

//                       </Step>
//                     ))}
//                   </Stepper>
//                 </Box>
//               </CardContent>
//               <Divider sx={{ mb: 2 }} />
//               <Typography variant="body2" color="textSecondary">
//                 Processed by MedConnect. Expected by{" "}
//                 {formatDate(order.EstimatedDeliveryDate)}
//               </Typography>
//             </Card>
//           ))}
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default OrderDetailsPage;
