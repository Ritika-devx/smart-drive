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

// Search files
export const searchFiles = async (name) => {
  try {

    const response = await api.get("/search", {
      params: {
        name,
      },
    });

    return response.data;

  } catch (error) {

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to search files",
      }
    );

  }
};