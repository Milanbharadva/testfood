export const BUSINESS_NAME =
  document.location.pathname.replace("/", "") || null;

export const getBusinessData = () => {
  return fetch(`/api/${BUSINESS_NAME}`);
};
export const resolveimg = (path) => {
  return `/uploads/${path}`;
};
