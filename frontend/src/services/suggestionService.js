import api from "./api";

// Fetch all optimization suggestions
export const getSuggestions = async () => {
  try {

    const response = await api.get("/suggestions");

    return response.data;

  } catch (error) {

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to fetch suggestions",
      }
    );

  }
};