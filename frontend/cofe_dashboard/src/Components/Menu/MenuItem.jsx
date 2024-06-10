import { Box, Stack, Typography, FormControl, Select, MenuItem as MuiMenuItem } from "@mui/material";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import { memo } from "react";

const coffeeNames = [
  "Американо", "Американо з молоком", "Лате", "Капучіно", "Мокачіно",
  "Шоколад з молоком", "Шоколад", "Чай з лимоном"
];

const MenuItem = memo(({ data, index, changeMenu }) => {
  const { name, cost } = data;
  const isCount = index % 2;

  const handleNameChange = (event) => {
    changeMenu(index, event.target.value, cost);
  };

  const handleCostChange = (event) => {
    changeMenu(index, name, event.target.value);
  };

  return (
    <Stack
      gap={2}
      component="li"
      flexDirection={isCount ? "row-reverse" : "row"}
    >
      <Box
        textAlign={"end"}
        maxWidth={"240px"}
        width={"100vw"}
        bgcolor={"primary.main"}
        borderRadius={3}
        pr={2}
        py={1}
      >
        <FormControl fullWidth>
          <Select
            value={name}
            onChange={handleNameChange}
            sx={{ mb: 1, color: "#000", backgroundColor: "white", border: "none" }}
          >
            {coffeeNames.map((coffeeName, idx) => (
              <MuiMenuItem key={idx} value={coffeeName}>
                {coffeeName}
              </MuiMenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography color={"secondary"}>
          <span>170 мл</span>
          <span> / </span>
          <span>
            <Box
              onChange={handleCostChange}
              sx={{ color: "secondary.main", fontSize: 16, border: "none" }}
              width={30}
              component={"input"}
              value={cost}
            />
            грн
          </span>
        </Typography>
      </Box>
      <Box bgcolor={"secondary.main"} borderRadius={3} py={1} px={2}>
        <TouchAppIcon fontSize="large" />
      </Box>
    </Stack>
  );
});

export default MenuItem;
