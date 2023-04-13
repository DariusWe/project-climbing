import type { Crag } from "./types";

const env = import.meta.env.VITE_APP_ENVIRONMENT;
const BASE_URL = env === "local" ? "http://localhost:3001" : "https://full-stack-crud-app-production.up.railway.app";

export const fetchCrags = async () => {
  const res = await fetch(`${BASE_URL}/api/crags/get`);
  return res.json();
};

export const postCrag = async (crag: Omit<Crag, "id">) => {
  try {
      await fetch(`${BASE_URL}/api/crags/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(crag),
      // return that it was successfull?
    });
  } catch (err) {
    console.log(err);
  }
};
