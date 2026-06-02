export const formatNumber = (value, digits = 0) => Number(value || 0).toFixed(digits);

export const formatPercent = (value, digits = 1) => `${formatNumber(value, digits)}%`;

export const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "00:00";
  const rounded = Math.ceil(seconds);
  const minutes = Math.floor(rounded / 60).toString().padStart(2, "0");
  const rest = Math.floor(rounded % 60).toString().padStart(2, "0");
  return `${minutes}:${rest}`;
};

export const formatDate = (isoString) => {
  if (!isoString) return "--";
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoString));
};
