import axios from "./instance";
const cafeId = localStorage.getItem('selectedCafeId');  

const getWeekPrediction = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `get_week_sales?startDate=${startDate}&endDate=${endDate}&cafeId=${cafeId}`
    );
    return response.data;
  } catch (error) {
    return { error: error.message, success: false };
  }
};

export default getWeekPrediction;
