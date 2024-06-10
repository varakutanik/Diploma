import { Box, Stack, Typography } from "@mui/material";
import CustomBox from "../Components/Ui/Box";
import CustomTitle from "../Components/Ui/Title";
import TableList from "../Components/TableList/TableList";
import { useEffect, useState } from "react";
import getCafes from "../api/getCafes";
import getTurnOver from "../api/getturnover";
const CustomText = ({ children, fontSize }) => (
  <Typography sx={{ color: "#000", fontSize: `${fontSize || 16}px` }}>
    {children}
  </Typography>
);
const CoffeeShops = () => {


  const [cafes, setCafes] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    getCafes().then((resp) => {
      setCafes(resp);
    });
  }, []);
  useEffect(() => {
    getTurnOver().then((resp) => {
      setData(resp);
      console.log(resp)
    });
  }, []);

  return (
    <Box>
      <CustomTitle>Кав’ярні</CustomTitle>
      <Stack
        flexDirection={"row"}
        gap={4}
        py={5}
        flexWrap={"wrap"}
        justifyContent={"center"}
      >
        <CustomBox>
          <CustomText>Загалом кав’ярень</CustomText>
          <CustomText fontSize={54}>{data.cafesCount}</CustomText>
        </CustomBox>
        <CustomBox>
          <CustomText>Загалом оборот за рік</CustomText>
          <CustomText fontSize={54}>{data.annual_turnover}</CustomText>
        </CustomBox>
        <CustomBox>
          <CustomText>Загалом чистий дохід за рік</CustomText>
          <CustomText fontSize={54}>{data.annual_income}</CustomText>
        </CustomBox>
      </Stack>
      <TableList cafes={cafes} />
    </Box>
  );
};

export default CoffeeShops;
