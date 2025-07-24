import axios from "axios";

export const analisisKeuangan = async (dataInput) => {
  const response = await axios.post("http://localhost:5000/api/analisis", dataInput);
  return response.data;
};