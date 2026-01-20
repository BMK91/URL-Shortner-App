import {
  AppBar,
  Box,
  Button,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
  Toolbar,
} from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "@components/Auth/ProtectedRoute";
import PublicRoute from "@components/Auth/PublicRoute";
import { SnackbarProvider } from "@components/SnackbarProvider";

import Auth from "@pages/Auth/Auth";
import Dashboard from "@pages/Dashboard/Dashboard";
import Users from "@pages/User/Users";

import { useCallback } from "react";
import "./App.css";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const routes = [
  { path: "/", element: <Navigate to="/login" />, public: true },
  { path: "/login", element: <Auth />, public: true },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/users", element: <Users /> },
];

function App() {
  const handleLogout = useCallback(() => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  }, []);

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />

        <SnackbarProvider>
          <Box component="main" sx={{ mt: 8 }}>
            <BrowserRouter>
              <Routes>
                {routes.map(({ path, element, public: isPublic }) => {
                  return (
                    <Route
                      key={path}
                      path={path}
                      element={
                        isPublic ? (
                          <PublicRoute>{element}</PublicRoute>
                        ) : (
                          <ProtectedRoute>
                            <AppBar position="fixed">
                              <Toolbar className="flex justify-between">
                                <Box fontWeight="bold" fontSize="20px">
                                  URL Shortener
                                </Box>

                                <Button
                                  color="primary"
                                  size="small"
                                  onClick={handleLogout}
                                >
                                  Logout
                                </Button>
                              </Toolbar>
                            </AppBar>

                            <Box className="mt-20">{element}</Box>
                          </ProtectedRoute>
                        )
                      }
                    />
                  );
                })}

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
