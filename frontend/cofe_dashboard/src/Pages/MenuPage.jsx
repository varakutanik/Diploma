import { Box, Button, Stack, Typography, FormControl, InputLabel, Select, MenuItem as MuiMenuItem } from "@mui/material";
import CustomTitle from "../Components/Ui/Title";
import MenuItemComponent from "../Components/Menu/MenuItem";
import { useEffect, useState } from "react";
import addSalesPrice from "../api/addSalesPrice";
import getCafesMenu from "../api/getCoffeMenu";
import getCafes from "../api/getCafes";
import Loader from "../Components/Ui/Loader";

const MenuPage = () => {
  const [menu, setMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cafes, setCafes] = useState([]);
  const [selectedCafe, setSelectedCafe] = useState('');

  useEffect(() => {
    getCafes().then((cafes) => {
      setCafes(cafes);
      if (cafes.length > 0) {
        setSelectedCafe(cafes[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedCafe) {
      setIsLoading(true);
      getCafesMenu(selectedCafe).then((result) => {
        setMenu(result || []);
        setIsLoading(false);
      });
    }
  }, [selectedCafe]);

  const changeMenu = (index, newName, value) => {
    setMenu(
      menu.map((item, i) =>
        i === index ? { ...item, name: newName, cost: value } : item
      )
    );
  };

  const onSubmit = () => {
    const transformedData = menu.reduce((acc, obj, index) => {
      acc[`cellCost${index + 1}`] = obj.cost;
      acc[`cellName${index + 1}`] = obj.name;
      return acc;
    }, {});

    addSalesPrice({ cafeId: selectedCafe, ...transformedData }).then((result) => {
      alert(result.message);
    });
  };

  const handleCafeChange = (event) => {
    setSelectedCafe(event.target.value);
  };

  return isLoading ? (
    <Loader />
  ) : (
    <Box>
      {/* <FormControl fullWidth style={{ color: "white" }} sx={{ mb: 4 }}>
        <InputLabel style={{ color: "white" }} id="cafe-select-label">Select Cafe</InputLabel>
        <Select
          labelId="cafe-select-label"
          id="cafe-select"
          value={selectedCafe}
          label="Select Cafe"
          onChange={handleCafeChange}
          style={{ color: "white" }}
        >
          {cafes.map((cafe) => (
            <MuiMenuItem key={cafe.id} value={cafe.id}>{cafe.name}</MuiMenuItem>
          ))}
        </Select>
      </FormControl> */}
      <CustomTitle>Меню</CustomTitle>
      <Stack alignItems={"center"} pt={4}>
        <Box
          bgcolor={"#000"}
          maxWidth={450}
          borderRadius={4}
          p={4}
          textAlign={"center"}
        >
          <Typography fontSize={32} lineHeight={1} color={"secondary"}>
            Натисни на те,
            <br /> що хочеш змінити
          </Typography>
          <Typography py={2} fontSize={16}>
            P.S Можете змінити:
            <br />
            Шоколад, шоколад з молоком(або еспресо) <br />
            Чай з малиною(або ірландський віскі) <br />
            Вартість
          </Typography>
          <Typography fontSize={16} color={"secondary"}>
            Важливо! Після змін натисніть кнопку “Зберегти”
          </Typography>
        </Box>

        <Box pt={4}>
          <CustomTitle>Оберіть напій</CustomTitle>
          <Stack
            flexDirection="row"
            flexWrap="wrap"
            justifyContent={"center"}
            gap={5}
            maxWidth={800}
            py={4}
          >
            {menu.map((data, index) => (
              <MenuItemComponent
                data={data}
                index={index}
                key={`${data.name}-${index}`}
                changeMenu={changeMenu}
              />
            ))}
          </Stack>
          <Stack alignItems={"center"}>
            <Button
              onClick={onSubmit}
              sx={{
                bgcolor: "secondary.main",
                width: 214,
                py: 2,
                borderRadius: 3,
                color: "#000",
              }}
            >
              Зберегти
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default MenuPage;
