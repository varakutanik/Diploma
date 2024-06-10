import { Box, Grid, Typography } from "@mui/material";
import LoginForm from "../Components/Form/LoginForm";
import { Navigate } from "react-router-dom";
import Context from "../context";
import { useContext } from "react";
import img from "./logo.png"
const LoginPage = () => {
  return (
    <Box maxHeight="100vh">
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh" }}
      >

        <Box
          component="img"
          alt="logo"
          src={img}
          width={100}
          pb={4}
        />
        <Grid item xs={3} bgcolor={"primary.main"} p={4} borderRadius={2}>
          <Typography fontWeight={"bold"}>Вхід</Typography>
          <LoginForm />
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;
