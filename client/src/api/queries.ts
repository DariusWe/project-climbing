const env = import.meta.env.VITE_APP_ENVIRONMENT;
const BASE_URL = env === "local" ? "http://localhost:3001" : "https://full-stack-crud-app-production.up.railway.app";

export const fetchWalls = async () => {
  const res = await fetch(`${BASE_URL}`);
  return res.json();
};
