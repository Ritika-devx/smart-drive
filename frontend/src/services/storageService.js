import axios from "axios";
import { getToken } from "../utils/authStorage";
const API = "/api";

export const getStorage = async () => {
  const token = getToken();

  const response = await axios.get(`${API}/storage`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getStorageBreakdown = async () => {
  const token = getToken();

  const response = await axios.get(`${API}/storage/breakdown`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};