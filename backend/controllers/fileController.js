const prisma = require("../utils/prismaClient");
const { getSuggestions } = require("../services/optimizationService");

const getFileSuggestions = async (req, res) => {
  try {
    const files = await prisma.file.findMany();

    const suggestionsData = files.map((file) => ({
      fileName: file.name,
      category: file.category,
      size: file.size,
      suggestions: getSuggestions(file),
    }));

    res.status(200).json({
      success: true,
      message: "Suggestions fetched successfully",
      data: suggestionsData,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error fetching suggestions",
    });
  }
};

module.exports = {
  getFileSuggestions,
};