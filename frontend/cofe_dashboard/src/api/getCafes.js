import axios from "./instance";

const name = localStorage.getItem("cafeName");

const getCafes = async () => {
  try {
    const response = await axios.get(`/get_cafes_by_username?username=${name}`);
    return response.data;
  } catch (error) {
    return { error: error.message, success: false };
  }
};

export default getCafes;