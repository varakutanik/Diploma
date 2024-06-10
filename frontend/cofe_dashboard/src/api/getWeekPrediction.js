import axios from "./instance";
const cafeId = localStorage.getItem('selectedCafeId');  
const name = localStorage.getItem("cafeName");

const getWeekPrediction = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `get_week_predictions?startDate=${startDate}&endDate=${endDate}&cafeId=${cafeId}&username=${name}`
    );
    return response.data;
  } catch (error) {
    return { error: error.message, success: false };
  }
};

export default getWeekPrediction;
