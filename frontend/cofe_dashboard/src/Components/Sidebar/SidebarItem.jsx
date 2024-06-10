import { ListItem, ListItemText, Stack } from "@mui/material";
import { Link } from "react-router-dom";

const SidebarItem = ({ icon, text, name }) => {
  return (
    <ListItem
      button
      component={Link}
      to={name}
      alignItems="center"
      sx={{
        paddingY: 0,
        color: "secondary.main",
        "&:hover span": {
          fontWeight: "bold",
        },
      }}
    >
      <ListItemText
        primary={
          <Stack direction="row" gap={1}>
            <span>{icon}</span>
            <span>{text}</span>
          </Stack>
        }
      />
    </ListItem>
  );
};
export default SidebarItem;
