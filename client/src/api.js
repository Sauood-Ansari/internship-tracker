const DEFAULT_API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://internship-tracker-rrkh.onrender.com";

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || DEFAULT_API_BASE_URL;

export const apiUrl = (path) => `${API_BASE_URL}${path}`;

export const authHeader = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {};
  }

  return { Authorization: `Bearer ${token}` };
};
