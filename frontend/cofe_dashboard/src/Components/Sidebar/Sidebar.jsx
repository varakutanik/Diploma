import React from "react";
import { Drawer, List, Box, Button, Stack, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SidebarItem from "./SidebarItem";
import Logo from "../Ui/Logo";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("selectedCafeName");
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          border: 0,
          position: "fixed",
          left: 0,
        },
      }}
    >
      <Stack
        py={4}
        height={"100vh"}
        justifyContent={"space-between"}
        sx={{
          background: "linear-gradient(to bottom, #FAB619 -40%, #2e2e2e);",
        }}
      >
        <Box>
          <Box pb={4} textAlign={"center"}>
            <Logo />
          </Box>
          <Box m="0 auto" py={4} textAlign={"center"}>
            <Link to={"/coffee"}>
              <Button
                color="secondary"
                variant="contained"
                size={"large"}
                sx={{ borderRadius: 3, py: 2, px: 3 }}
              >
                <DashboardIcon />
                <Typography component={"span"} pl={1}>
                  Dashboard
                </Typography>
              </Button>
            </Link>
          </Box>
          <Typography fontWeight={"bold"} pl={4} color={"secondary"}>
            Management
          </Typography>
          <List>
            <SidebarItem icon={<MenuBookIcon />} text={"Menu"} name={"menu"} />
          </List>
        </Box>
        <Box textAlign="center">
          <Button
            color="secondary"
            variant="contained"
            size={"large"}
            sx={{ borderRadius: 3, py: 2, px: 3 }}
            onClick={handleLogout}
          >
            Log out
          </Button>
        </Box>
      </Stack>
    </Drawer>
  );
};

export default Sidebar;
