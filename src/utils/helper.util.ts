export const generateCodeId = (prefix: string) => {
  const timestamp = new Date().getTime().toString().slice(-4);
  const day = new Date().getDate().toString().padStart(2, '0');
  const month = new Date().getMonth().toString().padStart(2, '0');
  const year = new Date().getFullYear().toString().slice(-2);
  return `${prefix}${day}${month}${year}${timestamp}`;
};
