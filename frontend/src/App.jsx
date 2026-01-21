import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import {
  AppBar,
  Box,
  Button,
  createTheme,
  CssBaseline,
  ThemeProvider,
  Toolbar,
} from "@mui/material";

import { checkAuth, logoutUser } from "@store/reducers/AuthReducer";

import { useHandleMessage } from "@hooks/handleMessage";

import ProtectedRoute from "@components/Auth/ProtectedRoute";
import PublicRoute from "@components/Auth/PublicRoute";
import { SnackbarProvider } from "@components/SnackbarProvider";

import Auth from "@pages/Auth/Auth";
import Dashboard from "@pages/Dashboard/Dashboard";
import Users from "@pages/User/Users";
import { logout } from "@pages/Auth/AuthService";

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
  const dispatch = useDispatch();
  const handleMessage = useHandleMessage();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.data?.status === "SUCCESS") {
        dispatch(logoutUser());
        window.location.href = "/login";
      }
      handleMessage(response);
    } catch (error) {
      handleMessage(error);
    }
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />

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
      </ThemeProvider>
    </>
  );
}

export default App;
