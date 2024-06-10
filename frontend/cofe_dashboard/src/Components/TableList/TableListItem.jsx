import { Link } from 'react-router-dom';
import { Box, Stack, Typography } from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";

const TableListItem = ({ data, number }) => {
  const {
    posName,
    cafeName,
    companyName,
    name,
    id,
    status = "success",
    connection = "success",
    power = "success",
  } = data;


  const handleClick = () => {
    localStorage.setItem('selectedCafeId', id);
    localStorage.setItem('selectedCafeName', cafeName);
  };

  const getIcon = (type) =>
    type === "success" ? (
      <CheckCircleIcon color="success" />
    ) : type === "warning" ? (
      <WarningIcon color="warning" />
    ) : (
      <ErrorIcon color="error" />
    );

  return (
    <Link to="/dashboard" onClick={handleClick} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Stack
        component={"li"}
        flexDirection={"row"}
        textAlign={"center"}
        border={"1px solid #666666"}
        p={1}
        style={{ cursor: 'pointer' }}
      >
        <Typography flex={2}>{number}</Typography>
        <Typography flex={7}>{companyName}</Typography>
        <Typography flex={7}>{cafeName}</Typography>
        <Typography flex={9}>{posName}</Typography>
        <Box flex={7}>{getIcon(status)}</Box>
        <Box flex={7}>
          <WifiIcon color={connection} />
        </Box>
        <Box flex={7}>{getIcon(power)}</Box>
      </Stack>
    </Link>
  );
};



export default TableListItem;
