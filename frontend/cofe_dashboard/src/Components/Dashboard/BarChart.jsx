import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { format } from "date-fns";

const BarChartComponent = ({ title, data, name, unit, hoveredIndex, onHover, onLeave, hoveredData }) => {
  // Function to format dates consistently
  const formatDate = (dateString) => {
    return format(new Date(dateString), "yyyy-MM-dd");
  };

  // Display the last data point or the hovered data point
  const displayResult = hoveredData ?
    { name: formatDate(hoveredData.date), value: hoveredData[name] } :
    { name: formatDate(data.slice(-1)[0].date), value: data.slice(-1)[0][name] };

  const handleBarMouseEnter = (data, index) => {
    onHover(data, index);
  };

  const handleBarMouseLeave = () => {
    onLeave();
  };

  return (
    <Box>
      <Typography
        textAlign={"center"}
        py={1}
        fontWeight={"bold"}
        fontSize={24}
        color={"secondary"}
      >
        {title}
      </Typography>
      <Box bgcolor={"secondary.main"} borderRadius={5}>
        <Box
          bgcolor={"primary.main"}
          borderRadius={5}
          width={"fit-content"}
          py={4}
          px={1}
        >
          <BarChart
            width={480}
            height={220}
            data={data}
            style={{ cursor: "pointer" }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis />
            <Bar
              dataKey={name}
              onMouseEnter={(e, index) => handleBarMouseEnter(e.payload, index)}
              onMouseLeave={handleBarMouseLeave}
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === hoveredIndex ? 'rgba(250, 182, 25, 1)' : 'rgba(250, 182, 25, 0.5)'} />
              ))}
            </Bar>
          </BarChart>
        </Box>

        <Stack
          height={35}
          alignItems={"center"}
          justifyContent={"center"}
          flexDirection={"row"}
          gap={1}
        >
          <>
            <span>{displayResult.name}:</span>
            <span>
              {displayResult.value} {unit}
            </span>
            <span>отримано</span>
          </>
        </Stack>
      </Box>
    </Box>
  );
};

export default BarChartComponent;
