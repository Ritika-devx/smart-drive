export const avatarInitial = (name = "") => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return "U";
  }

  return trimmedName.charAt(0).toUpperCase();
};

export const avatarGradient = (name = "") => {
  const gradients = [
    "linear-gradient(135deg, #4F46E5, #7C3AED)",
    "linear-gradient(135deg, #2563EB, #06B6D4)",
    "linear-gradient(135deg, #7C3AED, #EC4899)",
    "linear-gradient(135deg, #0F766E, #14B8A6)",
    "linear-gradient(135deg, #DB2777, #9333EA)",
    "linear-gradient(135deg, #EA580C, #F59E0B)",
  ];

  const value = name
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return gradients[value % gradients.length];
};