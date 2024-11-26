import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Grid,
  TextField,
  IconButton,
  Button,
  Avatar,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import SearchIcon from "@mui/icons-material/Search";

const FAQPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [question, setQuestion] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [responseError, setResponseError] = useState("");
  const [displayQuestion, setDisplayQuestion] = useState("");

  const fetchFaqData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/faq");
      const sortedData = response.data.sort((a, b) => b.id - a.id); // Adjust if you have a timestamp field
      setFaqs(sortedData);
      // console.log("Fetched data: ", sortedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchFaqData();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    const results = faqs.filter((faq) =>
      faq.question.toLowerCase().includes(text.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleSubmitQuestion = async () => {
    if (!name || !email || !question) {
      setResponseError("Please fill out all fields.");
      setTimeout(() => {
        setResponseError("");
      }, 5000);
      return;
    } else if (!email.includes("@")) {
      setResponseError("Please enter a valid email address.");
      setTimeout(() => {
        setResponseError("");
      }, 5000);
      return;
      // } else if (localStorage.getItem("data") === null) {
      //   setResponseError("Please login to submit a question.");
      //   return;
    } else {
      try {
        const response = await axios.post("http://localhost:5000/api/faq", {
          name,
          email,
          question,
        });
        console.log("Submitted question: ", response.data);
        setResponseError("Your question has been successfully submitted");
        setDisplayQuestion(question);
        await fetchFaqData();
        setName("");
        setEmail("");
        setQuestion("");
        // Time delay to show empty response error
        setTimeout(() => {
          setResponseError("");
          setDisplayQuestion("");
        }, 5000);
      } catch (error) {
        console.error("Error submitting question: ", error);
      }
    }
  };

  return (
    <Box
    id="FAQ"
      sx={{
        backgroundImage:
          theme.palette.mode === "dark"
            ? `linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.6)), url('/images/RTzCYioaRuOW-_yM1bNxQQ.webp')`
            : `linear-gradient(180deg, rgba(255,255,255,0.023), rgba(255,255,255,0.1)), url('/images/RTzCYioaRuOW-_yM1bNxQQ.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        backgroundAttachment: "fixed",
        borderBottomLeftRadius: "10rem",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          pb: 10,
          pt: 5,
          width: "100%",
        }}
      >
        <Box
          sx={{
            mb: 5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.7)"
                : "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(10px)",
            borderRadius: "10px",
            width: "100%",
            mt: 4,
          }}
        >
          <Typography
              style={{
                fontSize: "1.2rem",
                lineHeight: "30px",
                // textTransform: "uppercase",
                letterSpacing: "1.4px",
                fontWeight: 400,
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <span
                style={{
                  border: "1px solid ",
                  width: "100px",
                  display: "block",
                  marginRight: "10px",
                borderColor: theme.palette.mode === "dark" ? "#00ffea" : "#00a698",
                  // marginTop: "200px",
                }}
              ></span>
              <span style={{ padding: "0px 10px" , fontSize: 32,
              
              }}>FAQs</span>
              <span
                style={{
                  border: "1px solid ",
                  width: "100px",
                  display: "block",
                  marginLeft: "10px",
                  borderColor: theme.palette.mode === "dark" ? "#00ffea" : "#00a698",
                }}
              ></span>
            </Typography>
        </Box>

        <Box
          container
          spacing={4}
          gap={2}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          {/*|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */}

          <Box
            sx={{
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(0, 0, 0, 0.7)"
                  : "rgba(255, 255, 255, 0.5)",
              backdropFilter: "blur(10px)",
              p: 4,
              borderRadius: "10px",
              minWidth: { xs: "100%", md: "50%" },
            }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              Search for FAQs
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search for a question..."
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#333" : "#fff",
                  borderRadius: "25px",
                  height: "40px",
                }}
                InputProps={{
                  startAdornment: (
                    <SearchIcon  sx={{ mr: 1,}} />
                  ),
                  endAdornment: (
                    <IconButton onClick={() => handleSearch("")}>
                      <ClearIcon />
                    </IconButton>
                  ),
                  sx: {
                    borderRadius: "25px",
                    height: "40px",
                  },
                }}
                InputLabelProps={{
                  sx: {
                    top: "-14%",
                  },
                }}
              />
            </Box>
            <Box
              sx={{
                maxHeight: "60vh",
                overflowY: "auto",
                bgcolor:
                  theme.palette.mode === "dark"
                    ? colors.grey[8000]
                    : colors.grey[6000],
                borderRadius: "10px",
                padding: "1rem",
                // minHeight: "34.2rem",
              }}
            >
              {faqs.length === 0 && (
                //add a gif here
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    
                  }}
                >
                  <Box
                    component="img"
                    src="/images/3024051-removebg.png"
                    alt="loading"
                    sx={{ width: 450, height: 350 , borderRadius: "10px"}}
                  />
                </Box>
              )}
              {searchText.length === 0 &&
                faqs.map((faq, index) => (
                  <Accordion
                    key={index}
                    sx={{
                      mb: 1,
                      borderRadius: " 0 0 10px 10px",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${index}-content`}
                      id={`panel${index}-header`}
                      sx={{
                        borderRadius: " 0 0 10px 10px",
                        bgcolor:
                          theme.palette.mode === "dark" ? "#333" : "#fff",
                        "&.Mui-expanded": {
                          bgcolor:
                            theme.palette.mode === "dark" ? "#333" : "#fff",
                          borderRadius: "0 0 0 0",
                        },
                        // justifyContent: "space-between",
                        // display: "flex",
                        // alignItems: "center",

                      }}
                    >
                      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" ,gap: 2 , pr: "0.5rem"}}>
                      <Typography variant="h6" sx={{ fontWeight: "bold" , display: "flex", justifyContent: "center", alignItems: "center"}}>
                        {faq.question}
                      </Typography>
                      {/* <Typography variant="h6" sx={{ display: "flex", flexDirection: "row" }}>
                      <Typography variant="h6" >
                        {faq.name}
                        </Typography>
                        <Typography variant="h6" >
                        {faq.email}
                        </Typography>
                      </Typography> */}
                      {faq.name && (
                      <Chip
                        key={index}
                        avatar={<Avatar src = {`https://picsum.photos/id/${index}/200/300`}  sx={{ border : "2px solid", borderColor: colors.grey[100] }} />}
                        
                        label= {`${faq.name} (${faq.email})`}
                        sx={{
                          alignSelf: "flex-start",
                          maxWidth: "40%",
                        }}
                      />
                      )}
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        bgcolor: colors.grey[900],
                        borderRadius: "0 0 10px 10px",
                      }}
                    >
                      <Typography variant="body1">{faq.answer}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}

              {searchText.length > 0 &&
                searchResults.length === 0 &&
                faqs.length > 0 && (
                  <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    
                  }}
                >
                  <Box
                    component="img"
                    src="/images/360_F_426085199_q6YtlZR7McMNekrghgyetyoPZKTro0WV-removebg-preview.png"
                    alt="loading"
                    sx={{ width: 350, height: 350 , borderRadius: "10px"}}
                  />
                </Box>
                )}
              {searchText.length > 0 &&
                searchResults.map((faq, index) => (
                  <Accordion
                    key={index}
                    sx={{ mb: 1, borderRadius: "0 0 10px 10px " }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${index}-content`}
                      id={`panel${index}-header`}
                      sx={{
                        borderRadius: " 0 0 10px 10px",
                        bgcolor:
                          theme.palette.mode === "dark" ? "#333" : "#fff",
                        "&.Mui-expanded": {
                          bgcolor:
                            theme.palette.mode === "dark" ? "#333" : "#fff",
                          borderRadius: "0 0 0 0",
                        },
                      }}
                    >
                     <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" ,gap: 2 , pr: "0.5rem"}}>
                      <Typography variant="h6" sx={{ fontWeight: "bold" , display: "flex", justifyContent: "center", alignItems: "center"}}>
                        {faq.question}
                      </Typography>
                      {/* <Typography variant="h6" sx={{ display: "flex", flexDirection: "row" }}>
                      <Typography variant="h6" >
                        {faq.name}
                        </Typography>
                        <Typography variant="h6" >
                        {faq.email}
                        </Typography>
                      </Typography> */}
                      {faq.name && (
                      <Chip
                        key={index}
                        avatar={<Avatar src = {`https://picsum.photos/id/${index}/200/300`}  sx={{ border : "2px solid", borderColor: colors.grey[100] }} />}
                        
                        label= {`${faq.name} (${faq.email})`}
                        sx={{
                          alignSelf: "flex-start",
                          maxWidth: "40%",
                        }}
                      />
                      )}
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        bgcolor: colors.grey[900],
                        borderRadius: "0 0 10px 10px",
                      }}
                    >
                      <Typography variant="body1">{faq.answer}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
            </Box>
          </Box>
          {/*|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */}

          <Box
            sx={{
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(0, 0, 0, 0.7)"
                  : "rgba(255, 255, 255, 0.5)",
              backdropFilter: "blur(10px)",
              p: 4,
              borderRadius: "10px",
            }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              Ask a Question
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Enter Your Name..."
              // placeholder="Enter Your Name..."
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                mb: 2,
                backgroundColor:
                  theme.palette.mode === "dark" ? "#333" : "#fff",
                borderRadius: "5px",
              }}
            />

            <TextField
              fullWidth
              variant="outlined"
              label="Enter Your Email..."
              // placeholder="Enter your email..."
              type="email"
                  name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                mb: 2,
                backgroundColor:
                  theme.palette.mode === "dark" ? "#333" : "#fff",
                borderRadius: "5px",
              }}
            />
            <textarea
              rows={5}
              placeholder="Type your question here..."
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "5px",
                marginBottom: "1.5rem",
                resize: "vertical",
                backgroundColor:
                  theme.palette.mode === "dark" ? "#333" : "#fff",
                color: theme.palette.mode === "dark" ? "#fff" : "#333",
              }}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmitQuestion}
              sx={{
                bgcolor: "#00ffea",
                "&:hover": { bgcolor: "#00ffa2" },
                fontWeight: "bold",
                color: "#000",
                borderRadius: "25px",
              }}
            >
              Submit Question
            </Button>
            {/*|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */}

            <Box item xs={12} md={12} sx={{ mt: 4 }}>
                {responseError && (
              <Box
                sx={{
                  mb: 2,
                  bgcolor:
                    responseError === "Your question has been successfully submitted"
                      ? "green"
                      : "red",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1rem",
                  borderRadius: "10px",
                }}
              >
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: "1rem",
                    }}
                  >
                    {responseError}
                  </Typography>
              </Box>
                )}
                {displayQuestion && (
              <Box
                sx={{
                  mb: 4,
                  bgcolor: theme.palette.mode === "dark" ? "#333" : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1rem",
                  borderRadius: "10px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "grey" }}
                >
                  Your Question :&nbsp;
                </Typography>
                  <Typography variant="body1">{displayQuestion}</Typography>
              </Box>
                )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FAQPage;
