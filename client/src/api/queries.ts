const env = import.meta.env.VITE_APP_ENVIRONMENT;
const BASE_URL = env === "local" ? "http://localhost:3001" : "https://full-stack-crud-app-production.up.railway.app";

export const fetchCrags = async () => {
  const res = await fetch(`${BASE_URL}/api/crags/get`);
  return res.json();
};

export const postCrag = async (newCrag: FormData) => {
  try {
    await fetch(`${BASE_URL}/api/crags/post`, {
      method: "POST",
      body: newCrag,
      // return that it was successfull?
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateCragImage = async (formData: FormData) => {
  try {
    await fetch(`${BASE_URL}/api/crags/update-image`, {
      method: "PUT",
      body: formData,
      // return that it was successfull?
    });
  } catch (err) {
    console.log(err);
  }
};

export const postRoute = async (newRoute: FormData) => {
  try {
    await fetch(`${BASE_URL}/api/routes/post`, {
      method: "POST",
      body: newRoute,
    });
  } catch (err) {
    console.log(err);
  }
};
