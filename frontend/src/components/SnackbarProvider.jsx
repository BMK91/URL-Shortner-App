import React, { useContext } from "react";

import { Alert, Snackbar } from "@mui/material";

const SnackbarContext = React.createContext(null);

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
  const [snackBar, setSnackBar] = React.useState({
    open: false,
    message: "",
    severity: "info",
    duration: 3000,
  });

  const showSnackbar = (message, severity = "info", durationTime = 3000) => {
    console.log("Showing snackbar:", { message, severity, durationTime });
    setSnackBar({
      open: true,
      severity,
      message,
      duration: durationTime,
    });
  };

  const handleClose = () => {
    setSnackBar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <SnackbarContext.Provider value={{ showSnackbar }}>
        {children}

        <Snackbar
          open={snackBar.open}
          autoHideDuration={snackBar.duration}
          onClose={handleClose}
          severity={snackBar.severity}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleClose} severity={snackBar.severity}>
            {snackBar.message}
          </Alert>
        </Snackbar>
      </SnackbarContext.Provider>
    </>
  );
};
