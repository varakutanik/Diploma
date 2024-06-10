import { Typography } from "@mui/material";

const CustomTitle = ({ children }) => {
  return (
    <Typography fontSize={24} textAlign={"center"}>
      {children}
    </Typography>
  );
};
export default CustomTitle;
