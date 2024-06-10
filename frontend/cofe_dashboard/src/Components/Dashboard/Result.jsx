import { Stack, Typography } from "@mui/material";
import CustomTitle from "../Ui/Title";

const Result = ({ data }) => {
  return (
    <Stack pt={10}>
      <CustomTitle>Залишки продукції в роботі:</CustomTitle>
      <Typography textAlign={"center"} py={5}>
        Залишки оновлюються після <br />
        натискання кнопки:
      </Typography>
      <Stack direction={"row"} gap={2} justifyContent={"space-around"}>
        {data.map(({ name, result }) => (
          <Typography color={"secondary"} key={name}>
            <span>{name}: </span>
            <span>{result}</span>
          </Typography>
        ))}
      </Stack>
    </Stack>
  );
};

export default Result;

// const data = [
//   { name: "Кава", result: "1000г" },
//   { name: "Молоко", result: "650г" },
//   { name: "Шоколад", result: "1750г" },
//   { name: "Чай/Ірл.вiскі", result: "1500г" },
//   { name: "Вода", result: "19л" },
// ];
