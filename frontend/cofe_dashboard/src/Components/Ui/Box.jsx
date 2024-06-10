import { Box, Stack } from "@mui/material";

const CustomBox = ({ children, onClick }) => {
  return (
    <Stack
      alignItems={"center"}
      alignSelf={"center"}
      bgcolor={"secondary.main"}
      maxWidth={320}
      width={"100%"}
      borderRadius={3}
      py={4}
      onClick={onClick}
    >
      <Box textAlign={"center"} fontSize={20}>
        {children}
      </Box>
    </Stack>
  );
};

export default CustomBox;
