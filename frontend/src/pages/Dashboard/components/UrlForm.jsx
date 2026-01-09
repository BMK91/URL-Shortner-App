import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Grid, Paper, TextField } from "@mui/material";
import { z } from "zod";

import { useSnackbar } from "@components/SnackbarProvider";
import { createUrlService } from "../DashboardService";

const urlFormSchema = z.object({
  urlName: z.string().min(3, {
    message: "Must be at least 3 characters long",
  }),
  originalUrl: z.string().refine(
    (val) => {
      try {
        const url = new URL(val);
        return ["http:", "https:"].includes(url.protocol);
      } catch {
        return false;
      }
    },
    { message: "Enter a valid URL" }
  ),
});

const UrlForm = ({ historyRef }) => {
  const { showSnackbar } = useSnackbar();

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(urlFormSchema),
    defaultValues: {
      urlName: "",
      originalUrl: "",
    },
    mode: "all",
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        urlName: data.urlName || undefined,
        originalUrl: data.originalUrl,
      };

      const response = await createUrlService(payload);
      if (response.data?.status === "SUCCESS") {
        showSnackbar(response.data.message, "success");
        reset();
        historyRef.current?.initHistoryFn();
        return;
      }

      showSnackbar(response.data?.message, "error");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      showSnackbar(message, "error");
    }
  };

  return (
    <>
      <Box component="main">
        <Paper elevation={0}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid size={3}>
                <Controller
                  name="urlName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="URL Name*"
                      slotProps={{
                        htmlInput: { maxLength: 50 },
                      }}
                      autoFocus
                      variant="outlined"
                      size="small"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={
                        fieldState.error ? fieldState.error.message : " "
                      }
                    />
                  )}
                />
              </Grid>

              <Grid size={8}>
                <Controller
                  name="originalUrl"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Enter URL*"
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="http://example.com"
                      error={!!fieldState.error}
                      helperText={
                        fieldState.error ? fieldState.error.message : ""
                      }
                    />
                  )}
                />
              </Grid>

              <Grid size={1}>
                <Button type="submit" variant="contained">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default UrlForm;
