export const formatTimeAgo = (createdAt: string): string => {
  const now = new Date();
  const storyDate = new Date(createdAt);
  const diffInMs = now.getTime() - storyDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) return `${diffInMinutes}min ago`;
  if (diffInHours < 24) return `${diffInHours}hr ago`;
  return `${diffInDays}day ago`;
};
