import { Box } from "@mui/material";
import logo from "./logo.png"
const Logo = () => {
  return (
    <Box
      component="img"
      alt="logo"
      src={logo}
      width="70%"
      pb={4}
    />
  );
};

export default Logo;
