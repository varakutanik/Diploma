import axios from "./instance";

const addSalesPrice = async (value) => {
  try {
    const response = await axios.post(`/add_cells_prices`, value);
    return response.data;
  } catch (error) {
    return { error: error.message, success: false };
  }
};

export default addSalesPrice;
