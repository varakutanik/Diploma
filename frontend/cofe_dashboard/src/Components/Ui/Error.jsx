import { Alert, Box } from "@mui/material";

const ErrorMessage = ({ err }) => {
  return (
    <Box position={"fixed"} right={30} top={30}>
      <Alert severity="error">{err}</Alert>
    </Box>
  );
};

export default ErrorMessage;
