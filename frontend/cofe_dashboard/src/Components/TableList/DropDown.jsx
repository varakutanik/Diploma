import { Box, Button, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const DropDown = ({ flex, data, title }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (value) => {
    setAnchorEl(null);
  };

  return (

    <Stack
      flex={flex}
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      position={"relative"}
    >
      <Typography>{title}</Typography>
      <Box position={"absolute"} right={0}>
        <Button
          id="demo-positioned-button"
          aria-controls={open ? "demo-positioned-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          sx={{ p: 0 }}
        >
        </Button>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
        </Menu>
      </Box>
    </Stack>

  );
};

export default DropDown;
