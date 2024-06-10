import { Stack, Typography } from "@mui/material";
import DropDown from "./DropDown";

const TableListTitle = () => {
  return (
    <Stack
      component={"li"}
      flexDirection={"row"}
      border={"1px solid #666666"}
      p={1}
    >
      <Typography flex={2} textAlign={"center"}>
        #
      </Typography>
      <DropDown flex={10} title={"Назва Компанії"} />
      <DropDown flex={10} title={"Назва"} />
      <DropDown flex={10} title={"Місце"} />
      <DropDown flex={10} title={"Стан"} />
      <DropDown flex={10} title={"Зв’язок"} />
      <DropDown flex={10} title={"Живлення"} />
    </Stack>
  );
};

export default TableListTitle;

const dDList = ["Item1", "Item2", "Item3"];
