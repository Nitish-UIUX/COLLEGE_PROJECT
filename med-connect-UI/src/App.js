import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import NavBar from "./components/global/NavBar";
import Footer from "./components/global/Footer";
import AppRoutes from "./routes";
import { useLocation } from "react-router-dom";

function App() {
  const [theme, colorMode] = useMode();
  const location = useLocation();

  // Check if the current path is related to the dashboard
  const isDashboardRoute = location.pathname.startsWith("/userdashboard");

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div>
          <NavBar />
          <main className="content">
            <AppRoutes />
          </main>
          {!isDashboardRoute && <Footer />}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
