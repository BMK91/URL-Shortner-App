import { useSnackbar } from "@components/SnackbarProvider";
import { API_STATUS } from "@constants/api-status";

export function useHandleMessage() {
  const { showSnackbar } = useSnackbar();

  const handleMessage = (response, type = "success") => {
    const data = response?.data ?? response?.response?.data;
    let message = "";

    if (data?.status === API_STATUS.SUCCESS) {
      message = data?.message || "Run successfully!";
    } else {
      message =
        data?.data?.message ||
        data?.message ||
        response?.message ||
        "Something went wrong!";
      type = "error";
    }

    showSnackbar(message, type);
  };

  return handleMessage;
}
