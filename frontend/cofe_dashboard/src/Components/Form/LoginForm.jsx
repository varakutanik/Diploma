import {
  Box,
  Button,
  Checkbox,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Context from "../../context";

const LoginForm = () => {
  const [isError, setIsError] = useState({ username: "", password: "" });
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { setErrMessage } = useContext(Context);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.target.elements;

    const { username, password } = {
      username: form.username.value,
      password: form.password.value,
    };

    const validUser = userCredentials.find(
      (user) => user.username === username && user.password === password
    );

    if (validUser) {
      localStorage.setItem("cafeName", username);
      navigate("/coffee");
      setErrMessage("");
    } else {
      setErrMessage("Username or password is not valid");
    }
  };

  return (
    <Box width={260}>
      <form onSubmit={onSubmit} ref={formRef}>
        <>
          <Stack spacing={2} pt={4}>
            {loginData.map(({ name, label, type }) => {
              const err = isError ? isError[name] : "";
              return (
                <TextField
                  fullWidth
                  variant="outlined"
                  key={name}
                  name={name}
                  label={label}
                  error={!!err.length}
                  type={type}
                  helperText={err}
                  id="outlined-basic"
                  InputLabelProps={{
                    style: {
                      color: "#666666",
                      background: "#ffffff",
                      paddingLeft: 10,
                      paddingRight: 10,
                    },
                  }}
                  InputProps={{
                    style: {
                      color: "#000",
                      border: "1px solid rgba(133, 133, 133, 0.4)",
                    },
                  }}
                />
              );
            })}
          </Stack>
          <Stack flexDirection={"row"} alignItems={"center"}>
            <Checkbox
              sx={{ pl: 0 }}
              color="secondary"
              label="Label"
              onChange={handleCheckboxChange}
            />
            <Typography color={"#666666"}>Запам'ятати мене</Typography>
          </Stack>

          <Button type="submit" fullWidth variant="contained" color="secondary">
            Увійти
          </Button>
        </>
      </form>
    </Box>
  );
};
export default LoginForm;

const loginData = [
  { name: "username", label: "Username", type: "text", err: "" },
  { name: "password", label: "Password", type: "password", err: "" },
];

const userCredentials = [
  { username: "Kavel", password: "11111111" },
  { username: "Kavel_Andriy", password: "11111111" },
  { username: "Kavel_Maccoudi", password: "11111111" },
  { username: "Kavel_Sambir_Malyk_Vitalii", password: "11111111" },
  { username: "Kavel_Dnipro_Popov_Mykhailo", password: "11111111" },
  { username: "Kavel_Lviv_Sofiia_Tybinka", password: "11111111" },
  { username: "Kavel_Anastasiia_TTs Iskra", password: "11111111" },
  { username: "Kavel_Shevchuk_Mlyniv", password: "11111111" },
  { username: "Kavel_Bodnar_Horodok", password: "11111111" },
  { username: "Kavel_Morhun_Denys", password: "11111111" },
  { username: "Kavel_Honchar", password: "11111111" },
  { username: "Kavel_Kachanov_Oleksandr_Aitistep Kyiv", password: "11111111" },
  { username: "Kavel_Taras_Promyslova", password: "11111111" },
  { username: "Kavel_Zakhar_Shchurko", password: "11111111" },
  { username: "Kavel_Prokopchak_Mahnus", password: "11111111" },
  { username: "Kavel_Siriakov_Oleksandr_Kyiv", password: "11111111" },
  { username: "Kavil_Vladislav_Drogobych", password: "11111111" },
  { username: "Kavel_Nahorna_Ternopil", password: "11111111" },
  { username: "Kavel_Boryslav_Maksym", password: "11111111" },
  { username: "Kavel_Dzemiuk Vasyl", password: "11111111" },
  { username: "Kavel_Zoriana_Lviv", password: "11111111" },
  { username: "Kavel_Popko", password: "11111111" },
  { username: "Kavel_Furtak", password: "11111111" },
  { username: "Kavel_Tymoshenko_Dmytro", password: "11111111" },
  { username: "Kavel_Dmytro Suiark", password: "11111111" },
  { username: "Kavel_Dmytruk_Andrii", password: "11111111" },
  { username: "Kavel_Babichevskyi_Maksym", password: "11111111" },
  { username: "Kavel_Sheremet_Roman", password: "11111111" },
  { username: "Kavel_Paustovskyi Dmytro", password: "11111111" },
  { username: "Kavel_Zaiats Nazar", password: "11111111" },
  { username: "Kavel_Artur Osypenko", password: "11111111" },
  { username: "Kavel_Yatsko Andrii", password: "11111111" },
  { username: "Kavil_Yuri_Sich", password: "11111111" },
  { username: "Kavel_Havrylenko Serhii", password: "11111111" },
  { username: "Kavel_Tymus Iryna", password: "11111111" },
  { username: "Kavel_Andrieieva Iryna", password: "11111111" },
  { username: "Kavel_Kryshtop Vitalii", password: "11111111" },
  { username: "Kavel_Stupiak Khrystyna", password: "11111111" },
  { username: "Kavel_Sadovskyi", password: "11111111" },
  { username: "Kavel_Kurylo", password: "11111111" },
  { username: "Kavel_Sviridov_Dmytro", password: "11111111" },
  { username: "Kavel_Burlak Anhelina", password: "11111111" },
  { username: "Kavel_Korzhenivskyi", password: "11111111" },
  { username: "Kavel_Melnyk Vitalii Anatoliiovych", password: "11111111" },
  { username: "Kavel_Chumak", password: "11111111" },
  { username: "Kavel_Chornobaieva", password: "11111111" },
];
