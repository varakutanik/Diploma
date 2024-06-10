import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const Loader = () => {
  return (
    <Box sx={styles.loaderContainer}>
      <CircularProgress />
    </Box>
  );
};

export default Loader;

const styles = {
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "60vh",
  },
};
