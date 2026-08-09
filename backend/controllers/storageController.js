const prisma = require("../utils/prismaClient");

const getStorage = async (req, res) => {
  try {
    // Fetch only current user's files
    const files = await prisma.files.findMany({
      where: {
        userId: req.user.id,
      },
      select: {
        size: true,
        duplicate_flag: true,
      },
    });

    // Calculate used storage
    const usedStorage = files.reduce(
      (total, file) => total + Number(file.size || 0),
      0
    );

    // Free Plan = 10 GB
    const totalStorage = 10 * 1024 * 1024 * 1024;

    const availableStorage = totalStorage - usedStorage;

    const percentage = Number(
      ((usedStorage / totalStorage) * 100).toFixed(2)
    );

    const filesUploaded = files.length;
    const duplicatesRemoved = files.filter((f) => f.duplicate_flag).length;

    res.status(200).json({
      success: true,
      usedStorage,
      totalStorage,
      availableStorage,
      percentage,
      filesUploaded,
      duplicatesRemoved,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const getStorageBreakdown = async (req, res) => {
  try {
    const breakdown = await prisma.files.groupBy({
      by: ["type"],
      where: { userId: req.user.id },
      _sum: { size: true },
      _count: { _all: true },
    });

    const formatted = breakdown.map((b) => ({
      type: b.type || "Other",
      totalSize: Number(b._sum.size || 0),
      count: b._count._all,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  getStorage,
  getStorageBreakdown,
};