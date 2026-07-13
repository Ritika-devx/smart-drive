const getSuggestions = (file) => {
  let suggestions = [];

  // Rule 1: Duplicate file
  if (file.duplicate_flag) {
    suggestions.push({
      type: "Duplicate",
      action: "Delete",
      reason: "This file already exists in storage.",
    });
  }

  // Calculate file age
  const uploadDate = file.upload_date
    ? new Date(file.upload_date)
    : new Date();

  const fileAge =
    (Date.now() - uploadDate.getTime()) / (1000 * 60 * 60 * 24);

  // Rule 2: Old file
  if (fileAge > 180) {
    suggestions.push({
      type: "Old File",
      action: "Archive",
      reason: "File has not been accessed for a long time.",
    });
  }

  // Rule 3: Large file (>50 MB)
  if (Number(file.size) > 50 * 1024 * 1024) {
    suggestions.push({
      type: "Large File",
      action: "Review",
      reason: "Large files consume more storage space.",
    });
  }

  // Rule 4: Large + Old
  if (
    Number(file.size) > 50 * 1024 * 1024 &&
    fileAge > 180
  ) {
    suggestions.push({
      type: "High Priority Cleanup",
      action: "Delete or Archive",
      reason: "Large and old file wasting storage.",
    });
  }

  // Healthy file
  if (suggestions.length === 0) {
    suggestions.push({
      type: "Healthy File",
      action: "Keep",
      reason: "No optimization needed.",
    });
  }

  return suggestions;
};

module.exports = { getSuggestions };