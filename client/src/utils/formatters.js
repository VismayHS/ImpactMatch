export const formatScore = (score) => {
  return score?.toLocaleString() || '0';
};

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatSimilarity = (similarity) => {
  return (similarity * 100).toFixed(1) + '%';
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const getBadgeForScore = (score) => {
  if (score >= 200) return 'GOLD';
  if (score >= 100) return 'SILVER';
  if (score >= 50) return 'BRONZE';
  return null;
};
