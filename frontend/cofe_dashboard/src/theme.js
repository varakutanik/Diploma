import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },
  palette: {
    primary: {
      main: "#fff",
    },
    secondary: {
      main: "#FAB619",
    },
    error: { main: "#9F4C4C" },
    warning: { main: "#BF873E" },
    success: { main: "#699F4C" },
  },
});

export default theme;
