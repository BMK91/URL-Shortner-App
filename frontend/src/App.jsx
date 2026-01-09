import {
  AppBar,
  Box,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";

import "./App.css";
import { SnackbarProvider } from "./components/SnackbarProvider";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />

        <SnackbarProvider>
          <AppBar position="fixed">
            <Box p={1} fontWeight="bold" fontSize="24px">
              URL Shortener
            </Box>
          </AppBar>

          <Box component="main" sx={{ mt: 8 }}>
            <BrowserRouter>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/" element={<Navigate to="/dashboard" />} />

                <Route path="*" element={<h1>404 Not Found</h1>} />
              </Routes>
            </BrowserRouter>
          </Box>
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
