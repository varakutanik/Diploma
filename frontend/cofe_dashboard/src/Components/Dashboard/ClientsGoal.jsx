import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import getPayback from "../../api/getPayback";
import Loader from "../Ui/Loader";
const Container = ({ children }) => (
  <Stack direction={"row"} justifyContent={"space-between"}>
    {children}
  </Stack>
);

const Text = ({ children }) => (
  <Typography
    textAlign={"center"}
    width={"100%"}
    py={2}
    border={"0.5px solid black"}
    color={"#000"}
  >
    {children}
  </Typography>
);

const ClientsGoal = ({ cafeId }) => {
  const [payback, setPayback] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    getPayback(cafeId).then((result) => {
      setPayback(result);
      setIsLoading(false);
    });
  }, [cafeId]);

  return isLoading ? (
    <Loader />
  ) : (
    <Box
      bgcolor={"secondary.main"}
      maxWidth={800}
      borderRadius={3}
      m={"0 auto"}
    >
      <Container>
        <Text>До окупності днів</Text>
        <Text>Загалом {payback.days_for_payback} днів</Text>
      </Container>
      <Container>
        <Text>Окупність від 0 до 100</Text>
        <Text>Загалом {payback.days_for_payback_0_to_100} днів</Text>
      </Container>
      <Container>
        <Text>Відсоток окупності</Text>
        <Text>{Math.round(payback.return_on_investment)} %</Text>
      </Container>
    </Box>
  );
};

export default ClientsGoal;
