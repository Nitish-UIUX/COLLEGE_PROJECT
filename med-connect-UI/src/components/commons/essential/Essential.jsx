import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  Typography,
  Select,
  MenuItem,
  TextField,
  Card,
  CardContent,
  Rating,
  Dialog,
  IconButton,
  ImageList,
  ImageListItem,
  Link,
  CardMedia,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
import axios from "axios";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useNavigate } from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const productDescriptions = [
  {
    id: 1,
    details: "This is a fantastic product that solves many problems.",
    funFact: "Did you know this product was inspired by nature?",
    material: "100% organic cotton",
    features: "Eco-friendly, Durable, Stylish",
    origin: "Made in USA",
    availability: "In stock",
    itemNumber: "12345"
  }
  // Add more product descriptions as needed
];

const data = {
  labels: ['Feature A', 'Feature B', 'Feature C'],
  datasets: [
    {
      label: 'Feature Importance',
      data: [65, 59, 80],
      backgroundColor: ['rgba(75, 192, 192, 0.2)'],
      borderColor: ['rgba(75, 192, 192, 1)'],
      borderWidth: 1
    }
  ]
};




const offers = [
  {
    icon: <AccountBalanceIcon />,
    text: "Get ₹50 instant discount on first Online UPI transaction on order of ₹200 and above",
    link: "#",
  },
  {
    icon: <AccountBalanceIcon />,
    text: "5% Cashback on Axis Bank Card",
    link: "#",
  },
  {
    icon: <AccountBalanceIcon />,
    text: "10% off on ICICI Bank Credit Card, up to ₹1000 on orders of ₹5,000 and above",
    link: "#",
  },
  {
    icon: <LocalOfferIcon />,
    text: "Get extra 31% off (price inclusive of cashback/coupon)",
    link: "#",
  },
];

// const productDescriptions = [
//   {
//     id: 1,
//     details:
//       "A soft, cozy cardigan made from boiled merino wool. It has an easy fit with a shawl collar, patch pockets and a button front. The yarn is boiled before being knit, resulting in a plush texture that's irresistibly touchable.",
//     funFact:
//       "Boiled wool is a special kind of wool fabric that has been agitated in hot water to shrink and compress the fibers tightly together. The result is a dense, warm fabric that is windproof and water-resistant.",
//     material: "100% merino wool.",
//     features: "Button front, patch pockets.",
//     origin: "Imported.",
//     availability: "In Stock",
//     itemNumber: "123456",
//   },
// ];

const reviews = [
  {
    id: 1,
    productId: 1,
    rating: 4.0,
    comment:
      "Absolutely love this cardigan! The color is vibrant and the material is incredibly soft.",
    reviewer: "John D.",
  },
  {
    id: 2,
    productId: 1,
    rating: 4.5,
    comment: "Very comfortable and warm, perfect for layering during winter.",
    reviewer: "Sarah P.",
  },
  {
    id: 3,
    productId: 1,
    rating: 3.5,
    comment: "Great fit and quality, but a bit pricey.",
    reviewer: "Mark R.",
  },
];

const ProductPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { product_id } = useParams();
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [openImagePopup, setOpenImagePopup] = useState(false);
  const [thumbnailss, setThumbnailss] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);
  const [product, setProduct] = useState(null);
  const apiUrl = "http://localhost:5000/api";

  useEffect(() => {
    // scrollTo top
    window.scrollTo(0, 0);
  }, []);
  


  const handleClickOpen = (imageUrl) => setSelectedImage(imageUrl);
  const handleOpenPop = () => setOpenImagePopup(true);

  const fetchProductDetails = () => {
    if (product_id) {
      axios
        .get(`${apiUrl}/product/${product_id}`)
        .then((res) => {
          // Set product details
          setProduct(res.data);
          // Set thumbnails
          setThumbnailss(res.data.images.map((image) => image.product_image));
          // Optionally, set selectedImage if needed
          setSelectedImage(
            res.data.images.length > 0 ? res.data.images[0].product_image : null
          );
        })
        .catch((err) => console.error(err));
    }
  };

  console.log("thumbnails", thumbnailss);

  useEffect(() => {
    fetchProductDetails();
  }, [product_id]);

  // console.log(product.images.product_image);

  const handleReviewSubmit = async () => {
    const newReview = {
      productId: product_id,
      rating: reviewRating,
      comment: reviewComment,
      reviewer: reviewerName,
    };

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      if (response.ok) {
        alert("Review submitted successfully!");
        // Optionally, you can refresh the reviews list here
      } else {
        alert("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<StarIcon key={i} />);
      } else if (i - rating < 1) {
        stars.push(<StarHalfIcon key={i} />);
      } else {
        stars.push(<StarBorderIcon key={i} />);
      }
    }
    return stars;
  };

  const calculateAverageRating = (reviews) => {
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
  };

  const [isGrabbing, setIsGrabbing] = useState(false);

  const handleMouseDown = () => {
    setIsGrabbing(true);
  };

  const handleMouseUp = () => {
    setIsGrabbing(false);
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleAddToCart = (productId) => {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    if (cartItems.includes(productId)) {
      setSnackbarMessage("Item already in cart");
      setSnackbarSeverity("warning");
    } else {
      cartItems.push(productId);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      setSnackbarMessage("Item added successfully");
      setSnackbarSeverity("success");
    }
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleBuyNow = (productId) => {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    if (cartItems.includes(productId)) {
      setSnackbarMessage("Item already in cart");
      setSnackbarSeverity("warning");
      navigate("/cart");
    } else {
      cartItems.push(productId);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      navigate("/cart");
    }
    setSnackbarOpen(true);
  }

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "5rem",
        paddingBottom: "2rem",
      }}
    >
    <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          mb: 1,
          borderRadius: 5,
          width: "90%",
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
            Essential
          </Typography>
      </Box>
      {product ? (
        <>
          {/* Section 1: Product Display */}
          <Card style={{ width: "90%", marginBottom: "20px" }}>
            <CardContent>
              <Grid
                container
                spacing={2}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                <Grid item xs={2}>
                  <ImageList
                    cols={1}
                    style={{
                      overflowY: "auto",
                      maxHeight: "34rem",
                      padding: "0 20px",
                    }}
                  >
                  
                    {thumbnailss.map((thumbnail) => (
                      <ImageListItem key={thumbnail}>
                        <img
                          src={thumbnail||product.product_image}
                          alt={product.product_name}
                          style={{
                            cursor: "pointer",
                            border:
                              selectedImage === thumbnail
                                ? "3px solid #00ffea"
                                : "none",
                            borderRadius: "10px",
                            margin: "2px 0",
                          }}
                          onClick={() => handleClickOpen(thumbnail)}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Grid>
                <Grid item xs={5} style={{ overflow: "hidden" , display: "flex", justifyContent: "center", alignItems: "center"}}>
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: "100%",
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#000" : "#f5f5f5",
                      borderRadius: "10px",
                      overflow: "hidden",
                      minHeight: "34rem",
                      minWidth: "34rem",

                    }}
                  >
                    <img
                      src={selectedImage || product.product_image}
                      alt={product.product_name}
                      style={{
                        maxHeight: "34rem",
                        objectFit: "contain",
                        maxWidth: "34rem",
                        cursor: "zoom-in",
                        borderRadius: "5px",
                      }}
                      onClick={() => handleOpenPop()}
                    />
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box>
                    <Typography variant="h2" style={{ margin: "10px 0" }}>
                      {product.product_name}&nbsp;
                      <span style={{ color: "#888" }}>
                        ( {product.product_brand} )
                      </span>
                    </Typography>
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <Box
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginRight: "10px",
                        }}
                      >
                        <Typography variant="h5" style={{ color: "#388e3c" }}>
                          {calculateAverageRating(reviews)} ★
                        </Typography>
                      </Box>
                      <Typography variant="body1" style={{ color: "#888" }}>
                        {reviews.length} Ratings
                      </Typography>
                    </Box>
                    <Box
                      style={{
                        padding: "5px 10px",
                        borderRadius: "50px",
                        marginBottom: "10px",
                        width: "fit-content",
                        color: theme.palette.mode === "dark" ? "#fff" : "#000",
                        backgroundColor: "rgba(0, 255, 17, 0.3)",
                      }}
                    >
                      <Typography variant="body1">
                        {product.product_category}
                      </Typography>
                    </Box>
                    <Typography variant="h2" style={{ margin: "12px 0" }}>
                      ₹ {product.product_price}
                    </Typography>
                    <Typography variant="body1" style={{ color: "#388e3c" }}>
                      Extra ₹ {product.product_discount} off
                    </Typography>
                    <Typography
                      variant="h3"
                      style={{ color: "#888", textDecoration: "line-through" }}
                    >
                      MRP ₹ {product.product_mrp}
                    </Typography>

                    <Typography style={{ margin: "10px 0", fontSize: "1rem" }}>
                      {/* Availability:{" "} */}
                      {product.product_availability === 1
                        ? "In Stock"
                        : "Out of Stock"}
                    </Typography>
                    <Typography variant="body1" style={{ margin: "10px 0" }}>
                      Description: {product.product_description}
                    </Typography>

                    <Typography variant="body1" style={{ margin: "10px 0" }}>
                      Mkt: {product.product_manufacturer}
                    </Typography>
                    {offers.map((offer, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 1,
                          flexDirection: "row",
                        }}
                      >
                        <Typography variant="body1" sx={{ color: "#388e3c" }}>
                          {offer.icon}
                        </Typography>
                        <Typography variant="body2" sx={{ marginLeft: 1 }}>
                          {offer.text},
                        </Typography>
                        <Link
                          href={offer.link}
                          sx={{ color: "#388e3c" }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          T&C
                        </Link>
                      </Box>
                    ))}

                    {/* <Select
                    defaultValue="Medium"
                    style={{ width: "100%", marginBottom: "10px" }}
                  >
                    <MenuItem value="Small">Pack of 50</MenuItem>
                    <MenuItem value="Medium">Pack of 100</MenuItem>
                    <MenuItem value="Large">Pack of 150</MenuItem>
                    <MenuItem value="Large">Pack of 200</MenuItem>
                  </Select>
                  <Typography variant="body1" style={{ margin: "10px 0" }}>
                    Quantity:
                  </Typography>
                  <Select
                    defaultValue="1"
                    style={{ width: "100%", marginBottom: "10px" }}
                  >
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                  </Select> */}
                  </Box>

                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                      gap: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      style={{
                        width: "100%",
                        padding: "10px 0",
                        marginBottom: "10px",
                      }}
                      onClick={() => handleAddToCart(product.product_id)}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        width: "100%",
                        padding: "10px 0",
                        backgroundColor: "#f78f20",
                        color: "#fff",
                        marginBottom: "10px",
                      }}
                      onClick={() => handleBuyNow(product.product_id)}
                    >
                      Buy Now
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Section 2: Product Description */}

          <Card style={{ width: "90%", marginBottom: "20px", padding: "20px" }}>
      <Box >
        <Typography variant="h2" gutterBottom>
          Product Description
        </Typography>
        {productDescriptions.map((desc) => (
          <Card key={desc.id} sx={{ mb: 4 }}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <CardMedia
                  component="img"
                  height="300"
                  image= {product.product_image}
                  alt="Product Image"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    {desc.details}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Fun Fact:</strong> {desc.funFact}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Material:</strong> {desc.material}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Features:</strong> {desc.features}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Origin:</strong> {desc.origin}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Availability:</strong> {desc.availability}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Item Number:</strong> {desc.itemNumber}
                  </Typography>
                </CardContent>
              </Grid>
            </Grid>
            <Divider  sx={{ py: 2 }} />
            <CardContent sx={{ p : 10 }}>
              <Typography variant="h5" gutterBottom>
                Feature Analysis
              </Typography>
              <Bar data={data} />
              
            </CardContent>
          </Card>
        ))}
      </Box>
    </Card>

















          {/* <Card style={{ width: "90%", marginBottom: "20px" }}>
            <CardContent>
              <Typography variant="h2" style={{ marginBottom: "20px" }}>
                Product Description
              </Typography>
              {productDescriptions.map((desc) => (
                <React.Fragment key={desc.id}>
                  <Typography variant="h4" style={{ marginBottom: "10px" }}>
                    {desc.details}
                  </Typography>
                  <Typography variant="body1" style={{ marginBottom: "10px" }}>
                    <strong>Fun Fact:</strong> {desc.funFact}
                  </Typography>
                  <Typography variant="body1" style={{ marginBottom: "10px" }}>
                    <strong>Material:</strong> {desc.material}
                  </Typography>
                  <Typography variant="body1" style={{ marginBottom: "10px" }}>
                    <strong>Features:</strong> {desc.features}
                  </Typography>
                  <Typography variant="body1" style={{ marginBottom: "10px" }}>
                    <strong>Origin:</strong> {desc.origin}
                  </Typography>
                  <Typography variant="body1" style={{ marginBottom: "10px" }}>
                    <strong>Availability:</strong> {desc.availability}
                  </Typography>
                  <Typography variant="body1" style={{ marginBottom: "10px" }}>
                    <strong>Item Number:</strong> {desc.itemNumber}
                  </Typography>
                </React.Fragment>
              ))}
            </CardContent>
          </Card> */}

          {/* Section 3: Product Reviews */}
          <Card style={{ width: "90%", marginBottom: "20px" }}>
            <CardContent>
              <Typography variant="h2" style={{ marginBottom: "20px" }}>
                Reviews
              </Typography>
              {reviews.map((review) => (
                <React.Fragment key={review.id}>
                  <Typography variant="body1" style={{ marginBottom: "10px" }}>
                    {renderStars(review.rating)}
                    <br />
                    <strong>Comment:</strong> {review.comment}
                    <br />
                    <strong>Reviewer:</strong> {review.reviewer}
                  </Typography>
                </React.Fragment>
              ))}
            </CardContent>
          </Card>

          {/* Section 4: Add Review Form */}
          <Card style={{ width: "90%", marginBottom: "20px" }}>
            <CardContent>
              <Typography variant="h2" style={{ marginBottom: "20px" }}>
                Add Review
              </Typography>
              <form>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  style={{ marginBottom: "20px" }}
                >
                  <Typography variant="h5">Rating:</Typography>
                  <Rating
                    name="rating"
                    value={reviewRating}
                    onChange={(event, newValue) => setReviewRating(newValue)}
                    precision={0.5}
                  />
                </Box>
                <TextField
                  label="Comment"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  style={{ marginBottom: "20px" }}
                />
                <TextField
                  label="Your Name"
                  variant="outlined"
                  fullWidth
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  style={{ marginBottom: "20px" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleReviewSubmit}
                >
                  Submit Review
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Image Popup */}

          <Dialog
            open={openImagePopup}
            onClose={() => setOpenImagePopup(false)}
            maxWidth="100%"
            fullWidth
            style={{
              width: "100%",
              height: "auto",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              backdropFilter: "blur(2px)",
              cursor: isGrabbing ? "grabbing" : "grab",
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // Ensure cursor resets if mouse leaves image while dragging
          >
            <IconButton
              onClick={() => setOpenImagePopup(false)}
              style={{
                position: "fixed",
                top: "10px",
                right: "10px",
                color: "#000000",
                backgroundColor:
                  theme.palette.mode === "dark" ? "#ffffff" : colors.grey[900],
              }}
            >
              <CloseIcon />
            </IconButton>
            <TransformWrapper
              initialScale={1}
              wheel={{ step: 0.5 }}
              doubleClick={{ disabled: true }}
              pan={{ disabled: false }}
            >
              {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                <TransformComponent>
                  <img
                    src={selectedImage || product.product_image}
                    alt={product.product_name}
                    style={{
                      maxHeight: "100vh", // Limit the height to the viewport height
                      objectFit: "contain", // Maintain aspect ratio
                      backgroundColor: "transparent",
                    }}
                  />
                </TransformComponent>
              )}
            </TransformWrapper>
          </Dialog>
        </>
      ) : (
        <Typography variant="h2">Loading product details...</Typography>
      )}



      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}
         sx={{   marginTop: "3rem",fontSize: "1rem"}}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductPage;
