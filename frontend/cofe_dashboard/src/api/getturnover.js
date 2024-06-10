import axios from "./instance";
const name = localStorage.getItem("cafeName");

const getTurnOver = async () => {
  try {
    const response = await axios.get(`/get_turnover?username=${name}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    return { error: error.message, success: false };
  }
};

export default getTurnOver;
