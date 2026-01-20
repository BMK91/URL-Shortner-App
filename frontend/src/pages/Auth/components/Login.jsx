import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { z } from "zod";

const loginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(1, { message: "Password is required" }),
});

const Login = () => {
  const navigate = useNavigate();

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data) => {
    console.log("Login data submitted:", data);
    localStorage.setItem("isLoggedIn", "true");
    reset();
    navigate("/dashboard");
  };

  return (
    <>
      <Box component="main" className="flex items-center justify-center">
        <Paper elevation={3} className="w-full max-w-md p-4">
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className="w-full"
            noValidate
          >
            <Typography variant="h5" align="center" gutterBottom>
              Login
            </Typography>

            <Stack spacing={2}>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="E-mail*"
                    slotProps={{
                      htmlInput: { maxLength: 50 },
                    }}
                    autoFocus={true}
                    variant="outlined"
                    size="small"
                    error={!!fieldState.error}
                    helperText={
                      fieldState.error ? fieldState.error.message : " "
                    }
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Password*"
                    variant="outlined"
                    size="small"
                    type="password"
                    error={!!fieldState.error}
                    helperText={
                      fieldState.error ? fieldState.error.message : ""
                    }
                  />
                )}
              />

              <Button type="submit" variant="contained">
                Submit
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Login;
