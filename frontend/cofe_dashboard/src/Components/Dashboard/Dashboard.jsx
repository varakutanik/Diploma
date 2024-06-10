import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import BarChartComponent from "./BarChart";
import CustomTitle from "../Ui/Title";
import Loader from "../Ui/Loader";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const Dashboard = ({
  mainTitle,
  secondTitle,
  data,
  isLoading,
  getNewWeek,
  startDate,
  endDate,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredData, setHoveredData] = useState(null);

  const handleMouseEnter = (data, index) => {
    setHoveredIndex(index);
    setHoveredData(data);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setHoveredData(null);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Stack py={4} gap={3} alignItems={"center"}>
      <CustomTitle>{mainTitle}</CustomTitle>
      {secondTitle && (
        <Typography color={"secondary"} fontSize={20} textAlign={"center"} pt={2}>
          {secondTitle}
        </Typography>
      )}
      <Typography color={"secondary"} textAlign={"center"}>
        Інформація за проміжок з {startDate} по {endDate}
      </Typography>
      {data && data.length > 0 ? (
        <>
          <Stack direction={"row"} justifyContent={"center"} flexWrap={"wrap"} gap={5}>
            <BarChartComponent
              title={"Продаж у шт"}
              data={data}
              name={"productQuantity"}
              unit={"шт"}
              hoveredIndex={hoveredIndex}
              hoveredData={hoveredData}
              onHover={handleMouseEnter}
              onLeave={handleMouseLeave}
            />
            <BarChartComponent
              title={"Продаж у грн"}
              data={data}
              name={"revenue"}
              unit={"грн"}
              hoveredIndex={hoveredIndex}
              hoveredData={hoveredData}
              onHover={handleMouseEnter}
              onLeave={handleMouseLeave}
            />
          </Stack>
          <Stack flexDirection={"row"} alignItems={"center"} gap={5}>
            <Button onClick={() => getNewWeek(-7)}>
              <KeyboardArrowLeftIcon color="primary" fontSize="large" />
            </Button>
            <Typography>Обери потрібний тиждень</Typography>
            <Button onClick={() => getNewWeek(7)}>
              <KeyboardArrowRightIcon color="primary" fontSize="large" />
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <Typography color={"white"} fontSize={30}>
            Інформації за даний період немає
          </Typography>
          <Stack flexDirection={"row"} alignItems={"center"} gap={5}>
            <Button onClick={() => getNewWeek(-7)}>
              <KeyboardArrowLeftIcon color="primary" fontSize="large" />
            </Button>
            <Typography>Обери потрібний тиждень</Typography>
            <Button onClick={() => getNewWeek(7)}>
              <KeyboardArrowRightIcon color="primary" fontSize="large" />
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default Dashboard
