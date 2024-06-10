import { useEffect, useState } from "react";
import Routing from "./Components/Routing/Routing";
import Context from "./context";
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import Sidebar from "./Components/Sidebar/Sidebar";
import { Container, Stack } from "@mui/material";
import ErrorMessage from "./Components/Ui/Error";
import { useLocation } from "react-router-dom";

const App = () => {
  const [isUserAuth, setIsUserAuth] = useState(false);
  const [errText, setErrText] = useState("");
  const location = useLocation();

  useEffect(() => {
    setIsUserAuth(
      sessionStorage.getItem("isLogin") || localStorage.getItem("isLogin")
    );
  }, []);

  const userAuth = () => {
    setIsUserAuth(!isUserAuth);
  };

  const setErrMessage = (error) => {
    setErrText(error);
  };

  const ContextValue = {
    userAuth,
    isUserAuth,
    setErrMessage,
    errText,
  };

  const isLoginRoute = location.pathname === "/login";

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Context.Provider value={ContextValue}>
          <Stack
            direction={"row"}
            sx={{
              background:
                !isUserAuth &&
                "linear-gradient(to bottom, rgba(250, 182, 25, 0.9), rgba(50, 50, 50, 1))",
            }}
          >
            {!isLoginRoute ? <Sidebar /> : <></>}
            <Container sx={{ py: isUserAuth ? 6 : 0 }}>
              {errText && <ErrorMessage err={errText} />}
              <Routing />
            </Container>
          </Stack>
        </Context.Provider>
      </ThemeProvider>
    </div>
  );
};

export default App;
