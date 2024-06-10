import axios from "./instance";
const name = localStorage.getItem("cafeName");
const cafeId = localStorage.getItem('selectedCafeId');  

const getPayback = async () => {
  try {
    const response = await axios.get(`/get_payback?username=${name}&cafeId=${cafeId}`);
    return response.data;
  } catch (error) {
    return { error: error.message, success: false };
  }
};

export default getPayback;
