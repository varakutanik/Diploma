import axios from "./instance";
const cafeId = localStorage.getItem('selectedCafeId');  

const getCafesMenu = async () => {
  try {
    const response = await axios.get(`/get_coffee?cafeId=${cafeId} `);
    return response.data;
  } catch (error) {
    return { error: error.message, success: false };
  }
};

export default getCafesMenu;
