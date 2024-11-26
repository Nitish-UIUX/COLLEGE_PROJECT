import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  Rating,
  Snackbar,
  Alert,
  FormLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import { useParams } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Carousel from "react-material-ui-carousel";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import TuneIcon from "@mui/icons-material/Tune";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ClearIcon from "@mui/icons-material/Clear";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useNavigate } from "react-router-dom";

// Styled ToggleButtonGroup
const StyledToggleButtonGroup = styled(ToggleButtonGroup)({
  "& .MuiToggleButton-root": {
    border: "1px solid #ccc",
    borderRadius: "4px",
    margin: "0 2px",
    textTransform: "none",
    "&.Mui-selected": {
      border: "1px solid #00bfa5",
      backgroundColor: "#00bfa5",
      fontWeight: "bold",
      color: { styledBy: ["palette", "mode", "dark"] },
    },
  },
  "& .MuiToggleButtonGroup-grouped:not(:first-of-type)": {
    borderRadius: "4px",
  },
  "& .MuiToggleButtonGroup-grouped:not(:last-of-type)": {
    borderRadius: "4px",
  },
});

const Product = () => {
  const navigate = useNavigate();
  const { searchValue } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [results, setResults] = useState(searchValue || "");
  const [dataLength, setDataLength] = useState(0);
  const [data, setData] = useState([]);
  const [sort, setSort] = useState("popularity");
  const [priceRange, setPriceRange] = useState([10, 50000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const FilterClear = () => {
    setSelectedBrands([]);
    setSelectedManufacturers([]);
    setSelectedCategories([]);
    setPriceRange([10, 1000]);
    //change all the checkboxes to false
    // const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    // checkboxes.forEach((checkbox) => {
    //   checkbox.checked = false;
    // });
    //time delay to clear the checkboxes
    
    setCategories([]);
    setManufacturers([]);
    setBrands([]);
    
    window.location.reload();

    
  };


  useEffect(() => {
    //scroll to top
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        const products = response.data;
        setData(products);
        setDataLength(products.length);

        console.log(products);

        const brandCounts = {};
        const manufacturerCounts = {};
        const categoryCounts = {};

        products.forEach((item) => {
          brandCounts[item.product_brand] =
            (brandCounts[item.product_brand] || 0) + 1;
          manufacturerCounts[item.product_manufacturer] =
            (manufacturerCounts[item.product_manufacturer] || 0) + 1;
          categoryCounts[item.product_category] =
            (categoryCounts[item.product_category] || 0) + 1;
        });

        setBrands(Object.entries(brandCounts));
        setManufacturers(Object.entries(manufacturerCounts));
        setCategories(Object.entries(categoryCounts));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    setResults(event.target.value);
  };

  const handleSortChange = (event, newSort) => {
    setSort(newSort);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleBrandChange = (event) => {
    const value = event.target.value;
    setSelectedBrands((prevState) =>
      prevState.includes(value)
        ? prevState.filter((brand) => brand !== value)
        : [...prevState, value]
    );
  };

  const handleManufacturerChange = (event) => {
    const value = event.target.value;
    setSelectedManufacturers((prevState) =>
      prevState.includes(value)
        ? prevState.filter((manufacturer) => manufacturer !== value)
        : [...prevState, value]
    );
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategories((prevState) =>
      prevState.includes(value)
        ? prevState.filter((category) => category !== value)
        : [...prevState, value]
    );
  };

  const filteredResults = data.filter(
    (item) =>
      item.product_name.toLowerCase().includes(results.toLowerCase()) &&
      (selectedBrands.length === 0 ||
        selectedBrands.includes(item.product_brand)) &&
      (selectedManufacturers.length === 0 ||
        selectedManufacturers.includes(item.product_manufacturer)) &&
      (selectedCategories.length === 0 ||
        selectedCategories.includes(item.product_category)) &&
      item.product_price >= priceRange[0] &&
      item.product_price <= priceRange[1]
  );

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sort) {
      case "popularity":
        return a.product_id - b.product_id;
      case "high-to-low":
        return b.product_price - a.product_price;
      case "low-to-high":
        return a.product_price - b.product_price;
      case "discount":
        return b.product_discount - a.product_discount;
      default:
        return 0;
    }
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedResults.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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

  const renderStars = (rating) => {
    const stars = [];
    const integerPart = Math.floor(rating);
    const decimalPart = rating - integerPart;

    for (let i = 1; i <= 5; i++) {
      if (i <= integerPart) {
        stars.push(<StarIcon key={i} sx={{ color: "#FFA500" }} />);
      } else if (i === integerPart + 1 && decimalPart >= 0.5) {
        stars.push(<StarHalfIcon key={i} sx={{ color: "#FFA500" }} />);
      } else {
        stars.push(<StarBorderIcon key={i} sx={{ color: "#FFA500" }} />);
      }
    }

    return stars;
  };

  const toggleFavorite = (productId) => {
    const products = [...data];
    const index = products.findIndex((item) => item.product_id === productId);
    products[index].isFavorite = !products[index].isFavorite;
    setData(products);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        pt: 10,
        pb: 4,
        maxWidth: "90%",
        margin: "0 auto",
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
          onClick={() => navigate("/")}
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
        <Typography sx={{ ml: 0.5, textAlign: "center" , fontSize: "0.8rem" , color: "#00A799"}}>
           Products 
          </Typography>
      </Box>
      <Grid container spacing={3}>
        {/* Filters */}
        <Grid item xs={12} md={2} sx={{ pb: 3 }}>
          <Box
            sx={{
              p: "1rem 1.5rem",
              bgcolor:
                theme.palette.mode === "dark" ? colors.grey[900] : "#fff",
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
              borderRadius: 1,
            }}
          >
            <Typography
              variant="h4"
              sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}
            >
              Filters &nbsp; <TuneIcon />
            </Typography>
            <Divider sx={{ my: 2 }} />
            {/* <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <TextField
                variant="outlined"
                placeholder="Search Products..."
                value={results}
                onChange={handleSearch}
                InputProps={{
                  // startAdornment: (
                  //   <InputAdornment position="start">
                  //     <SearchIcon />
                  //   </InputAdornment>
                  // ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setResults("")}
                        size="small"
                        disabled={results === ""}
                      >
                        <CloseIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "30px",
                    height: "2.5rem",
                    // width: "800px",
                  },
                }}
              /> 
            </Box>*/}
            <FormLabel component="legend" sx={{ mb: 2 }}>
              Brands
            </FormLabel>
            {/* <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              fullWidth
              sx={{
                marginBottom: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
              }}
            /> */}
            <Box sx={{ maxHeight: "150px", overflowY: "auto" }}>
              <FormGroup>
                {brands.map(([brand, count]) => (
                  <FormControlLabel
                    key={brand}
                    control={
                      <Checkbox value={brand} onChange={handleBrandChange} />
                    }
                    label={`${brand} (${count})`}
                  />
                ))}
              </FormGroup>
            </Box>
            <Divider sx={{ my: 2 }} />
            <FormLabel component="legend" sx={{ mb: 2 }}>
              Manufacturers
            </FormLabel>
            {/* <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              fullWidth
              sx={{
                marginBottom: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
              }}
            /> */}
            <Box sx={{ maxHeight: "150px", overflowY: "auto" }}>
              <FormGroup>
                {manufacturers.map(([manufacturer, count]) => (
                  <FormControlLabel
                    key={manufacturer}
                    control={
                      <Checkbox
                        value={manufacturer}
                        onChange={handleManufacturerChange}
                      />
                    }
                    label={`${manufacturer} (${count})`}
                  />
                ))}
              </FormGroup>
            </Box>
            <Divider sx={{ my: 2 }} />
            <FormLabel component="legend" sx={{ mb: 2 }}>
              Categories
            </FormLabel>
            {/* <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              fullWidth
              sx={{
                marginBottom: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
              }}
            /> */}
            <FormGroup>
              {categories.map(([category, count]) => (
                <FormControlLabel
                  key={category}
                  control={
                    <Checkbox
                      value={category}
                      onChange={handleCategoryChange}
                    />
                  }
                  label={`${category} (${count})`}
                />
              ))}
            </FormGroup>
            <Divider sx={{ my: 2 }} />
            <FormLabel component="legend" sx={{ mb: 2 }}>
              Price Range
            </FormLabel>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={10}
              max={2000}
              sx={{ marginBottom: 0.2, ":hover": { color: "#00ffea" } }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2">₹10</Typography>
              <Typography variant="body2">₹2000</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Button
              variant="contained"
              color="primary"
              startIcon={<ClearIcon />}
              fullWidth
              onClick={() => FilterClear() }
              sx={{ bgcolor: "#00ffea", color: "#000" , "&:hover": {bgcolor: theme.palette.mode === "dark" ? "#fff" : "#000" , color: theme.palette.mode === "dark" ? "#000" : "#fff" }}}
            >
              clear filters
            </Button>
          </Box>
        </Grid>
        {/* Filters End */}

        <Grid item xs={12} md={10} sx={{ pb: 10 }}>
          {/* Carousel */}
          {/* <Carousel>
            <img
              src="/images/Crausel_1.png"
              alt="Carousel 1"
              style={{ width: "100%", height: "300px", objectFit: "cover" }}
            />
            <img
              src="/images/Crausel_2.jpg"
              alt="Carousel 2"
              style={{ width: "100%", height: "300px", objectFit: "cover" }}
            />
          </Carousel> */}
          {/* ---------------------create the search bar here--------------------- */}
          <Box display="flex" alignItems="center" width="100%" mb={2}>
            <TextField
              label="Search Products"
              variant="outlined"
              value={results}
              onChange={handleSearch}

              fullWidth
              InputProps={{ 
                endAdornment: (
                  <InputAdornment position="end">
                    {/* <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SearchIcon />}
                      sx={{ height: "40px", margin: "-14px" , 
                      ":hover": {
                        backgroundColor: "#00ffea",
                        color: "black",
                        fontWeight: "bold",
                      },
                        
                        }}
                    >
                      Search Orders
                    </Button> */}
                    <IconButton 
                      size="small"
                      onClick={() => setResults("")}
                      disabled={results === ""}

                      >
                        <ClearIcon />
                      </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* All Products */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">
              Showing {indexOfFirstItem + 1} -{" "}
              {indexOfLastItem > dataLength ? dataLength : indexOfLastItem} of{" "}
              {dataLength} results
            </Typography>
            <Box>
              <Typography variant="body2" component="span" sx={{ mr: 2 }}>
                Sort by:
              </Typography>
              <StyledToggleButtonGroup
                value={sort}
                exclusive
                onChange={handleSortChange}
                size="small"
              >
                <ToggleButton value="popularity">Popularity</ToggleButton>
                <ToggleButton value="high-to-low">High to Low</ToggleButton>
                <ToggleButton value="low-to-high">Low to High</ToggleButton>
                <ToggleButton value="discount">Discount</ToggleButton>
              </StyledToggleButtonGroup>
            </Box>
          </Box>
          <Grid container spacing={2}>
            {currentItems.map((item) => (
              <Grid item xs={3} key={item.product_id}>
                <Paper
                  sx={{
                    padding: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      textAlign: "center",
                      flexGrow: 1,
                    }}
                  >
                    {item.product_discount && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          left: -5,
                          backgroundColor: "green",
                          color: "white",
                          padding: "2px 4px",
                          borderRadius: "4px",
                          fontSize: "12px",
                        }}
                      >
                        {item.product_discount}% OFF
                      </Box>
                    )}
                    <Link to={`/essential/${item.product_id}`}>
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        style={{
                          width: "100%",
                          height: "12.5rem",
                          objectFit: "contain", 
                          borderRadius: "8px",
                        }}
                      />
                    </Link>
                    <IconButton
                      onClick={() => toggleFavorite(item.product_id)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: item.isFavorite ? "red" : "black",
                      }}
                    >
                      {item.isFavorite ? (
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                  </Box>
                  <Box sx={{ flexGrow: 1, textAlign: "left" }}>
                    <Typography variant="h5" noWrap mt={1}>
                      {item.product_name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {renderStars(item.product_ratings)}&nbsp;
                      <Typography
                        variant="subtitle1"
                        color="green"
                        component="div"
                        mt={1}
                      >
                        {item.product_ratings}&nbsp;
                        <Typography variant="text secondary">
                          Rating&nbsp;
                        </Typography>
                      </Typography>
                    </Box>
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
                      <Typography>{item.product_category}</Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      color="text.primary"
                      sx={{ fontSize: "1.2rem" }}
                    >
                      ₹{item.product_price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "green" }}>
                      Extra discount: {item.product_discount}% OFF
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        textDecoration: "line-through",
                        fontSize: "1rem",
                        mb: 0.5,
                      }}
                    >
                      MRP: ₹{item.product_mrp.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Brand: {item.product_brand}
                    </Typography>
                    <Typography variant="body2">
                      Mkt: {item.product_manufacturer}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                      mt: 1,
                      ":hover": {
                        backgroundColor: "#00ffea",
                        color: "black",
                        fontWeight: "bold",
                      },
                    }}
                    onClick={() => handleAddToCart(item.product_id)}
                  >
                    Add to Cart
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Button
              variant="contained"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              sx={{ mr: 2 }}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, index) => (
              <IconButton
                key={index}
                variant="contained"
                onClick={() => setCurrentPage(index + 1)}
                sx={{
                  mx: 1,
                  minWidth: 36,
                  backgroundColor:
                    currentPage === index + 1
                      ? theme.palette.mode === "dark"
                        ? "#000"
                        : "#00ffea"
                      : "transparent",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color:
                      currentPage === index + 1
                        ? theme.palette.mode === "dark"
                          ? "#fff"
                          : "#000"
                        : theme.palette.text.secondary,
                  }}
                >
                  {index + 1}
                </Typography>
              </IconButton>
            ))}
            <Button
              variant="contained"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              sx={{ ml: 2 }}
            >
              Next
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ marginTop: "3rem", fontSize: "1rem" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Product;
