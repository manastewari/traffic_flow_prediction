import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const predictTraffic = async (formData) => {
  const res = await API.post("/predict", formData);
  return res.data;
};
