import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";

const ConfirmDeletePopup = ({
  isOpen = false,
  message = "Are you sure you want to delete?",
  callbackFn = {
    confirm: () => {},
    cancel: () => {},
  },
}) => {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = (e, type = "cancel") => {
    setOpen(false);
    callbackFn[type]();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>

          <Button onClick={(e) => handleClose(e, "confirm")}>
            Yes, Please
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmDeletePopup;
