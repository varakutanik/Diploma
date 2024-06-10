import { Box, Stack } from "@mui/material";
import Dashboard from "../Components/Dashboard/Dashboard";
import ClientsGoal from "../Components/Dashboard/ClientsGoal";
import Result from "../Components/Dashboard/Result";
import CustomTitle from "../Components/Ui/Title";
import CustomBox from "../Components/Ui/Box";
import { useEffect, useState } from "react";
import getWeekPrediction from "../api/getWeekPrediction";
import getWeekSales from "../api/getWeekSales";

const getDateRange = () => {
  const today = new Date();
  const endDate = today.toISOString().split("T")[0];
  let startDate = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
  startDate = startDate.toISOString().split("T")[0];
  return { startDate, endDate };
};

const stringToDate = (dateString) => {
  const parts = dateString.split("-");
  if (parts[2].length === 1) {
    parts[2] = "0" + parts[2];
  }
  const formattedDateString = parts.join("-");
  return new Date(formattedDateString);
};

const getNewWeek = (week, daysShift, allowPast, allowFuture) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const newStartDate = new Date(
    stringToDate(week.startDate).getTime() + daysShift * 24 * 60 * 60 * 1000
  );
  const newEndDate = new Date(
    stringToDate(week.endDate).getTime() + daysShift * 24 * 60 * 60 * 1000
  );

  if (!allowPast && newStartDate < today) {
    return week;
  }

  if (!allowFuture && newEndDate > today) {
    return week;
  }

  return {
    startDate: newStartDate.toISOString().split("T")[0],
    endDate: newEndDate.toISOString().split("T")[0],
  };
};

const DashboardPage = () => {
  const [weekSales, setWeekSales] = useState([]);
  const [weekPrediction, setWeekPrediction] = useState([]);
  const [weekSalesDateRange, setWeekSalesDateRange] = useState(getDateRange());
  const [weekPredictionDateRange, setWeekPredictionDateRange] = useState(getDateRange());
  const [isLoadingWeekPrediction, setIsLoadingWeekPrediction] = useState(true);
  const [isLoadingWeekSales, setIsLoadingWeekSales] = useState(true);
  const [cafeName, setCafeName] = useState(localStorage.getItem('selectedCafeName'));
  const [selectedCafeId, setSelectedCafeId] = useState(localStorage.getItem('selectedCafeId'));
  const [prevWeekSales, setPrevWeekSales] = useState([]);
  const [prevWeekPrediction, setPrevWeekPrediction] = useState([]);
  const [resultData, setResultData] = useState([
    { name: "Кава", result: "100г" },
    { name: "Молоко", result: "450г" },
    { name: "Шоколад", result: "1450г" },
    { name: "Чай/Ірл.вiскі", result: "100г" },
    { name: "Вода", result: "9л" },
  ]);

  useEffect(() => {
    const fetchWeekData = async () => {
      setPrevWeekSales(weekSales);
      setPrevWeekPrediction(weekPrediction);

      setIsLoadingWeekSales(true);
      setIsLoadingWeekPrediction(true);

      try {
        const [predictionResp, salesResp] = await Promise.all([
          getWeekPrediction(weekPredictionDateRange.startDate, weekPredictionDateRange.endDate),
          getWeekSales(weekSalesDateRange.startDate, weekSalesDateRange.endDate)
        ]);
        setWeekPrediction(predictionResp);
        setWeekSales(salesResp);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoadingWeekPrediction(false);
        setIsLoadingWeekSales(false);
      }
    };

    fetchWeekData();
  }, [weekSalesDateRange, weekPredictionDateRange]);

  const handleDateChange = (type, daysShift) => {
    if (type === 'sales') {
      const newDates = getNewWeek(weekSalesDateRange, daysShift, true, false);
      setWeekSalesDateRange(newDates);
    } else if (type === 'prediction') {
      const newDates = getNewWeek(weekPredictionDateRange, daysShift, false, true);
      setWeekPredictionDateRange(newDates);
    }
  };


  useEffect(() => {
    setCafeName(localStorage.getItem('selectedCafeName'));
  }, []);

  const handleUpdateResults = () => {
    console.log("123213")

    setResultData([
      { name: "Кава", result: "1000г" },
      { name: "Молоко", result: "650г" },
      { name: "Шоколад", result: "1750г" },
      { name: "Чай/Ірл.вiскі", result: "1500г" },
      { name: "Вода", result: "19л" },
    ]);
  };

  return (
    <Box>
      <Dashboard
        mainTitle={`Кав’ярня ${cafeName}`}
        data={weekSales.length > 0 ? weekSales : prevWeekSales}
        isLoading={false}
        getNewWeek={(daysShift) => handleDateChange('sales', daysShift)}
        startDate={weekSalesDateRange.startDate}
        endDate={weekSalesDateRange.endDate}
      />
      <Dashboard
        mainTitle={"Прорахунок окупності (ШІ)"}
        data={weekPrediction.length > 0 ? weekPrediction : prevWeekPrediction}
        isLoading={false}
        getNewWeek={(daysShift) => handleDateChange('prediction', daysShift)}
        startDate={weekPredictionDateRange.startDate}
        endDate={weekPredictionDateRange.endDate}
      />
      {selectedCafeId && <ClientsGoal cafeId={selectedCafeId} />}
      <Stack justifyContent={"center"} pt={5}>
        <CustomTitle>Обслуговування</CustomTitle>
        <CustomBox onClick={handleUpdateResults}>
          Провів <br /> обслуговування
        </CustomBox>
      </Stack>
      <Result data={resultData} />
    </Box>
  );
};

export default DashboardPage;
