export const generateCodeId = (prefix: string) => {
  const timestamp = new Date().getTime().toString().slice(-4);
  const day = new Date().getDate().toString().padStart(2, '0');
  const month = new Date().getMonth().toString().padStart(2, '0');
  const year = new Date().getFullYear().toString().slice(-2);
  return `${prefix}${day}${month}${year}${timestamp}`;
};

export const calulateSkip = (page: number | string, limit: number | string) => {
  if (!page || !limit) return 0;
  if (Number(page) === 1) return 0;
  return (Number(page) - 1) * Number(limit);
};
