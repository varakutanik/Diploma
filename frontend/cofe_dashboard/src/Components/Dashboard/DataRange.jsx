import { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { enGB } from "date-fns/locale";
import { Box } from "@mui/material";

const CalendarCustom = () => {
  const [customPieChartStartDate, setCustomPieChartStartDate] = useState(null);
  const [customPieChartEndDate, setCustomPieChartEndDate] = useState(null);

  useEffect(() => {
    const calculateDefaultDates = () => {
      const today = new Date();
      const currentDayOfWeek = today.getDay();
      const mondayOffset = currentDayOfWeek - 1;
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - mondayOffset);
      setCustomPieChartStartDate(startOfWeek);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      setCustomPieChartEndDate(endOfWeek);
    };

    calculateDefaultDates();
  }, []);

  return (
    <Box sx={style}>
      <DateRangePicker
        ranges={[
          {
            startDate: customPieChartStartDate,
            endDate: customPieChartEndDate,
            key: "selection",
          },
        ]}
        locale={{
          ...enGB,
          options: {
            ...enGB.options,
            weekStartsOn: 1,
          },
        }}
        onChange={(item) => {
          setCustomPieChartStartDate(item.selection.startDate);
          setCustomPieChartEndDate(item.selection.endDate);
        }}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={1}
        direction="horizontal"
        rangeColors={["#FAB619"]}
      />
    </Box>
  );
};

export default CalendarCustom;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
