import axios from "axios";

const API = "/api";

export const getStorage = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API}/storage`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getStorageBreakdown = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API}/storage/breakdown`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};